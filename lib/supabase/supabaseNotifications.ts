import { createBrowserClient } from './client';
import { isSupabaseConfigured } from '../supabase';
import { NotificationItem, NotificationType } from '@/types';

// Map Supabase SQL notification record to HRFlowX NotificationItem TS interface
export function mapSupabaseRecordToNotification(rec: any): NotificationItem {
  let mappedType: NotificationType = "system";
  const rawType = (rec.type || "").toLowerCase();

  if (rawType.includes("leave_approved") || rawType.includes("leave_approved")) mappedType = "leave_approved";
  else if (rawType.includes("leave_rejected")) mappedType = "leave_rejected";
  else if (rawType.includes("leave")) mappedType = "leave_requested";
  else if (rawType.includes("payroll")) mappedType = "payroll_ready";
  else if (rawType.includes("attendance")) mappedType = "attendance_alert";

  return {
    id: rec.id,
    type: mappedType,
    title: rec.title || "Notification",
    message: rec.message || "",
    timestamp: rec.created_at ? new Date(rec.created_at).toLocaleString() : "Just now",
    read: Boolean(rec.is_read),
    targetRole: "employee",
  };
}

// Fetch notifications for an employee from Supabase
export async function fetchNotificationsFromSupabase(
  employeeIdOrCode?: string
): Promise<NotificationItem[] | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createBrowserClient();
    let query = supabase
      .from('notifications')
      .select('*')
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
      console.warn("fetchNotificationsFromSupabase error:", error.message);
      return null;
    }

    return (data || []).map(mapSupabaseRecordToNotification);
  } catch (err) {
    console.error("fetchNotificationsFromSupabase exception:", err);
    return null;
  }
}

// Create notification in Supabase
export async function createNotificationInSupabase(
  employeeIdOrCode: string,
  title: string,
  message: string,
  type: string = 'info',
  linkUrl?: string
): Promise<NotificationItem | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createBrowserClient();

    const { data: emp } = await supabase
      .from('employees')
      .select('id')
      .or(`employee_id.eq.${employeeIdOrCode},id.eq.${employeeIdOrCode}`)
      .single();

    if (!emp) return null;

    // Check for duplicate pending notifications within last 10 seconds
    const { data: dupes } = await supabase
      .from('notifications')
      .select('id')
      .eq('employee_id', emp.id)
      .eq('title', title)
      .gt('created_at', new Date(Date.now() - 10000).toISOString());

    if (dupes && dupes.length > 0) {
      // Prevent duplicate notification creation
      return null;
    }

    const { data: inserted, error } = await supabase
      .from('notifications')
      .insert({
        employee_id: emp.id,
        title,
        message,
        type: type as any,
        link_url: linkUrl,
        is_read: false,
      })
      .select('*')
      .single();

    if (error) {
      console.error("createNotificationInSupabase error:", error.message);
      return null;
    }

    return mapSupabaseRecordToNotification(inserted);
  } catch (err) {
    console.error("createNotificationInSupabase exception:", err);
    return null;
  }
}

// Mark single notification as read
export async function markNotificationAsReadInSupabase(
  notificationId: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const supabase = createBrowserClient();
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error("markNotificationAsReadInSupabase error:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("markNotificationAsReadInSupabase exception:", err);
    return false;
  }
}

// Mark all notifications as read for an employee
export async function markAllNotificationsAsReadInSupabase(
  employeeIdOrCode: string
): Promise<boolean> {
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
      .from('notifications')
      .update({ is_read: true })
      .eq('employee_id', emp.id)
      .eq('is_read', false);

    if (error) {
      console.error("markAllNotificationsAsReadInSupabase error:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("markAllNotificationsAsReadInSupabase exception:", err);
    return false;
  }
}

// Supabase Realtime subscription for notifications
export function subscribeToNotificationsInSupabase(
  employeeIdOrCode: string,
  onNewNotification: (notification: NotificationItem) => void
) {
  if (!isSupabaseConfigured()) return () => {};

  try {
    const supabase = createBrowserClient();
    const channel = supabase
      .channel(`notifications_realtime_${employeeIdOrCode}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          if (payload.new) {
            const mapped = mapSupabaseRecordToNotification(payload.new);
            onNewNotification(mapped);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.error("subscribeToNotificationsInSupabase exception:", err);
    return () => {};
  }
}
