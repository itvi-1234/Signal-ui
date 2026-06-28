from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    phone_number: str
    username: str
    display_name: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = ""
    is_online: bool = False
    last_seen: Optional[datetime] = None

class UserResponse(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None

class ContactCreate(BaseModel):
    phone_or_username: str

class ContactResponse(BaseModel):
    id: str
    owner_id: str
    contact_id: str
    nickname: Optional[str]
    created_at: datetime
    contact_user: UserResponse

    class Config:
        from_attributes = True
