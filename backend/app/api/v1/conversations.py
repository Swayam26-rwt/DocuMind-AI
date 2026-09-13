from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
router = APIRouter(prefix="/conversations", tags=["chat"])

@router.post("")
def create_conversation(user=Depends(get_current_user)):
    return {"title": "New conversation", "messages": []}
