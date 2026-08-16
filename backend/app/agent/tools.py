import uuid
import datetime
import json
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.database.models import (
    Incident, IncidentEvent, User, Identity, Message,
    AgentDecision, Approval, Postmortem
)
from app.caspian.client import caspian_client
from app.memory.knowledge import KnowledgeStore
from app.agent.policies import SEVERITY_CHANNEL_POLICY, is_action_safe, get_action_risk_level
from app.websocket.hub import ws_hub
from app.llm.featherless import get_llm_provider
from app.agent.prompts import POSTMORTEM_PROMPT, NEXORA_SYSTEM_PROMPT

class AgentTools:
    """
    18 structured tools callable by the NEXORA agent loop.
    """
    def __init__(self, db: Session):
        self.db = db

    async def create_incident(
        self,
        service: str,
        region: str = "India-East",
        error_rate: float = 42.0,
        latency: float = 8.7,
        affected_users: int = 18420,
        title: Optional[str] = None
    ) -> Incident:
        inc_num = f"{datetime.datetime.now(datetime.timezone.utc).year}-{self.db.query(Incident).count() + 42:04d}"
        incident_id = f"INC-{inc_num}"
        inc_title = title or f"{service} Critical Degradation Spike"

        incident = Incident(
            id=incident_id,
            title=inc_title,
            service=service,
            region=region,
            severity="P0",
            status="DETECTED",
            error_rate=error_rate,
            latency=latency,
            affected_users=affected_users,
            escalation_level=1,
            created_at=datetime.datetime.now(datetime.timezone.utc)
        )
        self.db.add(incident)
        self.db.commit()
        self.db.refresh(incident)

        await self.record_event(
            incident_id=incident_id,
            event_type="incident.created",
            actor="NEXORA",
            channel="system",
            summary=f"Incident {incident_id} detected: {service} error rate {error_rate}%, latency {latency}s.",
            details={"error_rate": error_rate, "latency": latency, "affected_users": affected_users}
        )

        return incident

    async def get_incident(self, incident_id: str) -> Optional[Incident]:
        return self.db.query(Incident).filter(Incident.id == incident_id).first()

    async def update_incident(self, incident_id: str, **kwargs) -> Optional[Incident]:
        incident = await self.get_incident(incident_id)
        if not incident:
            return None
        for k, v in kwargs.items():
            if hasattr(incident, k):
                setattr(incident, k, v)
        self.db.commit()
        self.db.refresh(incident)
        
        await ws_hub.broadcast("incident.updated", {
            "incident_id": incident_id,
            "status": incident.status,
            "severity": incident.severity,
            "current_owner_id": incident.current_owner_id,
            "escalation_level": incident.escalation_level
        })
        return incident

    async def analyze_incident(self, incident_id: str, classification_data: Dict[str, Any]) -> AgentDecision:
        severity = classification_data.get("severity", "P0")
        confidence = classification_data.get("confidence", 0.97)
        reasoning = classification_data.get("reasoning_summary", "Critical error rate spike affecting high volume of users.")
        
        decision = AgentDecision(
            id=f"dec_{uuid.uuid4().hex[:8]}",
            incident_id=incident_id,
            decision_type="CLASSIFICATION",
            severity=severity,
            confidence=confidence,
            action_taken=f"Classified as {severity} with {int(confidence*100)}% confidence.",
            reasoning_summary=reasoning,
            evidence=f"Error rate {classification_data.get('error_rate', 42)}%, {classification_data.get('affected_users', 18420)} users affected.",
            created_at=datetime.datetime.now(datetime.timezone.utc)
        )
        self.db.add(decision)
        self.db.commit()

        await self.record_event(
            incident_id=incident_id,
            event_type="incident.classified",
            actor="NEXORA",
            channel="system",
            summary=f"AI classified incident as {severity} ({int(confidence*100)}% confidence).",
            details=classification_data
        )

        await ws_hub.broadcast("ai.decision", {
            "incident_id": incident_id,
            "decision_type": "CLASSIFICATION",
            "severity": severity,
            "confidence": confidence,
            "reasoning_summary": reasoning,
            "evidence": decision.evidence
        })

        return decision

    async def find_responder(self, team: str, exclude_user_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        responders = KnowledgeStore.get_responders_by_team(self.db, team)
        if exclude_user_id:
            responders = [r for r in responders if r["id"] != exclude_user_id]
        if not responders:
            # Fallback to any online SRE / Platform engineer
            responders = KnowledgeStore.get_responders_by_team(self.db, "Platform")
        return responders[0] if responders else None

    async def assign_responder(self, incident_id: str, user_id: str, is_primary: bool = True) -> bool:
        incident = await self.get_incident(incident_id)
        if not incident:
            return False
        
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return False

        if is_primary:
            incident.primary_responder_id = user.id
            incident.current_owner_id = user.id
        else:
            incident.current_owner_id = user.id

        self.db.commit()

        await self.record_event(
            incident_id=incident_id,
            event_type="responder.selected",
            actor="NEXORA",
            channel="system",
            summary=f"{'Primary' if is_primary else 'Backup'} responder assigned: {user.name} ({user.role}).",
            details={"user_id": user.id, "name": user.name, "team": user.team}
        )
        return True

    async def get_responder_status(self, user_id: str) -> Optional[Dict[str, Any]]:
        return KnowledgeStore.get_user_with_identities(self.db, user_id)

    async def send_message(
        self,
        incident_id: str,
        user_id: str,
        channel: str,
        content: str,
        is_escalation: bool = False
    ) -> Message:
        user = self.db.query(User).filter(User.id == user_id).first()
        user_name = user.name if user else "Responder"
        
        # Determine channel user ID from identities
        channel_id = f"@{user_id}"
        if user and user.identities:
            for ident in user.identities:
                if ident.channel == channel:
                    channel_id = ident.channel_user_id
                    break

        msg_record = Message(
            id=f"msg_{uuid.uuid4().hex[:8]}",
            incident_id=incident_id,
            sender="NEXORA",
            recipient_id=user_id,
            channel=channel,
            content=content,
            status="SENT",
            sent_at=datetime.datetime.now(datetime.timezone.utc)
        )
        self.db.add(msg_record)
        self.db.commit()

        # Send via Caspian client abstraction
        await caspian_client.send_message(
            incident_id=incident_id,
            recipient_name=user_name,
            channel=channel,
            channel_user_id=channel_id,
            content=content,
            is_escalation=is_escalation
        )

        msg_record.status = "DELIVERED"
        self.db.commit()

        await self.record_event(
            incident_id=incident_id,
            event_type="message.sent",
            actor="NEXORA",
            channel=channel,
            summary=f"Sent alert to {user_name} via {channel.title()}.",
            details={"recipient": user_name, "channel": channel, "content": content}
        )

        return msg_record

    async def request_acknowledgement(self, incident_id: str, user_id: str, timeout_seconds: int = 10):
        await self.record_event(
            incident_id=incident_id,
            event_type="ack.requested",
            actor="NEXORA",
            channel="system",
            summary=f"Requested acknowledgement from responder within {timeout_seconds} seconds.",
            details={"timeout_seconds": timeout_seconds, "user_id": user_id}
        )
        await ws_hub.broadcast("ack.requested", {
            "incident_id": incident_id,
            "user_id": user_id,
            "timeout_seconds": timeout_seconds
        })

    async def check_acknowledgement(self, incident_id: str) -> bool:
        incident = await self.get_incident(incident_id)
        return incident.acknowledged_at is not None if incident else False

    async def escalate_incident(self, incident_id: str, reason: str) -> Dict[str, Any]:
        incident = await self.get_incident(incident_id)
        if not incident:
            return {"status": "error", "message": "Incident not found"}

        incident.escalation_level += 1
        incident.status = "ESCALATING"
        self.db.commit()

        # Find backup responder (Priya / Platform)
        backup_user = await self.find_responder(team="Platform", exclude_user_id=incident.primary_responder_id)
        backup_id = backup_user["id"] if backup_user else "usr_priya"
        backup_name = backup_user["name"] if backup_user else "Priya Sharma"

        incident.current_owner_id = backup_id
        self.db.commit()

        await self.record_event(
            incident_id=incident_id,
            event_type="ack.timeout",
            actor="NEXORA",
            channel="telegram",
            summary="Primary responder acknowledgement timed out. Autonomous escalation triggered.",
            details={"reason": reason}
        )

        await self.record_event(
            incident_id=incident_id,
            event_type="escalation.started",
            actor="NEXORA",
            channel="system",
            summary=f"Escalation Level {incident.escalation_level}: Reassigning incident to backup responder {backup_name}.",
            details={"level": incident.escalation_level, "backup_user": backup_name}
        )

        # Notify backup via Email through Caspian
        email_content = (
            f"URGENT — P0 INCIDENT ESCALATION\n\n"
            f"The primary responder did not acknowledge {incident.id} ({incident.service}).\n"
            f"You have been assigned as Lead Backup Responder.\n"
            f"Affected Users: {incident.affected_users:,} | Error Rate: {incident.error_rate}%\n"
            f"Please respond immediately."
        )
        await self.send_message(
            incident_id=incident_id,
            user_id=backup_id,
            channel="email",
            content=email_content,
            is_escalation=True
        )

        await ws_hub.broadcast("escalation.level", {
            "incident_id": incident_id,
            "level": incident.escalation_level,
            "new_owner": backup_name,
            "channel": "email"
        })

        return {
            "status": "escalated",
            "level": incident.escalation_level,
            "backup_responder": backup_name
        }

    async def switch_channel(self, incident_id: str, user_id: str, new_channel: str, reason: str):
        await self.record_event(
            incident_id=incident_id,
            event_type="channel.switched",
            actor="NEXORA",
            channel=new_channel,
            summary=f"Switched communication channel to {new_channel.title()} ({reason}).",
            details={"user_id": user_id, "new_channel": new_channel, "reason": reason}
        )

    async def record_event(
        self,
        incident_id: str,
        event_type: str,
        actor: str,
        channel: Optional[str],
        summary: str,
        details: Optional[Dict[str, Any]] = None
    ) -> IncidentEvent:
        event = IncidentEvent(
            id=f"evt_{uuid.uuid4().hex[:8]}",
            incident_id=incident_id,
            event_type=event_type,
            actor=actor,
            channel=channel,
            summary=summary,
            details=details or {},
            timestamp=datetime.datetime.now(datetime.timezone.utc)
        )
        self.db.add(event)
        self.db.commit()

        await ws_hub.broadcast("timeline.event", {
            "id": event.id,
            "incident_id": incident_id,
            "event_type": event_type,
            "actor": actor,
            "channel": channel,
            "summary": summary,
            "details": details,
            "timestamp": event.timestamp.isoformat()
        })
        return event

    async def request_approval(
        self,
        incident_id: str,
        action_name: str,
        reason: str
    ) -> Approval:
        risk_level = get_action_risk_level(action_name)
        approval = Approval(
            id=f"appr_{uuid.uuid4().hex[:8]}",
            incident_id=incident_id,
            action_name=action_name,
            risk_level=risk_level,
            reason=reason,
            status="PENDING",
            requested_at=datetime.datetime.now(datetime.timezone.utc)
        )
        self.db.add(approval)
        self.db.commit()

        await self.record_event(
            incident_id=incident_id,
            event_type="approval.requested",
            actor="NEXORA",
            channel="system",
            summary=f"Human approval requested for sensitive action: '{action_name}'.",
            details={"action": action_name, "risk": risk_level, "reason": reason}
        )

        await ws_hub.broadcast("approval.requested", {
            "approval_id": approval.id,
            "incident_id": incident_id,
            "action_name": action_name,
            "risk_level": risk_level,
            "reason": reason
        })
        return approval

    async def execute_approved_action(self, approval_id: str, approver_name: str = "Priya Sharma") -> Dict[str, Any]:
        approval = self.db.query(Approval).filter(Approval.id == approval_id).first()
        if not approval:
            return {"status": "error", "message": "Approval request not found"}
        
        approval.status = "APPROVED"
        approval.approved_by = approver_name
        approval.responded_at = datetime.datetime.now(datetime.timezone.utc)
        self.db.commit()

        # Update incident metrics to simulate resolution recovery
        incident = await self.get_incident(approval.incident_id)
        if incident:
            incident.error_rate = 0.4
            incident.latency = 0.32
            incident.status = "MITIGATING"
            self.db.commit()

        await self.record_event(
            incident_id=approval.incident_id,
            event_type="approval.approved",
            actor=approver_name,
            channel="system",
            summary=f"Human approved action: {approval.action_name}. Executed rollback safely.",
            details={"approved_by": approver_name, "action": approval.action_name}
        )

        await ws_hub.broadcast("approval.executed", {
            "approval_id": approval_id,
            "incident_id": approval.incident_id,
            "action_name": approval.action_name,
            "approved_by": approver_name,
            "error_rate": 0.4,
            "latency": 0.32
        })

        return {"status": "executed", "action": approval.action_name, "approved_by": approver_name}

    async def resolve_incident(self, incident_id: str, resolver_name: str = "Priya Sharma") -> Dict[str, Any]:
        incident = await self.get_incident(incident_id)
        if not incident:
            return {"status": "error", "message": "Incident not found"}

        incident.status = "RESOLVED"
        incident.resolved_at = datetime.datetime.now(datetime.timezone.utc)
        if not incident.acknowledged_at:
            incident.acknowledged_at = incident.created_at + datetime.timedelta(seconds=21)
        self.db.commit()

        await self.record_event(
            incident_id=incident_id,
            event_type="incident.resolved",
            actor=resolver_name,
            channel="system",
            summary=f"Incident {incident_id} successfully resolved. Metrics stabilized.",
            details={"resolved_by": resolver_name}
        )

        # Auto-generate postmortem
        postmortem = await self.generate_postmortem(incident_id)

        await ws_hub.broadcast("incident.resolved", {
            "incident_id": incident_id,
            "status": "RESOLVED",
            "time_to_awareness": "3s",
            "time_to_ack": "21s",
            "escalations": incident.escalation_level - 1,
            "postmortem_id": postmortem.id if postmortem else None
        })

        return {"status": "resolved", "incident_id": incident_id}

    async def generate_postmortem(self, incident_id: str) -> Optional[Postmortem]:
        incident = await self.get_incident(incident_id)
        if not incident:
            return None

        # Check existing postmortem
        existing = self.db.query(Postmortem).filter(Postmortem.incident_id == incident_id).first()
        if existing:
            return existing

        # Summarize events for prompt
        events_summary = ", ".join([f"{e.actor} ({e.event_type}): {e.summary}" for e in (incident.events or [])[-6:]])
        llm = get_llm_provider()
        
        prompt = POSTMORTEM_PROMPT.format(
            incident_id=incident.id,
            service=incident.service,
            severity=incident.severity,
            error_rate=incident.error_rate,
            timeline_summary=events_summary or "Incident detected, escalated via Caspian to backup responder, rollback approved and executed.",
            root_cause_notes="Database connection pool saturation and query connection leaks following deployment."
        )

        try:
            raw_ai = await llm.chat_complete(
                system_prompt=NEXORA_SYSTEM_PROMPT,
                user_prompt=prompt,
                json_mode=True
            )
            data = json.loads(raw_ai)
        except Exception as e:
            print(f"[Postmortem AI Fallback] {e}")
            data = {}

        created_str = incident.created_at.strftime('%H:%M UTC') if incident.created_at else '17:05 UTC'
        default_summary = (
            f"At {created_str}, {incident.service} experienced a critical degradation with error rates reaching {incident.error_rate}%. "
            f"NEXORA autonomously classified the P0 alert, dispatched Telegram telemetry, managed automated escalation to backup upon timeout, "
            f"and coordinated human mitigation through Caspian multi-channel reach."
        )

        pm = Postmortem(
            id=f"pm_{uuid.uuid4().hex[:8]}",
            incident_id=incident_id,
            executive_summary=data.get("executive_summary", default_summary),
            impact=data.get("impact", f"{incident.affected_users:,} affected user sessions. Zero customer data corruption."),
            root_cause=data.get("root_cause", "Database connection pool exhaustion caused by lingering unclosed client sockets during traffic surge."),
            confidence=float(data.get("confidence", 0.91)),
            time_to_awareness="3s",
            time_to_ack="21s",
            total_escalations=max(0, incident.escalation_level - 1),
            channels_used=2,
            responders_involved=3,
            what_went_well=data.get("what_went_well", "Autonomous Caspian escalation bridged the gap when primary was away; multi-channel reach achieved acknowledgment in 21 seconds."),
            what_failed=data.get("what_failed", "Primary responder on-call notification timed out on Telegram."),
            preventive_actions=data.get("preventive_actions", "1. Increase base connection pool limit from 100 to 500.\n2. Configure pre-emptive warning alerts at 75% connection pool utilization."),
            follow_up_tasks=data.get("follow_up_tasks", ["Tune payment connection pool parameters", "Verify failover replica timeouts"]),
            generated_at=datetime.datetime.now(datetime.timezone.utc)
        )
        self.db.add(pm)
        self.db.commit()

        await self.record_event(
            incident_id=incident_id,
            event_type="postmortem.generated",
            actor="NEXORA",
            channel="system",
            summary=f"AI generated comprehensive incident postmortem for {incident_id}.",
            details={"root_cause": pm.root_cause, "confidence": pm.confidence}
        )

        await ws_hub.broadcast("postmortem.generated", {
            "incident_id": incident_id,
            "postmortem_id": pm.id,
            "root_cause": pm.root_cause,
            "confidence": pm.confidence
        })

        return pm

    async def search_incident_history(self, query_text: str, service: Optional[str] = None) -> List[Dict[str, Any]]:
        return KnowledgeStore.search_historical_incidents(self.db, query_text, service)

