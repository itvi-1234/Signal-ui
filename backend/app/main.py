from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base

# Import all models so SQLAlchemy registers them before create_all
from app.models.user import User
from app.models.contact import Contact
from app.models.conversation import Conversation, ConversationParticipant
from app.models.group import GroupMeta
from app.models.message import Message, MessageStatus, MessageReaction

from app.routers import auth, users, contacts, conversations, messages, groups, ws

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SecureChat (Signal Clone) API", version="1.0.0")

import os

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    os.getenv("FRONTEND_URL", ""),  # Set this to your Vercel URL in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in ALLOWED_ORIGINS if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(contacts.router, prefix="/api")
app.include_router(conversations.router, prefix="/api")
app.include_router(messages.router, prefix="/api")
app.include_router(groups.router, prefix="/api")
app.include_router(ws.router)

@app.get("/")
def root():
    return {"message": "Welcome to SecureChat API"}
