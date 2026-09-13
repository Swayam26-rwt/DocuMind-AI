from fastapi import APIRouter
router = APIRouter(prefix="/members", tags=["members"])
@router.get("")
def list_items(): return []
