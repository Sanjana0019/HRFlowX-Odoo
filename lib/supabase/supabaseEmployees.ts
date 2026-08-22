import { createBrowserClient } from './client';
import { isSupabaseConfigured } from '../supabase';
import { Employee, UserRole, DynamicSalaryStructure, PrivateInfo, ResumeInfo } from '@/types';
import { calculateDynamicSalaryStructure, generateEmployeeId } from '../utils';

// Map Supabase SQL record to HRFlowX Employee TS Interface
export function mapSupabaseRecordToEmployee(rec: any, salaryRec?: any): Employee {
  const wage = salaryRec?.monthly_wage ? Number(salaryRec.monthly_wage) : 15000;
  const days = salaryRec?.working_days_per_week ? Number(salaryRec.working_days_per_week) : 5;
  const hours = salaryRec?.working_hours_per_week ? Number(salaryRec.working_hours_per_week) : 40;
  const breakTime = salaryRec?.break_time_minutes ? Number(salaryRec.break_time_minutes) : 60;

  const salaryStructure: DynamicSalaryStructure = calculateDynamicSalaryStructure(wage, days, hours, breakTime);

  return {
    id: rec.id,
    auth_user_id: rec.auth_user_id || undefined,
    employeeId: rec.employee_id || rec.id,
    name: rec.name || "Employee",
    email: rec.email || "",
    role: (rec.role as UserRole) || "employee",
    avatar: rec.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    phone: rec.phone || "+1 (555) 000-0000",
    address: rec.address || "San Francisco, CA",
    companyName: rec.companies?.name || "HRFlowX Technologies",
    department: rec.departments?.name || rec.department || "Engineering",
    designation: rec.designations?.name || rec.designation || "Personnel",
    branch: rec.branches?.name || "San Francisco Global HQ",
    managerName: rec.manager?.name || "Sarah Jenkins",
    location: rec.location || "San Francisco HQ",
    joiningDate: rec.joining_date || new Date().toISOString().split("T")[0],
    employmentStatus: rec.employment_status || "active",
    emergencyContact: { name: "Primary Contact", relationship: "Family", phone: rec.phone || "+1 (555) 000-9999" },
    resume: {
      about: rec.resume_about || "Team member at HRFlowX.",
      whatILoveAboutJob: rec.resume_love || "Collaborating with team members to achieve vision.",
      interestsHobbies: rec.resume_interests || "Reading, tech exploration, and outdoor sports.",
      skills: [{ id: "sk-1", name: "Core Specialization", level: "Intermediate" }],
      certifications: [],
    },
    privateInfo: {
      dateOfBirth: rec.date_of_birth || "1995-01-01",
      residingAddress: rec.address || "San Francisco, CA",
      nationality: rec.nationality || "United States",
      personalEmail: rec.personal_email || rec.email,
      gender: rec.gender || "Prefer not to say",
      maritalStatus: rec.marital_status || "Single",
      dateOfJoining: rec.joining_date || new Date().toISOString().split("T")[0],
      bankDetails: {
        accountNumber: rec.bank_account_number || "00000000000",
        bankName: rec.bank_name || "Verified Corporate Bank",
        ifscCode: rec.ifsc_code || "BANK0000",
        panNo: rec.pan_number || "PENDING",
        uanNo: rec.uan_number || "PENDING",
        empCode: rec.employee_id,
      },
    },
    salaryStructure,
    leaveBalances: { paid: { total: 24, used: 0 }, sick: { total: 10, used: 0 }, unpaid: { total: 10, used: 0 } },
    documents: [],
    onboarding: { personalInfoDone: true, documentsUploadedDone: true, bankDetailsAddedDone: true, profileCompletedDone: true, policiesAcknowledgedDone: true, assetsAssignedDone: true, hrApprovalDone: true },
  };
}

// Fetch all employees from Supabase
export async function fetchEmployeesFromSupabase(): Promise<Employee[] | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createBrowserClient();
    const { data: employeesData, error: empErr } = await supabase
      .from('employees')
      .select(`
        *,
        companies ( id, name ),
        departments ( id, name ),
        designations ( id, name ),
        branches ( id, name )
      `)
      .order('created_at', { ascending: true });

    if (empErr) {
      console.warn("Supabase fetch employees error:", empErr.message);
      return null;
    }

    if (!employeesData || employeesData.length === 0) {
      return [];
    }

    // Fetch salary structures
    const { data: salariesData } = await supabase
      .from('salary_structures')
      .select('*');

    const salaryMap = new Map();
    if (salariesData) {
      salariesData.forEach((s) => salaryMap.set(s.employee_id, s));
    }

    return employeesData.map((emp) => mapSupabaseRecordToEmployee(emp, salaryMap.get(emp.id)));
  } catch (err) {
    console.error("Failed to fetch employees from Supabase:", err);
    return null;
  }
}

// Ensure Company exists in Supabase for foreign key reference
export async function getOrCreateCompanyIdInSupabase(companyName: string = "HRFlowX Technologies"): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createBrowserClient();
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('name', companyName)
      .maybeSingle();

    if (existingCompany?.id) return existingCompany.id;

    // Get any company
    const { data: anyCompany } = await supabase
      .from('companies')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (anyCompany?.id) return anyCompany.id;

    // Insert fallback company
    const { data: newComp, error: compErr } = await supabase
      .from('companies')
      .insert({ name: companyName, identifier: 'HX' })
      .select('id')
      .single();

    if (compErr) {
      console.warn("Could not create company in Supabase:", compErr.message);
      return null;
    }

    return newComp.id;
  } catch (err) {
    console.error("getOrCreateCompanyIdInSupabase error:", err);
    return null;
  }
}

// Insert Employee to Supabase
export async function createEmployeeInSupabase(
  data: {
    name: string;
    email: string;
    role: UserRole;
    jobTitle: string;
    department: string;
    branch?: string;
    monthlyWage: number;
    phone?: string;
    address?: string;
    location?: string;
    companyName?: string;
  },
  existingEmployeesCount: number = 0
): Promise<Employee | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createBrowserClient();
    const companyId = await getOrCreateCompanyIdInSupabase(data.companyName || "HRFlowX Technologies");

    if (!companyId) return null;

    const currentYear = new Date().getFullYear();
    const generatedEmployeeId = generateEmployeeId(data.companyName || "HRFlowX", data.name, currentYear, existingEmployeesCount + 1);

    const { data: insertedEmp, error: empErr } = await supabase
      .from('employees')
      .insert({
        company_id: companyId,
        employee_id: generatedEmployeeId,
        name: data.name,
        email: data.email,
        role: data.role,
        designation: data.jobTitle,
        phone: data.phone || "+1 (555) 000-0000",
        address: data.address || "San Francisco, CA",
        location: data.location || "San Francisco HQ",
        joining_date: new Date().toISOString().split("T")[0],
        employment_status: "active",
        personal_email: data.email,
        gender: "Prefer not to say",
        marital_status: "Single",
      })
      .select('*')
      .single();

    if (empErr || !insertedEmp) {
      console.error("Error creating employee in Supabase:", empErr?.message);
      return null;
    }

    // Calculate & Insert Salary Structure
    const salary = calculateDynamicSalaryStructure(data.monthlyWage);
    const { data: insertedSalary } = await supabase
      .from('salary_structures')
      .insert({
        company_id: companyId,
        employee_id: insertedEmp.id,
        monthly_wage: salary.monthlyWage,
        yearly_wage: salary.monthlyWage * 12,
        working_days_per_week: salary.workingDaysPerWeek,
        working_hours_per_week: salary.workingHoursPerWeek,
        break_time_minutes: salary.breakTimeMinutes,
        basic_salary: salary.basicSalary,
        hra: salary.houseRentAllowance,
        standard_allowance: salary.standardAllowance,
        performance_bonus: salary.performanceBonus,
        leave_travel_allowance: salary.leaveTravelAllowance,
        fixed_allowance: salary.fixedAllowance,
        employee_pf: salary.employeePf,
        employer_pf: salary.employerPf,
        professional_tax: salary.professionalTax,
        gross_salary: salary.monthlyWage,
        net_salary: salary.netSalary,
      })
      .select('*')
      .single();

    return mapSupabaseRecordToEmployee(insertedEmp, insertedSalary);
  } catch (err) {
    console.error("createEmployeeInSupabase exception:", err);
    return null;
  }
}

// Update Employee Profile
export async function updateEmployeeInSupabase(employeeId: string, updates: Partial<Employee>): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const supabase = createBrowserClient();
    const payload: any = {};

    if (updates.name) payload.name = updates.name;
    if (updates.email) payload.email = updates.email;
    if (updates.phone) payload.phone = updates.phone;
    if (updates.address) payload.address = updates.address;
    if (updates.designation) payload.designation = updates.designation;
    if (updates.role) payload.role = updates.role;
    if (updates.employmentStatus) payload.employment_status = updates.employmentStatus;

    if (Object.keys(payload).length === 0) return true;

    const { error } = await supabase
      .from('employees')
      .update(payload)
      .or(`employee_id.eq.${employeeId},id.eq.${employeeId}`);

    if (error) {
      console.error("updateEmployeeInSupabase error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("updateEmployeeInSupabase exception:", err);
    return false;
  }
}

// Update Private Info in Supabase
export async function updateEmployeePrivateInfoInSupabase(
  employeeId: string,
  info: Partial<PrivateInfo>
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const supabase = createBrowserClient();
    const payload: any = {};

    if (info.dateOfBirth) payload.date_of_birth = info.dateOfBirth;
    if (info.residingAddress) payload.address = info.residingAddress;
    if (info.nationality) payload.nationality = info.nationality;
    if (info.personalEmail) payload.personal_email = info.personalEmail;
    if (info.gender) payload.gender = info.gender;
    if (info.maritalStatus) payload.marital_status = info.maritalStatus;

    if (info.bankDetails) {
      if (info.bankDetails.accountNumber) payload.bank_account_number = info.bankDetails.accountNumber;
      if (info.bankDetails.bankName) payload.bank_name = info.bankDetails.bankName;
      if (info.bankDetails.ifscCode) payload.ifsc_code = info.bankDetails.ifscCode;
      if (info.bankDetails.panNo) payload.pan_number = info.bankDetails.panNo;
      if (info.bankDetails.uanNo) payload.uan_number = info.bankDetails.uanNo;
    }

    const { error } = await supabase
      .from('employees')
      .update(payload)
      .or(`employee_id.eq.${employeeId},id.eq.${employeeId}`);

    if (error) {
      console.error("updateEmployeePrivateInfoInSupabase error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("updateEmployeePrivateInfoInSupabase exception:", err);
    return false;
  }
}

// Update Salary Structure in Supabase
export async function updateEmployeeSalaryInSupabase(
  employeeId: string,
  wage: number,
  days: number = 5,
  hours: number = 40,
  breakTime: number = 60
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const supabase = createBrowserClient();
    const salary = calculateDynamicSalaryStructure(wage, days, hours, breakTime);

    // Get employee UUID
    const { data: emp } = await supabase
      .from('employees')
      .select('id, company_id')
      .or(`employee_id.eq.${employeeId},id.eq.${employeeId}`)
      .single();

    if (!emp) return false;

    const { error } = await supabase
      .from('salary_structures')
      .upsert({
        employee_id: emp.id,
        company_id: emp.company_id,
        monthly_wage: salary.monthlyWage,
        yearly_wage: salary.monthlyWage * 12,
        working_days_per_week: days,
        working_hours_per_week: hours,
        break_time_minutes: breakTime,
        basic_salary: salary.basicSalary,
        hra: salary.houseRentAllowance,
        standard_allowance: salary.standardAllowance,
        performance_bonus: salary.performanceBonus,
        leave_travel_allowance: salary.leaveTravelAllowance,
        fixed_allowance: salary.fixedAllowance,
        employee_pf: salary.employeePf,
        employer_pf: salary.employerPf,
        professional_tax: salary.professionalTax,
        gross_salary: salary.monthlyWage,
        net_salary: salary.netSalary,
      }, { onConflict: 'employee_id' });

    if (error) {
      console.error("updateEmployeeSalaryInSupabase error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("updateEmployeeSalaryInSupabase exception:", err);
    return false;
  }
}

// Deactivate / Delete Employee in Supabase
export async function deleteEmployeeInSupabase(employeeId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const supabase = createBrowserClient();
    const { error } = await supabase
      .from('employees')
      .update({ employment_status: 'deactivated' })
      .or(`employee_id.eq.${employeeId},id.eq.${employeeId}`);

    if (error) {
      console.error("deleteEmployeeInSupabase error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("deleteEmployeeInSupabase exception:", err);
    return false;
  }
}
