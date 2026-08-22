-- ==========================================================
-- HRFLOWX HRMS — ROW LEVEL SECURITY (RLS) POLICIES
-- "Strict Multi-Tenant Role-Based Access Control"
-- Migration: 20260822060500_hrflowx_rls_policies.sql
-- ==========================================================

-- ==========================================================
-- SECURITY DEFINER HELPER FUNCTIONS
-- ==========================================================

-- Helper 1: Get current authenticated employee ID
CREATE OR REPLACE FUNCTION public.current_employee_id()
RETURNS UUID AS $$
    SELECT id FROM public.employees
    WHERE auth_user_id = auth.uid()
    LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- Helper 2: Get current authenticated employee's company ID
CREATE OR REPLACE FUNCTION public.current_company_id()
RETURNS UUID AS $$
    SELECT company_id FROM public.employees
    WHERE auth_user_id = auth.uid()
    LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- Helper 3: Check if current user is Admin or HR in their company
CREATE OR REPLACE FUNCTION public.is_admin_or_hr()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.employees
        WHERE auth_user_id = auth.uid()
          AND role IN ('admin', 'hr')
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- Helper 4: Check if current user is the direct manager of an employee
CREATE OR REPLACE FUNCTION public.is_manager_of(emp_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.employees
        WHERE id = emp_id
          AND manager_id = (
              SELECT id FROM public.employees WHERE auth_user_id = auth.uid() LIMIT 1
          )
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;


-- ==========================================================
-- 1. COMPANIES POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Companies: Select own company" ON companies;
DROP POLICY IF EXISTS "Companies: Admin update own company" ON companies;

CREATE POLICY "Companies: Select own company"
    ON companies FOR SELECT
    USING (id = public.current_company_id());

CREATE POLICY "Companies: Admin update own company"
    ON companies FOR UPDATE
    USING (id = public.current_company_id() AND public.is_admin_or_hr())
    WITH CHECK (id = public.current_company_id() AND public.is_admin_or_hr());


-- ==========================================================
-- 2. BRANCHES POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Branches: Select company branches" ON branches;
DROP POLICY IF EXISTS "Branches: Admin manage branches" ON branches;

CREATE POLICY "Branches: Select company branches"
    ON branches FOR SELECT
    USING (company_id = public.current_company_id());

CREATE POLICY "Branches: Admin manage branches"
    ON branches FOR ALL
    USING (company_id = public.current_company_id() AND public.is_admin_or_hr())
    WITH CHECK (company_id = public.current_company_id() AND public.is_admin_or_hr());


-- ==========================================================
-- 3. DEPARTMENTS POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Departments: Select company departments" ON departments;
DROP POLICY IF EXISTS "Departments: Admin manage departments" ON departments;

CREATE POLICY "Departments: Select company departments"
    ON departments FOR SELECT
    USING (company_id = public.current_company_id());

CREATE POLICY "Departments: Admin manage departments"
    ON departments FOR ALL
    USING (company_id = public.current_company_id() AND public.is_admin_or_hr())
    WITH CHECK (company_id = public.current_company_id() AND public.is_admin_or_hr());


-- ==========================================================
-- 4. DESIGNATIONS POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Designations: Select company designations" ON designations;
DROP POLICY IF EXISTS "Designations: Admin manage designations" ON designations;

CREATE POLICY "Designations: Select company designations"
    ON designations FOR SELECT
    USING (company_id = public.current_company_id());

CREATE POLICY "Designations: Admin manage designations"
    ON designations FOR ALL
    USING (company_id = public.current_company_id() AND public.is_admin_or_hr())
    WITH CHECK (company_id = public.current_company_id() AND public.is_admin_or_hr());


-- ==========================================================
-- 5. EMPLOYEES POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Employees: Select profile" ON employees;
DROP POLICY IF EXISTS "Employees: Insert by Admin/HR" ON employees;
DROP POLICY IF EXISTS "Employees: Update profile" ON employees;
DROP POLICY IF EXISTS "Employees: Delete by Admin/HR" ON employees;

CREATE POLICY "Employees: Select profile"
    ON employees FOR SELECT
    USING (
        auth_user_id = auth.uid() OR
        company_id = public.current_company_id()
    );

CREATE POLICY "Employees: Insert by Admin/HR"
    ON employees FOR INSERT
    WITH CHECK (
        company_id = public.current_company_id() AND public.is_admin_or_hr()
    );

CREATE POLICY "Employees: Update profile"
    ON employees FOR UPDATE
    USING (
        auth_user_id = auth.uid() OR
        (company_id = public.current_company_id() AND public.is_admin_or_hr())
    )
    WITH CHECK (
        auth_user_id = auth.uid() OR
        (company_id = public.current_company_id() AND public.is_admin_or_hr())
    );

CREATE POLICY "Employees: Delete by Admin/HR"
    ON employees FOR DELETE
    USING (
        company_id = public.current_company_id() AND public.is_admin_or_hr()
    );


-- ==========================================================
-- 6. ATTENDANCE POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Attendance: Select attendance" ON attendance;
DROP POLICY IF EXISTS "Attendance: Insert attendance" ON attendance;
DROP POLICY IF EXISTS "Attendance: Admin manage attendance" ON attendance;

CREATE POLICY "Attendance: Select attendance"
    ON attendance FOR SELECT
    USING (
        employee_id = public.current_employee_id() OR
        (company_id = public.current_company_id() AND public.is_admin_or_hr())
    );

CREATE POLICY "Attendance: Insert attendance"
    ON attendance FOR INSERT
    WITH CHECK (
        (employee_id = public.current_employee_id() AND company_id = public.current_company_id()) OR
        (company_id = public.current_company_id() AND public.is_admin_or_hr())
    );

CREATE POLICY "Attendance: Admin manage attendance"
    ON attendance FOR UPDATE
    USING (company_id = public.current_company_id() AND public.is_admin_or_hr())
    WITH CHECK (company_id = public.current_company_id() AND public.is_admin_or_hr());

CREATE POLICY "Attendance: Admin delete attendance"
    ON attendance FOR DELETE
    USING (company_id = public.current_company_id() AND public.is_admin_or_hr());


-- ==========================================================
-- 7. ATTENDANCE REQUESTS POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Attendance Requests: Select" ON attendance_requests;
DROP POLICY IF EXISTS "Attendance Requests: Insert own request" ON attendance_requests;
DROP POLICY IF EXISTS "Attendance Requests: Update request" ON attendance_requests;
DROP POLICY IF EXISTS "Attendance Requests: Delete request" ON attendance_requests;

CREATE POLICY "Attendance Requests: Select"
    ON attendance_requests FOR SELECT
    USING (
        employee_id = public.current_employee_id() OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    );

CREATE POLICY "Attendance Requests: Insert own request"
    ON attendance_requests FOR INSERT
    WITH CHECK (
        employee_id = public.current_employee_id()
    );

CREATE POLICY "Attendance Requests: Update request"
    ON attendance_requests FOR UPDATE
    USING (
        (employee_id = public.current_employee_id() AND status = 'pending') OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    )
    WITH CHECK (
        (employee_id = public.current_employee_id()) OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    );

CREATE POLICY "Attendance Requests: Delete request"
    ON attendance_requests FOR DELETE
    USING (
        (employee_id = public.current_employee_id() AND status = 'pending') OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    );


-- ==========================================================
-- 8. LEAVE TYPES POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Leave Types: Select company leave types" ON leave_types;
DROP POLICY IF EXISTS "Leave Types: Admin manage leave types" ON leave_types;

CREATE POLICY "Leave Types: Select company leave types"
    ON leave_types FOR SELECT
    USING (company_id = public.current_company_id());

CREATE POLICY "Leave Types: Admin manage leave types"
    ON leave_types FOR ALL
    USING (company_id = public.current_company_id() AND public.is_admin_or_hr())
    WITH CHECK (company_id = public.current_company_id() AND public.is_admin_or_hr());


-- ==========================================================
-- 9. LEAVE BALANCES POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Leave Balances: Select" ON leave_balances;
DROP POLICY IF EXISTS "Leave Balances: Admin manage" ON leave_balances;

CREATE POLICY "Leave Balances: Select"
    ON leave_balances FOR SELECT
    USING (
        employee_id = public.current_employee_id() OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    );

CREATE POLICY "Leave Balances: Admin manage"
    ON leave_balances FOR ALL
    USING (
        employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr()
    )
    WITH CHECK (
        employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr()
    );


-- ==========================================================
-- 10. LEAVE REQUESTS POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Leave Requests: Select" ON leave_requests;
DROP POLICY IF EXISTS "Leave Requests: Insert own" ON leave_requests;
DROP POLICY IF EXISTS "Leave Requests: Update" ON leave_requests;
DROP POLICY IF EXISTS "Leave Requests: Delete" ON leave_requests;

CREATE POLICY "Leave Requests: Select"
    ON leave_requests FOR SELECT
    USING (
        employee_id = public.current_employee_id() OR
        public.is_manager_of(employee_id) OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    );

CREATE POLICY "Leave Requests: Insert own"
    ON leave_requests FOR INSERT
    WITH CHECK (
        employee_id = public.current_employee_id()
    );

CREATE POLICY "Leave Requests: Update"
    ON leave_requests FOR UPDATE
    USING (
        (employee_id = public.current_employee_id() AND status = 'pending') OR
        public.is_manager_of(employee_id) OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    )
    WITH CHECK (
        (employee_id = public.current_employee_id()) OR
        public.is_manager_of(employee_id) OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    );

CREATE POLICY "Leave Requests: Delete"
    ON leave_requests FOR DELETE
    USING (
        (employee_id = public.current_employee_id() AND status = 'pending') OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    );


-- ==========================================================
-- 11. SALARY STRUCTURES POLICIES (STRICT CONFIDENTIALITY)
-- ==========================================================
DROP POLICY IF EXISTS "Salary Structures: Select own or Admin/HR" ON salary_structures;
DROP POLICY IF EXISTS "Salary Structures: Admin manage" ON salary_structures;

CREATE POLICY "Salary Structures: Select own or Admin/HR"
    ON salary_structures FOR SELECT
    USING (
        employee_id = public.current_employee_id() OR
        (company_id = public.current_company_id() AND public.is_admin_or_hr())
    );

CREATE POLICY "Salary Structures: Admin manage"
    ON salary_structures FOR ALL
    USING (company_id = public.current_company_id() AND public.is_admin_or_hr())
    WITH CHECK (company_id = public.current_company_id() AND public.is_admin_or_hr());


-- ==========================================================
-- 12. SALARY COMPONENTS POLICIES (STRICT CONFIDENTIALITY)
-- ==========================================================
DROP POLICY IF EXISTS "Salary Components: Select own or Admin/HR" ON salary_components;
DROP POLICY IF EXISTS "Salary Components: Admin manage" ON salary_components;

CREATE POLICY "Salary Components: Select own or Admin/HR"
    ON salary_components FOR SELECT
    USING (
        salary_structure_id IN (SELECT id FROM salary_structures WHERE employee_id = public.current_employee_id()) OR
        (salary_structure_id IN (SELECT id FROM salary_structures WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    );

CREATE POLICY "Salary Components: Admin manage"
    ON salary_components FOR ALL
    USING (
        salary_structure_id IN (SELECT id FROM salary_structures WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr()
    )
    WITH CHECK (
        salary_structure_id IN (SELECT id FROM salary_structures WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr()
    );


-- ==========================================================
-- 13. PAYROLL POLICIES (STRICT CONFIDENTIALITY)
-- ==========================================================
DROP POLICY IF EXISTS "Payroll: Select own or Admin/HR" ON payroll;
DROP POLICY IF EXISTS "Payroll: Admin manage" ON payroll;

CREATE POLICY "Payroll: Select own or Admin/HR"
    ON payroll FOR SELECT
    USING (
        employee_id = public.current_employee_id() OR
        (company_id = public.current_company_id() AND public.is_admin_or_hr())
    );

CREATE POLICY "Payroll: Admin manage"
    ON payroll FOR ALL
    USING (company_id = public.current_company_id() AND public.is_admin_or_hr())
    WITH CHECK (company_id = public.current_company_id() AND public.is_admin_or_hr());


-- ==========================================================
-- 14. PAYSLIPS POLICIES (STRICT CONFIDENTIALITY)
-- ==========================================================
DROP POLICY IF EXISTS "Payslips: Select own or Admin/HR" ON payslips;
DROP POLICY IF EXISTS "Payslips: Admin manage" ON payslips;

CREATE POLICY "Payslips: Select own or Admin/HR"
    ON payslips FOR SELECT
    USING (
        employee_id = public.current_employee_id() OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    );

CREATE POLICY "Payslips: Admin manage"
    ON payslips FOR ALL
    USING (
        employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr()
    )
    WITH CHECK (
        employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr()
    );


-- ==========================================================
-- 15. NOTIFICATIONS POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Notifications: Select own" ON notifications;
DROP POLICY IF EXISTS "Notifications: Update own read status" ON notifications;
DROP POLICY IF EXISTS "Notifications: Delete own" ON notifications;
DROP POLICY IF EXISTS "Notifications: System/Admin Insert" ON notifications;

CREATE POLICY "Notifications: Select own"
    ON notifications FOR SELECT
    USING (employee_id = public.current_employee_id());

CREATE POLICY "Notifications: Update own read status"
    ON notifications FOR UPDATE
    USING (employee_id = public.current_employee_id())
    WITH CHECK (employee_id = public.current_employee_id());

CREATE POLICY "Notifications: Delete own"
    ON notifications FOR DELETE
    USING (employee_id = public.current_employee_id());

CREATE POLICY "Notifications: System/Admin Insert"
    ON notifications FOR INSERT
    WITH CHECK (
        employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id())
    );


-- ==========================================================
-- 16. DOCUMENTS POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Documents: Select" ON documents;
DROP POLICY IF EXISTS "Documents: Insert" ON documents;
DROP POLICY IF EXISTS "Documents: Update/Delete by Admin/HR" ON documents;
DROP POLICY IF EXISTS "Documents: Delete own uploaded" ON documents;

CREATE POLICY "Documents: Select"
    ON documents FOR SELECT
    USING (
        employee_id = public.current_employee_id() OR
        (company_id = public.current_company_id() AND category = 'Policy') OR
        (company_id = public.current_company_id() AND public.is_admin_or_hr())
    );

CREATE POLICY "Documents: Insert"
    ON documents FOR INSERT
    WITH CHECK (
        (employee_id = public.current_employee_id() AND company_id = public.current_company_id()) OR
        (company_id = public.current_company_id() AND public.is_admin_or_hr())
    );

CREATE POLICY "Documents: Update/Delete by Admin/HR"
    ON documents FOR UPDATE
    USING (company_id = public.current_company_id() AND public.is_admin_or_hr())
    WITH CHECK (company_id = public.current_company_id() AND public.is_admin_or_hr());

CREATE POLICY "Documents: Delete own uploaded"
    ON documents FOR DELETE
    USING (
        (uploaded_by = public.current_employee_id() AND employee_id = public.current_employee_id()) OR
        (company_id = public.current_company_id() AND public.is_admin_or_hr())
    );


-- ==========================================================
-- 17. ANNOUNCEMENTS POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Announcements: Select" ON announcements;
DROP POLICY IF EXISTS "Announcements: Admin manage" ON announcements;

CREATE POLICY "Announcements: Select"
    ON announcements FOR SELECT
    USING (
        (company_id = public.current_company_id() AND is_published = TRUE) OR
        (company_id = public.current_company_id() AND public.is_admin_or_hr())
    );

CREATE POLICY "Announcements: Admin manage"
    ON announcements FOR ALL
    USING (company_id = public.current_company_id() AND public.is_admin_or_hr())
    WITH CHECK (company_id = public.current_company_id() AND public.is_admin_or_hr());


-- ==========================================================
-- 18. GOALS POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Goals: Select" ON goals;
DROP POLICY IF EXISTS "Goals: Insert" ON goals;
DROP POLICY IF EXISTS "Goals: Update" ON goals;
DROP POLICY IF EXISTS "Goals: Delete" ON goals;

CREATE POLICY "Goals: Select"
    ON goals FOR SELECT
    USING (
        employee_id = public.current_employee_id() OR
        assigned_by = public.current_employee_id() OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    );

CREATE POLICY "Goals: Insert"
    ON goals FOR INSERT
    WITH CHECK (
        employee_id = public.current_employee_id() OR
        assigned_by = public.current_employee_id() OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    );

CREATE POLICY "Goals: Update"
    ON goals FOR UPDATE
    USING (
        employee_id = public.current_employee_id() OR
        assigned_by = public.current_employee_id() OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    )
    WITH CHECK (
        employee_id = public.current_employee_id() OR
        assigned_by = public.current_employee_id() OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    );

CREATE POLICY "Goals: Delete"
    ON goals FOR DELETE
    USING (
        assigned_by = public.current_employee_id() OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    );


-- ==========================================================
-- 19. PERFORMANCE REVIEWS POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Performance Reviews: Select" ON performance_reviews;
DROP POLICY IF EXISTS "Performance Reviews: Manage by Reviewer/Admin" ON performance_reviews;

CREATE POLICY "Performance Reviews: Select"
    ON performance_reviews FOR SELECT
    USING (
        employee_id = public.current_employee_id() OR
        reviewer_id = public.current_employee_id() OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    );

CREATE POLICY "Performance Reviews: Manage by Reviewer/Admin"
    ON performance_reviews FOR ALL
    USING (
        reviewer_id = public.current_employee_id() OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    )
    WITH CHECK (
        reviewer_id = public.current_employee_id() OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    );


-- ==========================================================
-- 20. HOLIDAYS POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Holidays: Select company holidays" ON holidays;
DROP POLICY IF EXISTS "Holidays: Admin manage holidays" ON holidays;

CREATE POLICY "Holidays: Select company holidays"
    ON holidays FOR SELECT
    USING (company_id = public.current_company_id());

CREATE POLICY "Holidays: Admin manage holidays"
    ON holidays FOR ALL
    USING (company_id = public.current_company_id() AND public.is_admin_or_hr())
    WITH CHECK (company_id = public.current_company_id() AND public.is_admin_or_hr());


-- ==========================================================
-- 21. ASSETS POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Assets: Select" ON assets;
DROP POLICY IF EXISTS "Assets: Admin manage" ON assets;

CREATE POLICY "Assets: Select"
    ON assets FOR SELECT
    USING (
        employee_id = public.current_employee_id() OR
        (company_id = public.current_company_id() AND public.is_admin_or_hr())
    );

CREATE POLICY "Assets: Admin manage"
    ON assets FOR ALL
    USING (company_id = public.current_company_id() AND public.is_admin_or_hr())
    WITH CHECK (company_id = public.current_company_id() AND public.is_admin_or_hr());


-- ==========================================================
-- 22. SUPPORT REQUESTS POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Support Requests: Select" ON support_requests;
DROP POLICY IF EXISTS "Support Requests: Insert" ON support_requests;
DROP POLICY IF EXISTS "Support Requests: Update" ON support_requests;
DROP POLICY IF EXISTS "Support Requests: Delete" ON support_requests;

CREATE POLICY "Support Requests: Select"
    ON support_requests FOR SELECT
    USING (
        employee_id = public.current_employee_id() OR
        assigned_to = public.current_employee_id() OR
        (company_id = public.current_company_id() AND public.is_admin_or_hr())
    );

CREATE POLICY "Support Requests: Insert"
    ON support_requests FOR INSERT
    WITH CHECK (
        employee_id = public.current_employee_id() AND company_id = public.current_company_id()
    );

CREATE POLICY "Support Requests: Update"
    ON support_requests FOR UPDATE
    USING (
        employee_id = public.current_employee_id() OR
        assigned_to = public.current_employee_id() OR
        (company_id = public.current_company_id() AND public.is_admin_or_hr())
    )
    WITH CHECK (
        employee_id = public.current_employee_id() OR
        assigned_to = public.current_employee_id() OR
        (company_id = public.current_company_id() AND public.is_admin_or_hr())
    );

CREATE POLICY "Support Requests: Delete"
    ON support_requests FOR DELETE
    USING (company_id = public.current_company_id() AND public.is_admin_or_hr());


-- ==========================================================
-- 23. AUDIT LOGS POLICIES (STRICT ACCESS & IMMUTABILITY)
-- Employees CANNOT view audit logs. NO UPDATE OR DELETE ALLOWED.
-- ==========================================================
DROP POLICY IF EXISTS "Audit Logs: Admin/HR Select" ON audit_logs;
DROP POLICY IF EXISTS "Audit Logs: Authenticated Insert" ON audit_logs;

CREATE POLICY "Audit Logs: Admin/HR Select"
    ON audit_logs FOR SELECT
    USING (
        company_id = public.current_company_id() AND public.is_admin_or_hr()
    );

CREATE POLICY "Audit Logs: Authenticated Insert"
    ON audit_logs FOR INSERT
    WITH CHECK (
        actor_id = public.current_employee_id() OR auth_user_id = auth.uid()
    );


-- ==========================================================
-- 24. ONBOARDING TASKS POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Onboarding Tasks: Select" ON onboarding_tasks;
DROP POLICY IF EXISTS "Onboarding Tasks: Insert by Admin/HR" ON onboarding_tasks;
DROP POLICY IF EXISTS "Onboarding Tasks: Update" ON onboarding_tasks;
DROP POLICY IF EXISTS "Onboarding Tasks: Delete by Admin/HR" ON onboarding_tasks;

CREATE POLICY "Onboarding Tasks: Select"
    ON onboarding_tasks FOR SELECT
    USING (
        employee_id = public.current_employee_id() OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    );

CREATE POLICY "Onboarding Tasks: Insert by Admin/HR"
    ON onboarding_tasks FOR INSERT
    WITH CHECK (
        employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr()
    );

CREATE POLICY "Onboarding Tasks: Update"
    ON onboarding_tasks FOR UPDATE
    USING (
        employee_id = public.current_employee_id() OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    )
    WITH CHECK (
        employee_id = public.current_employee_id() OR
        (employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr())
    );

CREATE POLICY "Onboarding Tasks: Delete by Admin/HR"
    ON onboarding_tasks FOR DELETE
    USING (
        employee_id IN (SELECT id FROM employees WHERE company_id = public.current_company_id()) AND public.is_admin_or_hr()
    );


-- ==========================================================
-- 25. COMPANY POLICIES POLICIES
-- ==========================================================
DROP POLICY IF EXISTS "Company Policies: Select" ON company_policies;
DROP POLICY IF EXISTS "Company Policies: Admin manage" ON company_policies;

CREATE POLICY "Company Policies: Select"
    ON company_policies FOR SELECT
    USING (
        (company_id = public.current_company_id() AND is_published = TRUE) OR
        (company_id = public.current_company_id() AND public.is_admin_or_hr())
    );

CREATE POLICY "Company Policies: Admin manage"
    ON company_policies FOR ALL
    USING (company_id = public.current_company_id() AND public.is_admin_or_hr())
    WITH CHECK (company_id = public.current_company_id() AND public.is_admin_or_hr());
