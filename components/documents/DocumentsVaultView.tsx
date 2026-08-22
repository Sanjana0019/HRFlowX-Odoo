"use client";

import React, { useState, useEffect } from "react";
import {
  FolderLock,
  Plus,
  Download,
  Trash2,
  FileText,
  Upload,
  Search,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DocumentItem } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  fetchDocumentsFromSupabase,
  uploadDocumentToSupabase,
  getSignedDocumentUrlFromSupabase,
  deleteDocumentFromSupabase,
  SupabaseDocumentRecord,
} from "@/lib/supabase/supabaseDocuments";

export function DocumentsVaultView() {
  const { currentEmployee, employees, currentUser } = useStore();
  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "hr";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [category, setCategory] = useState<string>("Employment");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [dbDocs, setDbDocs] = useState<SupabaseDocumentRecord[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);

  // Load document records from Supabase
  const loadDocs = async () => {
    if (isSupabaseConfigured()) {
      setIsLoadingDocs(true);
      const targetEmp = isAdmin ? undefined : currentEmployee?.employeeId;
      const res = await fetchDocumentsFromSupabase(targetEmp);
      if (res) setDbDocs(res);
      setIsLoadingDocs(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, [isAdmin, currentEmployee]);

  // Merge store documents with uploaded documents
  const allDocs: Array<{
    id: string;
    title: string;
    category: string;
    uploadDate: string;
    size: string;
    fileUrl?: string;
    storagePath?: string;
    isCloud?: boolean;
  }> = [
    ...(currentEmployee?.documents || []).map((d) => ({
      id: d.id,
      title: d.title,
      category: d.category,
      uploadDate: d.uploadDate,
      size: d.size,
      fileUrl: d.fileUrl,
      isCloud: false,
    })),
    ...dbDocs.map((d) => ({
      id: d.id,
      title: d.title || d.fileName,
      category: d.category,
      uploadDate: d.uploadDate,
      size: `${Math.round((d.fileSizeBytes || 0) / 1024)} KB`,
      fileUrl: d.publicUrl,
      storagePath: d.storagePath,
      isCloud: true,
    })),
  ];

  const filteredDocs = allDocs.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.category.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!docTitle) setDocTitle(file.name);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !currentEmployee) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const res = await uploadDocumentToSupabase(
        selectedFile,
        docTitle || selectedFile.name,
        category,
        currentEmployee.employeeId
      );

      if (res) {
        setIsModalOpen(false);
        setSelectedFile(null);
        setDocTitle("");
        loadDocs();
      } else {
        setUploadError("Failed to upload document.");
      }
    } catch (err: any) {
      setUploadError(err.message || "An error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (doc: typeof allDocs[0]) => {
    if (doc.isCloud && doc.storagePath) {
      const signedUrl = await getSignedDocumentUrlFromSupabase(doc.storagePath);
      if (signedUrl) {
        window.open(signedUrl, "_blank");
      }
    } else if (doc.fileUrl) {
      window.open(doc.fileUrl, "_blank");
    }
  };

  const handleDelete = async (doc: typeof allDocs[0]) => {
    if (doc.isCloud) {
      if (confirm(`Are you sure you want to delete ${doc.title}?`)) {
        await deleteDocumentFromSupabase(doc.id);
        loadDocs();
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <FolderLock className="h-6 w-6 text-indigo-500" />
            Documents Vault & Storage
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">
            Encrypted repository for employment agreements, certifications, and identification files.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-1.5 font-semibold text-xs shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search documents by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-card)] space-y-4 text-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-[var(--foreground)] truncate block text-sm">
                    {doc.title}
                  </span>
                  <span className="text-[10px] text-[var(--foreground-subtle)] font-mono">
                    {doc.uploadDate} • {doc.size}
                  </span>
                </div>
              </div>

              <Badge variant="purple" size="xs">
                {doc.category}
              </Badge>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
              {doc.isCloud && isAdmin && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => handleDelete(doc)}
                  className="text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                variant="outline"
                size="xs"
                onClick={() => handleDownload(doc)}
                className="gap-1.5 font-semibold text-xs"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Document to Vault"
        description="Securely store and link document to profile."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {uploadError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
              Document Title
            </label>
            <Input
              placeholder="e.g. Identity Verification.pdf"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 w-full px-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              <option value="Identity Proof">Identity Proof</option>
              <option value="Employment">Employment Agreement</option>
              <option value="Payroll">Payroll Statement</option>
              <option value="Policy">Policy Acknowledgment</option>
              <option value="Certificates">Technical Certification</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-[var(--border)] rounded-2xl p-6 text-center text-xs text-[var(--foreground-muted)] bg-[var(--secondary)] relative">
            <Upload className="h-6 w-6 text-indigo-500 mx-auto mb-2" />
            <p className="font-semibold text-[var(--foreground)] mb-1">
              {selectedFile ? selectedFile.name : "Select file to upload"}
            </p>
            <p className="text-[11px] text-[var(--foreground-subtle)] mb-3">
              Supports PDF, PNG, JPG, DOC, DOCX up to 10MB
            </p>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isUploading}>
              Save to Vault →
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
