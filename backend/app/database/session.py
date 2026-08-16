import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.database.models import Base, User, Identity, Incident, Postmortem
import datetime

# SQLite database in project directory
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "nexora.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initializes tables and seeds initial human identities and historical memory."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Seed users if not exists
        if db.query(User).count() == 0:
            now = datetime.datetime.now(datetime.timezone.utc)
            # 1. Alex - Primary Payments
            alex = User(
                id="usr_alex",
                name="Alex Vance",
                role="Lead Payments Engineer",
                team="Payments",
                availability="online",
                preferred_channel="telegram",
                response_rate=0.94,
                last_seen=now
            )
            alex_identities = [
                Identity(id="id_alex_tg", user_id="usr_alex", channel="telegram", channel_user_id="@alex_payments"),
                Identity(id="id_alex_em", user_id="usr_alex", channel="email", channel_user_id="alex.vance@nexora.internal"),
                Identity(id="id_alex_sl", user_id="usr_alex", channel="slack", channel_user_id="U_ALEX_PAYMENTS"),
            ]

            # 2. Priya - Backup Platform / SRE
            priya = User(
                id="usr_priya",
                name="Priya Sharma",
                role="Senior Platform & SRE Lead",
                team="Platform",
                availability="online",
                preferred_channel="email",
                response_rate=0.98,
                last_seen=now
            )
            priya_identities = [
                Identity(id="id_priya_em", user_id="usr_priya", channel="email", channel_user_id="priya.sharma@nexora.internal"),
                Identity(id="id_priya_tg", user_id="usr_priya", channel="telegram", channel_user_id="@priya_sre"),
                Identity(id="id_priya_sl", user_id="usr_priya", channel="slack", channel_user_id="U_PRIYA_SRE"),
            ]

            # 3. Rahul - Database Operations
            rahul = User(
                id="usr_rahul",
                name="Rahul Nair",
                role="Principal Database Architect",
                team="Database",
                availability="online",
                preferred_channel="slack",
                response_rate=0.91,
                last_seen=now
            )
            rahul_identities = [
                Identity(id="id_rahul_sl", user_id="usr_rahul", channel="slack", channel_user_id="U_RAHUL_DB"),
                Identity(id="id_rahul_em", user_id="usr_rahul", channel="email", channel_user_id="rahul.nair@nexora.internal"),
                Identity(id="id_rahul_tg", user_id="usr_rahul", channel="telegram", channel_user_id="@rahul_database"),
            ]

            # 4. Maya - Incident Commander / Operations Manager
            maya = User(
                id="usr_maya",
                name="Maya Chen",
                role="Director of Incident Operations",
                team="Operations",
                availability="online",
                preferred_channel="telegram",
                response_rate=0.99,
                last_seen=now
            )
            maya_identities = [
                Identity(id="id_maya_tg", user_id="usr_maya", channel="telegram", channel_user_id="@maya_ops_lead"),
                Identity(id="id_maya_em", user_id="usr_maya", channel="email", channel_user_id="maya.chen@nexora.internal"),
            ]

            db.add_all([alex, priya, rahul, maya] + alex_identities + priya_identities + rahul_identities + maya_identities)

            # Seed Historical Incident for Long-term Memory retrieval (INC-2026-0031)
            hist_incident = Incident(
                id="INC-2026-0031",
                title="Payment API Latency Spike & 504 Gateway Errors",
                service="Payment API",
                region="India-East",
                severity="P0",
                status="RESOLVED",
                error_rate=38.5,
                latency=9.1,
                affected_users=14200,
                primary_responder_id="usr_alex",
                current_owner_id="usr_priya",
                escalation_level=2,
                created_at=now - datetime.timedelta(days=18),
                acknowledged_at=now - datetime.timedelta(days=18, seconds=-24),
                resolved_at=now - datetime.timedelta(days=18, minutes=-14),
            )
            hist_pm = Postmortem(
                id="pm_hist_0031",
                incident_id="INC-2026-0031",
                executive_summary="Payment API experienced critical request queueing and timeouts caused by database connection pool exhaustion following a surge in checkout traffic.",
                impact="14,200 checkout requests delayed or dropped over a 14-minute window.",
                root_cause="Database connection pool exhaustion on the primary replica cluster (max_connections capped at 100 with lingering idle connections).",
                confidence=0.94,
                time_to_awareness="4s",
                time_to_ack="24s",
                total_escalations=1,
                channels_used=2,
                responders_involved=3,
                what_went_well="Multi-channel fallback to Priya via Email successfully rescued coordination after Telegram timeout.",
                what_failed="Database connection pool saturation telemetry lacked a pre-90% warning threshold.",
                preventive_actions="Increase base connection pool limit to 500 and configure proactive 80% saturation threshold alerts.",
                follow_up_tasks=["Audit connection pool configs across microservices", "Deploy connection pool autoscaling"]
            )
            db.add(hist_incident)
            db.add(hist_pm)

            db.commit()

        # Seed playbooks if empty
        from app.playbooks.service import PlaybookService
        PlaybookService.seed_default_playbooks(db)
    finally:
        db.close()


