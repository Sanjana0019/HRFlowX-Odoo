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
    <div className="space-y-6 animate-fade-in">
      {/* Top Profile Header Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--card-border)] bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent p-6 sm:p-8 shadow-[var(--shadow-card)] glass-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <Avatar
              src={currentEmployee.avatar}
              alt={currentEmployee.name}
              size="xl"
              status="online"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
                  {currentEmployee.name}
                </h1>
                <Badge variant={currentEmployee.role === "admin" ? "purple" : "blue"} size="xs">
                  {currentEmployee.role === "admin" ? "HR Admin" : "Employee"}
                </Badge>
                <Badge variant="success" size="xs">
                  Active
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                {currentEmployee.designation} • {currentEmployee.department}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--foreground-muted)] pt-1">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-[var(--foreground-subtle)]" />
                  {currentEmployee.email}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Building className="h-3.5 w-3.5 text-[var(--foreground-subtle)]" />
                  {currentEmployee.employeeId}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[var(--foreground-subtle)]" />
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
                className="gap-1.5 font-semibold text-xs"
              >
                <Edit3 className="h-4 w-4" />
                Edit Personal Info
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="text-xs"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 p-3 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
            <Check className="h-4 w-4" />
            Profile updated successfully!
          </div>
        )}
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2 overflow-x-auto">
        {[
          { id: "personal", label: "Personal Info", icon: UserIcon },
          { id: "job", label: "Job & Organization", icon: Briefcase },
          { id: "salary", label: "Salary Structure", icon: Receipt },
          { id: "documents", label: "Documents Vault", icon: FileText },
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

      {/* Tab Content */}
      {activeTab === "personal" && (
        <Card>
          <CardHeader className="pb-3 border-b border-[var(--border)]">
            <CardTitle className="text-sm">Personal & Verified Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {!isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--foreground-subtle)] uppercase font-semibold">
                    Phone Number
                  </span>
                  <p className="font-mono font-bold text-[var(--foreground)]">{currentEmployee.phone}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[11px] text-[var(--foreground-subtle)] uppercase font-semibold">
                    Emergency Contact Name
                  </span>
                  <p className="font-bold text-[var(--foreground)]">
                    {currentEmployee.emergencyContact?.name || "None Listed"} (
                    {currentEmployee.emergencyContact?.relationship || "N/A"})
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] space-y-1 sm:col-span-2">
                  <span className="text-[11px] text-[var(--foreground-subtle)] uppercase font-semibold">
                    Residing Address
                  </span>
                  <p className="text-[var(--foreground)] font-medium">{currentEmployee.address}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                      Phone Number
                    </label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                      Emergency Contact Name
                    </label>
                    <Input
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                      Residing Address
                    </label>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
                  </div>
                </div>

                {/* Avatar presets */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-2">
                    Choose Profile Picture
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {sampleAvatars.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatar(url)}
                        className={`relative rounded-full ring-2 transition-all p-0.5 ${
                          avatar === url ? "ring-indigo-500 scale-105" : "ring-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Avatar src={url} alt="preset" size="md" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
                  <Button variant="secondary" size="sm" type="button" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "job" && (
        <Card>
          <CardHeader className="pb-3 border-b border-[var(--border)]">
            <CardTitle className="text-sm">Organization & Role Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[11px] text-[var(--foreground-subtle)] uppercase font-semibold">
                  Employee ID
                </span>
                <p className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{currentEmployee.employeeId}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[11px] text-[var(--foreground-subtle)] uppercase font-semibold">
                  Department
                </span>
                <p className="font-bold text-[var(--foreground)]">{currentEmployee.department}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[11px] text-[var(--foreground-subtle)] uppercase font-semibold">
                  Designation
                </span>
                <p className="font-bold text-[var(--foreground)]">{currentEmployee.designation}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[11px] text-[var(--foreground-subtle)] uppercase font-semibold">
                  Joining Date
                </span>
                <p className="font-mono text-[var(--foreground)]">{currentEmployee.joiningDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "salary" && (
        <Card>
          <CardHeader className="pb-3 border-b border-[var(--border)]">
            <CardTitle className="text-sm">Compensation Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-sans uppercase font-bold">
                  Monthly Basic Wage
                </span>
                <p className="text-2xl font-extrabold text-[var(--foreground)] mt-1">
                  {formatCurrency(currentEmployee.salaryStructure.basicSalary)}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-sans uppercase font-bold">
                  Monthly Net Take-Home
                </span>
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatCurrency(currentEmployee.salaryStructure.netSalary)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "documents" && (
        <Card>
          <CardHeader className="pb-3 border-b border-[var(--border)]">
            <CardTitle className="text-sm">Verified Corporate Documents</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 divide-y divide-[var(--border-subtle)]">
            {currentEmployee.documents?.map((doc) => (
              <div key={doc.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0 text-xs">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                  <div>
                    <span className="font-bold text-[var(--foreground)] block">{doc.title}</span>
                    <span className="text-[10px] text-[var(--foreground-subtle)] font-mono">
                      {doc.category} • {doc.size}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="xs">
                  <Download className="h-3.5 w-3.5" /> Download
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
