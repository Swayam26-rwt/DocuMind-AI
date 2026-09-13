from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.schemas.workspace import WorkspaceCreate, WorkspaceResponse
from app.services.workspace_service import create
router = APIRouter(prefix="/workspaces", tags=["workspaces"])

@router.post("", response_model=WorkspaceResponse, status_code=201)
def create_workspace(data: WorkspaceCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return create(db, user.id, data.name)
