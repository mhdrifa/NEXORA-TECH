-- ====================================================
-- NEXORA TECH - ENTERPRISE POSTGRESQL PRODUCTION DDL
-- Platform: PostgreSQL (14+)
-- ====================================================

-- Enable UUID Extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Custom Enum Types
CREATE TYPE project_status AS ENUM ('Pending', 'Active', 'Review', 'Completed', 'Cancelled');
CREATE TYPE task_priority AS ENUM ('Low', 'Medium', 'High', 'Critical');

-- ====================================================
-- TRIGGERS & FUNCTIONS FOR AUTOMATIC UPDATED_AT
-- ====================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================================
-- 1. ROLES TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER update_roles_modtime
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- ====================================================
-- 2. PERMISSIONS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    permission_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER update_permissions_modtime
    BEFORE UPDATE ON permissions
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- ====================================================
-- 3. ROLE_PERMISSIONS TABLE (Pivot with composite key)
-- ====================================================
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id VARCHAR(50) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(50) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_perm ON role_permissions(permission_id);

-- ====================================================
-- 4. USERS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    profile_image TEXT,
    role_id VARCHAR(50) NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT chk_user_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'))
);

CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_status_active ON users(status) WHERE deleted_at IS NULL;

-- ====================================================
-- 5. CLIENTS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    industry VARCHAR(100),
    website VARCHAR(255),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT chk_client_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'))
);

CREATE TRIGGER update_clients_modtime
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);

-- ====================================================
-- 6. SERVICES TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    service_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    icon VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER update_services_modtime
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE INDEX idx_services_category ON services(category);

-- ====================================================
-- 7. PROJECTS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    client_id VARCHAR(50) NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    service_id VARCHAR(50) NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    budget DECIMAL(15,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    progress INT DEFAULT 0 NOT NULL,
    status project_status DEFAULT 'Pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT chk_project_progress CHECK (progress >= 0 AND progress <= 100)
);

CREATE TRIGGER update_projects_modtime
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_service ON projects(service_id);
CREATE INDEX idx_projects_status ON projects(status);

-- ====================================================
-- 8. PROJECT_MEMBERS TABLE (Pivot with composite key)
-- ====================================================
CREATE TABLE IF NOT EXISTS project_members (
    project_id VARCHAR(50) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, user_id)
);

CREATE INDEX idx_project_members_proj ON project_members(project_id);
CREATE INDEX idx_project_members_usr ON project_members(user_id);

-- ====================================================
-- 9. TASKS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    project_id VARCHAR(50) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    assigned_to VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority task_priority DEFAULT 'Medium' NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'todo' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER update_tasks_modtime
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_assignee ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);

-- ====================================================
-- 10. BLOG_POSTS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    featured_image TEXT,
    category VARCHAR(100) NOT NULL,
    tags TEXT[] NOT NULL,
    seo_title VARCHAR(255),
    seo_description TEXT,
    author_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status VARCHAR(50) DEFAULT 'draft' NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER update_blog_posts_modtime
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);

-- ====================================================
-- 11. TESTIMONIALS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS testimonials (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    client_name VARCHAR(255) NOT NULL,
    company VARCHAR(150) NOT NULL,
    image TEXT,
    rating INT DEFAULT 5 NOT NULL,
    review TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_stars CHECK (rating >= 1 AND rating <= 5)
);

CREATE TRIGGER update_testimonials_modtime
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- ====================================================
-- 12. CONTACT_MESSAGES TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER update_contact_messages_modtime
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE INDEX idx_contact_messages_email ON contact_messages(email);

-- ====================================================
-- 13. CAREERS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS careers (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    salary_range VARCHAR(100),
    status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER update_careers_modtime
    BEFORE UPDATE ON careers
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- ====================================================
-- 14. JOB_APPLICATIONS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS job_applications (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    career_id VARCHAR(50) NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    applicant_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    resume_url TEXT NOT NULL,
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'applied' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER update_job_apps_modtime
    BEFORE UPDATE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE INDEX idx_job_apps_career ON job_applications(career_id);

-- ====================================================
-- 15. INVOICES TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    client_id VARCHAR(50) NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    tax DECIMAL(12,2) DEFAULT 0.00 NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'unpaid' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER update_invoices_modtime
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);

-- ====================================================
-- 16. PAYMENTS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    invoice_id VARCHAR(50) NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL
);

CREATE INDEX idx_payments_invoice ON payments(invoice_id);

-- ====================================================
-- 17. NOTIFICATIONS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_notifications_user ON notifications(user_id);

-- ====================================================
-- 18. AUDIT_LOGS TABLE
-- ====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(50),
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
COALESCE(NULL);
