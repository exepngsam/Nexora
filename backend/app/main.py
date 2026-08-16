from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.config import settings
from app.database.session import init_db
from app.api.routes import router as api_router
from app.websocket.hub import ws_hub

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB and seeds
    init_db()
    print("[NEXORA] System Initialized. Seeded human identities and long-term memory.")
    print(f"[NEXORA] Mode: Caspian={settings.CASPIAN_MODE}, LLM={settings.LLM_MODE}")
    yield
    print("[NEXORA] Shutdown complete.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount REST API
app.include_router(api_router)

# WebSocket endpoint for real-time live updates
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_hub.connect(websocket)
    try:
        while True:
            # Keep connection alive and accept client pings
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_hub.disconnect(websocket)
    except Exception:
        ws_hub.disconnect(websocket)

@app.get("/")
def root():
    return {
        "status": "online",
        "agent": "NEXORA Autonomous Coordination System",
        "version": settings.VERSION,
        "caspian_mode": settings.CASPIAN_MODE,
        "llm_mode": settings.LLM_MODE
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
