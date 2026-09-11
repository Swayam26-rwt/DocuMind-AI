##  Complete Database Schema

DocuMind AI uses **PostgreSQL** as its primary relational database and **pgvector** for semantic document retrieval.

The schema is designed to support:

* Multi-user authentication and RBAC.
* Workspace-level data isolation.
* Multi-format document management.
* Document versioning.
* Asynchronous processing.
* Structured AI extraction.
* Field-level confidence and evidence.
* Vector and keyword search.
* RAG conversations.
* Source citations.
* Human verification.
* Audit logging.
* AI evaluation and benchmarking.

---

###  Database Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    DOCUMIND AI DATABASE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Identity & Access                                          │
│  ├── users                                                  │
│  ├── workspaces                                             │
│  └── workspace_members                                      │
│                                                             │
│  Document Management                                        │
│  ├── documents                                               │
│  ├── document_versions                                      │
│  ├── document_chunks                                         │
│  ├── processing_jobs                                         │
│  ├── extraction_results                                      │
│  └── extracted_fields                                        │
│                                                             │
│  RAG & Conversations                                        │
│  ├── conversations                                           │
│  ├── messages                                                │
│  └── message_citations                                       │
│                                                             │
│  Verification & Audit                                       │
│  ├── verification_reviews                                    │
│  └── audit_logs                                              │
│                                                             │
│  AI Evaluation                                               │
│  ├── evaluation_datasets                                     │
│  ├── evaluation_cases                                        │
│  └── evaluation_runs                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2 PostgreSQL Extensions

DocuMind AI requires the `pgvector` extension for embedding storage and similarity search.

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Recommended extensions:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;
```

`pgcrypto` can be used for UUID generation and cryptographic database utilities.

---

# 3 Users

The `users` table stores application users and authentication-related information.

### Table: `users`

| Column          | Type         | Constraints      | Description                |
| --------------- | ------------ | ---------------- | -------------------------- |
| `id`            | UUID         | PK               | Unique user identifier     |
| `email`         | VARCHAR(255) | UNIQUE, NOT NULL | User email                 |
| `password_hash` | TEXT         | NULL             | Hashed password            |
| `full_name`     | VARCHAR(150) | NOT NULL         | Display name               |
| `is_active`     | BOOLEAN      | DEFAULT TRUE     | Account status             |
| `is_verified`   | BOOLEAN      | DEFAULT FALSE    | Email/account verification |
| `created_at`    | TIMESTAMPTZ  | NOT NULL         | Account creation time      |
| `updated_at`    | TIMESTAMPTZ  | NOT NULL         | Last update                |

### SQL

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash TEXT,

    full_name VARCHAR(150) NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    is_verified BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Indexes

```sql
CREATE UNIQUE INDEX idx_users_email
ON users (LOWER(email));
```

---

# 4 Workspaces

A workspace represents an isolated environment for an individual or team.

### Table: `workspaces`

| Column       | Type         | Constraints | Description     |
| ------------ | ------------ | ----------- | --------------- |
| `id`         | UUID         | PK          | Workspace ID    |
| `name`       | VARCHAR(150) | NOT NULL    | Workspace name  |
| `owner_id`   | UUID         | FK → users  | Workspace owner |
| `created_at` | TIMESTAMPTZ  | NOT NULL    | Creation time   |
| `updated_at` | TIMESTAMPTZ  | NOT NULL    | Last update     |

```sql
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,

    owner_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE RESTRICT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

# 5 Workspace Members

Users can belong to multiple workspaces.

### Table: `workspace_members`

| Column         | Type        | Constraints | Description                     |
| -------------- | ----------- | ----------- | ------------------------------- |
| `id`           | UUID        | PK          | Membership ID                   |
| `workspace_id` | UUID        | FK          | Workspace                       |
| `user_id`      | UUID        | FK          | User                            |
| `role`         | VARCHAR     | NOT NULL    | OWNER / ADMIN / MEMBER / VIEWER |
| `joined_at`    | TIMESTAMPTZ | NOT NULL    | Membership date                 |

```sql
CREATE TABLE workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workspace_id UUID NOT NULL
        REFERENCES workspaces(id)
        ON DELETE CASCADE,

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    role VARCHAR(20) NOT NULL,

    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_workspace_role
        CHECK (role IN ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER')),

    CONSTRAINT unique_workspace_member
        UNIQUE (workspace_id, user_id)
);
```

### Indexes

```sql
CREATE INDEX idx_workspace_members_user
ON workspace_members(user_id);

CREATE INDEX idx_workspace_members_workspace
ON workspace_members(workspace_id);
```

---

# 6 Documents

The `documents` table represents the logical document.

The physical file is stored in object storage such as **S3 or MinIO**.

### Table: `documents`

| Column          | Type         | Description                     |
| --------------- | ------------ | ------------------------------- |
| `id`            | UUID PK      | Document identifier             |
| `workspace_id`  | UUID FK      | Owning workspace                |
| `uploaded_by`   | UUID FK      | Uploading user                  |
| `filename`      | VARCHAR(500) | Original filename               |
| `file_type`     | VARCHAR(20)  | PDF, DOCX, XLSX, etc.           |
| `file_size`     | BIGINT       | Size in bytes                   |
| `checksum`      | VARCHAR(128) | File integrity hash             |
| `status`        | VARCHAR(30)  | Processing status               |
| `document_type` | VARCHAR(50)  | Invoice, contract, resume, etc. |
| `storage_key`   | TEXT         | Object-storage location         |
| `metadata`      | JSONB        | Additional metadata             |
| `created_at`    | TIMESTAMPTZ  | Upload time                     |
| `updated_at`    | TIMESTAMPTZ  | Last update                     |

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workspace_id UUID NOT NULL
        REFERENCES workspaces(id)
        ON DELETE CASCADE,

    uploaded_by UUID NOT NULL
        REFERENCES users(id)
        ON DELETE RESTRICT,

    filename VARCHAR(500) NOT NULL,

    file_type VARCHAR(20) NOT NULL,

    file_size BIGINT NOT NULL,

    checksum VARCHAR(128),

    status VARCHAR(30) NOT NULL DEFAULT 'UPLOADED',

    document_type VARCHAR(50),

    storage_key TEXT NOT NULL,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_document_status
        CHECK (
            status IN (
                'UPLOADED',
                'QUEUED',
                'PROCESSING',
                'EXTRACTED',
                'INDEXING',
                'READY',
                'FAILED'
            )
        )
);
```

### Indexes

```sql
CREATE INDEX idx_documents_workspace
ON documents(workspace_id);

CREATE INDEX idx_documents_status
ON documents(status);

CREATE INDEX idx_documents_type
ON documents(document_type);

CREATE INDEX idx_documents_created
ON documents(created_at DESC);
```

---

# 7 Document Versions

Every document can have multiple versions.

```sql
CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    document_id UUID NOT NULL
        REFERENCES documents(id)
        ON DELETE CASCADE,

    version_number INTEGER NOT NULL,

    storage_key TEXT NOT NULL,

    processing_status VARCHAR(30) NOT NULL,

    checksum VARCHAR(128),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_document_version
        UNIQUE (document_id, version_number)
);
```

### Index

```sql
CREATE INDEX idx_document_versions_document
ON document_versions(document_id);
```

---

# 8 Document Chunks

`document_chunks` is the primary RAG retrieval entity.

Each chunk represents a semantically meaningful section of a document.

### Table: `document_chunks`

| Column                | Type        | Description         |
| --------------------- | ----------- | ------------------- |
| `id`                  | UUID        | Chunk ID            |
| `document_version_id` | UUID        | Document version    |
| `chunk_index`         | INTEGER     | Chunk sequence      |
| `content`             | TEXT        | Extracted content   |
| `page_number`         | INTEGER     | Source page         |
| `section`             | TEXT        | Section heading     |
| `metadata`            | JSONB       | Structural metadata |
| `embedding`           | VECTOR      | Semantic embedding  |
| `created_at`          | TIMESTAMPTZ | Creation time       |

```sql
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    document_version_id UUID NOT NULL
        REFERENCES document_versions(id)
        ON DELETE CASCADE,

    chunk_index INTEGER NOT NULL,

    content TEXT NOT NULL,

    page_number INTEGER,

    section TEXT,

    metadata JSONB DEFAULT '{}'::jsonb,

    embedding VECTOR(1536),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_chunk_index
        UNIQUE (document_version_id, chunk_index)
);
```

> `VECTOR(1536)` is an example dimension. The dimension must match the selected embedding model.

### Vector Index

For large datasets, an approximate nearest-neighbor index can be created:

```sql
CREATE INDEX idx_document_chunks_embedding
ON document_chunks
USING hnsw (embedding vector_cosine_ops);
```

### Metadata Index

```sql
CREATE INDEX idx_document_chunks_metadata
ON document_chunks
USING GIN(metadata);
```

---

# 9 Extraction Results

Stores the structured output generated by the AI/document-processing pipeline.

```sql
CREATE TABLE extraction_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    document_version_id UUID NOT NULL
        REFERENCES document_versions(id)
        ON DELETE CASCADE,

    extraction_type VARCHAR(100) NOT NULL,

    extracted_data JSONB NOT NULL,

    confidence_score NUMERIC(5,4),

    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_extraction_confidence
        CHECK (
            confidence_score IS NULL
            OR (
                confidence_score >= 0
                AND confidence_score <= 1
            )
        )
);
```

Possible extraction types:

```text
GENERAL
INVOICE
RESUME
CONTRACT
RESEARCH_PAPER
FINANCIAL_REPORT
ACADEMIC_DOCUMENT
PRESENTATION
```

---

# 10 Extracted Fields

Individual extracted fields are stored separately to support field-level evidence and confidence.

```sql
CREATE TABLE extracted_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    extraction_result_id UUID NOT NULL
        REFERENCES extraction_results(id)
        ON DELETE CASCADE,

    field_name VARCHAR(200) NOT NULL,

    field_value TEXT,

    confidence_score NUMERIC(5,4),

    source_chunk_id UUID
        REFERENCES document_chunks(id)
        ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_field_confidence
        CHECK (
            confidence_score IS NULL
            OR (
                confidence_score >= 0
                AND confidence_score <= 1
            )
        )
);
```

This enables evidence tracing:

```text
Extracted Field
      ↓
Source Chunk
      ↓
Page
      ↓
Original Document
```

---

# 11 Processing Jobs

Background jobs are tracked independently from the document itself.

```sql
CREATE TABLE processing_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    document_version_id UUID NOT NULL
        REFERENCES document_versions(id)
        ON DELETE CASCADE,

    job_type VARCHAR(50) NOT NULL,

    status VARCHAR(30) NOT NULL,

    retry_count INTEGER NOT NULL DEFAULT 0,

    error_message TEXT,

    started_at TIMESTAMPTZ,

    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Possible job types:

```text
PARSE
OCR
LAYOUT_ANALYSIS
CLASSIFICATION
EXTRACTION
CHUNKING
EMBEDDING
INDEXING
```

Possible states:

```text
QUEUED
PROCESSING
COMPLETED
FAILED
RETRYING
```

---

# 12 Conversations

A conversation represents a document/RAG chat session.

```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workspace_id UUID NOT NULL
        REFERENCES workspaces(id)
        ON DELETE CASCADE,

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE RESTRICT,

    title VARCHAR(300),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_conversations_workspace
ON conversations(workspace_id);

CREATE INDEX idx_conversations_user
ON conversations(user_id);
```

---

# 13 Messages

Stores user questions and AI responses.

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    conversation_id UUID NOT NULL
        REFERENCES conversations(id)
        ON DELETE CASCADE,

    role VARCHAR(20) NOT NULL,

    content TEXT NOT NULL,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_message_role
        CHECK (
            role IN ('USER', 'ASSISTANT', 'SYSTEM')
        )
);
```

### Index

```sql
CREATE INDEX idx_messages_conversation
ON messages(conversation_id, created_at);
```

---

# 14 Message Citations

Citations connect AI answers to actual document chunks.

```sql
CREATE TABLE message_citations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    message_id UUID NOT NULL
        REFERENCES messages(id)
        ON DELETE CASCADE,

    document_chunk_id UUID NOT NULL
        REFERENCES document_chunks(id)
        ON DELETE CASCADE,

    page_number INTEGER,

    quoted_text TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_message_citations_message
ON message_citations(message_id);

CREATE INDEX idx_message_citations_chunk
ON message_citations(document_chunk_id);
```

This provides the relationship:

```text
AI Answer
   ↓
Citation
   ↓
Document Chunk
   ↓
Document Version
   ↓
Original Document
```

---

# 15 Verification Reviews

Human reviewers can validate, correct or reject AI-generated extraction results.

```sql
CREATE TABLE verification_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    extraction_result_id UUID NOT NULL
        REFERENCES extraction_results(id)
        ON DELETE CASCADE,

    reviewer_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE RESTRICT,

    status VARCHAR(30) NOT NULL,

    reviewer_notes TEXT,

    corrected_data JSONB,

    reviewed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_review_status
        CHECK (
            status IN (
                'PENDING',
                'APPROVED',
                'REJECTED',
                'CORRECTED'
            )
        )
);
```

The original AI result is preserved.

```text
AI Generated Result
       │
       ├── Original Data
       │
       └── Confidence
              ↓
       Human Verification
              ↓
       Corrected Data
              ↓
       Final Decision
```

---

# 16 Audit Logs

Audit logs provide traceability for security-sensitive and important application actions.

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    workspace_id UUID
        REFERENCES workspaces(id)
        ON DELETE SET NULL,

    action VARCHAR(100) NOT NULL,

    resource_type VARCHAR(100),

    resource_id UUID,

    details JSONB DEFAULT '{}'::jsonb,

    ip_address INET,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Examples:

```text
USER_LOGIN
DOCUMENT_UPLOADED
DOCUMENT_DELETED
DOCUMENT_ACCESSED
EXTRACTION_COMPLETED
VERIFICATION_STARTED
RESULT_APPROVED
RESULT_REJECTED
ROLE_CHANGED
WORKSPACE_UPDATED
```

### Indexes

```sql
CREATE INDEX idx_audit_logs_user
ON audit_logs(user_id);

CREATE INDEX idx_audit_logs_workspace
ON audit_logs(workspace_id);

CREATE INDEX idx_audit_logs_created
ON audit_logs(created_at DESC);

CREATE INDEX idx_audit_logs_resource
ON audit_logs(resource_type, resource_id);
```

---

# 17 Evaluation Datasets

Evaluation datasets contain controlled test cases used to measure AI quality.

```sql
CREATE TABLE evaluation_datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workspace_id UUID
        REFERENCES workspaces(id)
        ON DELETE CASCADE,

    name VARCHAR(200) NOT NULL,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

# 18 Evaluation Cases

Each case represents an evaluation question with expected output.

```sql
CREATE TABLE evaluation_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    dataset_id UUID NOT NULL
        REFERENCES evaluation_datasets(id)
        ON DELETE CASCADE,

    question TEXT NOT NULL,

    expected_answer TEXT,

    expected_citations JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

# 19 Evaluation Runs

Stores the results of evaluating a model or pipeline against a dataset.

```sql
CREATE TABLE evaluation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    dataset_id UUID NOT NULL
        REFERENCES evaluation_datasets(id)
        ON DELETE CASCADE,

    model_name VARCHAR(200) NOT NULL,

    accuracy NUMERIC(6,5),

    precision_score NUMERIC(6,5),

    recall_score NUMERIC(6,5),

    f1_score NUMERIC(6,5),

    retrieval_score NUMERIC(6,5),

    citation_accuracy NUMERIC(6,5),

    faithfulness NUMERIC(6,5),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

# 20 Complete Relationship Map

```text
USERS
 │
 ├───────────────┐
 │               │
 ↓               ↓
WORKSPACES    WORKSPACE_MEMBERS
 │               ↑
 │               │
 ├───────────────┘
 │
 ├── DOCUMENTS
 │       │
 │       └── DOCUMENT_VERSIONS
 │               │
 │               ├── DOCUMENT_CHUNKS
 │               │       │
 │               │       └── MESSAGE_CITATIONS
 │               │
 │               ├── EXTRACTION_RESULTS
 │               │       │
 │               │       ├── EXTRACTED_FIELDS
 │               │       │       └── DOCUMENT_CHUNKS
 │               │       │
 │               │       └── VERIFICATION_REVIEWS
 │               │
 │               └── PROCESSING_JOBS
 │
 ├── CONVERSATIONS
 │       │
 │       └── MESSAGES
 │               │
 │               └── MESSAGE_CITATIONS
 │
 ├── VERIFICATION_REVIEWS
 │
 └── AUDIT_LOGS

WORKSPACES
 │
 ├── EVALUATION_DATASETS
 │       │
 │       ├── EVALUATION_CASES
 │       └── EVALUATION_RUNS
 │
 └── AUDIT_LOGS
```

---

# 21 Important Database Constraints

DocuMind AI should enforce important rules at the database level wherever practical.

### Referential Integrity

Foreign keys prevent orphaned records.

```text
Workspace
   ↓
Document
   ↓
Document Version
   ↓
Chunk
```

### Unique Constraints

Examples:

```sql
UNIQUE (workspace_id, user_id)

UNIQUE (document_id, version_number)

UNIQUE (document_version_id, chunk_index)
```

### Confidence Validation

Confidence values must remain within:

```text
0.0 ≤ confidence ≤ 1.0
```

### Role Validation

Only the following workspace roles are accepted:

```text
OWNER
ADMIN
MEMBER
VIEWER
```

---

# 22 Data Deletion Strategy

Deletion should respect dependency relationships.

For example:

```text
Delete Document
      ↓
Document Versions
      ↓
Chunks
      ↓
Embeddings
      ↓
Extraction Results
      ↓
Processing Jobs
```

Database records can use controlled `ON DELETE CASCADE` behavior where appropriate.

Original files in S3/MinIO must be deleted separately through the storage service.

Therefore:

```text
Database Deletion
        +
Object Storage Deletion
        =
Complete Document Deletion
```

---

# 23 Recommended Row-Level Security

For production deployment, PostgreSQL **Row-Level Security (RLS)** can provide an additional workspace-isolation layer.

Conceptually:

```text
Authenticated User
       ↓
Workspace Membership
       ↓
Allowed Workspace IDs
       ↓
Database Row-Level Policy
       ↓
Accessible Records
```

The backend should still enforce authorization. RLS is an additional defense-in-depth mechanism, not a replacement for application-level RBAC.

---

# 24 Database Performance Strategy

The database should use indexes according to actual query patterns.

Important indexes include:

```text
users.email
workspace_members.user_id
workspace_members.workspace_id
documents.workspace_id
documents.status
documents.created_at
document_versions.document_id
document_chunks.document_version_id
document_chunks.embedding
conversations.workspace_id
messages.conversation_id
message_citations.message_id
message_citations.document_chunk_id
audit_logs.workspace_id
audit_logs.created_at
```

For semantic retrieval:

```sql
HNSW / IVFFlat
        ↓
pgvector
        ↓
Vector Similarity Search
```

For keyword retrieval:

```text
PostgreSQL Full-Text Search
        ↓
Keyword Results
```

These can then be combined into the application's **hybrid retrieval pipeline**.

---

# 25 Database-to-RAG Flow

The database directly supports the complete RAG workflow:

```text
Document
   ↓
Document Version
   ↓
Document Chunks
   ↓
Embedding
   ↓
pgvector
   ↓
Vector Search
   +
Keyword Search
   ↓
Hybrid Retrieval
   ↓
Reranking
   ↓
Relevant Chunks
   ↓
Gemini
   ↓
Answer
   ↓
Message
   ↓
Message Citations
   ↓
Source Document
```

---

# 26 Database-to-Verification Flow

```text
Document
    ↓
Extraction Result
    ↓
Confidence Score
    ↓
Low Confidence?
    │
    ├── No ──→ Result Available
    │
    └── Yes
          ↓
    Verification Review
          ↓
    Human Reviewer
          ↓
    Correct / Approve / Reject
          ↓
    Audit Log
```

---

# 27 Schema Summary

| Domain            | Tables                                                       |
| ----------------- | ------------------------------------------------------------ |
| **Identity**      | `users`                                                      |
| **Workspace**     | `workspaces`, `workspace_members`                            |
| **Documents**     | `documents`, `document_versions`                             |
| **Processing**    | `processing_jobs`                                            |
| **RAG**           | `document_chunks`                                            |
| **AI Extraction** | `extraction_results`, `extracted_fields`                     |
| **Conversations** | `conversations`, `messages`                                  |
| **Citations**     | `message_citations`                                          |
| **Verification**  | `verification_reviews`                                       |
| **Audit**         | `audit_logs`                                                 |
| **Evaluation**    | `evaluation_datasets`, `evaluation_cases`, `evaluation_runs` |

**Total core tables: 15**

---

## 28 Design Philosophy

The DocuMind AI database is designed around four principles:

```text
              ┌──────────────────┐
              │    SECURITY      │
              └────────┬─────────┘
                       │
       ┌───────────────┼───────────────┐
       ↓               ↓               ↓
  Workspace        Evidence        Auditability
  Isolation        Traceability
       │               │               │
       └───────────────┼───────────────┘
                       ↓
              ┌──────────────────┐
              │   RELIABILITY   │
              └──────────────────┘
```

The schema therefore does more than store documents. It maintains the complete lifecycle of information:

**User → Workspace → Document → Version → Processing → Extraction → Chunk → Embedding → Retrieval → AI Answer → Citation → Verification → Audit → Evaluation**

This provides the persistent data foundation required to operate DocuMind AI as a **secure, explainable and production-oriented document intelligence platform**.
