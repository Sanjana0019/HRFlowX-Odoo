import { createBrowserClient } from './client';
import { isSupabaseConfigured } from '../supabase';
import { AttendanceRecord, AttendanceStatus, AttendanceCorrectionRequest } from '@/types';

// Map Supabase SQL attendance record to HRFlowX AttendanceRecord TS interface
export function mapSupabaseRecordToAttendance(rec: any): AttendanceRecord {
  return {
    id: rec.id,
    employeeId: rec.employees?.employee_id || rec.employee_id,
    employeeName: rec.employees?.name || "Employee",
    employeeAvatar: rec.employees?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    date: rec.date,
    checkIn: rec.check_in_time || (rec.check_in ? new Date(rec.check_in).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : undefined),
    checkOut: rec.check_out_time || (rec.check_out ? new Date(rec.check_out).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : undefined),
    status: (rec.status as AttendanceStatus) || 'present',
    workingHours: rec.working_hours ? `${Math.floor(Number(rec.working_hours))}h ${Math.round((Number(rec.working_hours) % 1) * 60)}m` : '0h 00m',
    extraHours: rec.extra_hours ? `${Number(rec.extra_hours)}h` : '0h',
    breakDuration: rec.break_duration || '0m',
    notes: rec.notes || undefined,
    location: (rec.location as "Office" | "Remote" | "Client Site") || "Office",
  };
}

// Map Supabase SQL attendance_requests record to HRFlowX AttendanceCorrectionRequest interface
export function mapSupabaseRecordToAttendanceRequest(rec: any): AttendanceCorrectionRequest {
  return {
    id: rec.id,
    employeeId: rec.employees?.employee_id || rec.employee_id,
    employeeName: rec.employees?.name || "Employee",
    employeeAvatar: rec.employees?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    department: rec.employees?.departments?.name || rec.employees?.department || "Engineering",
    date: rec.date,
    requestedCheckIn: rec.requested_check_in,
    requestedCheckOut: rec.requested_check_out,
    reason: rec.reason,
    status: rec.status || 'pending',
    appliedDate: rec.created_at ? new Date(rec.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    reviewedBy: rec.reviewer?.name || undefined,
    reviewedDate: rec.reviewed_at ? new Date(rec.reviewed_at).toISOString().split('T')[0] : undefined,
    adminComment: rec.admin_comment || undefined,
  };
}

// Fetch all attendance records from Supabase
export async function fetchAttendanceRecordsFromSupabase(): Promise<AttendanceRecord[] | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        employees ( id, employee_id, name, avatar_url, department )
      `)
      .order('date', { ascending: false });

    if (error) {
      console.warn("fetchAttendanceRecordsFromSupabase error:", error.message);
      return null;
    }

    return (data || []).map(mapSupabaseRecordToAttendance);
  } catch (err) {
    console.error("fetchAttendanceRecordsFromSupabase exception:", err);
    return null;
  }
}

// Fetch attendance requests from Supabase
export async function fetchAttendanceRequestsFromSupabase(): Promise<AttendanceCorrectionRequest[] | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('attendance_requests')
      .select(`
        *,
        employees!attendance_requests_employee_id_fkey ( id, employee_id, name, avatar_url, department ),
        reviewer:employees!attendance_requests_reviewed_by_fkey ( id, name )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn("fetchAttendanceRequestsFromSupabase error:", error.message);
      return null;
    }

    return (data || []).map(mapSupabaseRecordToAttendanceRequest);
  } catch (err) {
    console.error("fetchAttendanceRequestsFromSupabase exception:", err);
    return null;
  }
}

// Punch In
export async function punchInInSupabase(
  employeeIdOrCode: string,
  location: "Office" | "Remote" = "Office"
): Promise<AttendanceRecord | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createBrowserClient();
    const todayStr = new Date().toISOString().split('T')[0];

    // Resolve employee internal UUID & company ID
    const { data: emp } = await supabase
      .from('employees')
      .select('id, company_id, employee_id, name, avatar_url')
      .or(`employee_id.eq.${employeeIdOrCode},id.eq.${employeeIdOrCode}`)
      .single();

    if (!emp) return null;

    // Check if today's record already exists
    const { data: existing } = await supabase
      .from('attendance')
      .select('*')
      .eq('employee_id', emp.id)
      .eq('date', todayStr)
      .maybeSingle();

    if (existing && existing.check_in) {
      // Already checked in
      return mapSupabaseRecordToAttendance({ ...existing, employees: emp });
    }

    const now = new Date();
    const checkInTimeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    if (existing) {
      // Update existing record
      const { data: updated, error: updateErr } = await supabase
        .from('attendance')
        .update({
          check_in: now.toISOString(),
          check_in_time: checkInTimeStr,
          status: 'present',
          location,
        })
        .eq('id', existing.id)
        .select('*')
        .single();

      if (updateErr) {
        console.error("punchInInSupabase update error:", updateErr.message);
        return null;
      }

      return mapSupabaseRecordToAttendance({ ...updated, employees: emp });
    } else {
      // Insert new record
      const { data: inserted, error: insertErr } = await supabase
        .from('attendance')
        .insert({
          employee_id: emp.id,
          company_id: emp.company_id,
          date: todayStr,
          check_in: now.toISOString(),
          check_in_time: checkInTimeStr,
          status: 'present',
          working_hours: 0,
          extra_hours: 0,
          location,
        })
        .select('*')
        .single();

      if (insertErr) {
        console.error("punchInInSupabase insert error:", insertErr.message);
        return null;
      }

      return mapSupabaseRecordToAttendance({ ...inserted, employees: emp });
    }
  } catch (err) {
    console.error("punchInInSupabase exception:", err);
    return null;
  }
}

// Punch Out
export async function punchOutInSupabase(
  employeeIdOrCode: string
): Promise<AttendanceRecord | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createBrowserClient();
    const todayStr = new Date().toISOString().split('T')[0];

    // Resolve employee internal UUID
    const { data: emp } = await supabase
      .from('employees')
      .select('id, employee_id, name, avatar_url')
      .or(`employee_id.eq.${employeeIdOrCode},id.eq.${employeeIdOrCode}`)
      .single();

    if (!emp) return null;

    // Find today's attendance record
    const { data: todayRec } = await supabase
      .from('attendance')
      .select('*')
      .eq('employee_id', emp.id)
      .eq('date', todayStr)
      .single();

    if (!todayRec || !todayRec.check_in) return null;

    const now = new Date();
    const checkOutTimeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Calculate work duration server/app side
    const checkInDate = new Date(todayRec.check_in);
    const diffMs = Math.max(0, now.getTime() - checkInDate.getTime());
    const workingHoursNum = Number((diffMs / (1000 * 60 * 60)).toFixed(2));
    const extraHoursNum = workingHoursNum > 8 ? Number((workingHoursNum - 8).toFixed(2)) : 0;

    const { data: updated, error: updateErr } = await supabase
      .from('attendance')
      .update({
        check_out: now.toISOString(),
        check_out_time: checkOutTimeStr,
        working_hours: workingHoursNum,
        extra_hours: extraHoursNum,
      })
      .eq('id', todayRec.id)
      .select('*')
      .single();

    if (updateErr) {
      console.error("punchOutInSupabase error:", updateErr.message);
      return null;
    }

    return mapSupabaseRecordToAttendance({ ...updated, employees: emp });
  } catch (err) {
    console.error("punchOutInSupabase exception:", err);
    return null;
  }
}

// Raise Attendance Correction Request
export async function createAttendanceCorrectionRequestInSupabase(
  employeeIdOrCode: string,
  data: {
    date: string;
    requestedCheckIn: string;
    requestedCheckOut: string;
    reason: string;
  }
): Promise<AttendanceCorrectionRequest | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createBrowserClient();

    const { data: emp } = await supabase
      .from('employees')
      .select('id, employee_id, name, avatar_url, department')
      .or(`employee_id.eq.${employeeIdOrCode},id.eq.${employeeIdOrCode}`)
      .single();

    if (!emp) return null;

    const { data: inserted, error } = await supabase
      .from('attendance_requests')
      .insert({
        employee_id: emp.id,
        date: data.date,
        requested_check_in: data.requestedCheckIn,
        requested_check_out: data.requestedCheckOut,
        reason: data.reason,
        status: 'pending',
      })
      .select('*')
      .single();

    if (error) {
      console.error("createAttendanceCorrectionRequestInSupabase error:", error.message);
      return null;
    }

    return mapSupabaseRecordToAttendanceRequest({ ...inserted, employees: emp });
  } catch (err) {
    console.error("createAttendanceCorrectionRequestInSupabase exception:", err);
    return null;
  }
}

// Approve Attendance Correction Request
export async function approveAttendanceCorrectionRequestInSupabase(
  requestId: string,
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

    // Get the request
    const { data: req } = await supabase
      .from('attendance_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (!req) return false;

    // Update request status
    const { error: reqErr } = await supabase
      .from('attendance_requests')
      .update({
        status: 'approved',
        reviewed_by: reviewerUuid,
        reviewed_at: new Date().toISOString(),
        admin_comment: adminComment,
      })
      .eq('id', requestId);

    if (reqErr) {
      console.error("approveAttendanceCorrectionRequestInSupabase error:", reqErr.message);
      return false;
    }

    // Update or insert actual attendance row
    const { data: emp } = await supabase
      .from('employees')
      .select('company_id')
      .eq('id', req.employee_id)
      .single();

    const { data: existingAttendance } = await supabase
      .from('attendance')
      .select('id')
      .eq('employee_id', req.employee_id)
      .eq('date', req.date)
      .maybeSingle();

    if (existingAttendance) {
      await supabase
        .from('attendance')
        .update({
          check_in_time: req.requested_check_in,
          check_out_time: req.requested_check_out,
          status: 'present',
          notes: `Correction Approved: ${adminComment}`,
        })
        .eq('id', existingAttendance.id);
    } else {
      await supabase
        .from('attendance')
        .insert({
          employee_id: req.employee_id,
          company_id: emp?.company_id,
          date: req.date,
          check_in_time: req.requested_check_in,
          check_out_time: req.requested_check_out,
          status: 'present',
          working_hours: 8,
          notes: `Correction Approved: ${adminComment}`,
        });
    }

    return true;
  } catch (err) {
    console.error("approveAttendanceCorrectionRequestInSupabase exception:", err);
    return false;
  }
}

// Reject Attendance Correction Request
export async function rejectAttendanceCorrectionRequestInSupabase(
  requestId: string,
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
      .from('attendance_requests')
      .update({
        status: 'rejected',
        reviewed_by: reviewerUuid,
        reviewed_at: new Date().toISOString(),
        admin_comment: adminComment,
      })
      .eq('id', requestId);

    if (error) {
      console.error("rejectAttendanceCorrectionRequestInSupabase error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("rejectAttendanceCorrectionRequestInSupabase exception:", err);
    return false;
  }
}
