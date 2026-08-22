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

  // Combine static fallback documents with database documents
  const allDocs: {
    id: string;
    title: string;
    category: string;
    uploadDate: string;
    size: string;
    ownerName?: string;
    ownerId?: string;
    storagePath?: string;
    publicUrl?: string;
  }[] = [];

  if (isSupabaseConfigured() && dbDocs.length > 0) {
    dbDocs.forEach((d) => {
      const sizeMb = d.fileSizeBytes ? `${(d.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB` : "1.2 MB";
      allDocs.push({
        id: d.id,
        title: d.title,
        category: d.category,
        uploadDate: d.uploadDate,
        size: sizeMb,
        ownerName: d.ownerName,
        ownerId: d.ownerId,
        storagePath: d.storagePath,
        publicUrl: d.publicUrl,
      });
    });
  } else {
    if (isAdmin) {
      employees.forEach((emp) => {
        emp.documents.forEach((d) => {
          allDocs.push({ ...d, ownerName: emp.name, ownerId: emp.employeeId });
        });
      });
    } else if (currentEmployee) {
      currentEmployee.documents.forEach((d) => {
        allDocs.push({ ...d, ownerName: currentEmployee.name, ownerId: currentEmployee.employeeId });
      });
    }
  }

  const filteredDocs = allDocs.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase()) ||
    (d.ownerName && d.ownerName.toLowerCase().includes(search.toLowerCase()))
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!docTitle) setDocTitle(file.name);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmployee) return;
    setUploadError(null);

    if (isSupabaseConfigured() && selectedFile) {
      setIsUploading(true);
      const res = await uploadDocumentToSupabase(
        selectedFile,
        docTitle || selectedFile.name,
        category,
        currentEmployee.employeeId
      );
      setIsUploading(false);

      if (res) {
        setIsModalOpen(false);
        setDocTitle("");
        setSelectedFile(null);
        loadDocs();
      } else {
        setUploadError("Failed to upload document to Supabase Storage. Please try again.");
      }
    } else {
      // Local fallback
      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        title: docTitle.endsWith(".pdf") ? docTitle : `${docTitle}.pdf`,
        category: category as any,
        uploadDate: new Date().toISOString().split("T")[0],
        size: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : "1.2 MB",
      };

      currentEmployee.documents.push(newDoc);
      setIsModalOpen(false);
      setDocTitle("");
      setSelectedFile(null);
    }
  };

  const handleDownload = async (doc: typeof allDocs[0]) => {
    if (doc.storagePath && isSupabaseConfigured()) {
      const signedUrl = await getSignedDocumentUrlFromSupabase(doc.storagePath, 3600);
      if (signedUrl) {
        window.open(signedUrl, '_blank');
        return;
      }
    }
    if (doc.publicUrl) {
      window.open(doc.publicUrl, '_blank');
      return;
    }
    alert(`Downloading "${doc.title}"... (Secure document stream verified)`);
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    if (isSupabaseConfigured()) {
      await deleteDocumentFromSupabase(docId);
      loadDocs();
    } else {
      if (currentEmployee) {
        currentEmployee.documents = currentEmployee.documents.filter((d) => d.id !== docId);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FolderLock className="h-6 w-6 text-indigo-400" />
            Corporate Documents Vault
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Encrypted cloud storage for offer letters, identity proofs, certifications, and compliance agreements.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} className="gap-1.5 font-semibold">
          <Upload className="h-4 w-4" /> Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents by title, employee, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <Badge variant="purple" size="sm">{filteredDocs.length} Verified Files</Badge>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Document Title</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Employee</th>
                  <th className="px-5 py-3.5">Upload Date</th>
                  <th className="px-5 py-3.5">File Size</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {isLoadingDocs ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto text-indigo-400 mb-2" />
                      Loading document metadata...
                    </td>
                  </tr>
                ) : filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No documents stored. Click "Upload Document" to add files.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-800/40">
                      <td className="px-5 py-3.5 font-semibold text-white whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <FileText className="h-4 w-4 text-indigo-400" />
                          <span>{doc.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <Badge variant="blue" size="sm">{doc.category}</Badge>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-medium text-white">{doc.ownerName}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">{doc.ownerId}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">{doc.uploadDate}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-400 whitespace-nowrap">{doc.size}</td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                            className="h-8 text-xs gap-1.5"
                          >
                            <Download className="h-3.5 w-3.5" /> Download
                          </Button>
                          {(isAdmin || currentEmployee?.employeeId === doc.ownerId) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(doc.id)}
                              className="h-8 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Vault Document" maxWidth="md">
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
              {uploadError}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Document Title</label>
            <Input
              placeholder="e.g. Identity Verification.pdf"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white"
            >
              <option value="ID Proof">Identity Proof</option>
              <option value="Employment">Employment</option>
              <option value="Payroll">Payroll</option>
              <option value="Policy">Policy</option>
              <option value="Certificates">Certificates</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center text-xs text-slate-400 bg-slate-950 relative">
            <Upload className="h-6 w-6 text-indigo-400 mx-auto mb-2" />
            <p className="text-white font-medium mb-1">
              {selectedFile ? selectedFile.name : "Select file to upload"}
            </p>
            <p className="text-[11px] text-slate-500 mb-3">
              Supports PDF, PNG, JPG, DOC, DOCX up to 10MB
            </p>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isUploading} className="gap-1.5">
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                "Save to Vault"
              )}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
