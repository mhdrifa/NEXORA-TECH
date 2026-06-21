/**
 * NEXORA TECH - Enterprise Database Schema Configuration
 * Platform: PostgreSQL
 * Framework: Drizzle ORM / Raw SQL compliant definition
 */

/**
 * ---------------------------------------------------
 * TABLE 1: ROLES & TABLE 2: PERMISSIONS
 * ---------------------------------------------------
 */

export interface Role {
  id: string; // "super_admin" | "admin" | "employee" | "client" | "guest"
  name: string;
  description: string;
  createdAt: string;
}

export interface Permission {
  id: string;
  roleId: string;
  resource: string; // "users" | "projects" | "invoices" | "payments" | "blog" | "careers" | "messages" | "tasks" | "analytics"
  action: string; // "create" | "read" | "update" | "delete" | "all"
  createdAt: string;
}

/**
 * ---------------------------------------------------
 * TABLE 3: USERS (Core auth account mapping)
 * ---------------------------------------------------
 */

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: "super_admin" | "admin" | "employee" | "client" | "guest";
  fullName: string;
  avatarUrl?: string;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpiry?: string;
  refreshToken?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * ---------------------------------------------------
 * TABLE 4: CLIENTS (Profile details extension for clients)
 * ---------------------------------------------------
 */

export interface Client {
  id: string;
  userId: string; // Foreign key to Users
  companyName?: string;
  contactPerson: string;
  email: string;
  phone?: string;
  billingAddress?: string;
  status: "active" | "suspended" | "pending";
  createdAt: string;
}

/**
 * ---------------------------------------------------
 * TABLE 5: EMPLOYEES (Profile details extension for staff)
 * ---------------------------------------------------
 */

export interface Employee {
  id: string;
  userId: string; // Foreign key to Users
  department: string;
  role: string;
  salary: number;
  skills: string[]; // stringified array
  status: "active" | "on_bench" | "terminated";
  createdAt: string;
}

/**
 * ---------------------------------------------------
 * TABLE 6: PROJECTS (Client assignment records)
 * ---------------------------------------------------
 */

export interface Project {
  id: string;
  clientId: string; // Foreign key to Clients
  name: string;
  description: string;
  status: "Pending" | "Active" | "Review" | "Completed";
  startDate: string;
  endDate: string;
  budget: number;
  assignedTeam: string[]; // array of Employee UserIds
  documents: string[]; // URL documents
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * ---------------------------------------------------
 * TABLE 7: SERVICES (Core offerings catalogue)
 * ---------------------------------------------------
 */

export interface Service {
  id: string;
  name: string;
  category: string; // "AI" | "Cloud" | "Cyber" | "Web" | "Mobile" | "DevOps"
  description: string;
  priceEstimate: number;
  isActive: boolean;
  createdAt: string;
}

/**
 * ---------------------------------------------------
 * TABLE 8: INVOICES & TABLE 9: PAYMENTS
 * ---------------------------------------------------
 */

export interface Invoice {
  id: string;
  projectId: string; // Foreign key to Projects
  clientId: string; // Foreign key to Clients
  invoiceNumber: string; // "NX-2026-001"
  issueDate: string;
  dueDate: string;
  amount: number;
  tax: number;
  discount: number;
  total: number;
  status: "draft" | "unpaid" | "partially_paid" | "paid" | "overdue";
  items: { description: string; quantity: number; unitPrice: number; total: number }[]; // JSON array
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string; // Foreign key to Invoices
  clientId: string; // Foreign key to Clients
  amount: number;
  paymentMethod: "stripe" | "paypal" | "bank_transfer";
  paymentIntentId?: string; // Stripe payment reference
  status: "pending" | "completed" | "failed";
  paidAt?: string;
  createdAt: string;
}

/**
 * ---------------------------------------------------
 * TABLE 10: BLOG_POSTS
 * ---------------------------------------------------
 */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  seoTitle?: string;
  seoDescription?: string;
  isPublished: boolean;
  publishedAt?: string;
  authorId: string; // Foreign key to Users/Employees
  createdAt: string;
}

/**
 * ---------------------------------------------------
 * TABLE 11: TESTIMONIALS
 * ---------------------------------------------------
 */

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  stars: number;
  image: string;
  isApproved: boolean;
  createdAt: string;
}

/**
 * ---------------------------------------------------
 * TABLE 12: CONTACT_MESSAGES
 * ---------------------------------------------------
 */

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  inquiryType: "ai-solutions" | "cloud-engineering" | "cybersecurity" | "custom-software";
  status: "unread" | "replied" | "archived";
  adminReplyText?: string;
  repliedAt?: string;
  createdAt: string;
}

/**
 * ---------------------------------------------------
 * TABLE 13: JOB_APPLICATIONS
 * ---------------------------------------------------
 */

export interface JobApplication {
  id: string;
  jobId: string; // Foreign key or Reference key
  fullName: string;
  email: string;
  phone?: string;
  resumeUrl: string; // Resume download PDF or link
  githubUrl: string;
  resumeText?: string;
  status: "applied" | "review" | "interviewing" | "hired" | "rejected";
  createdAt: string;
}

/**
 * ---------------------------------------------------
 * TABLE 14: TASKS
 * ---------------------------------------------------
 */

export interface Task {
  id: string;
  projectId?: string; // Foreign Key to Projects
  title: string;
  description: string;
  assignedTo: string; // Employee User ID
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * ---------------------------------------------------
 * TABLE 15: NOTIFICATIONS
 * ---------------------------------------------------
 */

export interface Notification {
  id: string;
  userId: string; // Target target user
  title: string;
  message: string;
  isRead: boolean;
  type: "system" | "project" | "invoice" | "support";
  createdAt: string;
}

/**
 * ---------------------------------------------------
 * TABLE 16: AUDIT_LOGS
 * ---------------------------------------------------
 */

export interface AuditLog {
  id: string;
  userId?: string; // Who triggered it
  userEmail?: string;
  action: string; // e.g., "LOGIN_SUCCESS", "CREATE_PROJECT", "PAY_INVOICE"
  ipAddress: string;
  endpoint: string;
  status: "success" | "failed";
  details: string;
  createdAt: string;
}

/**
 * Raw PostgreSQL DDL Commands (For documentation & database compilation reference)
 */
export const POSTGRES_DDL = `
-- PostgreSQL DDL Schema for NEXORA TECH Enterprise Platform
-- Database Setup: CREATE DATABASE nexora_tech;

CREATE TABLE IF NOT EXISTS roles (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id VARCHAR(50) REFERENCES roles(id) ON DELETE CASCADE,
  resource VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'guest',
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  reset_password_token VARCHAR(255),
  reset_password_expiry TIMESTAMP WITH TIME ZONE,
  refresh_token VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  contact_person VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  billing_address TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  department VARCHAR(100) NOT NULL,
  role VARCHAR(100) NOT NULL,
  salary DECIMAL(12,2) DEFAULT 0.00,
  skills TEXT[],
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'Pending',
  start_date DATE NOT NULL,
  end_date DATE,
  budget DECIMAL(15,2) DEFAULT 0.00,
  assigned_team UUID[],
  documents TEXT[],
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  price_estimate DECIMAL(12,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  tax DECIMAL(12,2) DEFAULT 0.00,
  discount DECIMAL(12,2) DEFAULT 0.00,
  total DECIMAL(12,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'unpaid',
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_intent_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags TEXT[],
  featured_image TEXT,
  seo_title VARCHAR(255),
  seo_description TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  company VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  stars INT DEFAULT 5,
  image TEXT,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  message TEXT NOT NULL,
  inquiry_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'unread',
  admin_reply_text TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id VARCHAR(100) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  resume_url TEXT NOT NULL,
  github_url TEXT NOT NULL,
  resume_text TEXT,
  status VARCHAR(50) DEFAULT 'applied',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'todo',
  priority VARCHAR(50) DEFAULT 'medium',
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  type VARCHAR(50) DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  user_email VARCHAR(255),
  action VARCHAR(100) NOT NULL,
  ip_address VARCHAR(50) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'success',
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
`;
