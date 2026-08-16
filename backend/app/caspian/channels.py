from typing import Dict, Any, List
from pydantic import BaseModel

class ChannelConfig(BaseModel):
    name: str
    icon: str
    status: str = "operational"  # operational, degraded, failed
    delivery_rate: float = 0.99
    average_latency_ms: int = 420
    is_connected: bool = True

class ChannelRegistry:
    def __init__(self):
        self.channels: Dict[str, ChannelConfig] = {
            "telegram": ChannelConfig(name="Telegram", icon="Send", delivery_rate=0.992, average_latency_ms=310),
            "email": ChannelConfig(name="Email", icon="Mail", delivery_rate=0.999, average_latency_ms=850),
            "slack": ChannelConfig(name="Slack", icon="MessageSquare", delivery_rate=0.988, average_latency_ms=280),
            "discord": ChannelConfig(name="Discord", icon="Disc", delivery_rate=0.975, average_latency_ms=350),
            "whatsapp": ChannelConfig(name="WhatsApp", icon="PhoneCall", delivery_rate=0.985, average_latency_ms=490),
        }

    def get_channel(self, channel_name: str) -> ChannelConfig:
        return self.channels.get(channel_name.lower(), ChannelConfig(name=channel_name, icon="Globe"))

    def get_all_statuses(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": k,
                "name": v.name,
                "icon": v.icon,
                "status": v.status,
                "delivery_rate": v.delivery_rate,
                "average_latency_ms": v.average_latency_ms,
                "is_connected": v.is_connected
            }
            for k, v in self.channels.items()
        ]

channel_registry = ChannelRegistry()
