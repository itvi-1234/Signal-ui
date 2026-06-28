from typing import Dict, List, Any
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # Maps user_id -> List of active WebSockets (allows multiple devices)
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, user_id: str, websocket: WebSocket):
        if user_id in self.active_connections:
            try:
                self.active_connections[user_id].remove(websocket)
                if not self.active_connections[user_id]:
                    del self.active_connections[user_id]
            except ValueError:
                pass

    async def send_to_user(self, user_id: str, payload: Any):
        """Send a pre-formed payload dict to a user."""
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(payload)
                except Exception:
                    pass

    async def broadcast_to_users(self, user_ids: List[str], payload: Any):
        for user_id in set(user_ids):
            await self.send_to_user(user_id, payload)

    async def broadcast_to_conversation(self, conversation_id: str, exclude_user_id: str, payload: Any, db):
        """Broadcast to all participants of a conversation except the sender."""
        from app.models.conversation import ConversationParticipant
        participants = db.query(ConversationParticipant).filter(
            ConversationParticipant.conversation_id == conversation_id
        ).all()
        for p in participants:
            if p.user_id != exclude_user_id:
                await self.send_to_user(p.user_id, payload)

manager = ConnectionManager()
