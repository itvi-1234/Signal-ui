import shutil
import os

source = os.path.expanduser('~/Downloads/signal.png')
dest = 'public/signal.png'

if os.path.exists(source):
    shutil.copy(source, dest)
    print("Copied successfully")
else:
    print("File not found")
