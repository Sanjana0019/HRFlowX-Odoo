import { createBrowserClient } from './client';
import { isSupabaseConfigured } from '../supabase';
import { SalarySlip, DynamicSalaryStructure } from '@/types';
import { calculateDynamicSalaryStructure } from '@/lib/utils';

// Map Supabase SQL payroll record to HRFlowX SalarySlip TS interface
export function mapSupabaseRecordToSalarySlip(rec: any): SalarySlip {
  const emp = rec.employees || {};
  let status: "paid" | "processed" | "draft" = "paid";
  if (rec.status === "processed" || rec.status === "processing") status = "processed";
  else if (rec.status === "draft" || rec.status === "pending") status = "draft";
  else if (rec.status === "paid") status = "paid";

  const grossEarnings = Number(rec.gross_earnings || 0);

  return {
    id: rec.id,
    employeeId: emp.employee_id || rec.employee_id,
    employeeName: emp.name || "Employee",
    department: emp.departments?.name || emp.department || "Engineering",
    designation: emp.designations?.title || emp.designation || "Software Engineer",
    month: rec.month || "August 2026",
    payPeriod: rec.pay_period || rec.month || "2026-08",
    paymentDate: rec.payment_date || (rec.created_at ? new Date(rec.created_at).toISOString().split('T')[0] : "2026-08-31"),
    monthlyWage: grossEarnings,
    basicSalary: Number(rec.basic_salary || 0),
    hra: Number(rec.hra || 0),
    standardAllowance: Number(rec.standard_allowance || 0),
    performanceBonus: Number(rec.performance_bonus || 0),
    lta: Number(rec.lta || 0),
    fixedAllowance: Number(rec.fixed_allowance || 0),
    pfDeduction: Number(rec.pf_deduction || 0),
    taxDeduction: Number(rec.tax_deduction || 0),
    unpaidLeaveDeduction: Number(rec.unpaid_leave_deduction || 0),
    grossEarnings,
    totalDeductions: Number(rec.total_deductions || 0),
    netPay: Number(rec.net_pay || 0),
    status,
  };
}

// Fetch all salary slips / payroll for employee or admin from Supabase
export async function fetchSalarySlipsFromSupabase(
  employeeIdOrCode?: string
): Promise<SalarySlip[] | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createBrowserClient();
    let query = supabase
      .from('payroll')
      .select(`
        *,
        employees ( id, employee_id, name, department, designation )
      `)
      .order('created_at', { ascending: false });

    if (employeeIdOrCode) {
      const { data: emp } = await supabase
        .from('employees')
        .select('id')
        .or(`employee_id.eq.${employeeIdOrCode},id.eq.${employeeIdOrCode}`)
        .maybeSingle();

      if (emp?.id) {
        query = query.eq('employee_id', emp.id);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.warn("fetchSalarySlipsFromSupabase error:", error.message);
      return null;
    }

    return (data || []).map(mapSupabaseRecordToSalarySlip);
  } catch (err) {
    console.error("fetchSalarySlipsFromSupabase exception:", err);
    return null;
  }
}

// Fetch salary structure for an employee from Supabase
export async function fetchSalaryStructureFromSupabase(
  employeeIdOrCode: string
): Promise<DynamicSalaryStructure | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createBrowserClient();

    const { data: emp } = await supabase
      .from('employees')
      .select('id')
      .or(`employee_id.eq.${employeeIdOrCode},id.eq.${employeeIdOrCode}`)
      .single();

    if (!emp) return null;

    const { data: struct, error } = await supabase
      .from('salary_structures')
      .select('*')
      .eq('employee_id', emp.id)
      .maybeSingle();

    if (error || !struct) return null;

    const monthlyWage = Number(struct.monthly_wage || struct.gross_salary || 0);
    return calculateDynamicSalaryStructure(monthlyWage);
  } catch (err) {
    console.error("fetchSalaryStructureFromSupabase exception:", err);
    return null;
  }
}

// Generate / Process Payroll in Supabase
export async function processPayrollInSupabase(
  employeeIdOrCode: string,
  month: string = "August 2026"
): Promise<SalarySlip | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createBrowserClient();

    const { data: emp } = await supabase
      .from('employees')
      .select('id, company_id, employee_id, name, department, designation')
      .or(`employee_id.eq.${employeeIdOrCode},id.eq.${employeeIdOrCode}`)
      .single();

    if (!emp) return null;

    // Get active salary structure
    const struct = await fetchSalaryStructureFromSupabase(emp.id);
    if (!struct) return null;

    const basicSalary = struct.basicSalary;
    const hra = struct.houseRentAllowance;
    const standardAllowance = struct.standardAllowance;
    const performanceBonus = struct.performanceBonus;
    const lta = struct.leaveTravelAllowance;
    const fixedAllowance = struct.fixedAllowance;
    const pfDeduction = struct.employeePf;
    const taxDeduction = struct.professionalTax;
    const grossEarnings = struct.grossSalary;
    const totalDeductions = pfDeduction + taxDeduction;
    const netPay = struct.netSalary;

    const { data: inserted, error } = await supabase
      .from('payroll')
      .insert({
        employee_id: emp.id,
        company_id: emp.company_id,
        month,
        year: 2026,
        basic_salary: basicSalary,
        hra,
        standard_allowance: standardAllowance,
        performance_bonus: performanceBonus,
        lta,
        fixed_allowance: fixedAllowance,
        pf_deduction: pfDeduction,
        tax_deduction: taxDeduction,
        gross_earnings: grossEarnings,
        total_deductions: totalDeductions,
        net_pay: netPay,
        status: 'paid',
        payment_date: new Date().toISOString().split('T')[0],
      })
      .select('*')
      .single();

    if (error) {
      console.error("processPayrollInSupabase error:", error.message);
      return null;
    }

    return mapSupabaseRecordToSalarySlip({ ...inserted, employees: emp });
  } catch (err) {
    console.error("processPayrollInSupabase exception:", err);
    return null;
  }
}
