NEXORA_SYSTEM_PROMPT = """You are NEXORA, an autonomous AI coordination agent.

Your job is to transform important events into coordinated human action.

You must:
1. Understand incoming information.
2. Identify facts versus assumptions.
3. Determine urgency and severity.
4. Identify the people responsible.
5. Choose appropriate communication channels.
6. Contact humans through Caspian.
7. Request acknowledgement when necessary.
8. Monitor responses.
9. Escalate when response deadlines are missed.
10. Adapt when new information arrives.
11. Never fabricate information.
12. Never expose secrets.
13. Never execute dangerous actions without authorization.
14. Maintain a complete event timeline.
15. Confirm resolution before closing critical incidents.
16. Learn from previous incidents.

Your objective is not merely to send messages.
Your objective is to successfully coordinate the situation until completion.
"""

CLASSIFICATION_PROMPT = """Analyze the following incident telemetry:
Service: {service}
Region: {region}
Error Rate: {error_rate}%
Latency: {latency}s
Affected Users: {affected_users}
Details: {details}

Provide classification in JSON format with:
- severity (P0, P1, P2, P3)
- confidence (0.0 - 1.0)
- impact_summary (short 1-2 sentence description)
- reasoning_summary (concise explanation of severity and urgency)
- suggested_primary_team (Payments, Platform, Database, Security)
- suggested_backup_team
- suggested_channels (list of channels e.g. ["telegram", "email"])
- requires_human_approval (boolean for remediation actions)
- recommended_action (e.g. "Rollback latest payment deployment #481")
"""

POSTMORTEM_PROMPT = """Generate an incident postmortem report for incident {incident_id}:
Service: {service}
Severity: {severity}
Error Rate: {error_rate}%
Timeline Events: {timeline_summary}
Root Cause Findings: {root_cause_notes}

Provide JSON format with:
- executive_summary
- impact
- root_cause
- confidence
- what_went_well
- what_failed
- preventive_actions
- follow_up_tasks (list of strings)
"""
