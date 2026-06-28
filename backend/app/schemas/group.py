from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class GroupCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    member_ids: List[str]

class GroupUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    avatar_url: Optional[str] = None

class GroupResponse(BaseModel):
    id: str
    conversation_id: str
    name: str
    description: str
    avatar_url: Optional[str]
    created_by: str
    created_at: datetime

    class Config:
        from_attributes = True

class GroupMemberAdd(BaseModel):
    user_ids: List[str]
