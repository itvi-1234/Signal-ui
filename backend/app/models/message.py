from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
import uuid

from app.database import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = Column(String, ForeignKey("conversations.id"))
    sender_id = Column(String, ForeignKey("users.id"))
    content = Column(String, nullable=False)
    message_type = Column(String, default="text") # 'text', 'image', 'file', 'system'
    reply_to_id = Column(String, ForeignKey("messages.id"), nullable=True)
    created_at = Column(DateTime, default=func.now())
    edited_at = Column(DateTime, nullable=True)
    is_deleted = Column(Boolean, default=False)
    disappears_at = Column(DateTime, nullable=True)

class MessageStatus(Base):
    __tablename__ = "message_status"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    message_id = Column(String, ForeignKey("messages.id"))
    user_id = Column(String, ForeignKey("users.id"))
    status = Column(String, default="sent") # 'sent', 'delivered', 'read'
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    __table_args__ = (UniqueConstraint('message_id', 'user_id', name='uq_msg_user'),)

class MessageReaction(Base):
    __tablename__ = "message_reactions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    message_id = Column(String, ForeignKey("messages.id"))
    user_id = Column(String, ForeignKey("users.id"))
    emoji = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())

    __table_args__ = (UniqueConstraint('message_id', 'user_id', name='uq_react_msg_user'),)
