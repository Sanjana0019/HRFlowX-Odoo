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
import { Input, Textarea } from "@/components/ui/input";
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
  const [branchLocation, setBranchLocation] = useState("");
  const [branchAddress, setBranchAddress] = useState("");
  const [branchHead, setBranchHead] = useState("");

  // Policy modal
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [policyTitle, setPolicyTitle] = useState("");
  const [policyCategory, setPolicyCategory] = useState<CompanyPolicy["category"]>("Remote Work");
  const [policyContent, setPolicyContent] = useState("");

  const [savedSuccess, setSavedSuccess] = useState(false);

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
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBranch({
      name: branchName,
      location: branchLocation,
      address: branchAddress,
      status: "active",
      headOfBranch: branchHead,
    });
    setIsBranchModalOpen(false);
    setBranchName("");
    setBranchLocation("");
    setBranchAddress("");
  };

  const handleAddPolicySubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Building className="h-6 w-6 text-indigo-400" />
          Company & Organizational Governance
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Manage corporate identity, global branch offices, official enterprise policies, and role permission policies.
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          Company profile details saved successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: "profile", label: "Company Profile", icon: Building },
          { id: "branches", label: `Global Branches (${branches.length})`, icon: MapPin },
          { id: "policies", label: `Company Policies (${policies.length})`, icon: FileText },
          { id: "permissions", label: "Roles & Permissions", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <Card>
          <CardHeader className="pb-4 border-b border-slate-800">
            <CardTitle className="text-base">Corporate Organization Profile</CardTitle>
            <p className="text-xs text-slate-400">
              Primary entity details displayed across payslips, contracts, and login branding.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSaveCompany} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Company Name
                  </label>
                  <Input
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    disabled={!isAdmin}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Industry Domain
                  </label>
                  <Input
                    value={compIndustry}
                    onChange={(e) => setCompIndustry(e.target.value)}
                    disabled={!isAdmin}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Corporate Website
                  </label>
                  <Input
                    value={compWebsite}
                    onChange={(e) => setCompWebsite(e.target.value)}
                    disabled={!isAdmin}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Contact Email
                  </label>
                  <Input
                    type="email"
                    value={compEmail}
                    onChange={(e) => setCompEmail(e.target.value)}
                    disabled={!isAdmin}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Primary Telephone
                  </label>
                  <Input
                    value={compPhone}
                    onChange={(e) => setCompPhone(e.target.value)}
                    disabled={!isAdmin}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Corporate HQ Address
                  </label>
                  <Input
                    value={compAddress}
                    onChange={(e) => setCompAddress(e.target.value)}
                    disabled={!isAdmin}
                  />
                </div>
              </div>

              {/* Logo Upload Simulation */}
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoUrl}
                    alt="Company Logo"
                    className="h-12 w-12 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Official Brand Logo</span>
                    <span className="text-[11px] text-slate-400">PNG or SVG format (recommended 256x256)</span>
                  </div>
                </div>

                {isAdmin && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setLogoUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop")}
                    className="text-xs gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5" /> Change Logo
                  </Button>
                )}
              </div>

              {isAdmin && (
                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" size="md" className="gap-1.5 font-semibold">
                    <CheckCircle2 className="h-4 w-4" /> Save Profile
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {/* Branches Tab */}
      {activeTab === "branches" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <CardTitle className="text-base">Global Office Branches</CardTitle>
              <p className="text-xs text-slate-400">Manage localized campuses, office hubs, and regional leadership.</p>
            </div>
            {isAdmin && (
              <Button variant="primary" size="sm" onClick={() => setIsBranchModalOpen(true)} className="gap-1.5">
                <Plus className="h-4 w-4" /> Add Branch
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {branches.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-indigo-400" />
                        <h4 className="text-sm font-bold text-white">{b.name}</h4>
                      </div>
                      <Badge variant="success" size="sm">Active</Badge>
                    </div>
                    <p className="text-xs text-slate-300">{b.address}</p>
                    <p className="text-[11px] text-slate-400">
                      Regional Head: <span className="text-indigo-300 font-semibold">{b.headOfBranch || "HR Director"}</span>
                    </p>
                  </div>

                  {isAdmin && (
                    <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-800/60">
                      <button
                        onClick={() => deleteBranch(b.id)}
                        className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Policies Tab */}
      {activeTab === "policies" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <CardTitle className="text-base">Enterprise Policies & Handbook</CardTitle>
              <p className="text-xs text-slate-400">Standard operating procedures and compliance rules visible to personnel.</p>
            </div>
            {isAdmin && (
              <Button variant="primary" size="sm" onClick={() => setIsPolicyModalOpen(true)} className="gap-1.5">
                <Plus className="h-4 w-4" /> Create Policy
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {policies.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-indigo-400" />
                      <h4 className="text-sm font-bold text-white">{p.title}</h4>
                      <Badge variant="blue" size="sm">{p.category}</Badge>
                      <Badge variant={p.isPublished ? "success" : "outline"} size="sm">
                        {p.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePolicyPublish(p.id)}
                          className="h-7 text-xs"
                        >
                          {p.isPublished ? "Unpublish" : "Publish"}
                        </Button>
                        <button
                          onClick={() => deletePolicy(p.id)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{p.content}</p>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    Version {p.version} • Effective Date: {p.effectiveDate}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Permissions Matrix Tab */}
      {activeTab === "permissions" && (
        <Card>
          <CardHeader className="pb-4 border-b border-slate-800">
            <CardTitle className="text-base">Role-Based Access Control (RBAC) Matrix</CardTitle>
            <p className="text-xs text-slate-400">System permissions configured by role tier.</p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Permission Area</th>
                    <th className="px-5 py-3 text-center">Employee Role</th>
                    <th className="px-5 py-3 text-center">Admin / HR Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {[
                    { area: "View Own Profile & Attendance", emp: "✓ Full Access", admin: "✓ Full Access" },
                    { area: "Punch In / Punch Out & Correction Requests", emp: "✓ Self Service", admin: "✓ Self Service" },
                    { area: "Apply for Time Off / Leave", emp: "✓ Self Service", admin: "✓ Full Management" },
                    { area: "Approve / Reject Leave Requests", emp: "✕ Restricted", admin: "✓ Full Approval" },
                    { area: "Employee Directory CRUD & Onboarding", emp: "✕ View Only", admin: "✓ Full CRUD" },
                    { area: "Salary Structure & Compensation Configuration", emp: "✕ Hidden / Read-Only", admin: "✓ Full Control" },
                    { area: "Batch Monthly Payroll Processing", emp: "✕ Restricted", admin: "✓ Full Execution" },
                    { area: "Company Policies & Global Settings", emp: "✕ Read Only", admin: "✓ Full Control" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-800/40">
                      <td className="px-5 py-3 font-semibold text-white">{row.area}</td>
                      <td className="px-5 py-3 text-center font-mono text-indigo-300">{row.emp}</td>
                      <td className="px-5 py-3 text-center font-mono text-emerald-400 font-bold">{row.admin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Branch Modal */}
      <Dialog
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        title="Add Regional Branch Office"
        maxWidth="md"
      >
        <form onSubmit={handleAddBranchSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Branch Name</label>
            <Input placeholder="e.g. Seattle Cloud Campus" value={branchName} onChange={(e) => setBranchName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">City / Region</label>
            <Input placeholder="Seattle, WA" value={branchLocation} onChange={(e) => setBranchLocation(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Physical Address</label>
            <Input placeholder="500 Pine St, Suite 400" value={branchAddress} onChange={(e) => setBranchAddress(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Branch Director</label>
            <Input placeholder="Director Name" value={branchHead} onChange={(e) => setBranchHead(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsBranchModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Create Branch</Button>
          </div>
        </form>
      </Dialog>

      {/* Add Policy Modal */}
      <Dialog
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
        title="Create Official Policy"
        maxWidth="lg"
      >
        <form onSubmit={handleAddPolicySubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Policy Title</label>
            <Input placeholder="e.g. Workplace AI & Code Governance" value={policyTitle} onChange={(e) => setPolicyTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Category</label>
            <select
              value={policyCategory}
              onChange={(e) => setPolicyCategory(e.target.value as any)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-700 bg-slate-900 text-sm text-slate-100"
            >
              <option value="Remote Work">Remote Work</option>
              <option value="Leave & Attendance">Leave & Attendance</option>
              <option value="Security">Security</option>
              <option value="Conduct">Conduct</option>
              <option value="Compensation">Compensation</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Policy Text / Directives</label>
            <Textarea placeholder="Detail the official guidelines..." value={policyContent} onChange={(e) => setPolicyContent(e.target.value)} rows={4} required />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsPolicyModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Publish Policy</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
