import uuid
import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database.models import AuditLog

class AuditLogger:
    @staticmethod
    def log(
        db: Session,
        actor: str,
        action: str,
        incident_id: Optional[str] = None,
        channel: Optional[str] = None,
        result: str = "SUCCESS",
        details: Optional[Dict[str, Any]] = None
    ) -> AuditLog:
        log_entry = AuditLog(
            id=f"aud_{uuid.uuid4().hex[:8]}",
            incident_id=incident_id,
            actor=actor,
            action=action,
            channel=channel,
            result=result,
            details=details or {},
            timestamp=datetime.datetime.now(datetime.timezone.utc)
        )
        db.add(log_entry)
        db.commit()
        return log_entry
