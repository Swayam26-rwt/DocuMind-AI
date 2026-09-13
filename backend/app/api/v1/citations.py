from fastapi import APIRouter
router = APIRouter(prefix="/citations", tags=["citations"])
@router.get("")
def list_items(): return []
