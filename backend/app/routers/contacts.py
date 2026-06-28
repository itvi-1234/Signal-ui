from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.models.contact import Contact
from app.schemas.user import ContactCreate, ContactResponse
from app.middleware.auth_middleware import get_db, get_current_user

router = APIRouter(prefix="/contacts", tags=["contacts"])

@router.get("", response_model=list[ContactResponse])
def get_contacts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    contacts = db.query(Contact).filter(Contact.owner_id == current_user.id).all()
    for c in contacts:
        c.contact_user = db.query(User).filter(User.id == c.contact_id).first()
    return contacts

@router.post("", response_model=ContactResponse)
def add_contact(contact_in: ContactCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    target_user = db.query(User).filter(
        (User.phone_number == contact_in.phone_or_username) | 
        (User.username == contact_in.phone_or_username)
    ).first()
    
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    if target_user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot add yourself as contact")
        
    existing = db.query(Contact).filter(
        Contact.owner_id == current_user.id, 
        Contact.contact_id == target_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Contact already exists")
        
    new_contact = Contact(owner_id=current_user.id, contact_id=target_user.id)
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    new_contact.contact_user = target_user
    
    return new_contact

@router.delete("/{contact_id}")
def remove_contact(contact_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    contact = db.query(Contact).filter(
        Contact.owner_id == current_user.id, 
        Contact.contact_id == contact_id
    ).first()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
        
    db.delete(contact)
    db.commit()
    return {"detail": "Contact removed"}
