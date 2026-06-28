from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.middleware.auth_middleware import get_db, get_current_user
from app.models.user import User
from app.models.conversation import Conversation, ConversationParticipant
from app.models.group import GroupMeta
from app.services.ws_manager import manager
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

router = APIRouter(prefix="/groups", tags=["groups"])

class GroupCreate(BaseModel):
    name: str
    member_ids: List[str]
    description: Optional[str] = ""

class GroupUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

@router.post("")
def create_group(body: GroupCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conv = Conversation(type="group")
    db.add(conv)
    db.commit()
    db.refresh(conv)

    meta = GroupMeta(
        conversation_id=conv.id,
        name=body.name,
        description=body.description or "",
        created_by=current_user.id
    )
    db.add(meta)

    member_ids = list(set([current_user.id] + body.member_ids))
    for uid in member_ids:
        db.add(ConversationParticipant(
            conversation_id=conv.id,
            user_id=uid,
            is_admin=(uid == current_user.id)
        ))
    db.commit()

    return {"id": conv.id, "name": body.name, "created_at": conv.created_at}

@router.get("/{conversation_id}")
def get_group(conversation_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    meta = db.query(GroupMeta).filter(GroupMeta.conversation_id == conversation_id).first()
    if not meta:
        raise HTTPException(status_code=404, detail="Group not found")
    participants = db.query(ConversationParticipant).filter(ConversationParticipant.conversation_id == conversation_id).all()
    for p in participants:
        p.user = db.query(User).filter(User.id == p.user_id).first()
    return {
        "id": meta.id,
        "conversation_id": conversation_id,
        "name": meta.name,
        "description": meta.description,
        "created_by": meta.created_by,
        "created_at": meta.created_at,
        "participants": [{"user_id": p.user_id, "is_admin": p.is_admin, "display_name": p.user.display_name if p.user else ""} for p in participants]
    }

@router.put("/{conversation_id}")
def update_group(conversation_id: str, body: GroupUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    meta = db.query(GroupMeta).filter(GroupMeta.conversation_id == conversation_id).first()
    if not meta:
        raise HTTPException(status_code=404, detail="Group not found")

    is_admin = db.query(ConversationParticipant).filter(
        ConversationParticipant.conversation_id == conversation_id,
        ConversationParticipant.user_id == current_user.id,
        ConversationParticipant.is_admin == True
    ).first()
    if not is_admin:
        raise HTTPException(status_code=403, detail="Only admins can edit the group")

    if body.name: meta.name = body.name
    if body.description is not None: meta.description = body.description
    db.commit()
    return {"detail": "Group updated"}

@router.post("/{conversation_id}/add")
def add_member(conversation_id: str, body: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = body.get("user_id")
    existing = db.query(ConversationParticipant).filter(
        ConversationParticipant.conversation_id == conversation_id,
        ConversationParticipant.user_id == user_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already in group")
    db.add(ConversationParticipant(conversation_id=conversation_id, user_id=user_id))
    db.commit()
    return {"detail": "Member added"}

@router.delete("/{conversation_id}/remove/{user_id}")
def remove_member(conversation_id: str, user_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    participant = db.query(ConversationParticipant).filter(
        ConversationParticipant.conversation_id == conversation_id,
        ConversationParticipant.user_id == user_id
    ).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Member not found")
    db.delete(participant)
    db.commit()
    return {"detail": "Member removed"}
