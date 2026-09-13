from fastapi import APIRouter
router = APIRouter(prefix="/extraction", tags=["extraction"])
@router.get("")
def list_items(): return []
