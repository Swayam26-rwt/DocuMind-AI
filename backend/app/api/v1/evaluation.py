from fastapi import APIRouter
router = APIRouter(prefix="/evaluation", tags=["evaluation"])
@router.get("")
def list_items(): return []
