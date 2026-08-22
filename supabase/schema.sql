
-- ==========================================================
-- HRFLOWX HRMS — SUPABASE POSTGRESQL RELATIONAL SCHEMA
-- "Streamline People, Power Performance."
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COMPANIES TABLE
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    identifier VARCHAR(10) NOT NULL UNIQUE DEFAULT 'HX',
    industry VARCHAR(255),
    website VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. BRANCHES TABLE
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    head_of_branch VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. POLICIES TABLE
CREATE TABLE IF NOT EXISTS company_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN ('Conduct', 'Leave & Attendance', 'Compensation', 'Security', 'Remote Work')),
    content TEXT NOT NULL,
    effective_date DATE NOT NULL,
    is_published BOOLEAN DEFAULT TRUE,
    version VARCHAR(20) DEFAULT 'v1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    head_of_department_id UUID,
    budget NUMERIC(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. EMPLOYEES TABLE
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) NOT NULL UNIQUE, -- e.g. "HXAR20230001"
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('employee', 'admin', 'hr')),
    avatar_url TEXT,
    phone VARCHAR(50),
    address TEXT,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    designation VARCHAR(100) NOT NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    location VARCHAR(100),
    joining_date DATE NOT NULL,
    employment_status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (employment_status IN ('active', 'on_leave', 'probation', 'terminated', 'deactivated')),
    
    -- Demographics & Private Info
    date_of_birth DATE,
    nationality VARCHAR(100),
    personal_email VARCHAR(255),
    gender VARCHAR(50),
    marital_status VARCHAR(50),
    
    -- Bank & Tax Identifiers
    bank_account_number VARCHAR(100),
    bank_name VARCHAR(255),
    ifsc_code VARCHAR(50),
    pan_number VARCHAR(50),
    uan_number VARCHAR(50),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. DYNAMIC SALARY STRUCTURES TABLE
CREATE TABLE IF NOT EXISTS salary_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL UNIQUE REFERENCES employees(id) ON DELETE CASCADE,
    wage_type VARCHAR(50) DEFAULT 'Fixed wage',
    monthly_wage NUMERIC(12, 2) NOT NULL,
    yearly_wage NUMERIC(12, 2) NOT NULL,
    working_days_per_week INT DEFAULT 5,
    working_hours_per_week INT DEFAULT 40,
    break_time_minutes INT DEFAULT 60,
    
    -- Computed Components
    basic_salary NUMERIC(12, 2) NOT NULL,
    hra NUMERIC(12, 2) NOT NULL,
    standard_allowance NUMERIC(12, 2) NOT NULL,
    performance_bonus NUMERIC(12, 2) NOT NULL,
    leave_travel_allowance NUMERIC(12, 2) NOT NULL,
    fixed_allowance NUMERIC(12, 2) NOT NULL,
    
    -- Deductions
    employee_pf NUMERIC(12, 2) NOT NULL,
    employer_pf NUMERIC(12, 2) NOT NULL,
    professional_tax NUMERIC(12, 2) NOT NULL,
    
    gross_salary NUMERIC(12, 2) NOT NULL,
    net_salary NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ATTENDANCE RECORDS TABLE
CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in VARCHAR(20),
    check_out VARCHAR(20),
    status VARCHAR(50) NOT NULL CHECK (status IN ('present', 'absent', 'half_day', 'on_leave', 'late')),
    working_hours VARCHAR(20),
    extra_hours VARCHAR(20),
    break_duration VARCHAR(20),
    location VARCHAR(50) DEFAULT 'Office',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- 8. ATTENDANCE CORRECTION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS attendance_correction_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    requested_check_in VARCHAR(20) NOT NULL,
    requested_check_out VARCHAR(20) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES employees(id),
    reviewed_date DATE,
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. LEAVE REQUESTS & TIME OFF TABLE
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type VARCHAR(50) NOT NULL CHECK (leave_type IN ('paid', 'sick', 'unpaid', 'casual', 'maternity', 'paternity')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL CHECK (total_days > 0),
    reason TEXT NOT NULL,
    attachment_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    reviewed_by UUID REFERENCES employees(id) ON DELETE SET NULL,
    reviewed_date DATE,
    admin_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. GOALS & PERFORMANCE REVIEWS TABLE
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    target TEXT NOT NULL,
    due_date DATE NOT NULL,
    progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status VARCHAR(50) DEFAULT 'on_track' CHECK (status IN ('on_track', 'behind', 'completed', 'at_risk')),
    feedback TEXT,
    assigned_by UUID REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. HARDWARE ASSETS TABLE
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_name VARCHAR(255) NOT NULL,
    asset_id VARCHAR(50) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL CHECK (category IN ('Laptop', 'Monitor', 'Phone', 'Access Card', 'Peripheral')),
    serial_number VARCHAR(100) NOT NULL,
    employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    assigned_date DATE,
    return_date DATE,
    status VARCHAR(50) DEFAULT 'assigned' CHECK (status IN ('assigned', 'available', 'maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action VARCHAR(255) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    target VARCHAR(255) NOT NULL,
    description TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_structures ENABLE ROW LEVEL SECURITY;
