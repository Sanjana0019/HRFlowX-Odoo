import { createBrowserClient } from './client';
import { isSupabaseConfigured } from '../supabase';
import { DocumentItem } from '@/types';

export interface SupabaseDocumentRecord {
  id: string;
  title: string;
  category: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  storagePath: string;
  publicUrl?: string;
  uploadDate: string;
  ownerName?: string;
  ownerId?: string;
  employeeId?: string;
}

// Map Supabase SQL documents record to DocumentItem / SupabaseDocumentRecord
export function mapSupabaseRecordToDocumentItem(rec: any): SupabaseDocumentRecord {
  const emp = rec.employees || {};
  return {
    id: rec.id,
    title: rec.title || rec.file_name,
    category: rec.category || "Other",
    fileName: rec.file_name,
    fileSizeBytes: Number(rec.file_size_bytes || 0),
    mimeType: rec.mime_type || "application/pdf",
    storagePath: rec.storage_path,
    publicUrl: rec.public_url,
    uploadDate: rec.created_at ? new Date(rec.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    ownerName: emp.name || "Employee",
    ownerId: emp.employee_id || rec.employee_id,
    employeeId: rec.employee_id,
  };
}

const BUCKET_NAME = 'employee-documents';

// Ensure storage bucket exists
async function ensureBucketExists(supabase: any) {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    if (buckets && !buckets.some((b: any) => b.name === BUCKET_NAME)) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
    }
  } catch (err) {
    console.warn("Storage bucket check warning:", err);
  }
}

// Fetch documents metadata from Supabase PostgreSQL
export async function fetchDocumentsFromSupabase(
  employeeIdOrCode?: string
): Promise<SupabaseDocumentRecord[] | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createBrowserClient();
    let query = supabase
      .from('documents')
      .select(`
        *,
        employees ( id, employee_id, name, department )
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
      console.warn("fetchDocumentsFromSupabase error:", error.message);
      return null;
    }

    return (data || []).map(mapSupabaseRecordToDocumentItem);
  } catch (err) {
    console.error("fetchDocumentsFromSupabase exception:", err);
    return null;
  }
}

// Upload document file to Supabase Storage + metadata to PostgreSQL
export async function uploadDocumentToSupabase(
  file: File,
  title: string,
  category: string,
  employeeIdOrCode: string
): Promise<SupabaseDocumentRecord | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createBrowserClient();
    await ensureBucketExists(supabase);

    // Resolve employee & company
    const { data: emp } = await supabase
      .from('employees')
      .select('id, company_id, employee_id, name')
      .or(`employee_id.eq.${employeeIdOrCode},id.eq.${employeeIdOrCode}`)
      .single();

    if (!emp) return null;

    // Validate file type & size (max 10MB)
    const allowedMimeTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size exceeds 10MB limit.");
    }

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `company/${emp.company_id}/employees/${emp.id}/${Date.now()}_${sanitizedFileName}`;

    // Upload to Supabase Storage
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadErr) {
      console.error("uploadDocumentToSupabase storage error:", uploadErr.message);
      return null;
    }

    // Insert metadata into PostgreSQL
    const { data: inserted, error: dbErr } = await supabase
      .from('documents')
      .insert({
        company_id: emp.company_id,
        employee_id: emp.id,
        title: title || file.name,
        category,
        file_name: file.name,
        file_size_bytes: file.size,
        mime_type: file.type || 'application/pdf',
        storage_path: storagePath,
        uploaded_by: emp.id,
      })
      .select('*')
      .single();

    if (dbErr) {
      console.error("uploadDocumentToSupabase db error:", dbErr.message);
      return null;
    }

    return mapSupabaseRecordToDocumentItem({ ...inserted, employees: emp });
  } catch (err) {
    console.error("uploadDocumentToSupabase exception:", err);
    return null;
  }
}

// Generate signed temporary download URL for private document
export async function getSignedDocumentUrlFromSupabase(
  storagePath: string,
  expiresInSeconds: number = 3600
): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(storagePath, expiresInSeconds);

    if (error || !data) {
      console.warn("getSignedDocumentUrlFromSupabase error:", error?.message);
      return null;
    }

    return data.signedUrl;
  } catch (err) {
    console.error("getSignedDocumentUrlFromSupabase exception:", err);
    return null;
  }
}

// Delete document from Storage & PostgreSQL
export async function deleteDocumentFromSupabase(
  documentId: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const supabase = createBrowserClient();

    // Get document metadata first
    const { data: doc } = await supabase
      .from('documents')
      .select('storage_path')
      .eq('id', documentId)
      .single();

    if (doc?.storage_path) {
      // Remove from Storage
      await supabase.storage.from(BUCKET_NAME).remove([doc.storage_path]);
    }

    // Delete record from PostgreSQL
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (error) {
      console.error("deleteDocumentFromSupabase error:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("deleteDocumentFromSupabase exception:", err);
    return false;
  }
}
