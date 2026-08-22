"use client";

import React, { useState } from "react";
import {
  User as UserIcon,
  Briefcase,
  Receipt,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  Edit3,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
  Lock,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Employee, SkillItem, CertificationItem } from "@/types";
import { formatCurrency, calculateDynamicSalaryStructure } from "@/lib/utils";

export function EmployeeDetailModal({
  isOpen = true,
  employee,
  onClose,
  isReadOnly = false,
}: {
  isOpen?: boolean;
  employee: Employee;
  onClose: () => void;
  isReadOnly?: boolean;
}) {
  const {
    currentUser,
    updateEmployee,
    updateEmployeeResume,
    updateEmployeePrivateInfo,
    updateEmployeeSalary,
    addSkillToEmployee,
    deleteSkillFromEmployee,
    addCertificationToEmployee,
    deleteCertificationFromEmployee,
  } = useStore();

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "hr";
  const isOwnProfile = currentUser?.employeeId === employee.employeeId;
  const canEditSalary = isAdmin;
  const canEditPersonal = isAdmin || isOwnProfile;

  const [activeTab, setActiveTab] = useState<"resume" | "private" | "salary" | "security">("resume");

  // Resume editing state
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [aboutText, setAboutText] = useState(employee.resume?.about || "");
  const [whatILoveText, setWhatILoveText] = useState(employee.resume?.whatILoveAboutJob || "");
  const [interestsText, setInterestsText] = useState(employee.resume?.interestsHobbies || "");

  // Skill input
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<SkillItem["level"]>("Intermediate");
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  // Cert input
  const [newCertName, setNewCertName] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("");
  const [newCertDate, setNewCertDate] = useState("");
  const [isAddingCert, setIsAddingCert] = useState(false);

  // Private Info editing state
  const [isEditingPrivate, setIsEditingPrivate] = useState(false);
  const [dob, setDob] = useState(employee.privateInfo?.dateOfBirth || "");
  const [address, setAddress] = useState(employee.privateInfo?.residingAddress || employee.address || "");
  const [nationality, setNationality] = useState(employee.privateInfo?.nationality || "United States");
  const [personalEmail, setPersonalEmail] = useState(employee.privateInfo?.personalEmail || "");
  const [gender, setGender] = useState<any>(employee.privateInfo?.gender || "Prefer not to say");
  const [maritalStatus, setMaritalStatus] = useState<any>(employee.privateInfo?.maritalStatus || "Single");

  // Bank Info state
  const [accNum, setAccNum] = useState(employee.privateInfo?.bankDetails?.accountNumber || "");
  const [bankName, setBankName] = useState(employee.privateInfo?.bankDetails?.bankName || "");
  const [ifsc, setIfsc] = useState(employee.privateInfo?.bankDetails?.ifscCode || "");
  const [pan, setPan] = useState(employee.privateInfo?.bankDetails?.panNo || "");
  const [uan, setUan] = useState(employee.privateInfo?.bankDetails?.uanNo || "");

  // Salary Engine state
  const [monthlyWage, setMonthlyWage] = useState(employee.salaryStructure?.monthlyWage || 15000);
  const [wageType, setWageType] = useState<"Fixed wage" | "Hourly wage">(employee.salaryStructure?.wageType || "Fixed wage");
  const [workingDays, setWorkingDays] = useState(employee.salaryStructure?.workingDaysPerWeek || 5);
  const [workingHours, setWorkingHours] = useState(employee.salaryStructure?.workingHoursPerWeek || 40);
  const [breakTime, setBreakTime] = useState(employee.salaryStructure?.breakTimeMinutes || 60);

  // Real-time calculated structure
  const calculatedSalary = calculateDynamicSalaryStructure(monthlyWage);

  const handleSaveResume = () => {
    updateEmployeeResume(employee.id, {
      about: aboutText,
      whatILoveAboutJob: whatILoveText,
      interestsHobbies: interestsText,
    });
    setIsEditingResume(false);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    addSkillToEmployee(employee.id, {
      name: newSkillName.trim(),
      level: newSkillLevel,
    });
    setNewSkillName("");
    setIsAddingSkill(false);
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName.trim() || !newCertIssuer.trim()) return;
    addCertificationToEmployee(employee.id, {
      name: newCertName.trim(),
      issuer: newCertIssuer.trim(),
      issueDate: newCertDate || new Date().toISOString().split("T")[0],
    });
    setNewCertName("");
    setNewCertIssuer("");
    setIsAddingCert(false);
  };

  const handleSavePrivateInfo = () => {
    updateEmployeePrivateInfo(employee.id, {
      dateOfBirth: dob,
      residingAddress: address,
      nationality,
      personalEmail,
      gender,
      maritalStatus,
      bankDetails: {
        accountNumber: accNum,
        bankName,
        ifscCode: ifsc,
        panNo: pan,
        uanNo: uan,
        empCode: employee.employeeId,
      },
    });
    setIsEditingPrivate(false);
  };

  const handleSaveSalary = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmployeeSalary(
      employee.id,
      Number(monthlyWage),
      Number(workingDays),
      Number(workingHours),
      Number(breakTime)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      {/* Frosted Backdrop */}
      <div className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-xl transition-opacity" onClick={onClose} />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-4xl rounded-3xl glass-modal p-0 shadow-[var(--shadow-modal)] z-10 my-auto text-[var(--foreground)] border border-[var(--border)] overflow-hidden">
        {/* Sticky Profile Header */}
        <div className="p-6 sm:p-7 border-b border-[var(--border)] bg-[var(--card)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 sm:gap-5">
            <Avatar src={employee.avatar} alt={employee.name} size="lg" status="online" />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-extrabold tracking-tight text-[var(--foreground)]">
                  {employee.name}
                </h3>
                <Badge variant={employee.role === "admin" ? "purple" : "neutral"} size="xs">
                  {employee.role === "admin" ? "HR Administrator" : "Staff Member"}
                </Badge>
              </div>
              <p className="text-xs text-[var(--foreground-muted)] flex flex-wrap items-center gap-2">
                <span>{employee.designation}</span>
                <span>•</span>
                <span>{employee.department}</span>
                <span>•</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                  {employee.employeeId}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-xl bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] flex items-center justify-center transition-colors border border-[var(--border-subtle)] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[var(--border)] bg-[var(--background-subtle)] overflow-x-auto">
          {[
            { id: "resume", label: "Resume & Skills", icon: UserIcon },
            { id: "private", label: "Private Info & Bank", icon: Briefcase },
            { id: "salary", label: "Dynamic Salary Engine", icon: Receipt },
            { id: "security", label: "Security & Credentials", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 cursor-pointer ${
                  isActive
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-[var(--card)]"
                    : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Container */}
        <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto space-y-6">
          {/* TAB 1: RESUME & SKILLS */}
          {activeTab === "resume" && (
            <div className="space-y-6 text-xs">
              {/* About Bio Section */}
              <div className="p-5 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Professional Summary & About
                  </span>
                  {canEditPersonal && (
                    <button
                      onClick={() => (isEditingResume ? handleSaveResume() : setIsEditingResume(true))}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      {isEditingResume ? "Save Changes" : "Edit Bio"}
                    </button>
                  )}
                </div>
                {isEditingResume ? (
                  <textarea
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    className="w-full h-24 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  />
                ) : (
                  <p className="text-[var(--foreground-muted)] leading-relaxed">{aboutText || "No summary provided."}</p>
                )}
              </div>

              {/* Skills Tags Section */}
              <div className="p-5 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Verified Technical Skills
                  </span>
                  {canEditPersonal && (
                    <Button variant="ghost" size="xs" onClick={() => setIsAddingSkill(true)} className="text-xs">
                      <Plus className="h-3 w-3" /> Add Skill
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {employee.resume?.skills?.map((sk) => (
                    <Badge key={sk.id} variant="purple" size="sm" className="gap-1.5 py-1 px-3">
                      <span>{sk.name}</span>
                      <span className="text-[9px] opacity-70 font-mono">({sk.level})</span>
                      {canEditPersonal && (
                        <button
                          onClick={() => deleteSkillFromEmployee(employee.id, sk.id)}
                          className="hover:text-rose-500 ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>

                {isAddingSkill && (
                  <form onSubmit={handleAddSkill} className="flex gap-2 pt-2">
                    <Input
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="Skill name (e.g. Next.js App Router)"
                      className="flex-1"
                    />
                    <Button variant="primary" size="sm" type="submit">
                      Save
                    </Button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRIVATE INFO & BANK */}
          {activeTab === "private" && (
            <div className="space-y-6 text-xs">
              <div className="p-5 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Demographic Details
                  </span>
                  {canEditPersonal && (
                    <button
                      onClick={() => (isEditingPrivate ? handleSavePrivateInfo() : setIsEditingPrivate(true))}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      {isEditingPrivate ? "Save Details" : "Edit Private Info"}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase block mb-1">
                      Date of Birth
                    </span>
                    {isEditingPrivate ? (
                      <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                    ) : (
                      <p className="font-mono text-[var(--foreground)]">{dob || "1995-11-12"}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase block mb-1">
                      Personal Email
                    </span>
                    {isEditingPrivate ? (
                      <Input type="email" value={personalEmail} onChange={(e) => setPersonalEmail(e.target.value)} />
                    ) : (
                      <p className="text-[var(--foreground)]">{personalEmail || employee.email}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase block mb-1">
                      Residing Address
                    </span>
                    {isEditingPrivate ? (
                      <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                    ) : (
                      <p className="text-[var(--foreground)]">{address || "1280 Mission St, San Francisco, CA"}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank Account Details */}
              <div className="p-5 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] space-y-4">
                <span className="font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  Disbursement Bank Account
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase block mb-1">
                      Account Number
                    </span>
                    <p className="font-mono text-[var(--foreground)] font-bold">{accNum || "99182736452"}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase block mb-1">
                      Bank Name
                    </span>
                    <p className="text-[var(--foreground)]">{bankName || "Chase Manhattan Bank"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DYNAMIC SALARY ENGINE */}
          {activeTab === "salary" && (
            <form onSubmit={handleSaveSalary} className="space-y-6 text-xs">
              <div className="p-5 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Monthly Wage Package
                  </span>
                  <Badge variant="purple" size="xs">
                    Fixed Monthly Base
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                      Monthly Wage (INR / USD)
                    </label>
                    <Input
                      type="number"
                      value={monthlyWage}
                      onChange={(e) => setMonthlyWage(Number(e.target.value))}
                      disabled={!canEditSalary}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                      Annual Projected Gross
                    </label>
                    <p className="h-10 flex items-center px-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(monthlyWage * 12)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Components Table */}
              <div className="rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--card)]">
                <div className="p-4 bg-[var(--background-subtle)] border-b border-[var(--border)] flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-xs text-[var(--foreground)]">
                    Calculated Breakdown Components
                  </span>
                  <span className="text-[10px] text-[var(--foreground-subtle)] font-mono">
                    Auto-rebalanced by engine
                  </span>
                </div>

                <div className="p-4 space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between text-[var(--foreground)]">
                    <span>Basic Salary (50.00%)</span>
                    <span className="font-bold">{formatCurrency(calculatedSalary.basicSalary)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--foreground)]">
                    <span>House Rent Allowance (50% of Basic)</span>
                    <span className="font-bold">{formatCurrency(calculatedSalary.houseRentAllowance)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--foreground)]">
                    <span>Standard Allowance (8.33% of Wage)</span>
                    <span className="font-bold">{formatCurrency(calculatedSalary.standardAllowance)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--foreground)]">
                    <span>Performance Bonus (8.33% of Basic)</span>
                    <span className="font-bold">{formatCurrency(calculatedSalary.performanceBonus)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--foreground)]">
                    <span>Leave Travel Allowance (8.33% of Basic)</span>
                    <span className="font-bold">{formatCurrency(calculatedSalary.leaveTravelAllowance)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--foreground)]">
                    <span>Fixed Allowance (Remainder)</span>
                    <span className="font-bold">{formatCurrency(calculatedSalary.fixedAllowance)}</span>
                  </div>
                  <div className="flex justify-between text-rose-500 pt-2 border-t border-[var(--border)]">
                    <span>Provident Fund (12% of Basic)</span>
                    <span className="font-bold">-{formatCurrency(calculatedSalary.employeePf)}</span>
                  </div>
                  <div className="flex justify-between text-rose-500">
                    <span>Professional Tax</span>
                    <span className="font-bold">-{formatCurrency(calculatedSalary.professionalTax)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold text-sm pt-2 border-t border-[var(--border)]">
                    <span>Net Monthly Take-Home Pay</span>
                    <span>{formatCurrency(calculatedSalary.netSalary)}</span>
                  </div>
                </div>
              </div>

              {canEditSalary && (
                <div className="flex justify-end gap-2">
                  <Button variant="primary" size="sm" type="submit" className="font-bold">
                    Save Compensation Band →
                  </Button>
                </div>
              )}
            </form>
          )}

          {/* TAB 4: SECURITY & ACCESS */}
          {activeTab === "security" && (
            <div className="p-5 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] space-y-4 text-xs">
              <span className="font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                Security & Authentication Credentials
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                  <span className="text-[11px] text-[var(--foreground-muted)] block">System Generated Login ID</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-sm">{employee.employeeId}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                  <span className="text-[11px] text-[var(--foreground-muted)] block">SSO Authentication Status</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active & Enforced</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
