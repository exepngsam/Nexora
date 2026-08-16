import uuid
import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.database.models import AgentPlan
from app.websocket.hub import ws_hub

class AgentPlanner:
    """
    Manages structured coordination plans and replanning loops for active incidents.
    Supports pausing, human intervention, and transparent plan inspection.
    """
    DEFAULT_STEPS = [
        {"id": "step_1", "title": "Identify incident telemetry & user blast radius", "status": "completed"},
        {"id": "step_2", "title": "Classify severity & urgency with Featherless AI", "status": "completed"},
        {"id": "step_3", "title": "Score & select primary responder (Payments)", "status": "completed"},
        {"id": "step_4", "title": "Dispatch alert via Caspian (Telegram)", "status": "completed"},
        {"id": "step_5", "title": "Monitor acknowledgement countdown SLA", "status": "in_progress"},
        {"id": "step_6", "title": "Autonomously escalate to backup upon timeout", "status": "pending"},
        {"id": "step_7", "title": "Coordinate cross-team response (Platform & Database)", "status": "pending"},
        {"id": "step_8", "title": "Request human authorization for remediation", "status": "pending"},
        {"id": "step_9", "title": "Verify service metrics recovery (error rate < 1%)", "status": "pending"},
        {"id": "step_10", "title": "Synthesize AI postmortem & update long-term memory", "status": "pending"}
    ]

    @staticmethod
    def initialize_plan(db: Session, incident_id: str, service: str) -> AgentPlan:
        plan = AgentPlan(
            id=f"plan_{uuid.uuid4().hex[:8]}",
            incident_id=incident_id,
            objective=f"Coordinate rapid triage, escalation, and stabilization for {service}",
            current_status="ACTIVE",
            steps=AgentPlanner.DEFAULT_STEPS,
            waiting_for="Primary responder acknowledgement SLA",
            confidence=0.96,
            updated_at=datetime.datetime.now(datetime.timezone.utc)
        )
        db.add(plan)
        db.commit()
        db.refresh(plan)
        return plan

    @staticmethod
    async def update_step_status(db: Session, incident_id: str, step_index: int, new_status: str, waiting_for: Optional[str] = None):
        plan = db.query(AgentPlan).filter(AgentPlan.incident_id == incident_id).first()
        if not plan:
            return
        
        steps = list(plan.steps)
        if 0 <= step_index < len(steps):
            steps[step_index]["status"] = new_status
            plan.steps = steps
            if waiting_for:
                plan.waiting_for = waiting_for
            plan.updated_at = datetime.datetime.now(datetime.timezone.utc)
            db.commit()

            await ws_hub.broadcast("agent.plan.updated", {
                "incident_id": incident_id,
                "plan_id": plan.id,
                "current_status": plan.current_status,
                "steps": plan.steps,
                "waiting_for": plan.waiting_for
            })

    @staticmethod
    async def set_agent_status(db: Session, incident_id: str, status: str) -> Dict[str, Any]:
        plan = db.query(AgentPlan).filter(AgentPlan.incident_id == incident_id).first()
        if plan:
            plan.current_status = status
            db.commit()
        await ws_hub.broadcast("agent.state.changed", {
            "incident_id": incident_id,
            "status": status
        })
        return {"status": status, "incident_id": incident_id}
