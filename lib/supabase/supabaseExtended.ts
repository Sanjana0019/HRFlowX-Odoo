import { createBrowserClient } from './client';
import { isSupabaseConfigured } from '../supabase';
import { Goal, Asset, SupportTicket, Announcement, Holiday, AuditLog } from '@/types';

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewerName: string;
  reviewPeriod: string;
  rating: number;
  strengths: string;
  improvements: string;
  comments: string;
  status: string;
  createdDate: string;
}

// ==========================================================
// 1. GOALS
// ==========================================================
export async function fetchGoalsFromSupabase(employeeIdOrCode?: string): Promise<Goal[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createBrowserClient();
    let query = supabase.from('goals').select('*').order('created_at', { ascending: false });

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
      console.warn("fetchGoalsFromSupabase error:", error.message);
      return null;
    }

    return (data || []).map((rec: any) => ({
      id: rec.id,
      employeeId: rec.employee_id,
      employeeName: 'Employee',
      title: rec.title,
      target: rec.target,
      dueDate: rec.due_date,
      progress: rec.progress || 0,
      status: rec.status || 'on_track',
      feedback: rec.feedback || '',
      assignedBy: rec.assigned_by || 'Manager',
    }));
  } catch (err) {
    console.error("fetchGoalsFromSupabase exception:", err);
    return null;
  }
}

export async function createGoalInSupabase(goal: Omit<Goal, 'id'>, employeeIdOrCode: string): Promise<Goal | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createBrowserClient();
    const { data: emp } = await supabase
      .from('employees')
      .select('id')
      .or(`employee_id.eq.${employeeIdOrCode},id.eq.${employeeIdOrCode}`)
      .single();

    if (!emp) return null;

    const { data: inserted, error } = await supabase
      .from('goals')
      .insert({
        employee_id: emp.id,
        title: goal.title,
        target: goal.target,
        due_date: goal.dueDate,
        progress: goal.progress,
        status: goal.status,
        feedback: goal.feedback,
      })
      .select('*')
      .single();

    if (error) {
      console.error("createGoalInSupabase error:", error.message);
      return null;
    }

    return {
      id: inserted.id,
      employeeId: inserted.employee_id,
      employeeName: goal.employeeName || 'Employee',
      title: inserted.title,
      target: inserted.target,
      dueDate: inserted.due_date,
      progress: inserted.progress,
      status: inserted.status,
      feedback: inserted.feedback || '',
      assignedBy: inserted.assigned_by || 'Manager',
    };
  } catch (err) {
    console.error("createGoalInSupabase exception:", err);
    return null;
  }
}

export async function updateGoalProgressInSupabase(goalId: string, progress: number, status?: any): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const supabase = createBrowserClient();
    const updates: any = { progress, updated_at: new Date().toISOString() };
    if (status) updates.status = status;

    const { error } = await supabase.from('goals').update(updates).eq('id', goalId);
    if (error) {
      console.error("updateGoalProgressInSupabase error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("updateGoalProgressInSupabase exception:", err);
    return false;
  }
}

// ==========================================================
// 2. PERFORMANCE REVIEWS
// ==========================================================
export async function fetchPerformanceReviewsFromSupabase(employeeIdOrCode?: string): Promise<PerformanceReview[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createBrowserClient();
    let query = supabase.from('performance_reviews').select('*').order('created_at', { ascending: false });

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
      console.warn("fetchPerformanceReviewsFromSupabase error:", error.message);
      return null;
    }

    return (data || []).map((rec: any) => ({
      id: rec.id,
      employeeId: rec.employee_id,
      employeeName: 'Employee',
      reviewerName: 'Manager/HR',
      reviewPeriod: rec.review_period,
      rating: parseFloat(rec.rating || 0),
      strengths: rec.strengths || '',
      improvements: rec.improvements || '',
      comments: rec.comments || '',
      status: rec.status || 'draft',
      createdDate: rec.created_at ? rec.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    }));
  } catch (err) {
    console.error("fetchPerformanceReviewsFromSupabase exception:", err);
    return null;
  }
}

// ==========================================================
// 3. ASSETS
// ==========================================================
export async function fetchAssetsFromSupabase(): Promise<Asset[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.from('assets').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn("fetchAssetsFromSupabase error:", error.message);
      return null;
    }

    return (data || []).map((rec: any) => ({
      id: rec.id,
      assetId: rec.asset_id,
      assetName: rec.asset_name,
      category: rec.category || 'Peripheral',
      serialNumber: rec.serial_number,
      employeeId: rec.employee_id || '',
      employeeName: rec.employee_id ? 'Assigned' : 'Unassigned',
      assignedDate: rec.assigned_date || '',
      status: rec.status || 'available',
    }));
  } catch (err) {
    console.error("fetchAssetsFromSupabase exception:", err);
    return null;
  }
}

export async function assignAssetInSupabase(assetId: string, employeeIdOrCode: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const supabase = createBrowserClient();
    const { data: emp } = await supabase
      .from('employees')
      .select('id')
      .or(`employee_id.eq.${employeeIdOrCode},id.eq.${employeeIdOrCode}`)
      .single();

    if (!emp) return false;

    const { error } = await supabase
      .from('assets')
      .update({
        employee_id: emp.id,
        assigned_date: new Date().toISOString().split('T')[0],
        status: 'assigned',
      })
      .or(`id.eq.${assetId},asset_id.eq.${assetId}`);

    if (error) {
      console.error("assignAssetInSupabase error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("assignAssetInSupabase exception:", err);
    return false;
  }
}

// ==========================================================
// 4. SUPPORT REQUESTS
// ==========================================================
export async function fetchSupportTicketsFromSupabase(): Promise<SupportTicket[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.from('support_requests').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn("fetchSupportTicketsFromSupabase error:", error.message);
      return null;
    }

    return (data || []).map((rec: any) => ({
      id: rec.id,
      employeeId: rec.employee_id,
      employeeName: 'Employee',
      subject: rec.subject,
      category: (rec.category as any) || 'General HR',
      priority: rec.priority || 'medium',
      message: rec.description || rec.subject,
      status: rec.status || 'open',
      createdAt: rec.created_at ? rec.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      hrReply: rec.resolution_notes || '',
    }));
  } catch (err) {
    console.error("fetchSupportTicketsFromSupabase exception:", err);
    return null;
  }
}

export async function createSupportTicketInSupabase(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>, employeeIdOrCode: string): Promise<SupportTicket | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createBrowserClient();
    const { data: emp } = await supabase
      .from('employees')
      .select('id, company_id')
      .or(`employee_id.eq.${employeeIdOrCode},id.eq.${employeeIdOrCode}`)
      .single();

    if (!emp) return null;

    const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

    const { data: inserted, error } = await supabase
      .from('support_requests')
      .insert({
        ticket_id: ticketId,
        company_id: emp.company_id,
        employee_id: emp.id,
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        status: 'open',
        description: ticket.message,
      })
      .select('*')
      .single();

    if (error) {
      console.error("createSupportTicketInSupabase error:", error.message);
      return null;
    }

    return {
      id: inserted.id,
      employeeId: inserted.employee_id,
      employeeName: ticket.employeeName || 'Employee',
      subject: inserted.subject,
      category: inserted.category as any,
      priority: inserted.priority,
      message: inserted.description,
      status: inserted.status,
      createdAt: inserted.created_at ? inserted.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    };
  } catch (err) {
    console.error("createSupportTicketInSupabase exception:", err);
    return null;
  }
}

export async function replySupportTicketInSupabase(ticketId: string, reply: string, status: any): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const supabase = createBrowserClient();
    const { error } = await supabase
      .from('support_requests')
      .update({
        resolution_notes: reply,
        status: status || 'in_progress',
        updated_at: new Date().toISOString(),
      })
      .or(`id.eq.${ticketId},ticket_id.eq.${ticketId}`);

    if (error) {
      console.error("replySupportTicketInSupabase error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("replySupportTicketInSupabase exception:", err);
    return false;
  }
}

// ==========================================================
// 5. ANNOUNCEMENTS
// ==========================================================
export async function fetchAnnouncementsFromSupabase(): Promise<Announcement[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.warn("fetchAnnouncementsFromSupabase error:", error.message);
      return null;
    }

    return (data || []).map((rec: any) => ({
      id: rec.id,
      title: rec.title,
      content: rec.content,
      priority: rec.priority || 'medium',
      publishDate: rec.published_at ? rec.published_at.split('T')[0] : new Date().toISOString().split('T')[0],
      expiryDate: rec.expires_at ? rec.expires_at.split('T')[0] : undefined,
      status: 'active',
      authorName: 'Leadership',
    }));
  } catch (err) {
    console.error("fetchAnnouncementsFromSupabase exception:", err);
    return null;
  }
}

// ==========================================================
// 6. HOLIDAYS
// ==========================================================
export async function fetchHolidaysFromSupabase(): Promise<Holiday[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.from('holidays').select('*').order('date', { ascending: true });
    if (error) {
      console.warn("fetchHolidaysFromSupabase error:", error.message);
      return null;
    }

    return (data || []).map((rec: any) => ({
      id: rec.id,
      name: rec.name,
      date: rec.date,
      dayOfWeek: rec.day_of_week || 'Holiday',
      type: rec.is_optional ? 'Optional Holiday' : 'Company Holiday',
      description: rec.description || rec.name,
    }));
  } catch (err) {
    console.error("fetchHolidaysFromSupabase exception:", err);
    return null;
  }
}

// ==========================================================
// 7. AUDIT LOGS
// ==========================================================
export async function fetchAuditLogsFromSupabase(): Promise<AuditLog[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(50);
    if (error) {
      console.warn("fetchAuditLogsFromSupabase error:", error.message);
      return null;
    }

    return (data || []).map((rec: any) => ({
      id: rec.id,
      user: rec.user_name || 'User',
      userRole: (rec.user_role as any) || 'employee',
      action: rec.action,
      resource: rec.resource_type || 'System',
      target: rec.target || 'General',
      description: rec.description || rec.action,
      timestamp: rec.timestamp ? new Date(rec.timestamp).toLocaleString() : 'Just now',
      type: (rec.resource_type || 'system').toLowerCase() as any,
    }));
  } catch (err) {
    console.error("fetchAuditLogsFromSupabase exception:", err);
    return null;
  }
}

export async function createAuditLogInSupabase(log: Omit<AuditLog, 'id' | 'timestamp'>, employeeIdOrCode?: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const supabase = createBrowserClient();
    let empId: string | null = null;
    let companyId: string | null = null;

    if (employeeIdOrCode) {
      const { data: emp } = await supabase
        .from('employees')
        .select('id, company_id')
        .or(`employee_id.eq.${employeeIdOrCode},id.eq.${employeeIdOrCode}`)
        .maybeSingle();

      if (emp) {
        empId = emp.id;
        companyId = emp.company_id;
      }
    }

    const { error } = await supabase.from('audit_logs').insert({
      actor_id: empId,
      company_id: companyId,
      user_name: log.user || 'User',
      user_role: log.userRole || 'employee',
      action: log.action,
      resource_type: log.resource || log.type || 'system',
      target: log.target || 'General',
      description: log.description || `${log.action} on ${log.target}`,
    });

    if (error) {
      console.error("createAuditLogInSupabase error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("createAuditLogInSupabase exception:", err);
    return false;
  }
}
