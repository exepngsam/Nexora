import pytest
import asyncio
import httpx
from app.database.session import SessionLocal, init_db
from app.agent.tools import AgentTools
from app.agent.orchestrator import orchestrator
from app.database.models import Incident, User, Postmortem
from app.llm.featherless import test_featherless_connection, FEATHERLESS_MODELS


@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    init_db()

@pytest.mark.asyncio
async def test_incident_creation_and_classification():
    db = SessionLocal()
    try:
        tools = AgentTools(db)
        incident = await tools.create_incident(
            service="Payment API",
            region="India-East",
            error_rate=42.0,
            latency=8.7,
            affected_users=18420
        )
        assert incident.id.startswith("INC-")
        assert incident.service == "Payment API"
        assert incident.status == "DETECTED"
        assert incident.error_rate == 42.0

        # Test Classification
        classification_data = {
            "severity": "P0",
            "confidence": 0.97,
            "reasoning_summary": "Critical payment outage affecting ~18,420 users.",
            "error_rate": 42.0,
            "affected_users": 18420
        }
        decision = await tools.analyze_incident(incident.id, classification_data)
        assert decision.severity == "P0"
        assert decision.confidence == 0.97
    finally:
        db.close()

@pytest.mark.asyncio
async def test_responder_selection_and_routing():
    db = SessionLocal()
    try:
        tools = AgentTools(db)
        primary = await tools.find_responder(team="Payments")
        assert primary is not None
        assert primary["name"] == "Alex Vance"
        assert "telegram" in primary["identities"]

        backup = await tools.find_responder(team="Platform", exclude_user_id=primary["id"])
        assert backup is not None
        assert backup["name"] == "Priya Sharma"
        assert "email" in backup["identities"]
    finally:
        db.close()

@pytest.mark.asyncio
async def test_autonomous_escalation_flow():
    db = SessionLocal()
    try:
        tools = AgentTools(db)
        incident = await tools.create_incident(service="Payment Gateway", error_rate=50.0)
        
        # Initial primary assignment
        await tools.assign_responder(incident.id, "usr_alex", is_primary=True)
        assert incident.current_owner_id == "usr_alex"

        # Simulate timeout and trigger escalation
        escalation_res = await tools.escalate_incident(
            incident_id=incident.id,
            reason="Primary responder missed 10s acknowledgement SLA"
        )
        assert escalation_res["status"] == "escalated"
        assert escalation_res["level"] == 2
        
        # Verify ownership transferred to Priya
        updated_inc = await tools.get_incident(incident.id)
        assert updated_inc.current_owner_id == "usr_priya"
        assert updated_inc.escalation_level == 2
    finally:
        db.close()

@pytest.mark.asyncio
async def test_human_approval_gate_and_resolution():
    db = SessionLocal()
    try:
        tools = AgentTools(db)
        incident = await tools.create_incident(service="Payment API", error_rate=42.0)
        
        # Request approval for dangerous action
        approval = await tools.request_approval(
            incident_id=incident.id,
            action_name="Rollback payment deployment #481",
            reason="Spike occurred right after build 481 deployment"
        )
        assert approval.status == "PENDING"
        assert approval.risk_level == "CRITICAL"

        # Execute approval
        exec_res = await tools.execute_approved_action(approval.id, approver_name="Priya Sharma")
        assert exec_res["status"] == "executed"
        
        # Verify incident metrics mitigated
        updated_inc = await tools.get_incident(incident.id)
        assert updated_inc.error_rate == 0.4

        # Resolve incident
        resolve_res = await tools.resolve_incident(incident.id, resolver_name="Priya Sharma")
        assert resolve_res["status"] == "resolved"

        # Verify postmortem auto-generation
        pm = db.query(Postmortem).filter(Postmortem.incident_id == incident.id).first()
        assert pm is not None
        assert "Database connection pool exhaustion" in pm.root_cause
        assert pm.confidence >= 0.90
    finally:
        db.close()

@pytest.mark.asyncio
async def test_long_term_memory_search():
    db = SessionLocal()
    try:
        tools = AgentTools(db)
        history = await tools.search_incident_history(query_text="database connection pool saturation")
        assert len(history) > 0
        assert history[0]["incident_id"] == "INC-2026-0031"
        assert "connection pool" in history[0]["root_cause"].lower()
    finally:
        db.close()

@pytest.mark.asyncio
async def test_featherless_model_catalog_and_connection():
    assert len(FEATHERLESS_MODELS) >= 5
    model_ids = [m["id"] for m in FEATHERLESS_MODELS]
    assert "deepseek-ai/DeepSeek-V3.2" in model_ids
    assert "meta-llama/Meta-Llama-3.1-70B-Instruct" in model_ids
    assert "mistralai/Mistral-Nemo-Instruct-2407" in model_ids

    # Test benchmark connection routine
    bench = await test_featherless_connection(api_key=None, model="deepseek-ai/DeepSeek-V3.2")
    assert bench["status"] in ("simulated", "connected")
    assert bench["latency_ms"] > 0

@pytest.mark.asyncio
async def test_authentication_endpoint():
    from app.api.routes import login_user, LoginRequest
    db = SessionLocal()
    try:
        # Test valid login
        req = LoginRequest(email="priya.sharma@nexora.ai", password="anypassword")
        res = login_user(req, db)
        assert res["status"] == "authenticated"
        assert res["user"]["name"] == "Priya Sharma"
        assert "approval.grant" in res["user"]["permissions"]
    finally:
        db.close()


