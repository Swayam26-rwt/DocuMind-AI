from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.services.auth_service import register, login
router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", status_code=201)
def register_user(data: RegisterRequest, db: Session = Depends(get_db)):
    try: return register(db, data)
    except ValueError as e: raise HTTPException(409, str(e))

@router.post("/login", response_model=TokenResponse)
def login_user(data: LoginRequest, db: Session = Depends(get_db)):
    try: return {"access_token": login(db, data.email, data.password)}
    except ValueError as e: raise HTTPException(401, str(e))
