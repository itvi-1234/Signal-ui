import os
import sys
from datetime import datetime, timedelta

# Add parent dir to path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, Base, engine
from app.models.user import User
from app.models.conversation import Conversation, ConversationParticipant
from app.models.message import Message, MessageStatus
from app.models.group import GroupMeta
from app.services.auth_service import get_password_hash

def seed_data():
    print("Recreating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    print("Seeding users...")
    users = [
        {"phone_number": "+1234567890", "username": "alice", "display_name": "Alice Johnson", "password": "pass123"},
        {"phone_number": "+1234567891", "username": "bob", "display_name": "Bob Smith", "password": "pass123"},
        {"phone_number": "+1234567892", "username": "carol", "display_name": "Carol Williams", "password": "pass123"},
        {"phone_number": "+1234567893", "username": "dave", "display_name": "Dave Brown", "password": "pass123"},
        {"phone_number": "+1234567894", "username": "eve", "display_name": "Eve Davis", "password": "pass123"},
        {"phone_number": "+1234567895", "username": "frank", "display_name": "Frank Miller", "password": "pass123"},
    ]

    user_objs = {}
    for u in users:
        user = User(
            phone_number=u["phone_number"],
            username=u["username"],
            display_name=u["display_name"],
            password_hash=get_password_hash(u["password"])
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        user_objs[u["username"]] = user

    print("Seeding conversations (direct)...")
    # Alice <-> Bob
    c1 = Conversation(type="direct")
    db.add(c1)
    db.commit()
    db.add_all([
        ConversationParticipant(conversation_id=c1.id, user_id=user_objs["alice"].id),
        ConversationParticipant(conversation_id=c1.id, user_id=user_objs["bob"].id)
    ])

    # Alice <-> Carol
    c2 = Conversation(type="direct")
    db.add(c2)
    db.commit()
    db.add_all([
        ConversationParticipant(conversation_id=c2.id, user_id=user_objs["alice"].id),
        ConversationParticipant(conversation_id=c2.id, user_id=user_objs["carol"].id)
    ])

    print("Seeding groups...")
    # Team Alpha (Alice, Bob, Carol, Dave)
    g1 = Conversation(type="group")
    db.add(g1)
    db.commit()
    db.add(GroupMeta(conversation_id=g1.id, name="Team Alpha 🚀", created_by=user_objs["alice"].id))
    for name in ["alice", "bob", "carol", "dave"]:
        db.add(ConversationParticipant(conversation_id=g1.id, user_id=user_objs[name].id, is_admin=(name=="alice")))

    db.commit()

    print("Seeding messages...")
    now = datetime.utcnow()
    m1 = Message(conversation_id=c1.id, sender_id=user_objs["alice"].id, content="Hey Bob!", created_at=now - timedelta(days=1))
    db.add(m1)
    db.commit()
    db.add(MessageStatus(message_id=m1.id, user_id=user_objs["bob"].id, status="read"))
    
    m2 = Message(conversation_id=c1.id, sender_id=user_objs["bob"].id, content="Hi Alice, how are you?", created_at=now - timedelta(hours=10))
    db.add(m2)
    db.commit()
    db.add(MessageStatus(message_id=m2.id, user_id=user_objs["alice"].id, status="delivered"))

    m3 = Message(conversation_id=g1.id, sender_id=user_objs["alice"].id, content="Welcome to the group guys!", created_at=now - timedelta(hours=5))
    db.add(m3)
    db.commit()
    for name in ["bob", "carol", "dave"]:
        db.add(MessageStatus(message_id=m3.id, user_id=user_objs[name].id, status="read"))

    db.commit()
    print("Seed complete!")

if __name__ == "__main__":
    seed_data()
