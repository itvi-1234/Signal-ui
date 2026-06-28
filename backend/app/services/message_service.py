from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.message import Message, MessageStatus, MessageReaction
from app.models.conversation import ConversationParticipant, Conversation
from datetime import datetime

def get_conversation_messages(db: Session, conversation_id: str, page: int = 1, limit: int = 50):
    skip = (page - 1) * limit
    messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(desc(Message.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )
    for msg in messages:
        msg.statuses = db.query(MessageStatus).filter(MessageStatus.message_id == msg.id).all()
        msg.reactions = db.query(MessageReaction).filter(MessageReaction.message_id == msg.id).all()
    return messages[::-1]


def create_message(db: Session, conversation_id: str, sender_id: str, content: str, message_type: str = "text", reply_to_id: str = None):
    msg = Message(
        conversation_id=conversation_id,
        sender_id=sender_id,
        content=content,
        message_type=message_type,
        reply_to_id=reply_to_id,
    )
    db.add(msg)

    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if conv:
        conv.last_message_at = datetime.utcnow()

    db.commit()
    db.refresh(msg)

    participants = db.query(ConversationParticipant).filter(ConversationParticipant.conversation_id == conversation_id).all()
    for p in participants:
        if p.user_id != sender_id:
            status = MessageStatus(message_id=msg.id, user_id=p.user_id, status="sent")
            db.add(status)
    db.commit()

    msg.statuses = db.query(MessageStatus).filter(MessageStatus.message_id == msg.id).all()
    msg.reactions = []
    return msg
