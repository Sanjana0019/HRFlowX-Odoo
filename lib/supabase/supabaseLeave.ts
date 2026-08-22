import { createBrowserClient } from './client';
import { isSupabaseConfigured } from '../supabase';
import { LeaveRequest, LeaveType, LeaveStatus } from '@/types';

// Map Supabase SQL leave_requests record to HRFlowX LeaveRequest TS interface
export function mapSupabaseRecordToLeaveRequest(rec: any): LeaveRequest {
  return {
    id: rec.id,
    employeeId: rec.employees?.employee_id || rec.employee_id,
    employeeName: rec.employees?.name || "Employee",
    employeeAvatar: rec.employees?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    department: rec.employees?.departments?.name || rec.employees?.department || "Engineering",
    leaveType: (rec.leave_type as LeaveType) || "paid",
    startDate: rec.start_date,
    endDate: rec.end_date,
    totalDays: Number(rec.total_days || 1),
    reason: rec.reason || "",
    status: (rec.status as LeaveStatus) || "pending",
    appliedDate: rec.created_at ? new Date(rec.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    reviewedBy: rec.reviewer?.name || undefined,
    reviewedDate: rec.reviewed_at ? new Date(rec.reviewed_at).toISOString().split('T')[0] : undefined,
    adminComment: rec.admin_comment || undefined,
  };
}

// Fetch leave requests from Supabase
export async function fetchLeaveRequestsFromSupabase(): Promise<LeaveRequest[] | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('leave_requests')
      .select(`
        *,
        employees!leave_requests_employee_id_fkey ( id, employee_id, name, avatar_url, department ),
        reviewer:employees!leave_requests_reviewed_by_fkey ( id, name )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn("fetchLeaveRequestsFromSupabase error:", error.message);
      return null;
    }

    return (data || []).map(mapSupabaseRecordToLeaveRequest);
  } catch (err) {
    console.error("fetchLeaveRequestsFromSupabase exception:", err);
    return null;
  }
}

// Fetch leave balances for an employee
export async function fetchLeaveBalancesFromSupabase(
  employeeIdOrCode: string
): Promise<{ paid: { total: number; used: number }; sick: { total: number; used: number }; unpaid: { total: number; used: number } } | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createBrowserClient();

    const { data: emp } = await supabase
      .from('employees')
      .select('id')
      .or(`employee_id.eq.${employeeIdOrCode},id.eq.${employeeIdOrCode}`)
      .single();

    if (!emp) return null;

    const { data: balances } = await supabase
      .from('leave_balances')
      .select(`
        *,
        leave_types ( code )
      `)
      .eq('employee_id', emp.id);

    const result = {
      paid: { total: 24, used: 0 },
      sick: { total: 10, used: 0 },
      unpaid: { total: 10, used: 0 },
    };

    if (balances && balances.length > 0) {
      balances.forEach((b) => {
        const code = (b.leave_types?.code || '').toLowerCase();
        if (code.includes('paid') || code.includes('annual')) {
          result.paid = { total: Number(b.total_allocated || 24), used: Number(b.used_days || 0) };
        } else if (code.includes('sick') || code.includes('medical')) {
          result.sick = { total: Number(b.total_allocated || 10), used: Number(b.used_days || 0) };
        } else if (code.includes('unpaid')) {
          result.unpaid = { total: Number(b.total_allocated || 10), used: Number(b.used_days || 0) };
        }
      });
    }

    return result;
  } catch (err) {
    console.error("fetchLeaveBalancesFromSupabase exception:", err);
    return null;
  }
}

// Apply for Leave in Supabase
export async function applyLeaveInSupabase(
  employeeIdOrCode: string,
  data: {
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    totalDays: number;
  }
): Promise<LeaveRequest | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createBrowserClient();

    const { data: emp } = await supabase
      .from('employees')
      .select('id, employee_id, name, avatar_url, department, company_id')
      .or(`employee_id.eq.${employeeIdOrCode},id.eq.${employeeIdOrCode}`)
      .single();

    if (!emp) return null;

    // Get leave type ID matching company & code
    const { data: lType } = await supabase
      .from('leave_types')
      .select('id')
      .eq('company_id', emp.company_id)
      .ilike('code', `%${data.leaveType}%`)
      .maybeSingle();

    // Server-side validation of dates
    const sDate = new Date(data.startDate);
    const eDate = new Date(data.endDate);
    if (eDate < sDate) throw new Error("End date cannot be earlier than start date.");

    const diffDays = Math.max(1, Math.ceil((eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    const { data: inserted, error } = await supabase
      .from('leave_requests')
      .insert({
        employee_id: emp.id,
        leave_type_id: lType?.id || null,
        leave_type: data.leaveType,
        start_date: data.startDate,
        end_date: data.endDate,
        total_days: diffDays,
        reason: data.reason,
        status: 'pending',
      })
      .select('*')
      .single();

    if (error) {
      console.error("applyLeaveInSupabase error:", error.message);
      return null;
    }

    return mapSupabaseRecordToLeaveRequest({ ...inserted, employees: emp });
  } catch (err) {
    console.error("applyLeaveInSupabase exception:", err);
    return null;
  }
}

// Approve Leave Request in Supabase
export async function approveLeaveInSupabase(
  leaveId: string,
  reviewerIdOrCode?: string,
  adminComment: string = "Approved by HR."
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const supabase = createBrowserClient();

    let reviewerUuid: string | null = null;
    if (reviewerIdOrCode) {
      const { data: reviewer } = await supabase
        .from('employees')
        .select('id')
        .or(`employee_id.eq.${reviewerIdOrCode},id.eq.${reviewerIdOrCode}`)
        .maybeSingle();
      if (reviewer?.id) reviewerUuid = reviewer.id;
    }

    // Get the leave request
    const { data: leaveReq } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('id', leaveId)
      .single();

    if (!leaveReq) return false;

    // Prevent double deduction if already approved
    if (leaveReq.status === 'approved') return true;

    // Update leave request status
    const { error: leaveErr } = await supabase
      .from('leave_requests')
      .update({
        status: 'approved',
        reviewed_by: reviewerUuid,
        reviewed_at: new Date().toISOString(),
        admin_comment: adminComment,
      })
      .eq('id', leaveId);

    if (leaveErr) {
      console.error("approveLeaveInSupabase error:", leaveErr.message);
      return false;
    }

    // Update leave balance for the employee if leave_type_id exists or find balance
    if (leaveReq.leave_type_id) {
      const { data: balance } = await supabase
        .from('leave_balances')
        .select('*')
        .eq('employee_id', leaveReq.employee_id)
        .eq('leave_type_id', leaveReq.leave_type_id)
        .maybeSingle();

      if (balance) {
        await supabase
          .from('leave_balances')
          .update({
            used_days: Number(balance.used_days || 0) + Number(leaveReq.total_days || 0),
          })
          .eq('id', balance.id);
      }
    }

    return true;
  } catch (err) {
    console.error("approveLeaveInSupabase exception:", err);
    return false;
  }
}

// Reject Leave Request in Supabase
export async function rejectLeaveInSupabase(
  leaveId: string,
  reviewerIdOrCode?: string,
  adminComment: string = "Declined."
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const supabase = createBrowserClient();

    let reviewerUuid: string | null = null;
    if (reviewerIdOrCode) {
      const { data: reviewer } = await supabase
        .from('employees')
        .select('id')
        .or(`employee_id.eq.${reviewerIdOrCode},id.eq.${reviewerIdOrCode}`)
        .maybeSingle();
      if (reviewer?.id) reviewerUuid = reviewer.id;
    }

    const { error } = await supabase
      .from('leave_requests')
      .update({
        status: 'rejected',
        reviewed_by: reviewerUuid,
        reviewed_at: new Date().toISOString(),
        admin_comment: adminComment,
      })
      .eq('id', leaveId);

    if (error) {
      console.error("rejectLeaveInSupabase error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("rejectLeaveInSupabase exception:", err);
    return false;
  }
}

// Cancel Leave Request in Supabase
export async function cancelLeaveInSupabase(
  leaveId: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const supabase = createBrowserClient();

    const { data: leaveReq } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('id', leaveId)
      .single();

    if (!leaveReq) return false;

    // If approved, reverse deduction
    if (leaveReq.status === 'approved' && leaveReq.leave_type_id) {
      const { data: balance } = await supabase
        .from('leave_balances')
        .select('*')
        .eq('employee_id', leaveReq.employee_id)
        .eq('leave_type_id', leaveReq.leave_type_id)
        .maybeSingle();

      if (balance) {
        const newUsed = Math.max(0, Number(balance.used_days || 0) - Number(leaveReq.total_days || 0));
        await supabase
          .from('leave_balances')
          .update({ used_days: newUsed })
          .eq('id', balance.id);
      }
    }

    const { error } = await supabase
      .from('leave_requests')
      .update({ status: 'cancelled' })
      .eq('id', leaveId);

    if (error) {
      console.error("cancelLeaveInSupabase error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("cancelLeaveInSupabase exception:", err);
    return false;
  }
}
