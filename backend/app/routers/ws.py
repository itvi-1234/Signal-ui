from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, HTTPException
from jose import jwt, JWTError
from app.services.auth_service import SECRET_KEY, ALGORITHM
from app.services.ws_manager import manager
from app.database import SessionLocal
from app.models.user import User

router = APIRouter(tags=["websocket"])

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str, token: str = Query(...)):
    # Authenticate
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        token_user_id: str = payload.get("sub")
        if token_user_id != user_id:
            await websocket.close(code=4001)
            return
    except JWTError:
        await websocket.close(code=4001)
        return

    await manager.connect(user_id, websocket)

    # Mark online
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            user.is_online = True
            db.commit()
    finally:
        db.close()

    try:
        while True:
            data = await websocket.receive_json()
            event = data.get("event")
            payload_data = data.get("data", {})

            # Open a short-lived DB session for the event processing
            db_event = SessionLocal()
            try:
                if event == "typing_start":
                    conv_id = payload_data.get("conversation_id")
                    await manager.broadcast_to_conversation(conv_id, user_id, {
                        "event": "typing_indicator",
                        "data": {"conversation_id": conv_id, "user_id": user_id, "is_typing": True}
                    }, db_event)

                elif event == "typing_stop":
                    conv_id = payload_data.get("conversation_id")
                    await manager.broadcast_to_conversation(conv_id, user_id, {
                        "event": "typing_indicator",
                        "data": {"conversation_id": conv_id, "user_id": user_id, "is_typing": False}
                    }, db_event)

                elif event == "message_read":
                    message_id = payload_data.get("message_id")
                    conv_id = payload_data.get("conversation_id")
                    await manager.broadcast_to_conversation(conv_id, user_id, {
                        "event": "message_status",
                        "data": {"message_id": message_id, "user_id": user_id, "status": "read"}
                    }, db_event)
                    
                elif event == "message_delivered":
                    message_id = payload_data.get("message_id")
                    conv_id = payload_data.get("conversation_id")
                    await manager.broadcast_to_conversation(conv_id, user_id, {
                        "event": "message_status",
                        "data": {"message_id": message_id, "user_id": user_id, "status": "delivered"}
                    }, db_event)
            finally:
                db_event.close()

    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)
        # Mark offline
        db = SessionLocal()
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                user.is_online = False
                db.commit()
        finally:
            db.close()
