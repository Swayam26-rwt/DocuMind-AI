from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
from app.schemas.user import UserResponse
router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
def me(user=Depends(get_current_user)): return user
