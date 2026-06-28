from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.schemas.auth import UserRegister, VerifyOTP, UserLogin, Token, RefreshToken, OTPResponse
from app.schemas.user import UserResponse
from app.services.auth_service import get_password_hash, verify_password, create_access_token, create_refresh_token
from app.middleware.auth_middleware import get_db, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=OTPResponse)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.phone_number == user_in.phone_number).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    db_user = db.query(User).filter(User.username == user_in.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    new_user = User(
        phone_number=user_in.phone_number,
        username=user_in.username,
        display_name=user_in.display_name,
        password_hash=get_password_hash(user_in.password),
        is_online=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"user_id": new_user.id, "otp_sent": True}

@router.post("/verify-otp")
def verify_otp(verify_data: VerifyOTP, db: Session = Depends(get_db)):
    if verify_data.otp != "123456":
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    user = db.query(User).filter(User.id == verify_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    access_token = create_access_token(data={"sub": user.id})
    refresh_token = create_refresh_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": UserResponse.model_validate(user)
    }

@router.post("/login")
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.phone_number == login_data.phone_or_username) | 
        (User.username == login_data.phone_or_username)
    ).first()
    
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect credentials")
        
    access_token = create_access_token(data={"sub": user.id})
    refresh_token = create_refresh_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": UserResponse.model_validate(user)
    }

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"detail": "Logged out successfully"}

@router.post("/refresh")
def refresh(token_data: RefreshToken, db: Session = Depends(get_db)):
    from jose import jwt, JWTError
    from app.services.auth_service import SECRET_KEY, ALGORITHM
    try:
        payload = jwt.decode(token_data.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=400, detail="Invalid token type")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    access_token = create_access_token(data={"sub": user_id})
    return {"access_token": access_token}
