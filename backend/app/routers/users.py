from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.middleware.auth_middleware import get_db, get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_me(user_update: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_update.display_name is not None:
        current_user.display_name = user_update.display_name
    if user_update.avatar_url is not None:
        current_user.avatar_url = user_update.avatar_url
    if user_update.bio is not None:
        current_user.bio = user_update.bio
        
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/search")
def search_users(q: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    users = db.query(User).filter(
        (User.username.ilike(f"%{q}%")) | 
        (User.phone_number.ilike(f"%{q}%"))
    ).filter(User.id != current_user.id).all()
    return [UserResponse.model_validate(u) for u in users]

@router.get("/{id}", response_model=UserResponse)
def get_user(id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
