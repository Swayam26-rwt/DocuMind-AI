from fastapi import APIRouter
from .auth import router as auth
from .users import router as users
from .workspaces import router as workspaces
from .documents import router as documents
from .search import router as search
from .conversations import router as conversations
from .verification import router as verification
from .health import router as health

api_router = APIRouter()
for r in [auth, users, workspaces, documents, search, conversations, verification, health]:
    api_router.include_router(r)
