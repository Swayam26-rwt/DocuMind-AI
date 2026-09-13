from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User

def register(db, data):
    if db.query(User).filter_by(email=data.email).first():
        raise ValueError("Email already registered")
    user = User(email=data.email, password_hash=hash_password(data.password), full_name=data.full_name)
    db.add(user); db.commit(); db.refresh(user)
    return user

def login(db, email, password):
    user = db.query(User).filter_by(email=email).first()
    if not user or not verify_password(password, user.password_hash):
        raise ValueError("Invalid credentials")
    return create_access_token(user.id)
