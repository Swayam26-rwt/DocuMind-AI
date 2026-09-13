from fastapi import APIRouter
router = APIRouter(prefix="/messages", tags=["messages"])
@router.get("")
def list_items(): return []
