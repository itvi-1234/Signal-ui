from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .user import UserResponse
from .message import MessageResponse

class ConversationBase(BaseModel):
    type: str
    created_at: datetime
    last_message_at: Optional[datetime] = None

class ConversationParticipantResponse(BaseModel):
    user_id: str
    joined_at: datetime
    is_admin: bool
    user: UserResponse

    class Config:
        from_attributes = True

class ConversationResponse(ConversationBase):
    id: str
    participants: List[ConversationParticipantResponse] = []
    last_message: Optional[MessageResponse] = None
    unread_count: int = 0
    
    # For groups
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    
    class Config:
        from_attributes = True

class ConversationCreateDirect(BaseModel):
    user_id: str
