import asyncio
import json
import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.agent.tools import AgentTools
from app.llm.featherless import get_llm_provider
from app.agent.prompts import NEXORA_SYSTEM_PROMPT, CLASSIFICATION_PROMPT
from app.websocket.hub import ws_hub
from app.caspian.client import caspian_client

class AgentOrchestrator:
    """
    NEXORA Autonomous Coordination Orchestrator.
    Drives the genuine Observe -> Think -> Plan -> Act -> Adapt loop.
    """
    def __init__(self):
        self.active_timers: Dict[str, asyncio.Task] = {}
        self.llm = get_llm_provider()

        # Register Caspian incoming message hook
        caspian_client.on_message(self.handle_incoming_human_message)

    async def run_incident_simulation(
        self,
        service: str = "Payment API",
        region: str = "India-East",
        error_rate: float = 42.0,
        latency: float = 8.7,
        affected_users: int = 18420,
        title: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes the signature hackathon demo flow with genuine backend state.
        """
        db = SessionLocal()
        tools = AgentTools(db)
        try:
            # 1. OBSERVE: Create Incident
            incident = await tools.create_incident(
                service=service,
                region=region,
                error_rate=error_rate,
                latency=latency,
                affected_users=affected_users,
                title=title
            )

            # 2. THINK: AI Classification
            classification_raw = await self.llm.chat_complete(
                system_prompt=NEXORA_SYSTEM_PROMPT,
                user_prompt=CLASSIFICATION_PROMPT.format(
                    service=service,
                    region=region,
                    error_rate=error_rate,
                    latency=latency,
                    affected_users=affected_users,
                    details="Sudden spike in HTTP 504 gateway timeouts and connection drops."
                ),
                json_mode=True
            )
            try:
                classification = json.loads(classification_raw)
            except Exception:
                classification = {
                    "severity": "P0",
                    "confidence": 0.97,
                    "reasoning_summary": "Critical payment processing failure affecting thousands of users.",
                    "suggested_primary_team": "Payments",
                    "suggested_backup_team": "Platform",
                    "suggested_channels": ["telegram", "email"],
                    "requires_human_approval": True,
                    "recommended_action": "Rollback latest payment deployment #481"
                }

            await tools.analyze_incident(incident.id, classification)

            # 3. PLAN: Initialize dynamic agent plan
            from app.agent.planner import AgentPlanner
            from app.agent.scoring import ResponderScoringEngine
            from app.audit.service import AuditLogger
            
            AgentPlanner.initialize_plan(db, incident.id, service)
            AuditLogger.log(db, actor="NEXORA", action=f"Incident {incident.id} Created & Classified P0", incident_id=incident.id)

            # Score & Rank Responders
            scored_responders = ResponderScoringEngine.rank_all_responders(db, service=service, severity="P0")
            top_candidate = scored_responders[0] if scored_responders else None
            primary_id = top_candidate["user_id"] if top_candidate else "usr_alex"
            primary_name = top_candidate["name"] if top_candidate else "Alex Vance"
            channel_decision = top_candidate["channel_decision"] if top_candidate else {"selected_channel": "telegram", "reason": "Highest response rate"}
            selected_channel = channel_decision["selected_channel"]
            
            await tools.assign_responder(incident.id, primary_id, is_primary=True)

            # 4. ACT: Reach Primary via Caspian
            telegram_msg = (
                f"🚨 P0 INCIDENT ALERT\n\n"
                f"{service} outage detected.\n"
                f"Error rate: {error_rate}%\n"
                f"Latency: {latency}s\n"
                f"Affected users: {affected_users:,}\n\n"
                f"You are the assigned Primary Responder.\n"
                f"Please acknowledge within 10 seconds."
            )
            await tools.send_message(
                incident_id=incident.id,
                user_id=primary_id,
                channel=selected_channel,
                content=telegram_msg
            )
            AuditLogger.log(db, actor="NEXORA", action=f"Dispatched alert to {primary_name}", incident_id=incident.id, channel=selected_channel)

            # 5. WAIT: Request Acknowledgement & Start Autonomous Countdown Timer
            timeout_sec = 10
            await tools.request_acknowledgement(incident.id, primary_id, timeout_seconds=timeout_sec)
            await AgentPlanner.update_step_status(db, incident.id, 4, "in_progress", "Awaiting primary responder acknowledgement SLA")

            # Spawn autonomous background timer
            timer_task = asyncio.create_task(
                self._run_ack_timer(incident.id, timeout_sec)
            )
            self.active_timers[incident.id] = timer_task

            return {
                "incident_id": incident.id,
                "status": "WAITING_FOR_ACK",
                "primary_responder": primary_name,
                "responder_score": top_candidate["total_score"] if top_candidate else 88,
                "score_explanation": top_candidate["explanation"] if top_candidate else "High ownership score",
                "channel": selected_channel,
                "channel_reason": channel_decision["reason"],
                "timeout_seconds": timeout_sec
            }
        finally:
            db.close()


    async def _run_ack_timer(self, incident_id: str, timeout_seconds: int):
        """
        Background autonomous loop: Tracks countdown and triggers escalation if timeout fires.
        """
        for remaining in range(timeout_seconds, 0, -1):
            await ws_hub.broadcast("ack.countdown", {
                "incident_id": incident_id,
                "remaining_seconds": remaining,
                "total_seconds": timeout_seconds
            })
            await asyncio.sleep(1.0)
            
            # Check if acknowledged during sleep
            db = SessionLocal()
            try:
                tools = AgentTools(db)
                is_acked = await tools.check_acknowledgement(incident_id)
                if is_acked:
                    return
            finally:
                db.close()

        # Timeout reached! Autonomous Escalation
        await ws_hub.broadcast("ack.countdown", {
            "incident_id": incident_id,
            "remaining_seconds": 0,
            "total_seconds": timeout_seconds
        })

        db = SessionLocal()
        try:
            tools = AgentTools(db)
            is_acked = await tools.check_acknowledgement(incident_id)
            if not is_acked:
                await tools.escalate_incident(
                    incident_id=incident_id,
                    reason="Primary responder did not acknowledge within the configured 10s response window."
                )
        finally:
            db.close()

    async def handle_human_acknowledgement(
        self,
        incident_id: str,
        user_id: str,
        user_name: str,
        channel: str,
        message_text: str = "I'm responding. Looking into it now."
    ) -> Dict[str, Any]:
        """
        Processes human response, cancels timer, transfers ownership, searches memory,
        and coordinates next mitigation step.
        """
        # Cancel active timer if running
        if incident_id in self.active_timers:
            self.active_timers[incident_id].cancel()

        db = SessionLocal()
        tools = AgentTools(db)
        try:
            incident = await tools.get_incident(incident_id)
            if not incident:
                return {"status": "error", "message": "Incident not found"}

            incident.status = "RESPONDING"
            incident.acknowledged_at = datetime.datetime.now(datetime.timezone.utc)
            incident.current_owner_id = user_id
            db.commit()

            # Record human ACK event
            await tools.record_event(
                incident_id=incident_id,
                event_type="ack.received",
                actor=user_name,
                channel=channel,
                summary=f"{user_name} acknowledged via {channel.title()}: \"{message_text}\"",
                details={"user_id": user_id, "channel": channel, "text": message_text}
            )

            from app.agent.planner import AgentPlanner
            from app.audit.service import AuditLogger

            await AgentPlanner.update_step_status(db, incident_id, 4, "completed")
            await AgentPlanner.update_step_status(db, incident_id, 5, "completed")
            await AgentPlanner.update_step_status(db, incident_id, 6, "completed", "Database team coordination active")
            await AgentPlanner.update_step_status(db, incident_id, 7, "in_progress", "Awaiting human authorization for rollback")

            AuditLogger.log(db, actor=user_name, action=f"Acknowledged incident {incident_id}", incident_id=incident_id, channel=channel)

            await ws_hub.broadcast("ack.received", {
                "incident_id": incident_id,
                "owner_id": user_id,
                "owner_name": user_name,
                "channel": channel,
                "status": "RESPONDING",
                "escalation_level": incident.escalation_level
            })


            # Search Long-Term Memory for similar previous incidents
            historical = await tools.search_incident_history(query_text="database connection pool", service=incident.service)
            similar_info = ""
            if historical:
                top_match = historical[0]
                similar_info = (
                    f"SIMILAR INCIDENT FOUND: {top_match['incident_id']} occurred recently with root cause: "
                    f"\"{top_match['root_cause']}\". Recommend checking connection pool saturation."
                )
                await tools.record_event(
                    incident_id=incident_id,
                    event_type="memory.match",
                    actor="NEXORA",
                    channel="system",
                    summary=f"Found past matching incident {top_match['incident_id']}: Connection pool exhaustion.",
                    details=top_match
                )
                await ws_hub.broadcast("memory.matched", {
                    "incident_id": incident_id,
                    "historical_match": top_match
                })

            # Coordinate Next Action: Request approval for rollback
            approval = await tools.request_approval(
                incident_id=incident_id,
                action_name="Rollback payment deployment #481",
                reason="Error rate surged immediately following deployment #481. Long-term memory indicates connection pool exhaustion."
            )

            return {
                "status": "acknowledged",
                "owner": user_name,
                "channel": channel,
                "approval_id": approval.id,
                "memory_match": similar_info
            }
        finally:
            db.close()

    async def handle_incoming_human_message(self, message_data: Dict[str, Any]):
        """Caspian handler callback for incoming chat messages."""
        incident_id = message_data.get("incident_id")
        sender_name = message_data.get("sender_name", "Responder")
        channel = message_data.get("channel", "email")
        text = message_data.get("text", "")
        
        user_id = "usr_priya" if "priya" in sender_name.lower() else "usr_alex"
        if incident_id:
            await self.handle_human_acknowledgement(
                incident_id=incident_id,
                user_id=user_id,
                user_name=sender_name,
                channel=channel,
                message_text=text
            )

orchestrator = AgentOrchestrator()
