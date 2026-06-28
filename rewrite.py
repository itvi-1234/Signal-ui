import os
import subprocess

# Reset git
subprocess.run(['rm', '-rf', '.git'])
subprocess.run(['git', 'init'])

def commit_files(path_patterns, message):
    files_to_add = []
    for pattern in path_patterns:
        if '*' in pattern:
            # Simple wildcard resolution
            base_dir = pattern[:pattern.rfind('/')]
            if os.path.exists(base_dir):
                ext = pattern.split('*')[-1]
                for f in os.listdir(base_dir):
                    if f.endswith(ext):
                        files_to_add.append(os.path.join(base_dir, f))
        else:
            if os.path.exists(pattern):
                files_to_add.append(pattern)
            elif os.path.isdir(pattern):
                for root, _, files in os.walk(pattern):
                    for f in files:
                        files_to_add.append(os.path.join(root, f))
    
    if files_to_add:
        # Add files
        subprocess.run(['git', 'add'] + files_to_add)
        # Commit
        subprocess.run(['git', 'commit', '-s', '-m', message])

# Backend
commit_files(['backend/requirements.txt', 'backend/Procfile', 'backend/nixpacks.toml', 'backend/railway.json', 'backend/runtime.txt', 'render.yaml', '.gitignore', 'README.md'], 'chore: initialize project repository and environment configs')
commit_files(['backend/app/config.py', 'backend/app/database.py', 'backend/app/__init__.py'], 'backend: add database and core configuration')
commit_files(['backend/app/models'], 'backend: define SQLAlchemy database models')
commit_files(['backend/app/schemas'], 'backend: add Pydantic validation schemas')
commit_files(['backend/app/middleware', 'backend/app/services'], 'backend: implement authentication, chat, and WS services')
commit_files(['backend/app/routers'], 'backend: add REST and WebSocket API endpoints')
commit_files(['backend/app/main.py', 'backend/app/seed.py'], 'backend: configure FastAPI application and seed script')

# Frontend Configs
commit_files(['frontend/package.json', 'frontend/package-lock.json', 'frontend/tsconfig.json', 'frontend/next.config.js', 'frontend/tailwind.config.ts', 'frontend/postcss.config.js', 'frontend/.env.example', 'frontend/next-env.d.ts'], 'frontend: initialize Next.js and Tailwind project')
commit_files(['frontend/public', 'frontend/copy_img.py'], 'chore: add frontend static assets')

# Frontend Libs & State
commit_files(['frontend/src/lib', 'frontend/src/types'], 'frontend: add TypeScript definitions, API, and WS clients')
commit_files(['frontend/src/hooks', 'frontend/src/store'], 'frontend: implement Zustand stores and custom React hooks')

# Frontend Components
commit_files(['frontend/src/components/shared'], 'frontend: add reusable shared UI components')
commit_files(['frontend/src/components/sidebar'], 'frontend: implement sidebar navigation and new chat panel')
commit_files(['frontend/src/components/chat'], 'frontend: implement rich message composer and chat views')
commit_files(['frontend/src/components/group', 'frontend/src/components/settings'], 'frontend: implement group management and settings UI')

# Frontend Pages
commit_files(['frontend/src/app/auth'], 'frontend: create authentication flows and profile setup')
commit_files(['frontend/src/app/chat', 'frontend/src/app/calls', 'frontend/src/app/stories', 'frontend/src/app/settings'], 'frontend: setup application routing and feature pages')
commit_files(['frontend/src/app/layout.tsx', 'frontend/src/app/page.tsx', 'frontend/src/app/globals.css'], 'frontend: configure root layout and global styles')

# Anything else
subprocess.run(['git', 'add', '.'])
# Only commit if there are changes left
result = subprocess.run(['git', 'status', '--porcelain'], capture_output=True, text=True)
if result.stdout.strip():
    subprocess.run(['git', 'commit', '-s', '-m', 'chore: final project configurations and remaining assets'])

print("Git history rewritten using Python!")
