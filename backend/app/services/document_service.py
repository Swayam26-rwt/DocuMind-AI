import uuid, hashlib
from app.models.document import Document
from app.models.document_version import DocumentVersion
from app.storage.minio_storage import MinioStorage

ALLOWED = {".pdf",".docx",".pptx",".xlsx",".csv",".txt",".md",".json",".png",".jpg",".jpeg",".webp"}

def upload(db, workspace_id, user_id, filename, data):
    ext = "." + filename.rsplit(".",1)[-1].lower()
    if ext not in ALLOWED:
        raise ValueError("Unsupported file format")
    checksum = hashlib.sha256(data).hexdigest()
    key = f"{workspace_id}/{uuid.uuid4()}-{filename}"
    MinioStorage().put(key, data)
    d = Document(workspace_id=workspace_id, uploaded_by=user_id, filename=filename,
        file_type=ext[1:], file_size=len(data), checksum=checksum,
        status="QUEUED", storage_key=key)
    db.add(d); db.flush()
    db.add(DocumentVersion(document_id=d.id, version_number=1,
        storage_key=key, processing_status="QUEUED", checksum=checksum))
    db.commit(); db.refresh(d)
    return d
