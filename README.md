# SecureChat (Signal Clone)

A fullstack web application clone of Signal Messenger featuring real-time messaging, WebSocket connectivity, optimistic UI updates, and an authentic dark mode experience.

## Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS, Zustand, Axios
- **Backend**: Python 3.11, FastAPI, SQLAlchemy, SQLite, WebSockets
- **Authentication**: JWT (Access & Refresh tokens), bcrypt

## Features
- Complete Authentication Flow (with mocked OTP `123456`)
- Real-time Direct Messaging via WebSockets
- Read Receipts (sent, delivered, read statuses)
- Typing Indicators
- Group Chats & Management
- Optimistic UI updates
- Signal-accurate Dark Mode aesthetics

## Architecture Overview
The application consists of a FastAPI backend and a Next.js frontend. 
Communication happens over REST for operations (CRUD, Auth) and WebSockets for real-time state synchronization (Messages, Typing, Receipts).

### Database Schema
We use SQLite mapped via SQLAlchemy. Key tables:
- `users`: stores profile and auth data.
- `conversations`: unifies Direct and Group chats.
- `conversation_participants`: maps users to conversations.
- `messages`: core messaging table.
- `message_status`: tracks delivery/read status per recipient.

### Setup Instructions

#### Backend Setup
1. `cd backend`
2. Create virtual environment: `python -m venv venv`
3. Activate it: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Seed database: `python app/seed.py`
6. Run server: `uvicorn app.main:app --reload` (Runs on http://localhost:8000)

#### Frontend Setup
1. `cd frontend`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev` (Runs on http://localhost:3000)

Use the predefined seeded users (alice, bob, carol) with password `pass123` to test.
