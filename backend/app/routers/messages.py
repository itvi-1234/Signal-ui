from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.middleware.auth_middleware import get_db, get_current_user
from app.models.user import User
from app.models.message import Message, MessageStatus, MessageReaction
from app.models.conversation import Conversation, ConversationParticipant
from app.services.message_service import get_conversation_messages, create_message
from app.services.ws_manager import manager
from pydantic import BaseModel
from typing import Optional
import json

router = APIRouter(prefix="/messages", tags=["messages"])

class MessageCreate(BaseModel):
    content: str
    message_type: str = "text"
    reply_to_id: Optional[str] = None

class MessageStatusUpdate(BaseModel):
    status: str  # sent | delivered | read

def serialize_message(msg, db):
    statuses = db.query(MessageStatus).filter(MessageStatus.message_id == msg.id).all()
    reactions = db.query(MessageReaction).filter(MessageReaction.message_id == msg.id).all()
    return {
        "id": msg.id,
        "conversation_id": msg.conversation_id,
        "sender_id": msg.sender_id,
        "content": msg.content,
        "message_type": msg.message_type,
        "reply_to_id": msg.reply_to_id,
        "created_at": msg.created_at,
        "edited_at": msg.edited_at,
        "is_deleted": msg.is_deleted,
        "statuses": [{"user_id": s.user_id, "status": s.status, "updated_at": s.updated_at} for s in statuses],
        "reactions": [{"id": r.id, "user_id": r.user_id, "emoji": r.emoji, "created_at": r.created_at} for r in reactions],
    }

@router.get("/{conversation_id}")
def get_messages(conversation_id: str, page: int = 1, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    is_participant = db.query(ConversationParticipant).filter(
        ConversationParticipant.conversation_id == conversation_id,
        ConversationParticipant.user_id == current_user.id
    ).first()
    if not is_participant:
        raise HTTPException(status_code=403, detail="Not a participant")

    messages = get_conversation_messages(db, conversation_id, page)
    return [serialize_message(m, db) for m in messages]

@router.post("/{conversation_id}")
async def send_message(conversation_id: str, body: MessageCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    is_participant = db.query(ConversationParticipant).filter(
        ConversationParticipant.conversation_id == conversation_id,
        ConversationParticipant.user_id == current_user.id
    ).first()
    if not is_participant:
        raise HTTPException(status_code=403, detail="Not a participant")

    msg = create_message(db, conversation_id, current_user.id, body.content, body.message_type, body.reply_to_id)
    serialized = serialize_message(msg, db)

    # Broadcast via WebSocket
    participants = db.query(ConversationParticipant).filter(ConversationParticipant.conversation_id == conversation_id).all()
    for p in participants:
        await manager.send_to_user(p.user_id, {"event": "new_message", "data": serialized})

    return serialized

@router.put("/{message_id}/status")
async def update_status(message_id: str, body: MessageStatusUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    msg = db.query(Message).filter(Message.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")

    status_row = db.query(MessageStatus).filter(
        MessageStatus.message_id == message_id,
        MessageStatus.user_id == current_user.id
    ).first()

    if status_row:
        status_row.status = body.status
    else:
        status_row = MessageStatus(message_id=message_id, user_id=current_user.id, status=body.status)
        db.add(status_row)
    db.commit()

    # Notify sender via WS
    await manager.send_to_user(msg.sender_id, {
        "event": "message_status",
        "data": {"message_id": message_id, "user_id": current_user.id, "status": body.status}
    })

    return {"detail": "Status updated"}

@router.delete("/{message_id}")
async def delete_message(message_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    msg = db.query(Message).filter(Message.id == message_id, Message.sender_id == current_user.id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found or unauthorized")
    msg.is_deleted = True
    msg.content = "This message was deleted"
    db.commit()

    participants = db.query(ConversationParticipant).filter(ConversationParticipant.conversation_id == msg.conversation_id).all()
    for p in participants:
        await manager.send_to_user(p.user_id, {"event": "message_deleted", "data": {"message_id": message_id}})

    return {"detail": "Message deleted"}
