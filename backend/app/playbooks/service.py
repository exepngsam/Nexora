import uuid
import datetime
import json
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.database.models import Playbook
from app.llm.featherless import get_llm_provider

class PlaybookService:
    @staticmethod
    def seed_default_playbooks(db: Session):
        if db.query(Playbook).count() == 0:
            p1 = Playbook(
                id="pb_payment_p0",
                name="Critical Payment API Degradation (P0)",
                description="Rapid escalation and mitigation procedure for checkout & payment gateway outages.",
                service="Payment API",
                severity="P0",
                primary_team="Payments",
                backup_team="Platform",
                ack_timeout_seconds=10,
                escalation_strategy="IMMEDIATE_FAILOVER",
                approval_required_actions=["rollback_deployment", "restart_service"],
                resolution_conditions="Error rate < 0.5% and P99 latency < 500ms for 5 minutes",
                created_at=datetime.datetime.now(datetime.timezone.utc)
            )
            p2 = Playbook(
                id="pb_database_saturation",
                name="Database Connection Pool Exhaustion",
                description="Mitigation playbook for PostgreSQL connection leaks and thread starvation.",
                service="Order Database",
                severity="P0",
                primary_team="Database",
                backup_team="Platform",
                ack_timeout_seconds=15,
                escalation_strategy="TIERED",
                approval_required_actions=["modify_production_infrastructure", "scale_cluster"],
                resolution_conditions="Active connections < 70% pool capacity",
                created_at=datetime.datetime.now(datetime.timezone.utc)
            )
            p3 = Playbook(
                id="pb_security_incident",
                name="Authentication & Credential Stuffing Surge",
                description="Response playbook for coordinated auth anomalies and brute-force attacks.",
                service="Auth Service",
                severity="P1",
                primary_team="Security",
                backup_team="Platform",
                ack_timeout_seconds=30,
                escalation_strategy="TIERED",
                approval_required_actions=["disable_systems", "enable_rate_limit_hard"],
                resolution_conditions="Anomalous auth requests drop below 1%",
                created_at=datetime.datetime.now(datetime.timezone.utc)
            )
            db.add_all([p1, p2, p3])
            db.commit()

    @staticmethod
    async def generate_playbook_with_ai(prompt_text: str, service_name: str) -> Dict[str, Any]:
        """Generates a structured incident response playbook using Featherless AI."""
        llm = get_llm_provider()
        system_prompt = "You are an expert SRE Architect. Generate a production incident playbook in JSON."
        user_prompt = f"Create a response procedure for: {prompt_text}. Service: {service_name}"
        
        # Call LLM or deterministic generator
        raw = await llm.chat_complete(system_prompt, user_prompt, json_mode=True)
        try:
            data = json.loads(raw)
        except Exception:
            data = {}

        return {
            "id": f"pb_{uuid.uuid4().hex[:8]}",
            "name": data.get("name", f"{service_name} Response Procedure"),
            "description": data.get("description", f"AI-generated response playbook for {service_name}"),
            "service": service_name,
            "severity": data.get("severity", "P0"),
            "primary_team": data.get("primary_team", "Payments"),
            "backup_team": data.get("backup_team", "Platform"),
            "ack_timeout_seconds": data.get("ack_timeout_seconds", 10),
            "escalation_strategy": data.get("escalation_strategy", "IMMEDIATE_FAILOVER"),
            "approval_required_actions": data.get("approval_required_actions", ["rollback_deployment", "restart_service"]),
            "resolution_conditions": data.get("resolution_conditions", "Error rate < 1.0% for 5 minutes")
        }
