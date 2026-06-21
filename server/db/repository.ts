import { 
  User, Client, Employee, Project, Service, Invoice, Payment, 
  BlogPost, Testimonial, ContactMessage, JobApplication, Task, 
  Notification, AuditLog
} from "./schema";

// SQLite / Postgres Query Log item
export interface QueryLog {
  id: string;
  sql: string;
  params: any[];
  durationMs: number;
  timestamp: string;
}

class NexoraDatabaseEngine {
  public users: User[] = [];
  public clients: Client[] = [];
  public employees: Employee[] = [];
  public projects: Project[] = [];
  public services: Service[] = [];
  public invoices: Invoice[] = [];
  public payments: Payment[] = [];
  public blogPosts: BlogPost[] = [];
  public testimonials: Testimonial[] = [];
  public contactMessages: ContactMessage[] = [];
  public jobApplications: JobApplication[] = [];
  public tasks: Task[] = [];
  public notifications: Notification[] = [];
  public auditLogs: AuditLog[] = [];
  public queryLogs: QueryLog[] = [];

  constructor() {
    this.seed();
  }

  // Logs a database query simulation
  private logQuery(sql: string, params: any[] = []) {
    const durationMs = parseFloat((Math.random() * 3 + 0.5).toFixed(2));
    const log: QueryLog = {
      id: "q-" + Math.random().toString(36).substr(2, 9),
      sql,
      params,
      durationMs,
      timestamp: new Date().toISOString()
    };
    this.queryLogs.unshift(log);
    // limit logs
    if (this.queryLogs.length > 100) this.queryLogs.pop();
  }

  private seed() {
    // 1. Seed Users (Roles: super_admin, admin, employee, client, guest)
    this.users = [
      {
        id: "u-1",
        email: "solutions@nexora.tech", // Match previous credential or simple default
        passwordHash: "$2b$10$T1KqLz72y..M3U.uG6jZGu.67R8lUe0iSFe.nU1s67xU1E32N36I6", // Simulated hash of "nexora123"
        role: "super_admin",
        fullName: "Alex Vane",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        isVerified: true,
        createdAt: "2026-01-10T12:00:00Z",
        updatedAt: "2026-06-20T12:00:00Z"
      },
      {
        id: "u-2",
        email: "finance@nexora.tech",
        passwordHash: "$2b$10$T1KqLz72y..M3U.uG6jZGu.67R8lUe0iSFe.nU1s67xU1E32N36I6", // "nexora123"
        role: "admin",
        fullName: "Marcus Kincaid",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        isVerified: true,
        createdAt: "2026-02-15T09:00:00Z",
        updatedAt: "2026-06-20T12:00:00Z"
      },
      {
        id: "u-3",
        email: "lead_dev@nexora.tech",
        passwordHash: "$2b$10$T1KqLz72y..M3U.uG6jZGu.67R8lUe0iSFe.nU1s67xU1E32N36I6", // "nexora123"
        role: "employee",
        fullName: "Siddharth Sen",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        isVerified: true,
        createdAt: "2026-03-01T10:30:00Z",
        updatedAt: "2026-06-20T12:00:00Z"
      },
      {
        id: "u-4",
        email: "acme.corp@gmail.com",
        passwordHash: "$2b$10$T1KqLz72y..M3U.uG6jZGu.67R8lUe0iSFe.nU1s67xU1E32N36I6", // "nexora123"
        role: "client",
        fullName: "Sarah Connor (Acme Corp)",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        isVerified: true,
        createdAt: "2026-04-10T14:00:00Z",
        updatedAt: "2026-06-20T12:00:00Z"
      },
      {
        id: "u-5",
        email: "quantum@gmail.com",
        passwordHash: "$2b$10$T1KqLz72y..M3U.uG6jZGu.67R8lUe0iSFe.nU1s67xU1E32N36I6", // "nexora123"
        role: "client",
        fullName: "Raymond Reddington (Quantum Dynamics)",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        isVerified: true,
        createdAt: "2026-04-18T11:00:00Z",
        updatedAt: "2026-06-20T12:00:00Z"
      },
      {
        id: "u-6",
        email: "guest_sandbox@nexora.tech",
        passwordHash: "$2b$10$T1KqLz72y..M3U.uG6jZGu.67R8lUe0iSFe.nU1s67xU1E32N36I6",
        role: "guest",
        fullName: "Sandbox Guest User",
        avatarUrl: "",
        isVerified: false,
        createdAt: "2026-06-01T08:00:00Z",
        updatedAt: "2026-06-01T08:00:00Z"
      }
    ];

    // 2. Seed Clients
    this.clients = [
      {
        id: "c-1",
        userId: "u-4",
        companyName: "Acme Enterprises",
        contactPerson: "Sarah Connor",
        email: "acme.corp@gmail.com",
        phone: "+1 415-555-0199",
        billingAddress: "500 Bowman Parkway, San Francisco CA",
        status: "active",
        createdAt: "2026-04-10T14:05:00Z"
      },
      {
        id: "c-2",
        userId: "u-5",
        companyName: "Quantum Dynamics Ltd",
        contactPerson: "Raymond Reddington",
        email: "quantum@gmail.com",
        phone: "+1 202-555-0143",
        billingAddress: "100 Maryland Ave NE, Washington DC",
        status: "active",
        createdAt: "2026-04-18T11:10:00Z"
      }
    ];

    // 3. Seed Employees
    this.employees = [
      {
        id: "emp-1",
        userId: "u-3",
        department: "AI & Decoupled Architecture",
        role: "Senior Solutions Engineer",
        salary: 165000,
        skills: ["React", "Typescript", "Node.js", "Express", "Postgres", "Transformers"],
        status: "active",
        createdAt: "2026-03-01T11:00:00Z"
      },
      {
        id: "emp-2",
        userId: "u-2",
        department: "Finance Operations",
        role: "Director of Accounts",
        salary: 130000,
        skills: ["Invoicing", "Budgeting", "SLA Management", "Stripe Routing"],
        status: "active",
        createdAt: "2026-02-15T09:15:00Z"
      }
    ];

    // 4. Seed Services
    this.services = [
      {
        id: "s-1",
        name: "Enterprise Agentic Workflows",
        category: "AI",
        description: "Autonomous LLM agents that connect to APIs, manage file outputs, and sync with secure PostgreSQL schemas.",
        priceEstimate: 12000,
        isActive: true,
        createdAt: "2026-01-15T00:00:00Z"
      },
      {
        id: "s-2",
        name: "Kubernetes Cluster Engineering",
        category: "Cloud",
        description: "Production readiness architectures on Microsoft Azure with sub-millisecond response guarantees & multi-tenant isolation.",
        priceEstimate: 15000,
        isActive: true,
        createdAt: "2026-01-15T00:00:00Z"
      },
      {
        id: "s-3",
        name: "Full Stack Decoupled Platforms",
        category: "Web",
        description: "Elegant, responsive corporate applications featuring real-time state engines and highly secure database integrations.",
        priceEstimate: 8500,
        isActive: true,
        createdAt: "2026-01-15T00:00:00Z"
      }
    ];

    // 5. Seed Projects
    this.projects = [
      {
        id: "p-1",
        clientId: "c-1",
        name: "Project Overlord (Agentic Sync)",
        description: "Build a highly scalable autonomous inventory dispatcher backed by transactional Postgres and cloud routers.",
        status: "Active",
        startDate: "2026-04-12",
        endDate: "2026-08-30",
        budget: 45000,
        assignedTeam: ["u-3"],
        documents: ["https://nexora.tech/docs/sow_overlord_v2.pdf", "https://nexora.tech/docs/architecture_schema.png"],
        progressPercentage: 65,
        createdAt: "2026-04-10T14:15:00Z",
        updatedAt: "2026-06-20T11:00:00Z"
      },
      {
        id: "p-2",
        clientId: "c-2",
        name: "Project Horizon (Cluster Migration)",
        description: "Migrating standard monolithic operations into high-concurrency Node.js cluster systems with Azure container routing.",
        status: "Active",
        startDate: "2026-05-01",
        endDate: "2026-07-15",
        budget: 68000,
        assignedTeam: ["u-3", "u-2"],
        documents: ["https://nexora.tech/docs/cluster_migration_blueprint.pdf"],
        progressPercentage: 85,
        createdAt: "2026-04-18T11:20:00Z",
        updatedAt: "2026-06-20T10:00:00Z"
      },
      {
        id: "p-3",
        clientId: "c-1",
        name: "Security Posture Upgrade",
        description: "Zero-Trust credential isolation combined with penetration test coverage and XSS protection validation.",
        status: "Completed",
        startDate: "2026-05-10",
        endDate: "2026-06-10",
        budget: 15000,
        assignedTeam: ["u-3"],
        documents: ["https://nexora.tech/docs/penetration_results_signoff.pdf"],
        progressPercentage: 100,
        createdAt: "2026-05-08T10:00:00Z",
        updatedAt: "2026-06-10T17:00:00Z"
      },
      {
        id: "p-4",
        clientId: "c-2",
        name: "Autonomous Document Engine",
        description: "Extracting dynamic billing parameters and auto-generating formal invoicing PDFs utilizing browser layouts.",
        status: "Pending",
        startDate: "2026-07-01",
        endDate: "2026-09-30",
        budget: 24000,
        assignedTeam: ["u-3"],
        documents: [],
        progressPercentage: 0,
        createdAt: "2026-06-18T09:00:00Z",
        updatedAt: "2026-06-18T09:00:00Z"
      }
    ];

    // 6. Seed Invoices
    this.invoices = [
      {
        id: "inv-1",
        projectId: "p-1",
        clientId: "c-1",
        invoiceNumber: "NX-2026-001",
        issueDate: "2026-04-15",
        dueDate: "2026-05-15",
        amount: 15000,
        tax: 1200,
        discount: 500,
        total: 15700,
        status: "paid",
        items: [
          { description: "Milestone 1: Dynamic Parser Architecture Setup", quantity: 1, unitPrice: 10000, total: 10000 },
          { description: "Database Modeling with Postgres transactional safety", quantity: 1, unitPrice: 5000, total: 5000 }
        ],
        createdAt: "2026-04-15T09:00:00Z",
        updatedAt: "2026-05-02T14:30:00Z"
      },
      {
        id: "inv-2",
        projectId: "p-1",
        clientId: "c-1",
        invoiceNumber: "NX-2026-002",
        issueDate: "2026-05-20",
        dueDate: "2026-06-20",
        amount: 20000,
        tax: 1600,
        discount: 0,
        total: 21600,
        status: "unpaid",
        items: [
          { description: "Milestone 2: Multi-agent state machine implementation", quantity: 1, unitPrice: 20000, total: 20000 }
        ],
        createdAt: "2026-05-20T08:00:00Z",
        updatedAt: "2026-05-20T08:00:00Z"
      },
      {
        id: "inv-3",
        projectId: "p-2",
        clientId: "c-2",
        invoiceNumber: "NX-2026-003",
        issueDate: "2026-05-05",
        dueDate: "2026-06-05",
        amount: 34000,
        tax: 2720,
        discount: 1000,
        total: 35720,
        status: "paid",
        items: [
          { description: "Milestone 1: Azure Container Architecture Provisioning", quantity: 1, unitPrice: 34000, total: 34000 }
        ],
        createdAt: "2026-05-05T10:00:00Z",
        updatedAt: "2026-05-12T11:00:00Z"
      },
      {
        id: "inv-4",
        projectId: "p-2",
        clientId: "c-2",
        invoiceNumber: "NX-2026-004",
        issueDate: "2026-06-15",
        dueDate: "2026-07-15",
        amount: 34000,
        tax: 2720,
        discount: 0,
        total: 36720,
        status: "unpaid",
        items: [
          { description: "Milestone 2: Automated Load Balancing & Routing Signoff", quantity: 1, unitPrice: 34000, total: 34000 }
        ],
        createdAt: "2026-06-15T09:00:00Z",
        updatedAt: "2026-06-15T09:00:00Z"
      }
    ];

    // 7. Seed Payments
    this.payments = [
      {
        id: "pay-1",
        invoiceId: "inv-1",
        clientId: "c-1",
        amount: 15700,
        paymentMethod: "stripe",
        paymentIntentId: "pi_overlord_mock_001",
        status: "completed",
        paidAt: "2026-05-02T14:30:00Z",
        createdAt: "2026-05-02T14:25:00Z"
      },
      {
        id: "pay-2",
        invoiceId: "inv-3",
        clientId: "c-2",
        amount: 35720,
        paymentMethod: "paypal",
        paymentIntentId: "pay_horizon_mock_119",
        status: "completed",
        paidAt: "2026-05-12T11:00:00Z",
        createdAt: "2026-05-12T10:55:00Z"
      }
    ];

    // 8. Seed Blog Posts
    this.blogPosts = [
      {
        id: "b-1",
        title: "Demystifying Hyper-Available Postgres in Cloud Run Containers",
        slug: "postgres-cloud-run",
        summary: "An structural architect's guide to isolating database networks, managing scale-to-zero microservices, and optimizing connection pooling.",
        content: `### Architecting Transactional Security at Scale

When running high-concurrency web systems under elastic containers, we face unique configuration boundaries:
- **Connection Saturation**: Monolithic frameworks exhaust postgres loops quickly. Solution: Implement custom PGBouncer proxies.
- **Scale-To-Zero Hibernation**: Cold start times must maintain sub-200ms latency.
- **Audit Compliance**: Log every transactional change safely inside metadata files.

Here is an example Postgres parameterized query avoiding common security vulnerabilities:
\`\`\`sql
-- SQL Injection Isolation Pattern
SELECT id, full_name, role 
FROM users 
WHERE email = $1 AND is_verified = TRUE;
\`\`\``,
        category: "Cloud",
        tags: ["PostgreSQL", "Cloud Run", "Docker", "Security"],
        featuredImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
        seoTitle: "Containerized Postgres Architectures",
        seoDescription: "An in-depth manual on setting up Dockerized PostgreSQL with PgBouncer connection pooling.",
        isPublished: true,
        publishedAt: "2026-06-01T15:00:00Z",
        authorId: "u-3",
        createdAt: "2026-06-01T14:00:00Z"
      },
      {
        id: "b-2",
        title: "Securing LLM Agents: From RAG Pipelines to RBAC Role Guards",
        slug: "securing-llm-agents",
        summary: "How to avoid prompt injection vulnerabilities while maintaining robust role-based authorizations inside Express API servers.",
        content: `### Security Posture in AI Workflows

Agent development introduces critical security requirements:
1. **Never run client-side API keys**: Keep Stripe, OpenAI, and Gemini tokens bound strictly server-side.
2. **Implement Input Validation**: Always wrap user prompts inside schema constraints (using validator structures).
3. **Audit Log everything**: Track agent actions inside structured database schemas.`,
        category: "AI",
        tags: ["AI Tools", "Llama", "Express", "Node.js", "Security"],
        featuredImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
        seoTitle: "Securing AI Agents | Nexora Blog",
        seoDescription: "Enterprise methodology for protecting agent workflows utilizing JWT tokens and robust access controls.",
        isPublished: true,
        publishedAt: "2026-06-15T10:00:00Z",
        authorId: "u-3",
        createdAt: "2026-06-15T09:00:00Z"
      }
    ];

    // 9. Seed Testimonials
    this.testimonials = [
      {
        id: "t-1",
        name: "Sarah Connor",
        role: "Head of Infrastructure",
        company: "Acme Enterprises",
        content: "Nexora Tech migrated our entire catalog ledger into transactionally-linked PostgreSQL within 2 weeks. The live dashboard, JWT auth, and instant PDF invoice generation is highly polished and professional.",
        stars: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        isApproved: true,
        createdAt: "2026-05-20T12:00:00Z"
      },
      {
        id: "t-2",
        name: "Raymond Reddington",
        role: "Managing Director",
        company: "Quantum Dynamics",
        content: "The custom Agentic billing pipelines they designed and deployed inside Docker container meshes reduced our operational tracking deficits to zero. True full-stack craftsmanship.",
        stars: 5,
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        isApproved: true,
        createdAt: "2026-06-02T12:00:00Z"
      }
    ];

    // 10. Seed Contact Messages
    this.contactMessages = [
      {
        id: "msg-1",
        name: "Arthur Pendragon",
        email: "arthur@camelot.org",
        phone: "+44 20 7946 0958",
        company: "Camelot Digital Labs",
        message: "We need a robust multi-device client management dashboard with Stripe invoice payments built. Do you specialize in Node / Express backends?",
        inquiryType: "custom-software",
        status: "unread",
        createdAt: "2026-06-19T14:30:00Z"
      },
      {
        id: "msg-2",
        name: "Bruce Wayne",
        email: "executive@wayne.co",
        phone: "+1 313-555-0100",
        company: "Wayne Enterprises",
        message: "Requesting a highly secure Kubernetes container layout running closed-source secure LLM vectors on-prem. Need custom permission matrix setup.",
        inquiryType: "ai-solutions",
        status: "replied",
        adminReplyText: "Bruce, we have evaluated your spec and configured a multi-role RBAC schema. Let's arrange a secure technical consultation.",
        repliedAt: "2026-06-20T10:00:00Z",
        createdAt: "2026-06-20T08:15:00Z"
      }
    ];

    // 11. Seed Job Applications
    this.jobApplications = [
      {
        id: "app-1",
        jobId: "job-1",
        fullName: "Bruce Banner",
        email: "gamma.scientist@avengers.org",
        phone: "+1 650-555-0145",
        resumeUrl: "https://nexora.tech/resumes/bruce_banner_cv.pdf",
        githubUrl: "https://github.com/hulk-coder",
        resumeText: "Experienced Cloud Specialist. Handled heavy workloads, dynamic cluster balancing, Kubernetes optimization in highly pressurized environments.",
        status: "review",
        createdAt: "2026-06-15T11:00:00Z"
      },
      {
        id: "app-2",
        jobId: "job-2",
        fullName: "Tony Stark",
        email: "tony@starkindustries.com",
        phone: "+1 212-555-9988",
        resumeUrl: "https://nexora.tech/resumes/tony_stark_genius.pdf",
        githubUrl: "https://github.com/ironman-ai",
        resumeText: "Full stack master. Built JARVIS backend, neural network matrix systems, local automated node engines, and highly reactive responsive layouts.",
        status: "interviewing",
        createdAt: "2026-06-18T16:00:00Z"
      }
    ];

    // 12. Seed Tasks
    this.tasks = [
      {
        id: "task-1",
        projectId: "p-1",
        title: "Define JWT and Password Hashing middleware",
        description: "Configure Express JWT decoder with role checking logic to secure private routes, ensuring proper access control.",
        assignedTo: "u-3",
        status: "done",
        priority: "critical",
        dueDate: "2026-06-15",
        createdAt: "2026-06-10T09:00:00Z",
        updatedAt: "2026-06-15T14:00:00Z"
      },
      {
        id: "task-2",
        projectId: "p-1",
        title: "Stripe Webhook Verification Tunnel",
        description: "Build verify endpoint inside controller routing to process incoming stripe pay configurations securely.",
        assignedTo: "u-3",
        status: "in_progress",
        priority: "high",
        dueDate: "2026-06-25",
        createdAt: "2026-06-12T10:00:00Z",
        updatedAt: "2026-06-20T11:30:00Z"
      },
      {
        id: "task-3",
        projectId: "p-2",
        title: "Draft Kubernetes ingress configs",
        description: "Configure Azure load balances to delegate to Express container instances using Docker containers.",
        assignedTo: "u-3",
        status: "todo",
        priority: "medium",
        dueDate: "2026-07-05",
        createdAt: "2026-06-19T08:00:00Z",
        updatedAt: "2026-06-19T08:00:00Z"
      }
    ];

    // 13. Seed Notifications
    this.notifications = [
      {
        id: "not-1",
        userId: "u-1",
        title: "Enterprise Core Configured",
        message: "Nexora relational schema initialized; JWT credentials are ready for secure operations.",
        isRead: false,
        type: "system",
        createdAt: "2026-06-20T13:00:00Z"
      },
      {
        id: "not-2",
        userId: "u-4",
        title: "New Invoice Available",
        message: "Invoice NX-2026-002 for Project Overlord ($21,600.00) was dispatched. Due on 2026-06-20.",
        isRead: false,
        type: "invoice",
        createdAt: "2026-06-15T09:05:00Z"
      }
    ];

    // 14. Seed Audit Logs
    this.auditLogs = [
      {
        id: "log-1",
        userEmail: "solutions@nexora.tech",
        userId: "u-1",
        action: "ROUTING_INITIALIZED",
        ipAddress: "127.0.0.1",
        endpoint: "/api/health",
        status: "success",
        details: "Clean architecture full-stack system connected and booted.",
        createdAt: "2026-06-20T15:00:00Z"
      },
      {
        id: "log-2",
        userEmail: "solutions@nexora.tech",
        userId: "u-1",
        action: "JWT_SCHEME_LOADED",
        ipAddress: "127.0.0.1",
        endpoint: "/api/auth/verify",
        status: "success",
        details: "Loaded private key simulations & bcrypt security controls.",
        createdAt: "2026-06-20T15:02:00Z"
      }
    ];
  }

  // CORE REPOSITORY QUERIES (SIMULATED POSTGRES WITH SQL LOGGING)

  // Auth Operations
  public findUserByEmail(email: string): User | undefined {
    this.logQuery("SELECT * FROM users WHERE email = $1 LIMIT 1;", [email]);
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    this.logQuery("SELECT * FROM users WHERE id = $1 LIMIT 1;", [id]);
    return this.users.find(u => u.id === id);
  }

  public createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    const newUser: User = {
      ...userData,
      id: "u-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.push(newUser);
    this.logQuery(
      `INSERT INTO users (id, email, password_hash, role, full_name, is_verified, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
      [newUser.id, newUser.email, "[HASHED_VALUE]", newUser.role, newUser.fullName, newUser.isVerified, newUser.createdAt, newUser.updatedAt]
    );

    // If client role, auto create client profile
    if (newUser.role === "client") {
      this.createClientProfile({
        userId: newUser.id,
        contactPerson: newUser.fullName,
        email: newUser.email,
        companyName: "Acme Enterprises Partner",
        status: "active"
      });
    }

    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return undefined;
    
    this.users[idx] = {
      ...this.users[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    const keys = Object.keys(updates);
    const sqlSet = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");
    this.logQuery(
      `UPDATE users SET ${sqlSet}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;`,
      [id, ...Object.values(updates)]
    );

    return this.users[idx];
  }

  // Client Operations
  public createClientProfile(clientData: Omit<Client, "id" | "createdAt">): Client {
    const newClient: Client = {
      ...clientData,
      id: "c-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.clients.push(newClient);
    this.logQuery(
      `INSERT INTO clients (id, user_id, company_name, contact_person, email, phone, billing_address, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
      [newClient.id, newClient.userId, newClient.companyName, newClient.contactPerson, newClient.email, newClient.phone, newClient.billingAddress, newClient.status, newClient.createdAt]
    );
    return newClient;
  }

  // Project Operations
  public getProjects(): Project[] {
    this.logQuery("SELECT * FROM projects ORDER BY created_at DESC;");
    return this.projects;
  }

  public getProjectsByClientId(clientId: string): Project[] {
    this.logQuery("SELECT * FROM projects WHERE client_id = $1 ORDER BY created_at DESC;", [clientId]);
    return this.projects.filter(p => p.clientId === clientId);
  }

  public createProject(projectData: Omit<Project, "id" | "createdAt" | "updatedAt">): Project {
    const newProject: Project = {
      ...projectData,
      id: "p-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.projects.push(newProject);
    this.logQuery(
      `INSERT INTO projects (id, client_id, name, description, status, start_date, end_date, budget, progress_percentage, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;`,
      [newProject.id, newProject.clientId, newProject.name, newProject.description, newProject.status, newProject.startDate, newProject.endDate, newProject.budget, newProject.progressPercentage, newProject.createdAt, newProject.updatedAt]
    );
    return newProject;
  }

  public updateProject(id: string, updates: Partial<Project>): Project | undefined {
    const idx = this.projects.findIndex(p => p.id === id);
    if (idx === -1) return undefined;

    this.projects[idx] = {
      ...this.projects[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    const keys = Object.keys(updates);
    const sqlSet = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");
    this.logQuery(
      `UPDATE projects SET ${sqlSet}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;`,
      [id, ...Object.values(updates)]
    );

    return this.projects[idx];
  }

  public deleteProject(id: string): boolean {
    const initialLen = this.projects.length;
    this.projects = this.projects.filter(p => p.id !== id);
    this.logQuery("DELETE FROM projects WHERE id = $1;", [id]);
    return this.projects.length < initialLen;
  }

  // Invoice Operations
  public getInvoices(): Invoice[] {
    this.logQuery("SELECT * FROM invoices ORDER BY created_at DESC;");
    return this.invoices;
  }

  public getInvoicesByClientId(clientId: string): Invoice[] {
    this.logQuery("SELECT * FROM invoices WHERE client_id = $1 ORDER BY created_at DESC;", [clientId]);
    return this.invoices.filter(inv => inv.clientId === clientId);
  }

  public createInvoice(invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt">): Invoice {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: "inv-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.invoices.push(newInvoice);
    this.logQuery(
      `INSERT INTO invoices (id, project_id, client_id, invoice_number, issue_date, due_date, amount, tax, discount, total, status, items, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;`,
      [newInvoice.id, newInvoice.projectId, newInvoice.clientId, newInvoice.invoiceNumber, newInvoice.issueDate, newInvoice.dueDate, newInvoice.amount, newInvoice.tax, newInvoice.discount, newInvoice.total, newInvoice.status, JSON.stringify(newInvoice.items), newInvoice.createdAt, newInvoice.updatedAt]
    );
    return newInvoice;
  }

  public updateInvoice(id: string, updates: Partial<Invoice>): Invoice | undefined {
    const idx = this.invoices.findIndex(inv => inv.id === id);
    if (idx === -1) return undefined;

    this.invoices[idx] = {
      ...this.invoices[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    const keys = Object.keys(updates);
    const sqlSet = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");
    this.logQuery(
      `UPDATE invoices SET ${sqlSet}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;`,
      [id, ...Object.values(updates)]
    );

    return this.invoices[idx];
  }

  // Payment Operations
  public getPayments(): Payment[] {
    this.logQuery("SELECT * FROM payments ORDER BY created_at DESC;");
    return this.payments;
  }

  public createPayment(paymentData: Omit<Payment, "id" | "createdAt">): Payment {
    const newPayment: Payment = {
      ...paymentData,
      id: "pay-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.payments.push(newPayment);
    this.logQuery(
      `INSERT INTO payments (id, invoice_id, client_id, amount, payment_method, payment_intent_id, status, paid_at, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
      [newPayment.id, newPayment.invoiceId, newPayment.clientId, newPayment.amount, newPayment.paymentMethod, newPayment.paymentIntentId, newPayment.status, newPayment.paidAt, newPayment.createdAt]
    );
    return newPayment;
  }

  // Blog Operations
  public getBlogPosts(onlyPublished: boolean = false): BlogPost[] {
    if (onlyPublished) {
      this.logQuery("SELECT * FROM blog_posts WHERE is_published = TRUE ORDER BY published_at DESC;");
      return this.blogPosts.filter(b => b.isPublished);
    }
    this.logQuery("SELECT * FROM blog_posts ORDER BY created_at DESC;");
    return this.blogPosts;
  }

  public createBlogPost(postData: Omit<BlogPost, "id" | "createdAt">): BlogPost {
    const newBlogPost: BlogPost = {
      ...postData,
      id: "b-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.blogPosts.push(newBlogPost);
    this.logQuery(
      `INSERT INTO blog_posts (id, title, slug, summary, content, category, tags, featured_image, seo_title, seo_description, is_published, published_at, author_id, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;`,
      [newBlogPost.id, newBlogPost.title, newBlogPost.slug, newBlogPost.summary, newBlogPost.content, newBlogPost.category, newBlogPost.tags, newBlogPost.featuredImage, newBlogPost.seoTitle, newBlogPost.seoDescription, newBlogPost.isPublished, newBlogPost.publishedAt, newBlogPost.authorId, newBlogPost.createdAt]
    );
    return newBlogPost;
  }

  public updateBlogPost(id: string, updates: Partial<BlogPost>): BlogPost | undefined {
    const idx = this.blogPosts.findIndex(b => b.id === id);
    if (idx === -1) return undefined;

    this.blogPosts[idx] = {
      ...this.blogPosts[idx],
      ...updates
    };

    const keys = Object.keys(updates);
    const sqlSet = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");
    this.logQuery(
      `UPDATE blog_posts SET ${sqlSet} WHERE id = $1 RETURNING *;`,
      [id, ...Object.values(updates)]
    );

    return this.blogPosts[idx];
  }

  public deleteBlogPost(id: string): boolean {
    const initialLen = this.blogPosts.length;
    this.blogPosts = this.blogPosts.filter(b => b.id !== id);
    this.logQuery("DELETE FROM blog_posts WHERE id = $1;", [id]);
    return this.blogPosts.length < initialLen;
  }

  // Careers / Job Applications Operations
  public getJobApplications(): JobApplication[] {
    this.logQuery("SELECT * FROM job_applications ORDER BY created_at DESC;");
    return this.jobApplications;
  }

  public createJobApplication(appData: Omit<JobApplication, "id" | "createdAt">): JobApplication {
    const newApp: JobApplication = {
      ...appData,
      id: "app-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.jobApplications.push(newApp);
    this.logQuery(
      `INSERT INTO job_applications (id, job_id, full_name, email, phone, resume_url, github_url, resume_text, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`,
      [newApp.id, newApp.jobId, newApp.fullName, newApp.email, newApp.phone, newApp.resumeUrl, newApp.githubUrl, newApp.resumeText, newApp.status, newApp.createdAt]
    );
    return newApp;
  }

  public updateJobApplication(id: string, updates: Partial<JobApplication>): JobApplication | undefined {
    const idx = this.jobApplications.findIndex(a => a.id === id);
    if (idx === -1) return undefined;

    this.jobApplications[idx] = {
      ...this.jobApplications[idx],
      ...updates
    };

    const keys = Object.keys(updates);
    const sqlSet = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");
    this.logQuery(
      `UPDATE job_applications SET ${sqlSet} WHERE id = $1 RETURNING *;`,
      [id, ...Object.values(updates)]
    );

    return this.jobApplications[idx];
  }

  // Contact Messages Operations
  public getContactMessages(): ContactMessage[] {
    this.logQuery("SELECT * FROM contact_messages ORDER BY created_at DESC;");
    return this.contactMessages;
  }

  public createContactMessage(msgData: Omit<ContactMessage, "id" | "status" | "createdAt">): ContactMessage {
    const newMsg: ContactMessage = {
      ...msgData,
      id: "msg-" + Math.random().toString(36).substr(2, 9),
      status: "unread",
      createdAt: new Date().toISOString()
    };
    this.contactMessages.push(newMsg);
    this.logQuery(
      `INSERT INTO contact_messages (id, name, email, phone, company, message, inquiry_type, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
      [newMsg.id, newMsg.name, newMsg.email, newMsg.phone, newMsg.company, newMsg.message, newMsg.inquiryType, newMsg.status, newMsg.createdAt]
    );
    return newMsg;
  }

  public updateContactMessage(id: string, updates: Partial<ContactMessage>): ContactMessage | undefined {
    const idx = this.contactMessages.findIndex(m => m.id === id);
    if (idx === -1) return undefined;

    this.contactMessages[idx] = {
      ...this.contactMessages[idx],
      ...updates
    };

    const keys = Object.keys(updates);
    const sqlSet = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");
    this.logQuery(
      `UPDATE contact_messages SET ${sqlSet} WHERE id = $1 RETURNING *;`,
      [id, ...Object.values(updates)]
    );

    return this.contactMessages[idx];
  }

  // Tasks Operations
  public getTasks(): Task[] {
    this.logQuery("SELECT * FROM tasks ORDER BY due_date ASC;");
    return this.tasks;
  }

  public createTask(taskData: Omit<Task, "id" | "createdAt" | "updatedAt">): Task {
    const newTask: Task = {
      ...taskData,
      id: "task-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    this.logQuery(
      `INSERT INTO tasks (id, project_id, title, description, assigned_to, status, priority, due_date, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`,
      [newTask.id, newTask.projectId, newTask.title, newTask.description, newTask.assignedTo, newTask.status, newTask.priority, newTask.dueDate, newTask.createdAt, newTask.updatedAt]
    );
    return newTask;
  }

  public updateTask(id: string, updates: Partial<Task>): Task | undefined {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) return undefined;

    this.tasks[idx] = {
      ...this.tasks[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    const keys = Object.keys(updates);
    const sqlSet = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");
    this.logQuery(
      `UPDATE tasks SET ${sqlSet}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;`,
      [id, ...Object.values(updates)]
    );

    return this.tasks[idx];
  }

  public deleteTask(id: string): boolean {
    const initialLen = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.logQuery("DELETE FROM tasks WHERE id = $1;", [id]);
    return this.tasks.length < initialLen;
  }

  // Audit Logs Operations
  public getAuditLogs(): AuditLog[] {
    this.logQuery("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50;");
    return this.auditLogs;
  }

  public writeAuditLog(log: Omit<AuditLog, "id" | "createdAt">): AuditLog {
    const newLog: AuditLog = {
      ...log,
      id: "log-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.auditLogs.unshift(newLog);
    this.logQuery(
      `INSERT INTO audit_logs (id, user_id, user_email, action, ip_address, endpoint, status, details, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
      [newLog.id, newLog.userId, newLog.userEmail, newLog.action, newLog.ipAddress, newLog.endpoint, newLog.status, newLog.details, newLog.createdAt]
    );
    return newLog;
  }

  // Notifications Operations
  public getNotifications(userId: string): Notification[] {
    this.logQuery("SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC;", [userId]);
    return this.notifications.filter(n => n.userId === userId || n.userId === "all");
  }

  public createNotification(data: Omit<Notification, "id" | "isRead" | "createdAt">): Notification {
    const newNotification: Notification = {
      ...data,
      id: "not-" + Math.random().toString(36).substr(2, 9),
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.notifications.unshift(newNotification);
    this.logQuery(
      `INSERT INTO notifications (id, user_id, title, message, is_read, type, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
      [newNotification.id, newNotification.userId, newNotification.title, newNotification.message, newNotification.isRead, newNotification.type, newNotification.createdAt]
    );
    return newNotification;
  }

  public markNotificationsAsRead(userId: string) {
    this.notifications.filter(n => n.userId === userId).forEach(n => n.isRead = true);
    this.logQuery("UPDATE notifications SET is_read = TRUE WHERE user_id = $1;", [userId]);
  }
}

export const dbInstance = new NexoraDatabaseEngine();
export default dbInstance;
