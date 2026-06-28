from sqlalchemy import Column, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
import uuid

from app.database import Base

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = Column(String, ForeignKey("users.id"))
    contact_id = Column(String, ForeignKey("users.id"))
    nickname = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())

    __table_args__ = (UniqueConstraint('owner_id', 'contact_id', name='uq_owner_contact'),)
