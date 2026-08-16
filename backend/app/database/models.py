import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    Enum as SQLEnum,
    JSON
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

def now_utc():
    return datetime.datetime.now(datetime.timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)  # e.g., "usr_alex"
    name = Column(String, nullable=False)   # e.g., "Alex Vance"
    role = Column(String, nullable=False)   # e.g., "Lead Payments Engineer"
    team = Column(String, nullable=False)   # e.g., "Payments"
    availability = Column(String, default="online")  # "online", "busy", "offline"
    preferred_channel = Column(String, default="telegram")
    response_rate = Column(Float, default=0.94)  # e.g., 94%
    last_seen = Column(DateTime, default=now_utc)

    identities = relationship("Identity", back_populates="user", cascade="all, delete-orphan")


class Identity(Base):
    """
    Unified Human Identity mapping:
    Same person on Telegram, Email, Slack, etc.
    """
    __tablename__ = "identities"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    channel = Column(String, nullable=False)  # "telegram", "email", "slack", "discord", "whatsapp"
    channel_user_id = Column(String, nullable=False)  # e.g. "@alex_payments", "alex@nexora.internal"
    verified = Column(Boolean, default=True)

    user = relationship("User", back_populates="identities")


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True)  # e.g., "INC-2026-0042"
    title = Column(String, nullable=False)
    service = Column(String, nullable=False)
    region = Column(String, default="India-East")
    severity = Column(String, default="P0")  # P0, P1, P2, P3
    status = Column(String, default="DETECTED")  # DETECTED, ESCALATING, ACKNOWLEDGED, MITIGATING, RESOLVED
    error_rate = Column(Float, default=0.0)
    latency = Column(Float, default=0.0)
    affected_users = Column(Integer, default=0)
    
    # Responder Assignment
    primary_responder_id = Column(String, ForeignKey("users.id"), nullable=True)
    current_owner_id = Column(String, ForeignKey("users.id"), nullable=True)
    escalation_level = Column(Integer, default=1)
    
    # Timing
    created_at = Column(DateTime, default=now_utc)
    acknowledged_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    
    # Relationships
    events = relationship("IncidentEvent", back_populates="incident", order_by="IncidentEvent.timestamp")
    messages = relationship("Message", back_populates="incident")
    decisions = relationship("AgentDecision", back_populates="incident")
    approvals = relationship("Approval", back_populates="incident")
    postmortem = relationship("Postmortem", back_populates="incident", uselist=False)


class IncidentEvent(Base):
    __tablename__ = "incident_events"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False)
    event_type = Column(String, nullable=False)  # e.g., "incident.created", "ack.timeout", "escalation.started"
    actor = Column(String, default="NEXORA")      # "NEXORA", "Alex", "Priya", "System"
    channel = Column(String, nullable=True)       # "telegram", "email", "slack", "system"
    summary = Column(String, nullable=False)
    details = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=now_utc)

    incident = relationship("Incident", back_populates="events")


class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False)
    sender = Column(String, default="NEXORA")
    recipient_id = Column(String, ForeignKey("users.id"), nullable=False)
    channel = Column(String, nullable=False)  # "telegram", "email", "slack"
    content = Column(Text, nullable=False)
    status = Column(String, default="SENT")    # SENT, DELIVERED, ACKNOWLEDGED, TIMEOUT, FAILED
    sent_at = Column(DateTime, default=now_utc)
    acknowledged_at = Column(DateTime, nullable=True)

    incident = relationship("Incident", back_populates="messages")


class AgentDecision(Base):
    __tablename__ = "agent_decisions"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False)
    decision_type = Column(String, nullable=False)  # "CLASSIFICATION", "RESPONDER_SELECTION", "CHANNEL_ROUTING", "ESCALATION"
    severity = Column(String, nullable=True)
    confidence = Column(Float, default=0.95)
    action_taken = Column(String, nullable=False)
    reasoning_summary = Column(Text, nullable=False)  # Concise summary only
    evidence = Column(Text, nullable=True)
    created_at = Column(DateTime, default=now_utc)

    incident = relationship("Incident", back_populates="decisions")


class Approval(Base):
    __tablename__ = "approvals"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False)
    action_name = Column(String, nullable=False)  # e.g., "Rollback payment deployment #481"
    risk_level = Column(String, default="HIGH")    # HIGH, CRITICAL
    reason = Column(Text, nullable=False)
    status = Column(String, default="PENDING")     # PENDING, APPROVED, REJECTED, EXECUTED
    requested_at = Column(DateTime, default=now_utc)
    responded_at = Column(DateTime, nullable=True)
    approved_by = Column(String, nullable=True)

    incident = relationship("Incident", back_populates="approvals")


class Postmortem(Base):
    __tablename__ = "postmortems"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False, unique=True)
    executive_summary = Column(Text, nullable=False)
    impact = Column(Text, nullable=False)
    root_cause = Column(Text, nullable=False)
    confidence = Column(Float, default=0.91)
    time_to_awareness = Column(String, default="3s")
    time_to_ack = Column(String, default="21s")
    total_escalations = Column(Integer, default=1)
    channels_used = Column(Integer, default=2)
    responders_involved = Column(Integer, default=3)
    what_went_well = Column(Text, nullable=True)
    what_failed = Column(Text, nullable=True)
    preventive_actions = Column(Text, nullable=True)
    follow_up_tasks = Column(JSON, nullable=True)
    generated_at = Column(DateTime, default=now_utc)

    incident = relationship("Incident", back_populates="postmortem")


class Playbook(Base):
    __tablename__ = "playbooks"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    service = Column(String, nullable=False)
    severity = Column(String, default="P0")
    primary_team = Column(String, default="Payments")
    backup_team = Column(String, default="Platform")
    ack_timeout_seconds = Column(Integer, default=10)
    escalation_strategy = Column(String, default="IMMEDIATE_FAILOVER")
    approval_required_actions = Column(JSON, default=list)
    resolution_conditions = Column(String, default="Error rate < 1.0% for 5 minutes")
    created_at = Column(DateTime, default=now_utc)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True)
    incident_id = Column(String, nullable=True)
    actor = Column(String, nullable=False)  # "NEXORA", "Priya Sharma", "System"
    action = Column(String, nullable=False)
    channel = Column(String, nullable=True)
    result = Column(String, default="SUCCESS")  # SUCCESS, FAILED, TIMEOUT, GATED
    details = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=now_utc)


class AgentPlan(Base):
    __tablename__ = "agent_plans"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False)
    objective = Column(String, nullable=False)
    current_status = Column(String, default="ACTIVE")  # ACTIVE, PAUSED, COMPLETED
    steps = Column(JSON, nullable=False)  # list of {step: str, status: "completed"|"in_progress"|"pending"}
    waiting_for = Column(String, nullable=True)
    confidence = Column(Float, default=0.95)
    updated_at = Column(DateTime, default=now_utc)


class MemoryRecord(Base):
    __tablename__ = "memory_records"

    id = Column(String, primary_key=True)
    incident_id = Column(String, nullable=False)
    title = Column(String, nullable=False)
    service = Column(String, nullable=False)
    symptoms = Column(Text, nullable=False)
    root_cause = Column(Text, nullable=False)
    successful_mitigation = Column(Text, nullable=False)
    similarity_keywords = Column(JSON, default=list)
    created_at = Column(DateTime, default=now_utc)


