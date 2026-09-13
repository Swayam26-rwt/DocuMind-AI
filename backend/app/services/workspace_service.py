from app.models.workspace import Workspace
from app.models.workspace_member import WorkspaceMember

def create(db, user_id, name):
    w = Workspace(name=name, owner_id=user_id)
    db.add(w); db.flush()
    db.add(WorkspaceMember(workspace_id=w.id, user_id=user_id, role="OWNER"))
    db.commit(); db.refresh(w)
    return w
