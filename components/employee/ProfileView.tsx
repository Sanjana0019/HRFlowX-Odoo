"use client";

import React, { useState } from "react";
import {
  User as UserIcon,
  Briefcase,
  Receipt,
  FileText,
  Edit3,
  Check,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Download,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

export function ProfileView() {
  const { currentEmployee, updateEmployee, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState<"personal" | "job" | "salary" | "documents">("personal");
  const [isEditing, setIsEditing] = useState(false);

  if (!currentEmployee) return null;

  // Editable personal state
  const [phone, setPhone] = useState(currentEmployee.phone);
  const [address, setAddress] = useState(currentEmployee.address);
  const [avatar, setAvatar] = useState(currentEmployee.avatar);
  const [emergencyName, setEmergencyName] = useState(currentEmployee.emergencyContact?.name || "");
  const [emergencyRelation, setEmergencyRelation] = useState(currentEmployee.emergencyContact?.relationship || "");
  const [emergencyPhone, setEmergencyPhone] = useState(currentEmployee.emergencyContact?.phone || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmployee(currentEmployee.employeeId, {
      phone,
      address,
      avatar,
      emergencyContact: {
        name: emergencyName,
        relationship: emergencyRelation,
        phone: emergencyPhone,
      },
    });

    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const sampleAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Profile Header Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Avatar
              src={currentEmployee.avatar}
              name={currentEmployee.name}
              size="xl"
              isOnline={true}
              className="ring-4 ring-indigo-500/30"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  {currentEmployee.name}
                </h1>
                <Badge variant="purple" size="md">
                  {currentEmployee.role === "admin" ? "HR Admin" : "Employee"}
                </Badge>
                <Badge variant="success" size="md">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-indigo-300 font-medium mt-1">
                {currentEmployee.designation} • {currentEmployee.department}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                  {currentEmployee.email}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Building className="h-3.5 w-3.5 text-slate-500" />
                  {currentEmployee.employeeId}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  {currentEmployee.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-1.5"
              >
                <Edit3 className="h-4 w-4" />
                Edit Personal Info
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-xs text-emerald-400">
            <Check className="h-4 w-4" />
            Profile updated successfully!
          </div>
        )}
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: "personal", label: "Personal Info", icon: UserIcon },
          { id: "job", label: "Job & Organization", icon: Briefcase },
          { id: "salary", label: "Salary Structure", icon: Receipt },
          { id: "documents", label: "Documents Vault", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "personal" && (
        <Card>
          <CardHeader className="pb-4 border-b border-slate-800">
            <CardTitle className="text-base">Personal Information</CardTitle>
            <p className="text-xs text-slate-400">
              Manage your verified contact details and emergency response info.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Full Legal Name
                  </label>
                  <Input value={currentEmployee.name} disabled className="bg-slate-900/40 opacity-70" />
                  <p className="text-[10px] text-slate-500 mt-1">Official name cannot be modified by employee.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Work Email Address
                  </label>
                  <Input value={currentEmployee.email} disabled className="bg-slate-900/40 opacity-70" />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Phone Number
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!isEditing}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Residential Address
                  </label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={!isEditing}
                    placeholder="123 Main St, City, State"
                  />
                </div>
              </div>

              {/* Avatar Switcher if editing */}
              {isEditing && (
                <div className="pt-2 border-t border-slate-800">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Select Avatar Preset
                  </label>
                  <div className="flex items-center gap-3">
                    {sampleAvatars.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatar(url)}
                        className={`rounded-full p-0.5 border-2 transition-all ${
                          avatar === url ? "border-indigo-500 scale-110" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Avatar src={url} name={`User ${i}`} size="md" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Emergency Contact */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Emergency Contact Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Contact Name</label>
                    <Input
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g. Elena Rivera"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Relationship</label>
                    <Input
                      value={emergencyRelation}
                      onChange={(e) => setEmergencyRelation(e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g. Spouse / Sister"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Emergency Phone</label>
                    <Input
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      disabled={!isEditing}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <Button type="button" variant="outline" size="md" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="md" className="gap-1.5 font-semibold">
                    <Check className="h-4 w-4" />
                    Save Personal Profile
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === "job" && (
        <Card>
          <CardHeader className="pb-4 border-b border-slate-800">
            <CardTitle className="text-base">Job & Organizational Information</CardTitle>
            <p className="text-xs text-slate-400">Official employment hierarchy and role specifications.</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
                <span className="text-slate-500 uppercase tracking-wider font-semibold">Employee ID</span>
                <p className="text-sm font-mono font-bold text-white">{currentEmployee.employeeId}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
                <span className="text-slate-500 uppercase tracking-wider font-semibold">Department</span>
                <p className="text-sm font-bold text-indigo-400">{currentEmployee.department}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
                <span className="text-slate-500 uppercase tracking-wider font-semibold">Designation</span>
                <p className="text-sm font-bold text-white">{currentEmployee.designation}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
                <span className="text-slate-500 uppercase tracking-wider font-semibold">Joining Date</span>
                <p className="text-sm font-semibold text-white">{currentEmployee.joiningDate}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
                <span className="text-slate-500 uppercase tracking-wider font-semibold">Employment Status</span>
                <p className="text-sm font-semibold text-emerald-400 capitalize">{currentEmployee.employmentStatus}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
                <span className="text-slate-500 uppercase tracking-wider font-semibold">Reporting Manager</span>
                <p className="text-sm font-semibold text-white">{currentEmployee.managerName || "Executive Team"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "salary" && (
        <Card>
          <CardHeader className="pb-4 border-b border-slate-800">
            <CardTitle className="text-base">Compensation & Structure Overview</CardTitle>
            <p className="text-xs text-slate-400">Fixed monthly package and annual breakdown.</p>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
                <span className="text-xs text-indigo-300 font-medium">Monthly Basic Wage</span>
                <p className="text-2xl font-bold font-mono text-white mt-1">
                  {formatCurrency(currentEmployee.salaryStructure.basicSalary)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                <span className="text-xs text-emerald-300 font-medium">Monthly Net Take-Home</span>
                <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                  {formatCurrency(currentEmployee.salaryStructure.netSalary)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "documents" && (
        <Card>
          <CardHeader className="pb-4 border-b border-slate-800">
            <CardTitle className="text-base">Employee Documents Vault</CardTitle>
            <p className="text-xs text-slate-400">Encrypted compliance files, contracts, and certificates.</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {currentEmployee.documents.length === 0 ? (
                <p className="text-xs text-slate-500 p-6 text-center">No documents uploaded yet.</p>
              ) : (
                currentEmployee.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{doc.title}</p>
                        <p className="text-[10px] text-slate-400">
                          {doc.category} • {doc.size} • Uploaded {doc.uploadDate}
                        </p>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
