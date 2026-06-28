from pydantic import BaseModel, Field
from typing import Optional

class UserRegister(BaseModel):
    phone_number: str
    username: str
    display_name: str
    password: str

class VerifyOTP(BaseModel):
    user_id: str
    otp: str

class UserLogin(BaseModel):
    phone_or_username: str
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshToken(BaseModel):
    refresh_token: str

class OTPResponse(BaseModel):
    user_id: str
    otp_sent: bool = True
