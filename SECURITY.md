# 🔐 Security Policy — DocuMind AI

This document describes the security architecture, controls, and responsible disclosure policy for DocuMind AI.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Password Security](#2-password-security)
3. [JWT Token Management](#3-jwt-token-management)
4. [Role-Based Access Control (RBAC)](#4-role-based-access-control-rbac)
5. [Workspace Isolation](#5-workspace-isolation)
6. [API Security](#6-api-security)
7. [File Upload Security](#7-file-upload-security)
8. [Secret Management](#8-secret-management)
9. [AI / Prompt Security](#9-ai--prompt-security)
10. [Audit Logging](#10-audit-logging)
11. [Reporting a Vulnerability](#11-reporting-a-vulnerability)

---

## 1. Authentication

DocuMind AI uses **stateless JWT-based authentication** via the `python-jose` library.

**Auth flow:**

```
User submits email + password
       ↓
Credentials validated against database
       ↓
Password verified with bcrypt
       ↓
JWT access token issued (HS256, 60 min expiry)
       ↓
Token sent in Authorization: Bearer header on every request
       ↓
FastAPI dependency decodes + validates token on each route
```

**Auth endpoints:**

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/login` | Login, receive JWT |
| `POST` | `/api/v1/auth/logout` | Invalidate session |
| `GET`  | `/api/v1/auth/me` | Get current user |
| `POST` | `/api/v1/auth/forgot-password` | Request password reset |
| `POST` | `/api/v1/auth/reset-password` | Apply new password |

---

## 2. Password Security

Passwords are **never stored in plaintext**. The implementation uses `passlib` with `bcrypt`:

```python
# backend/app/core/security.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)
```

- bcrypt automatically salts each hash (no rainbow table attacks)
- Work factor adjusts with `passlib` defaults (cost factor ≥ 12)
- Passwords are hashed before being written to the `users` table

---

## 3. JWT Token Management

Tokens are signed with **HS256** using a `SECRET_KEY` loaded from environment variables:

```python
# backend/app/core/security.py
def create_access_token(subject: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    return jwt.encode({"sub": subject, "exp": exp}, settings.secret_key, algorithm="HS256")

def decode_token(token: str) -> str:
    payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
    return payload["sub"]
```

| Property | Value |
|----------|-------|
| Algorithm | HS256 |
| Expiry | 60 minutes (configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`) |
| Payload | `sub` (user ID) + `exp` |
| Transport | `Authorization: Bearer <token>` header |

> ⚠️ **Production requirement:** `SECRET_KEY` must be a randomly generated 256-bit value. Never use the default `development-secret`.

Generate a secure key:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

---

## 4. Role-Based Access Control (RBAC)

Every workspace member has one of four roles. All resource access is gated by role checks in FastAPI dependencies:

| Operation | OWNER | ADMIN | MEMBER | VIEWER |
|-----------|:-----:|:-----:|:------:|:------:|
| View Documents | ✅ | ✅ | ✅ | ✅ |
| Semantic Search | ✅ | ✅ | ✅ | ✅ |
| AI Chat (RAG) | ✅ | ✅ | ✅ | ✅ |
| Upload Documents | ✅ | ✅ | ✅ | ❌ |
| Delete Documents | ✅ | ✅ | Own only | ❌ |
| Verify Extractions | ✅ | ✅ | Optional | ❌ |
| Manage Members | ✅ | ✅ | ❌ | ❌ |
| Workspace Settings | ✅ | ✅ | ❌ | ❌ |
| View Audit Logs | ✅ | ✅ | ❌ | ❌ |
| Admin Panel | ✅ | ❌ | ❌ | ❌ |

---

## 5. Workspace Isolation

All resources (documents, chunks, conversations, extractions) are scoped to a **workspace**. Every API request must pass workspace membership validation:

```
Incoming Request
       ↓
Decode JWT → User ID
       ↓
Extract Workspace ID (from URL or body)
       ↓
Check workspace_members table for (user_id, workspace_id)
       ↓
Verify role has required permission
       ↓
Resource access granted / denied
       ↓
Action written to audit_log
```

A user in Workspace A **cannot access any resource** from Workspace B — even if they know the resource ID.

---

## 6. API Security

### CORS
The FastAPI backend restricts cross-origin requests to the frontend origin only:

```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

> In production, replace with your actual frontend domain.

### Input Validation
All request bodies are validated with **Pydantic v2** schemas. Invalid or malformed inputs are rejected with `422 Unprocessable Entity` before reaching business logic.

### Rate Limiting
API routes implement rate limiting (429 Too Many Requests) to protect against brute-force and abuse.

### HTTPS / TLS
All traffic must be served over **HTTPS in production**. Configure TLS termination at your reverse proxy (nginx / Caddy / Cloudflare).

---

## 7. File Upload Security

Uploaded documents are treated as **untrusted data** at all times:

- File type is validated by **content inspection** (magic bytes), not just file extension
- Maximum file size enforced (configurable, default 100 MB)
- Files are stored in **MinIO / S3** object storage — never on the application filesystem
- File contents are processed in an **isolated Celery worker** process
- OCR and parsing libraries (PyMuPDF, python-docx, etc.) run on sandboxed inputs
- Storage keys use **UUID-based paths** — not predictable or user-controlled

---

## 8. Secret Management

| Secret | Storage | Notes |
|--------|---------|-------|
| `SECRET_KEY` | `.env` file | Must be random 256-bit hex in production |
| `GEMINI_API_KEY` | `.env` file | Server-side only, never exposed to frontend |
| `POSTGRES_PASSWORD` | `.env` file | Strong password required in production |
| `S3_ACCESS_KEY` / `S3_SECRET_KEY` | `.env` file | Use IAM roles in cloud deployments |

**Rules:**
- ✅ All secrets loaded via `pydantic-settings` from environment variables
- ✅ `.env` is listed in `.gitignore` — **never committed to git**
- ✅ Only `.env.example` with empty values is committed
- ❌ Never hardcode secrets in source code
- ❌ Never log secrets or include them in API responses

---

## 9. AI / Prompt Security

DocuMind AI uses Google Gemini for generation and embedding. The following controls apply:

- **API key is server-side only** — the `GEMINI_API_KEY` is never sent to or exposed in the frontend
- **User input is not directly concatenated** into prompts — inputs are structured with explicit role separation (`system` / `user` / `context`)
- **Prompt injection protection** — retrieved document chunks are wrapped in delimiters to prevent context manipulation
- **Output grounding** — all AI answers are grounded in retrieved document chunks, reducing hallucination surface
- **Citation enforcement** — responses include source chunk references, making outputs auditable

---

## 10. Audit Logging

Every significant action is written to the `audit_log` table:

| Logged Event | Details Captured |
|-------------|-----------------|
| Login / Logout | User ID, IP, timestamp |
| Document upload / delete | User, workspace, document ID |
| Extraction verification (approve/reject) | Reviewer, field, decision |
| Member role changes | Actor, target user, old/new role |
| Admin actions | Action type, affected resource |

Audit logs are **append-only** — they cannot be edited or deleted by any user, including OWNER role.

---

## 11. Reporting a Vulnerability

If you discover a security vulnerability in DocuMind AI, please **do not open a public GitHub issue**.

**Responsible disclosure:**

1. Email details to: `swaymrawat862@gmail.com`
2. Include: description, steps to reproduce, potential impact
3. Allow up to **7 days** for an initial response
4. We will work with you on a fix before public disclosure

We appreciate responsible security research and will credit reporters in release notes.

---

<p align="center">
  <sub>Security is a shared responsibility. When in doubt, ask.</sub>
</p>
