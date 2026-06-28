from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
import uuid

from app.database import Base

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    type = Column(String, nullable=False) # 'direct' or 'group'
    created_at = Column(DateTime, default=func.now())
    last_message_at = Column(DateTime, nullable=True)

class ConversationParticipant(Base):
    __tablename__ = "conversation_participants"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = Column(String, ForeignKey("conversations.id"))
    user_id = Column(String, ForeignKey("users.id"))
    joined_at = Column(DateTime, default=func.now())
    is_admin = Column(Boolean, default=False)

    __table_args__ = (UniqueConstraint('conversation_id', 'user_id', name='uq_conv_user'),)
