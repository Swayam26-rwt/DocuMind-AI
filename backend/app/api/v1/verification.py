from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
router = APIRouter(prefix="/verification", tags=["verification"])

@router.get("/pending")
def pending(user=Depends(get_current_user)): return []
