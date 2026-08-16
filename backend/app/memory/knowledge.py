from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database.models import User, Identity, Incident, Postmortem

class KnowledgeStore:
    """
    Manages long-term incident memory and unified human identities.
    """
    @staticmethod
    def get_user_with_identities(db: Session, user_id: str) -> Optional[Dict[str, Any]]:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        return {
            "id": user.id,
            "name": user.name,
            "role": user.role,
            "team": user.team,
            "availability": user.availability,
            "preferred_channel": user.preferred_channel,
            "response_rate": user.response_rate,
            "identities": {ident.channel: ident.channel_user_id for ident in user.identities}
        }

    @staticmethod
    def get_responders_by_team(db: Session, team: str) -> List[Dict[str, Any]]:
        users = db.query(User).filter(User.team == team).all()
        return [
            {
                "id": u.id,
                "name": u.name,
                "role": u.role,
                "team": u.team,
                "availability": u.availability,
                "preferred_channel": u.preferred_channel,
                "response_rate": u.response_rate,
                "identities": {ident.channel: ident.channel_user_id for ident in u.identities}
            }
            for u in users
        ]

    @staticmethod
    def search_historical_incidents(db: Session, query_text: str, service: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Searches historical postmortems for similar incidents, root causes, and recommendations.
        """
        postmortems = db.query(Postmortem).join(Incident).all()
        results = []
        q = query_text.lower()

        for pm in postmortems:
            inc = pm.incident
            score = 0
            if service and inc.service.lower() == service.lower():
                score += 5
            if "pool" in q or "database" in q or "exhaustion" in q or "connection" in q:
                if "connection pool" in pm.root_cause.lower():
                    score += 10
            if "payment" in q and "payment" in inc.service.lower():
                score += 3

            if score > 0:
                results.append({
                    "incident_id": inc.id,
                    "title": inc.title,
                    "service": inc.service,
                    "severity": inc.severity,
                    "root_cause": pm.root_cause,
                    "confidence": pm.confidence,
                    "what_went_well": pm.what_went_well,
                    "preventive_actions": pm.preventive_actions,
                    "match_score": score
                })

        # Sort by match score descending
        results.sort(key=lambda x: x["match_score"], reverse=True)
        return results
