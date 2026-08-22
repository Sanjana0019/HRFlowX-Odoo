-- ==========================================================
-- HRFlowX — DEMO SEED DATA SCRIPT
-- Fictional Demo Data for HRFlowX Live Presentation
-- ==========================================================

-- 1. DEMO COMPANY
INSERT INTO companies (id, name, identifier, industry, website, email, phone, address, logo)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'HRFlowX Technologies',
    'HX',
    'Enterprise Cloud Software',
    'https://hrflowx-demo.com',
    'contact@hrflowx-demo.com',
    '+1 (800) 555-0199',
    '742 Evergreen Terrace, San Francisco, CA 94107',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop'
) ON CONFLICT (id) DO NOTHING;

-- 2. DEMO DEPARTMENTS
INSERT INTO departments (id, company_id, name, code, budget) VALUES
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Executive Leadership', 'EXEC', 500000),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Software Engineering', 'ENG', 1200000),
('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Human Resources', 'HR', 350000),
('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Product & Design', 'PROD', 650000)
ON CONFLICT (id) DO NOTHING;

-- 3. DEMO EMPLOYEES
INSERT INTO employees (
    id, company_id, department_id, employee_id, name, email, role, avatar, phone, job_title, branch, employment_status, monthly_wage
) VALUES 
(
    'e0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'HXADMIN0001',
    'Sarah Jenkins',
    'admin@hrflowx-demo.com',
    'admin',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    '+1 (555) 019-2831',
    'Head of HR & Operations',
    'Headquarters',
    'active',
    250000
),
(
    'e0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000002',
    'HXEMP0001',
    'Alex Rivera',
    'employee@hrflowx-demo.com',
    'employee',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    '+1 (555) 014-9822',
    'Senior Full-Stack Engineer',
    'Headquarters',
    'active',
    120000
),
(
    'e0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000004',
    'HXEMP0002',
    'Elena Rostova',
    'elena@hrflowx-demo.com',
    'employee',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
    '+1 (555) 012-4431',
    'Lead Product Designer',
    'Headquarters',
    'active',
    110000
)
ON CONFLICT (id) DO NOTHING;

-- 4. DEMO ANNOUNCEMENTS
INSERT INTO announcements (id, company_id, title, content, category, priority, is_published)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Q3 Strategic Goals & Innovation Week',
    'We are excited to launch Innovation Week next Monday! Please submit your project ideas on the internal portal.',
    'Event',
    'high',
    TRUE
) ON CONFLICT (id) DO NOTHING;

-- 5. DEMO HOLIDAYS
INSERT INTO holidays (id, company_id, name, date, day_of_week, description) VALUES
('h0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Labor Day', '2026-09-07', 'Monday', 'National holiday celebration'),
('h0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Thanksgiving Day', '2026-11-26', 'Thursday', 'Company holiday celebration')
ON CONFLICT (id) DO NOTHING;

-- 6. DEMO ASSETS
INSERT INTO assets (id, company_id, asset_name, asset_id, category, serial_number, status)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'MacBook Pro 16" M3 Max',
    'AST-MBP-2026-01',
    'Laptop',
    'C02G90XXMD6M',
    'available'
) ON CONFLICT (id) DO NOTHING;

-- 7. DEMO GOALS
INSERT INTO goals (id, employee_id, title, target, due_date, progress, status)
VALUES (
    'g0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000002',
    'Complete Migration of Core API Services to GraphQL',
    'Migrate 100% of legacy endpoints with automated integration tests',
    '2026-09-30',
    75,
    'on_track'
) ON CONFLICT (id) DO NOTHING;
