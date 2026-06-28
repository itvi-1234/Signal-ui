from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.middleware.auth_middleware import get_db, get_current_user
from app.models.user import User
from app.models.conversation import Conversation, ConversationParticipant
from app.models.group import GroupMeta
from app.models.message import Message, MessageStatus
from app.services.conversation_service import get_user_conversations, get_or_create_direct_conversation
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/conversations", tags=["conversations"])

class DirectConvCreate(BaseModel):
    user_id: str

def build_conv_response(conv, user_id, db):
    parts = db.query(ConversationParticipant).filter(ConversationParticipant.conversation_id == conv.id).all()
    for p in parts:
        p.user = db.query(User).filter(User.id == p.user_id).first()

    last_msg = db.query(Message).filter(Message.conversation_id == conv.id).order_by(desc(Message.created_at)).first()

    unread = db.query(MessageStatus).join(Message).filter(
        Message.conversation_id == conv.id,
        MessageStatus.user_id == user_id,
        MessageStatus.status != "read"
    ).count()

    name = None
    avatar_url = None
    if conv.type == "group":
        meta = db.query(GroupMeta).filter(GroupMeta.conversation_id == conv.id).first()
        if meta:
            name = meta.name
            avatar_url = meta.avatar_url

    return {
        "id": conv.id,
        "type": conv.type,
        "created_at": conv.created_at,
        "last_message_at": conv.last_message_at,
        "name": name,
        "avatar_url": avatar_url,
        "unread_count": unread,
        "last_message": {
            "id": last_msg.id,
            "content": last_msg.content,
            "sender_id": last_msg.sender_id,
            "created_at": last_msg.created_at,
        } if last_msg else None,
        "participants": [
            {
                "user_id": p.user_id,
                "joined_at": p.joined_at,
                "is_admin": p.is_admin,
                "user": {
                    "id": p.user.id,
                    "username": p.user.username,
                    "display_name": p.user.display_name,
                    "avatar_url": p.user.avatar_url,
                    "bio": p.user.bio,
                    "is_online": p.user.is_online,
                    "last_seen": p.user.last_seen,
                    "phone_number": p.user.phone_number,
                    "created_at": p.user.created_at,
                }
            } for p in parts if p.user
        ]
    }

@router.get("")
def list_conversations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    parts = db.query(ConversationParticipant).filter(ConversationParticipant.user_id == current_user.id).all()
    conv_ids = [p.conversation_id for p in parts]
    convs = db.query(Conversation).filter(Conversation.id.in_(conv_ids)).order_by(desc(Conversation.last_message_at)).all()
    return [build_conv_response(c, current_user.id, db) for c in convs]

@router.get("/{conversation_id}")
def get_conversation(conversation_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return build_conv_response(conv, current_user.id, db)

@router.post("/direct")
def create_direct(body: DirectConvCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if body.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot start a conversation with yourself")
    target = db.query(User).filter(User.id == body.user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    conv, created = get_or_create_direct_conversation(db, current_user.id, body.user_id)
    return build_conv_response(conv, current_user.id, db)
