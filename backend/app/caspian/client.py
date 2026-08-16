import asyncio
import uuid
import datetime
from typing import Dict, Any, Optional, Callable
from app.config import settings
from app.websocket.hub import ws_hub
from app.caspian.channels import channel_registry

class CaspianClient:
    """
    Unified Caspian Communication Client.
    Exposes a single interface for NEXORA to reach humans across Telegram, Email, Slack, etc.
    """
    def __init__(self):
        self.mode = settings.CASPIAN_MODE  # 'mock' or 'live'
        self.api_key = settings.CASPIAN_API_KEY
        self.message_handlers: list[Callable] = []

    def on_message(self, handler: Callable):
        self.message_handlers.append(handler)
        return handler

    async def send_message(
        self,
        incident_id: str,
        recipient_name: str,
        channel: str,
        channel_user_id: str,
        content: str,
        is_escalation: bool = False,
        requires_ack: bool = True
    ) -> Dict[str, Any]:
        """
        Sends an alert message through Caspian to the target channel.
        Broadcasts live message flow events for the response graph.
        """
        msg_id = f"msg_{uuid.uuid4().hex[:8]}"
        
        # 1. Message Dispatched
        dispatch_event = {
            "message_id": msg_id,
            "incident_id": incident_id,
            "recipient_name": recipient_name,
            "channel": channel,
            "channel_user_id": channel_user_id,
            "content": content,
            "status": "SENT",
            "is_escalation": is_escalation,
            "requires_ack": requires_ack,
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
        await ws_hub.broadcast("message.sent", dispatch_event)

        # Simulate Caspian delivery latency (or live SDK call)
        delivery_latency = 0.4 if self.mode == "mock" else 1.0
        await asyncio.sleep(delivery_latency)

        # 2. Message Delivered
        delivered_event = {
            **dispatch_event,
            "status": "DELIVERED",
            "delivered_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
        await ws_hub.broadcast("message.delivered", delivered_event)

        return delivered_event

    async def simulate_incoming_response(
        self,
        incident_id: str,
        sender_name: str,
        channel: str,
        response_text: str
    ):
        """Simulates an incoming message from a human on a specific channel."""
        event_data = {
            "incident_id": incident_id,
            "sender_name": sender_name,
            "channel": channel,
            "text": response_text,
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
        await ws_hub.broadcast("message.received", event_data)
        
        # Invoke registered handlers
        for handler in self.message_handlers:
            try:
                await handler(event_data)
            except Exception as e:
                print(f"[Caspian Handler Error]: {e}")

caspian_client = CaspianClient()

