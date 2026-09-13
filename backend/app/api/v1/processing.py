from fastapi import APIRouter
router = APIRouter(prefix="/processing", tags=["processing"])
@router.get("")
def list_items(): return []
