"use client";

import React, { useState } from "react";
import {
  Building,
  MapPin,
  FileText,
  ShieldCheck,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Globe,
  Mail,
  Phone,
  Upload,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Branch, CompanyPolicy } from "@/types";

export function CompanySettingsView() {
  const {
    company,
    updateCompanyProfile,
    branches,
    addBranch,
    updateBranch,
    deleteBranch,
    policies,
    addPolicy,
    updatePolicy,
    deletePolicy,
    togglePolicyPublish,
    currentUser,
  } = useStore();

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "hr";

  const [activeTab, setActiveTab] = useState<"profile" | "branches" | "policies" | "permissions">("profile");

  // Company profile form
  const [compName, setCompName] = useState(company.name);
  const [compIndustry, setCompIndustry] = useState(company.industry);
  const [compWebsite, setCompWebsite] = useState(company.website);
  const [compEmail, setCompEmail] = useState(company.email);
  const [compPhone, setCompPhone] = useState(company.phone);
  const [compAddress, setCompAddress] = useState(company.address);
  const [logoUrl, setLogoUrl] = useState(company.logo);

  // Branch modal
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [branchCity, setBranchCity] = useState("");
  const [branchCountry, setBranchCountry] = useState("United States");
  const [branchAddress, setBranchAddress] = useState("");
  const [branchHead, setBranchHead] = useState("");

  // Policy modal
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [policyTitle, setPolicyTitle] = useState("");
  const [policyCategory, setPolicyCategory] = useState<CompanyPolicy["category"]>("Remote Work");
  const [policyContent, setPolicyContent] = useState("");

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyProfile({
      name: compName,
      industry: compIndustry,
      website: compWebsite,
      email: compEmail,
      phone: compPhone,
      address: compAddress,
      logo: logoUrl,
    });
  };

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName || !branchCity) return;
    addBranch({
      name: branchName,
      location: `${branchCity}, ${branchCountry}`,
      address: branchAddress || branchCity,
      status: "active",
      headOfBranch: branchHead,
    });
    setIsBranchModalOpen(false);
    setBranchName("");
    setBranchCity("");
  };

  const handleAddPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyTitle || !policyContent) return;
    addPolicy({
      title: policyTitle,
      category: policyCategory,
      content: policyContent,
      effectiveDate: new Date().toISOString().split("T")[0],
      isPublished: true,
      version: "v1.0",
    });
    setIsPolicyModalOpen(false);
    setPolicyTitle("");
    setPolicyContent("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
          <Building className="h-6 w-6 text-indigo-500" />
          Company Profile & Governance
        </h1>
        <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">
          Manage entity corporate details, multi-regional branch offices, and compliance policies.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2 overflow-x-auto">
        {[
          { id: "profile", label: "Company Overview", icon: Building },
          { id: "branches", label: "Branch Offices", icon: MapPin },
          { id: "policies", label: "Corporate Policies", icon: FileText },
          { id: "permissions", label: "Role Permissions Matrix", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMPANY PROFILE */}
      {activeTab === "profile" && (
        <Card>
          <CardHeader className="pb-3 border-b border-[var(--border)]">
            <CardTitle className="text-sm">Entity Legal & Brand Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSaveCompany} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                    Company Registered Name
                  </label>
                  <Input value={compName} onChange={(e) => setCompName(e.target.value)} disabled={!isAdmin} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                    Industry Sector
                  </label>
                  <Input value={compIndustry} onChange={(e) => setCompIndustry(e.target.value)} disabled={!isAdmin} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                    Corporate Website
                  </label>
                  <Input value={compWebsite} onChange={(e) => setCompWebsite(e.target.value)} disabled={!isAdmin} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                    Official Contact Email
                  </label>
                  <Input value={compEmail} onChange={(e) => setCompEmail(e.target.value)} disabled={!isAdmin} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                    Headquarters Address
                  </label>
                  <Input value={compAddress} onChange={(e) => setCompAddress(e.target.value)} disabled={!isAdmin} />
                </div>
              </div>

              {isAdmin && (
                <div className="flex justify-end pt-3 border-t border-[var(--border)]">
                  <Button type="submit" variant="primary" size="sm" className="font-semibold">
                    Save Entity Profile
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: BRANCH OFFICES */}
      {activeTab === "branches" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            {isAdmin && (
              <Button variant="primary" size="sm" onClick={() => setIsBranchModalOpen(true)} className="gap-1.5 text-xs font-semibold">
                <Plus className="h-4 w-4" /> Add Branch Location
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((b) => (
              <div key={b.id} className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-card)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-500" />
                    {b.name}
                  </span>
                  <Badge variant="purple" size="xs">
                    {b.status}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--foreground-muted)]">{b.address}</p>
                <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--foreground-subtle)]">
                  <span>Head: {b.headOfBranch || "Regional Director"}</span>
                  <span className="font-mono">{b.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CORPORATE POLICIES */}
      {activeTab === "policies" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            {isAdmin && (
              <Button variant="primary" size="sm" onClick={() => setIsPolicyModalOpen(true)} className="gap-1.5 text-xs font-semibold">
                <Plus className="h-4 w-4" /> Add Policy Document
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies.map((p) => (
              <div key={p.id} className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-card)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[var(--foreground)]">{p.title}</span>
                  <Badge variant="purple" size="xs">{p.category}</Badge>
                </div>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">{p.content}</p>
                <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--foreground-subtle)]">
                  <span>Effective: {p.effectiveDate}</span>
                  <Badge variant={p.isPublished ? "success" : "neutral"} size="xs">
                    {p.isPublished ? "Enforced" : "Draft"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PERMISSIONS MATRIX */}
      {activeTab === "permissions" && (
        <Card>
          <CardHeader className="pb-3 border-b border-[var(--border)]">
            <CardTitle className="text-sm">Role-Based Access Control (RBAC) Governance Matrix</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-muted)] uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Permission Capability</th>
                    <th className="px-4 py-3">Staff Employee</th>
                    <th className="px-4 py-3">HR Administrator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {[
                    { cap: "Personal Biometric Punch Clock", emp: true, adm: true },
                    { cap: "Submit Time Off & Correction Requests", emp: true, adm: true },
                    { cap: "View Own Salary Structure & Payslips", emp: true, adm: true },
                    { cap: "Approve / Reject Leave Requests", emp: false, adm: true },
                    { cap: "Batch Payroll Execution & Wage Recalculation", emp: false, adm: true },
                    { cap: "Workforce Onboarding & Termination", emp: false, adm: true },
                    { cap: "Access SOC2 Real-Time Audit Logs", emp: false, adm: true },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-[var(--secondary)] transition-colors">
                      <td className="px-4 py-3 font-semibold text-[var(--foreground)]">{row.cap}</td>
                      <td className="px-4 py-3">
                        <Badge variant={row.emp ? "success" : "neutral"} size="xs">
                          {row.emp ? "Granted" : "Restricted"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={row.adm ? "purple" : "neutral"} size="xs">
                          {row.adm ? "Full Authority" : "Restricted"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Branch Modal */}
      <Dialog isOpen={isBranchModalOpen} onClose={() => setIsBranchModalOpen(false)} title="Add Branch Location">
        <form onSubmit={handleAddBranch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">Branch Name</label>
            <Input value={branchName} onChange={(e) => setBranchName(e.target.value)} placeholder="e.g. Austin Innovation Lab" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">City</label>
              <Input value={branchCity} onChange={(e) => setBranchCity(e.target.value)} placeholder="Austin, TX" required />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">Country</label>
              <Input value={branchCountry} onChange={(e) => setBranchCountry(e.target.value)} placeholder="United States" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">Address</label>
            <Input value={branchAddress} onChange={(e) => setBranchAddress(e.target.value)} placeholder="500 Congress Ave" />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsBranchModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Create Branch</Button>
          </div>
        </form>
      </Dialog>

      {/* Add Policy Modal */}
      <Dialog isOpen={isPolicyModalOpen} onClose={() => setIsPolicyModalOpen(false)} title="Publish Corporate Policy">
        <form onSubmit={handleAddPolicy} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">Policy Title</label>
            <Input value={policyTitle} onChange={(e) => setPolicyTitle(e.target.value)} placeholder="e.g. Remote Work Security Directives" required />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">Policy Directive Content</label>
            <textarea
              value={policyContent}
              onChange={(e) => setPolicyContent(e.target.value)}
              placeholder="Detail guidelines for staff..."
              className="w-full h-24 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsPolicyModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Publish Policy</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
