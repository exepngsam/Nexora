# 🚀 NEXORA
### ONE AGENT. EVERY HUMAN. ZERO DELAY.

**NEXORA** is an autonomous AI coordination agent platform designed for the **Caspian AI Agent Hackathon**. It transforms critical incident intelligence into coordinated human action across the communication channels teams already use (Telegram, Email, Slack) using the **Caspian SDK** and **Featherless AI**.

---

## 🌟 Why NEXORA?
> **"AI can think, but reaching the right human at the right moment is still difficult."**

Traditional alerting tools dump alerts and stop. NEXORA stays in the loop:
1. **Understands & Classifies**: Evaluates P0 severity and impact blast in < 3s via Featherless AI.
2. **Caspian Multi-Channel Reach**: Dispatches alerts with continuous cross-channel context.
3. **Autonomous Escalation**: Triggers channel failover upon 10-second SLA timeout.
4. **Unified Human Identity**: Maps single responders across Telegram, Email, and Slack.
5. **Long-Term Memory**: Recalls past root causes (e.g. database connection pool exhaustion).
6. **Human-in-the-Loop Safety**: Gates destructive actions (e.g. deployment rollbacks) behind explicit authorization.
7. **Automated Postmortem**: Generates executive root-cause postmortems with 1-click Markdown export.

---

## 🏗️ Architecture

```text
                    NEXORA AI AGENT
                           │
                    ┌──────▼──────┐
                    │ AI REASONING│
                    │ Featherless │
                    └──────┬──────┘
                           │
                  ┌────────▼────────┐
                  │  AGENT ENGINE   │
                  │ Observe → Think │
                  │ Plan → Act      │
                  └────────┬────────┘
                           │
                    ┌──────▼──────┐
                    │ CASPIAN SDK │
                    └──────┬──────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
          Telegram       Email         Slack
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                    HUMAN RESPONDERS
```

---

## ⚡ Quick Start

### 1. Start Backend (FastAPI)
```bash
# In project root
python -m venv venv
.\venv\Scripts\activate
pip install -r backend/requirements.txt

# Run server
cd backend
uvicorn app.main:app --port 8000 --reload
```
API & WebSocket server will run at `http://localhost:8000`.

### 2. Start Frontend (React + Vite)
```bash
# In frontend directory
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` to launch the **NEXORA Command Center**.

---

## 🧪 Automated Testing
```bash
pytest backend/tests/ -v
```
All 5 end-to-end tests verify:
- P0 incident detection & AI classification
- Caspian channel routing & unified identities
- 10s timeout autonomous escalation
- Human approval policy gating & metric stabilization
- Long-term memory similarity search

---

## 🏆 Presentation Script
Follow the official [3-Minute Hackathon Demo Script](docs/demo-script.md) for the live judge demonstration.
