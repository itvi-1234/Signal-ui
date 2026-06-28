from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
import uuid

from app.database import Base

class GroupMeta(Base):
    __tablename__ = "group_meta"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = Column(String, ForeignKey("conversations.id"), unique=True)
    name = Column(String, nullable=False)
    description = Column(String, default="")
    avatar_url = Column(String, nullable=True)
    created_by = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=func.now())
