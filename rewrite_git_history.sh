#!/bin/bash

# Save current remote URL
REMOTE_URL=$(git config --get remote.origin.url)

echo "Reinitializing git repository..."
rm -rf .git
git init

# 1. Project init
git add backend/requirements.txt backend/.env.example backend/Procfile backend/nixpacks.toml backend/railway.json backend/runtime.txt render.yaml .gitignore README.md
git commit -s -m "chore: initialize project repository and environment configs

- Add backend python requirements
- Add deployment configurations for Render/Railway
- Add base .gitignore and README"

# 2. Backend core config
git add backend/app/config.py backend/app/database.py backend/app/__init__.py
git commit -s -m "backend: add database and core configuration

- Setup SQLAlchemy declarative base
- Configure environment variables and database URLs"

# 3. Backend models
git add backend/app/models/
git commit -s -m "backend: define SQLAlchemy database models

- Define User, Conversation, Message models
- Setup relationships between entities"

# 4. Backend schemas
git add backend/app/schemas/
git commit -s -m "backend: add Pydantic validation schemas

- Create schemas for Auth, User, Message, and Chat
- Ensure type safety for API endpoints"

# 5. Backend auth services & middleware
git add backend/app/services/auth.py backend/app/middleware/
git commit -s -m "backend: implement JWT authentication and middleware

- Add password hashing and token generation
- Implement JWT bearer dependency for protected routes"

# 6. Backend chat/message services
git add backend/app/services/chat.py
git commit -s -m "backend: implement chat and message services

- Add CRUD operations for conversations
- Implement message creation and retrieval logic"

# 7. Backend websocket service
git add backend/app/services/websocket.py
git commit -s -m "backend: implement WebSocket connection manager

- Support real-time messaging and typing indicators
- Handle active connections per user"

# 8. Backend routers: Auth & Users
git add backend/app/routers/auth.py backend/app/routers/users.py
git commit -s -m "backend: add authentication and user REST endpoints

- Implement login, registration, and user search APIs"

# 9. Backend routers: Chat & WS
git add backend/app/routers/chat.py backend/app/routers/ws.py
git commit -s -m "backend: add chat and WebSocket API endpoints

- Implement message sending and conversation fetching APIs
- Expose WebSocket endpoint for real-time events"

# 10. Backend main application entry & seed
git add backend/app/main.py backend/app/seed.py
git commit -s -m "backend: configure FastAPI application and seed script

- Setup CORS and include all API routers
- Add database seeding script for testing"

# 11. Frontend Next.js init
git add frontend/package.json frontend/tsconfig.json frontend/next.config.js frontend/tailwind.config.ts frontend/postcss.config.js frontend/.env.example
git commit -s -m "frontend: initialize Next.js and Tailwind project

- Add package dependencies and scripts
- Configure Tailwind CSS and PostCSS"

# 12. Frontend core types and utilities
git add frontend/src/types/ frontend/src/lib/utils.ts frontend/src/lib/api.ts
git commit -s -m "frontend: add TypeScript definitions and API client

- Define core interfaces (User, Message, Conversation)
- Configure Axios interceptors with auth tokens"

# 13. Frontend WebSocket client
git add frontend/src/lib/wsClient.ts
git commit -s -m "frontend: implement robust WebSocket client

- Add auto-reconnection logic and event emission
- Support typing, presence, and message events"

# 14. Frontend global state management
git add frontend/src/store/
git commit -s -m "frontend: implement Zustand state stores

- Add authStore for session management
- Add chatStore for local message caching and conversations"

# 15. Frontend generic UI components
git add frontend/src/components/ui/
git commit -s -m "frontend: add reusable Radix UI components

- Implement accessible buttons, inputs, avatars
- Add dialogs, dropdowns, and tooltip primitives"

# 16. Frontend authentication UI
git add frontend/src/components/auth/
git commit -s -m "frontend: implement login and registration components

- Build responsive auth forms with validation
- Integrate with Next.js navigation"

# 17. Frontend Left Rail & Navigation
git add frontend/src/components/sidebar/LeftRail.tsx frontend/src/components/sidebar/Sidebar.tsx
git commit -s -m "frontend: implement sidebar navigation and left rail

- Build responsive navigation panel
- Add profile settings and theme toggles"

# 18. Frontend New Chat & User Search UI
git add frontend/src/components/sidebar/NewChatPanel.tsx frontend/src/components/sidebar/SearchBar.tsx frontend/src/components/sidebar/ChatList.tsx
git commit -s -m "frontend: implement new chat and user discovery UI

- Add dynamic panel for group creation and user search
- Implement smooth transitions and exact Signal parity"

# 19. Frontend Chat View Core Layout
git add frontend/src/components/chat/ChatView.tsx frontend/src/components/chat/MessageList.tsx frontend/src/components/chat/MessageBubble.tsx
git commit -s -m "frontend: implement core messaging interface

- Build message list with scroll-to-bottom
- Add stylized message bubbles with timestamp formatting"

# 20. Frontend Message Input and Attachments UI
git add frontend/src/components/chat/MessageInput.tsx
git commit -s -m "frontend: implement rich message composer

- Add dynamic text area with auto-resize
- Integrate custom emoji picker and file attachment menus"

# 21. Frontend Main Layout
git add frontend/src/app/layout.tsx frontend/src/app/globals.css
git commit -s -m "frontend: configure root layout and global styles

- Apply Inter font and dark theme variables
- Set up root HTML structure"

# 22. Frontend Pages: Auth
git add frontend/src/app/login/ frontend/src/app/register/
git commit -s -m "frontend: create authentication pages

- Add dedicated routes for sign-in and sign-up flows"

# 23. Frontend Pages: App
git add frontend/src/app/page.tsx frontend/src/app/chat/
git commit -s -m "frontend: setup application routing and chat pages

- Add default blank slate view
- Implement dynamic routing for active conversations"

# 24. Final Polish & Assets
git add frontend/public/ frontend/copy_img.py frontend/next-env.d.ts frontend/package-lock.json
git commit -s -m "chore: add static assets and lockfiles

- Include public icons and manifest
- Lock frontend dependency versions"

# Catch any remaining untracked files
git add .
git commit -s -m "chore: final project configurations and remaining assets"

echo "Re-linking remote repository: $REMOTE_URL"
if [ ! -z "$REMOTE_URL" ]; then
    git remote add origin $REMOTE_URL
    echo "You can now push using: git push -f origin main"
else
    echo "No remote URL found. Please add it manually using: git remote add origin <URL>"
fi

echo "Git history has been rewritten with 25 commits!"
