from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.conversation import Conversation, ConversationParticipant
from app.models.message import Message, MessageStatus
from app.models.group import GroupMeta
from app.models.user import User

def get_user_conversations(db: Session, user_id: str):
    participant_rows = db.query(ConversationParticipant).filter(ConversationParticipant.user_id == user_id).all()
    conv_ids = [p.conversation_id for p in participant_rows]

    conversations = (
        db.query(Conversation)
        .filter(Conversation.id.in_(conv_ids))
        .order_by(desc(Conversation.last_message_at))
        .all()
    )

    for conv in conversations:
        parts = db.query(ConversationParticipant).filter(ConversationParticipant.conversation_id == conv.id).all()
        for p in parts:
            p.user = db.query(User).filter(User.id == p.user_id).first()
        conv.participants = parts

        last_msg = db.query(Message).filter(Message.conversation_id == conv.id).order_by(desc(Message.created_at)).first()
        conv.last_message = last_msg

        unread = db.query(MessageStatus).join(Message).filter(
            Message.conversation_id == conv.id,
            MessageStatus.user_id == user_id,
            MessageStatus.status != "read"
        ).count()
        conv.unread_count = unread

        if conv.type == "group":
            meta = db.query(GroupMeta).filter(GroupMeta.conversation_id == conv.id).first()
            if meta:
                conv.name = meta.name
                conv.avatar_url = meta.avatar_url

    return conversations


def get_or_create_direct_conversation(db: Session, user_id: str, target_user_id: str):
    user_convs = (
        db.query(ConversationParticipant.conversation_id)
        .join(Conversation)
        .filter(
            ConversationParticipant.user_id == user_id,
            Conversation.type == "direct"
        )
        .subquery()
    )

    existing = (
        db.query(ConversationParticipant.conversation_id)
        .filter(
            ConversationParticipant.conversation_id.in_(user_convs),
            ConversationParticipant.user_id == target_user_id
        )
        .first()
    )

    if existing:
        return db.query(Conversation).filter(Conversation.id == existing[0]).first(), False

    conv = Conversation(type="direct")
    db.add(conv)
    db.commit()
    db.refresh(conv)

    db.add_all([
        ConversationParticipant(conversation_id=conv.id, user_id=user_id),
        ConversationParticipant(conversation_id=conv.id, user_id=target_user_id),
    ])
    db.commit()
    return conv, True
