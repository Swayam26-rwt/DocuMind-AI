from pydantic import BaseModel
class WorkspaceCreate(BaseModel): name: str
class WorkspaceResponse(BaseModel):
    id: str
    name: str
    owner_id: str
    model_config = {"from_attributes": True}
