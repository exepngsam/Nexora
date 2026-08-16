from typing import Dict, Any, List

# Channel routing policy matrix
SEVERITY_CHANNEL_POLICY: Dict[str, Dict[str, Any]] = {
    "P0": {
        "primary_channels": ["telegram"],
        "escalation_channels": ["email", "slack"],
        "default_timeout_seconds": 10,
        "requires_multi_channel": True,
        "escalation_strategy": "IMMEDIATE_FAILOVER"
    },
    "P1": {
        "primary_channels": ["telegram"],
        "escalation_channels": ["email"],
        "default_timeout_seconds": 30,
        "requires_multi_channel": False,
        "escalation_strategy": "TIERED"
    },
    "P2": {
        "primary_channels": ["email"],
        "escalation_channels": ["slack"],
        "default_timeout_seconds": 300,
        "requires_multi_channel": False,
        "escalation_strategy": "TIERED"
    },
    "P3": {
        "primary_channels": ["dashboard"],
        "escalation_channels": [],
        "default_timeout_seconds": 1800,
        "requires_multi_channel": False,
        "escalation_strategy": "NOTIFY_ONLY"
    }
}

# Human-In-The-Loop safety policy
SAFE_ACTIONS = {
    "send_notification",
    "create_incident",
    "assign_responder",
    "summarize",
    "update_timeline",
    "generate_report",
    "search_history",
    "request_acknowledgement",
    "escalate_incident",
    "switch_channel"
}

REQUIRES_APPROVAL_ACTIONS = {
    "rollback_deployment": {
        "risk_level": "CRITICAL",
        "description": "Rollback deployment to previous verified build artifact."
    },
    "restart_service": {
        "risk_level": "HIGH",
        "description": "Gracefully cycle pods and reset connection sockets."
    },
    "modify_production_infrastructure": {
        "risk_level": "CRITICAL",
        "description": "Adjust live connection pool quotas or DB parameters."
    },
    "disable_systems": {
        "risk_level": "CRITICAL",
        "description": "Enable circuit breaker to shed incoming load."
    }
}

def is_action_safe(action_name: str) -> bool:
    norm = action_name.lower().replace(" ", "_")
    for safe in SAFE_ACTIONS:
        if safe in norm:
            return True
    return False

def get_action_risk_level(action_name: str) -> str:
    norm = action_name.lower().replace(" ", "_")
    for req_action, data in REQUIRES_APPROVAL_ACTIONS.items():
        if req_action in norm or any(k in norm for k in req_action.split("_")):
            return data["risk_level"]
    return "HIGH"  # Default to HIGH for sensitive requested actions

