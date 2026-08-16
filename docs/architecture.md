# NEXORA Technical Architecture

```text
                               ┌──────────────────────────┐
                               │       NEXORA BRAIN       │
                               │  Observe → Think → Plan  │
                               └────────────┬─────────────┘
                                            │
                               ┌────────────▼─────────────┐
                               │      FEATHERLESS AI      │
                               │    Inference Engine      │
                               │      (Mock / Live)       │
                               └────────────┬─────────────┘
                                            │
                               ┌────────────▼─────────────┐
                               │       CASPIAN SDK        │
                               │  Unified Communication   │
                               └────────────┬─────────────┘
                                            │
             ┌──────────────────────────────┼──────────────────────────────┐
             │                              │                              │
    ┌────────▼────────┐            ┌────────▼────────┐            ┌────────▼────────┐
    │    Telegram     │            │      Email      │            │      Slack      │
    │  (Fast Paging)  │            │  (Escalations)  │            │  (Cross-Team)   │
    └────────┬────────┘            └────────┬────────┘            └────────┬────────┘
             │                              │                              │
    ┌────────▼────────┐            ┌────────▼────────┐            ┌────────▼────────┐
    │   Alex Vance    │            │  Priya Sharma   │            │   Rahul Nair    │
    │ (Lead Payments) │            │ (Platform/SRE)  │            │  (Database DBA) │
    └─────────────────┘            └─────────────────┘            └─────────────────┘
```

## 1. Core Design Philosophy
**"AI is the brain. Caspian is the reach. Humans are the action. NEXORA coordinates the loop."**

NEXORA eliminates fragmented notification fatigue by acting as an autonomous coordination layer. When a critical anomaly occurs, NEXORA:
1. Classifies severity (P0) with confidence scoring.
2. Resolves human identities across platforms (Alex on Telegram = Alex on Email = Alex on Slack).
3. Chooses optimal communication channels.
4. Enforces a 10-second SLA countdown.
5. Autonomously escalates across channels if primary on-call is unavailable.
6. Retrieves historical incident memory (e.g. matching previous connection pool exhaustion).
7. Gates sensitive infrastructure actions (rollback deployment) behind human approval.
8. Synthesizes an executive postmortem immediately upon resolution.

---

## 2. Caspian SDK Integration
Caspian provides the unified messaging foundation:
- **Unified CommClient**: NEXORA writes to a single interface (`caspian_client.send_message`), abstracting platform-specific authentication and webhooks.
- **Cross-Channel Persistence**: Context for `INC-2026-0042` remains continuous regardless of whether the message originated via Telegram or Email.
- **Failover & Escalation**: If Telegram is unacknowledged within 10s, Caspian routes the escalation to Email without restarting incident context.

---

## 3. Featherless AI Inference
- Powered by `https://api.featherless.ai/v1` with `meta-llama/Meta-Llama-3.1-70B-Instruct`.
- Extracts structured classification and postmortem analysis.
- Supports deterministic high-fidelity mock mode (`LLM_MODE=mock`) for offline hackathon judging.

---

## 4. Real-Time Telemetry & Response Graph
- **WebSockets**: Zero-latency event pipeline pushes state updates to the React client.
- **Response Graph**: Animated SVG network showing packet transmission from NEXORA Core to Channel Nodes, Responders, and Resolution States.
