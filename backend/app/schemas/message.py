from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MessageStatusUpdate(BaseModel):
    status: str # 'delivered', 'read'

class MessageReactionCreate(BaseModel):
    emoji: str

class MessageReactionResponse(BaseModel):
    id: str
    user_id: str
    emoji: str
    created_at: datetime

    class Config:
        from_attributes = True

class MessageStatusResponse(BaseModel):
    user_id: str
    status: str
    updated_at: datetime

    class Config:
        from_attributes = True

class MessageBase(BaseModel):
    content: str
    message_type: str = "text"
    reply_to_id: Optional[str] = None

class MessageCreate(MessageBase):
    pass

class MessageUpdate(BaseModel):
    content: str

class MessageResponse(MessageBase):
    id: str
    conversation_id: str
    sender_id: str
    created_at: datetime
    edited_at: Optional[datetime] = None
    is_deleted: bool = False
    disappears_at: Optional[datetime] = None
    
    statuses: List[MessageStatusResponse] = []
    reactions: List[MessageReactionResponse] = []

    class Config:
        from_attributes = True
