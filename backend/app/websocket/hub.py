import json
import asyncio
from typing import List, Dict, Any
from fastapi import WebSocket

class ConnectionManager:
    """
    Manages active WebSocket connections and broadcasts real-time
    incident, agent, and Caspian communication events to the frontend.
    """
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, event_type: str, data: Dict[str, Any]):
        """Broadcasts a structured JSON event to all connected UI clients."""
        if not self.active_connections:
            return
        
        payload = {
            "type": event_type,
            "data": data,
            "timestamp": asyncio.get_event_loop().time()
        }
        
        message_str = json.dumps(payload, default=str)
        dead_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message_str)
            except Exception:
                dead_connections.append(connection)
        
        for dead in dead_connections:
            self.disconnect(dead)

# Global singleton
ws_hub = ConnectionManager()
