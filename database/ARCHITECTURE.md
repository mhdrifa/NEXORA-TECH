# NEXORA TECH - Enterprise Database Architecture Manual

This architectural specification details the structural design, indexing plans, performance optimization models, security practices, and pagination standards for NEXORA TECH's enterprise application databases.

---

## 1. Directory Structure

This database division has been structured using modular, modern standards keeping a clear decoupling between raw database assets and compiled Prisma mappings:

```text
/
├── prisma/
│   ├── schema.prisma                       # Complete Prisma models with relations
│   ├── seed.ts                             # Prisma client seeder data
│   └── migrations/
│       └── 20260620150000_init/
│           └── migration.sql               # Baseline DDL migration schema
│
├── database/
│   ├── schema.sql                          # Compliant raw PostgreSQL DDL setups
│   ├── ERD.md                              # Entity relation schemas & diagrams
│   └── ARCHITECTURE.md                     # Performance & security procedures (this file)
```

---

## 2. Advanced Performance & Indexing Strategy

To guarantee rapid data queries even when tables grow to millions of records, we apply specific indexing types and query optimizations:

### 2.1 B-Tree Indexing on High-Frequency Columns
All search fields, primary/secondary keys, and unique vectors are mapped via standard **B-Tree** indexes:
- `users.email` and `clients.email`: Enables sub-millisecond route checks and login verifications.
- `blog_posts.slug`: Rapidly retrieves articles on public routes.
- `invoices.invoiceNumber` and `payments.transactionId`: Ensures secure transactional lookups.

### 2.2 Partial Indexing (Conditional Operations)
To save storage and database load, partial indexes are declared on state/status criteria where searches target active records:
```sql
CREATE INDEX idx_users_status_active 
ON users(status) 
WHERE deleted_at IS NULL AND status = 'ACTIVE';
```
This is critical for Soft-Delete architectures, as queries filtering out soft-deleted rows bypass parsing inactive indices.

### 2.3 Composite Multi-column Indexes
Composite indices prioritize sorting sequence orders:
```sql
CREATE INDEX idx_projects_client_status 
ON projects(client_id, status);
```
With this index, a query fetching an active project for a client is processed using a single index scan, avoiding separate scans of client and status columns.

### 2.4 GIN Indexing for Full-Text Search
For search bars on blog posts and service listings, we use PostgreSQL's **Generalized Inverted Index (GIN)** rather than slow `LIKE %value%` queries:
```sql
CREATE INDEX idx_blog_post_content_search 
ON blog_posts USING gin(to_tsvector('english', title || ' ' || content));
```

---

## 3. High-Security Database Safeguards

To prevent vulnerabilities, secure client data, and isolate systems, NEXORA TECH incorporates the following patterns:

### 3.1 SQL Injection Protection
By applying Prisma ORM alongside parameterized raw SQL statements, inputs are treated strictly as scalar values rather than executable code:
```typescript
// SECURE: Prisma inherently parameterizes inputs
const targetUser = await prisma.user.findUnique({
  where: { email: inputEmail }
});

// SECURE RAW SQL: Parameterized placeholders protect inputs from injection
const activeStaff = await prisma.$queryRaw`
  SELECT * FROM users WHERE status = ${inputStatus} AND "deletedAt" IS NULL
`;
```

### 3.2 Secure Hashing Credentials (Bcrypt/Argon2)
Passwords must never exist in plain text. Let's apply standard multi-round blowfish hashes:
- Default `Bcrypt` rounds: **10** (balancing security with server resource usage).
- Custom database-level check constraints guard role domains.

### 3.3 Dynamic Connection Pooling (Max Connections Limits)
To avoid server crashes due to database connection exhaustion (the classic `too many clients already` failure):
- Employs **PgBouncer** proxies in production.
- Connection lifetimes are limited via client timeouts:
```text
DATABASE_URL="postgresql://sql_user:password@localhost:5432/nexora_tech?connection_limit=20&pool_timeout=15"
```

---

## 4. Query Engineering Standards

### 4.1 Scalable Cursor Pagination (Keyset standard)
Limit/Offset pagination suffers from poor performance for deeper pages, as the database must scan all preceding rows to compute offsets.
NEXORA TECH mandates **Cursor-Based Pagination** for infinite lists (e.g., Log logs, Notification streams):

```typescript
export async function getAuditLogsPaginated(limit: number, cursorId?: string) {
  return await prisma.auditLog.findMany({
    take: limit,
    skip: cursorId ? 1 : 0,
    cursor: cursorId ? { id: cursorId } : undefined,
    orderBy: { createdAt: "desc" }
  });
}
```

### 4.2 Comprehensive Soft Deletes
Critical tables (e.g., `Users`, `Clients`, `Projects`) use soft deletes.
- A `deletedAt` field of type `DateTime?` stores the deletion time.
- Standard queries automatically filter records to omit soft-deleted data:
```typescript
// Fetching active clients safely
const activeClients = await prisma.client.findMany({
  where: { deletedAt: null }
});
```

---

## 5. Deployment Checklist (Production Readiness)

1. Run base migration scripts against production PostgreSQL using SSL modes.
2. Initialize connection limits relative to concurrent CPU parameters.
3. Establish PgBouncer proxies for cloud servers.
4. Bind Prisma schema generation to automated deployment pipelines (`npm run build`).
