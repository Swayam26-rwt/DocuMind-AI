from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.services.document_service import upload
from app.schemas.document import DocumentResponse
router = APIRouter(prefix="/workspaces/{workspace_id}/documents", tags=["documents"])

@router.post("", response_model=DocumentResponse, status_code=201)
async def upload_document(workspace_id: str, file: UploadFile = File(...),
                          db: Session = Depends(get_db), user=Depends(get_current_user)):
    try:
        return upload(db, workspace_id, user.id, file.filename, await file.read())
    except ValueError as e:
        raise HTTPException(415, str(e))
