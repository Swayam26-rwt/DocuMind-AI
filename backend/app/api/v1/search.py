from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.rag.keyword_search import keyword_search
router = APIRouter(prefix="/search", tags=["search"])

@router.get("")
def search(q: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    rows = keyword_search(db, q)
    return [{"id": r.id, "content": r.content, "page": r.page_number} for r in rows]
