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
import { Input, Textarea } from "@/components/ui/input";
import { Employee, SkillItem, CertificationItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function EmployeeDetailModal({
  employee,
  onClose,
  isReadOnly = false,
}: {
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
  const [isAddingCert, setIsAddingCert] = useState(false);

  // Salary editing state
  const [monthlyWage, setMonthlyWage] = useState(employee.salaryStructure.monthlyWage);
  const [workingDays, setWorkingDays] = useState(employee.salaryStructure.workingDaysPerWeek);
  const [workingHours, setWorkingHours] = useState(employee.salaryStructure.workingHoursPerWeek);
  const [breakTime, setBreakTime] = useState(employee.salaryStructure.breakTimeMinutes);

  // Private Info editing state
  const [dob, setDob] = useState(employee.privateInfo?.dateOfBirth || "");
  const [address, setAddress] = useState(employee.privateInfo?.residingAddress || employee.address);
  const [nationality, setNationality] = useState(employee.privateInfo?.nationality || "United States");
  const [personalEmail, setPersonalEmail] = useState(employee.privateInfo?.personalEmail || employee.email);
  const [gender, setGender] = useState(employee.privateInfo?.gender || "Male");
  const [maritalStatus, setMaritalStatus] = useState(employee.privateInfo?.maritalStatus || "Single");

  const [accountNumber, setAccountNumber] = useState(employee.privateInfo?.bankDetails?.accountNumber || "");
  const [bankName, setBankName] = useState(employee.privateInfo?.bankDetails?.bankName || "");
  const [ifscCode, setIfscCode] = useState(employee.privateInfo?.bankDetails?.ifscCode || "");
  const [panNo, setPanNo] = useState(employee.privateInfo?.bankDetails?.panNo || "");
  const [uanNo, setUanNo] = useState(employee.privateInfo?.bankDetails?.uanNo || "");

  const [savedToast, setSavedToast] = useState(false);

  const handleSaveResume = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmployeeResume(employee.employeeId, {
      about: aboutText,
      whatILoveAboutJob: whatILoveText,
      interestsHobbies: interestsText,
    });
    setIsEditingResume(false);
    showToast();
  };

  const handleSavePrivateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmployeePrivateInfo(employee.employeeId, {
      dateOfBirth: dob,
      residingAddress: address,
      nationality,
      personalEmail,
      gender: gender as any,
      maritalStatus: maritalStatus as any,
      bankDetails: {
        accountNumber,
        bankName,
        ifscCode,
        panNo,
        uanNo,
        empCode: employee.employeeId,
      },
    });
    showToast();
  };

  const handleSaveSalary = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmployeeSalary(employee.employeeId, monthlyWage, workingDays, workingHours, breakTime);
    showToast();
  };

  const showToast = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    addSkillToEmployee(employee.employeeId, { name: newSkillName, level: newSkillLevel });
    setNewSkillName("");
    setIsAddingSkill(false);
  };

  const handleAddCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName.trim()) return;
    addCertificationToEmployee(employee.employeeId, {
      name: newCertName,
      issuer: newCertIssuer || "Verified Authority",
      issueDate: new Date().toISOString().split("T")[0],
    });
    setNewCertName("");
    setNewCertIssuer("");
    setIsAddingCert(false);
  };

  const s = employee.salaryStructure;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-5xl rounded-3xl border border-slate-700/80 bg-slate-900 shadow-2xl text-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Nav Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              {isAdmin ? "Admin Workforce Console" : "Employee Profile"}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">{employee.employeeId}</span>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {savedToast && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-6 py-2 text-xs font-medium text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Changes saved to database successfully.
          </div>
        )}

        {/* Hero Header Area Matching Wireframe */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border-b border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left: Avatar with Edit badge & Info */}
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative">
                <Avatar
                  src={employee.avatar}
                  name={employee.name}
                  size="xl"
                  isOnline={true}
                  className="ring-4 ring-indigo-500/40"
                />
                {canEditPersonal && (
                  <button
                    title="Edit Avatar"
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-md transition-all"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-2xl font-extrabold tracking-tight text-white">
                    {employee.name}
                  </h2>
                  <Badge variant={employee.role === "admin" ? "purple" : "blue"} size="md">
                    {employee.role === "admin" ? "HR Admin" : "Employee"}
                  </Badge>
                  <Badge variant="success" size="md">
                    Active
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mt-2 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400">Login ID: </span>
                    <span className="font-mono text-indigo-300 font-bold">{employee.employeeId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Company: </span>
                    <span className="font-semibold text-white">{employee.companyName || "HRFlowX Technologies"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Email: </span>
                    <span className="text-slate-200">{employee.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Department: </span>
                    <span className="text-indigo-400 font-semibold">{employee.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Mobile: </span>
                    <span className="text-slate-200">{employee.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Manager: </span>
                    <span className="text-slate-200">{employee.managerName || "Executive Team"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher Matching Wireframe */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-800 bg-slate-950/60 overflow-x-auto">
          <button
            onClick={() => setActiveTab("resume")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "resume"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Resume
          </button>

          <button
            onClick={() => setActiveTab("private")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "private"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <UserIcon className="h-3.5 w-3.5" />
            Private Info
          </button>

          {(canEditSalary || isOwnProfile) && (
            <button
              onClick={() => setActiveTab("salary")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "salary"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Receipt className="h-3.5 w-3.5" />
              Salary Info {isAdmin && <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">Admin Only</span>}
            </button>
          )}

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "security"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            Security & Access
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: RESUME */}
          {activeTab === "resume" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: About, What I Love, Interests */}
              <div className="lg:col-span-7 space-y-5">
                {/* About */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      About
                    </h4>
                    {canEditPersonal && (
                      <button
                        onClick={() => setIsEditingResume(!isEditingResume)}
                        className="text-slate-400 hover:text-indigo-400 transition-colors"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  {isEditingResume ? (
                    <Textarea
                      value={aboutText}
                      onChange={(e) => setAboutText(e.target.value)}
                      rows={3}
                      className="text-xs"
                    />
                  ) : (
                    <p className="text-xs text-slate-300 leading-relaxed">{employee.resume?.about}</p>
                  )}
                </div>

                {/* What I Love About My Job */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    What I Love About My Job
                  </h4>
                  {isEditingResume ? (
                    <Textarea
                      value={whatILoveText}
                      onChange={(e) => setWhatILoveText(e.target.value)}
                      rows={3}
                      className="text-xs"
                    />
                  ) : (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {employee.resume?.whatILoveAboutJob}
                    </p>
                  )}
                </div>

                {/* Interests & Hobbies */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    My Interests & Hobbies
                  </h4>
                  {isEditingResume ? (
                    <Textarea
                      value={interestsText}
                      onChange={(e) => setInterestsText(e.target.value)}
                      rows={3}
                      className="text-xs"
                    />
                  ) : (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {employee.resume?.interestsHobbies}
                    </p>
                  )}
                </div>

                {isEditingResume && (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditingResume(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleSaveResume}>
                      Save Bio
                    </Button>
                  </div>
                )}
              </div>

              {/* Right Column: Skills & Certifications */}
              <div className="lg:col-span-5 space-y-5">
                {/* Skills */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Skills
                    </h4>
                    {canEditPersonal && (
                      <button
                        onClick={() => setIsAddingSkill(!isAddingSkill)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Skill
                      </button>
                    )}
                  </div>

                  {isAddingSkill && (
                    <form onSubmit={handleAddSkillSubmit} className="flex gap-2 pt-1 pb-2">
                      <Input
                        placeholder="e.g. React 19"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        className="h-8 text-xs flex-1"
                        autoFocus
                      />
                      <Button type="submit" size="sm" variant="primary" className="h-8 text-xs">
                        Add
                      </Button>
                    </form>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {employee.resume?.skills?.length === 0 ? (
                      <p className="text-xs text-slate-500">No skills added yet.</p>
                    ) : (
                      employee.resume?.skills?.map((sk) => (
                        <span
                          key={sk.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs font-medium"
                        >
                          {sk.name}
                          {canEditPersonal && (
                            <button
                              onClick={() => deleteSkillFromEmployee(employee.employeeId, sk.id)}
                              className="hover:text-rose-400 ml-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Certifications */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Certifications
                    </h4>
                    {canEditPersonal && (
                      <button
                        onClick={() => setIsAddingCert(!isAddingCert)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Certification
                      </button>
                    )}
                  </div>

                  {isAddingCert && (
                    <form onSubmit={handleAddCertSubmit} className="space-y-2 pt-1 pb-2">
                      <Input
                        placeholder="Certificate Title"
                        value={newCertName}
                        onChange={(e) => setNewCertName(e.target.value)}
                        className="h-8 text-xs"
                      />
                      <Input
                        placeholder="Issuing Authority (e.g. AWS, SHRM)"
                        value={newCertIssuer}
                        onChange={(e) => setNewCertIssuer(e.target.value)}
                        className="h-8 text-xs"
                      />
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setIsAddingCert(false)} className="h-7 text-xs">
                          Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" className="h-7 text-xs">
                          Save
                        </Button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2">
                    {employee.resume?.certifications?.length === 0 ? (
                      <p className="text-xs text-slate-500">No certifications uploaded.</p>
                    ) : (
                      employee.resume?.certifications?.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                        >
                          <div>
                            <p className="font-semibold text-white">{c.name}</p>
                            <p className="text-[10px] text-slate-400">
                              {c.issuer} • {c.issueDate}
                            </p>
                          </div>
                          {canEditPersonal && (
                            <button
                              onClick={() => deleteCertificationFromEmployee(employee.employeeId, c.id)}
                              className="text-slate-500 hover:text-rose-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVATE INFO MATCHING WIREFRAME */}
          {activeTab === "private" && (
            <form onSubmit={handleSavePrivateInfo} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Demographic Info */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Personal Details
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Date of Birth</label>
                      <Input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        disabled={!canEditPersonal}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Residing Address</label>
                      <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={!canEditPersonal}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Nationality</label>
                      <Input
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        disabled={!canEditPersonal}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Personal Email</label>
                      <Input
                        type="email"
                        value={personalEmail}
                        onChange={(e) => setPersonalEmail(e.target.value)}
                        disabled={!canEditPersonal}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">Gender</label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value as any)}
                          disabled={!canEditPersonal}
                          className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white focus:outline-none focus:border-indigo-500 disabled:opacity-60"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">Marital Status</label>
                        <select
                          value={maritalStatus}
                          onChange={(e) => setMaritalStatus(e.target.value as any)}
                          disabled={!canEditPersonal}
                          className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white focus:outline-none focus:border-indigo-500 disabled:opacity-60"
                        >
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank & Tax Identification Details */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Bank & Statutory Identifiers
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Bank Name</label>
                      <Input
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        disabled={!canEditPersonal}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Account Number</label>
                      <Input
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        disabled={!canEditPersonal}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">IFSC / Routing Code</label>
                      <Input
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value)}
                        disabled={!canEditPersonal}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">PAN / Tax ID</label>
                        <Input
                          value={panNo}
                          onChange={(e) => setPanNo(e.target.value)}
                          disabled={!canEditPersonal}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">UAN / SSN</label>
                        <Input
                          value={uanNo}
                          onChange={(e) => setUanNo(e.target.value)}
                          disabled={!canEditPersonal}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Employee Code</label>
                      <Input value={employee.employeeId} disabled className="opacity-70 font-mono" />
                    </div>
                  </div>
                </div>
              </div>

              {canEditPersonal && (
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="submit" variant="primary" size="md" className="gap-1.5 font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    Save Private Information
                  </Button>
                </div>
              )}
            </form>
          )}

          {/* TAB 3: SALARY INFO MATCHING EXCALIDRAW WIREFRAME EXACTLY */}
          {activeTab === "salary" && (
            <form onSubmit={handleSaveSalary} className="space-y-6">
              {/* Wage Top Line */}
              <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Monthly Wage ($)</label>
                    <Input
                      type="number"
                      value={monthlyWage}
                      onChange={(e) => setMonthlyWage(Number(e.target.value))}
                      disabled={!canEditSalary}
                      className="font-mono font-bold text-base text-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Yearly Wage ($)</label>
                    <div className="h-11 flex items-center px-3.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono font-bold text-white text-base">
                      {formatCurrency(monthlyWage * 12)}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Working Days / Week</label>
                    <Input
                      type="number"
                      value={workingDays}
                      onChange={(e) => setWorkingDays(Number(e.target.value))}
                      disabled={!canEditSalary}
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Weekly Hours / Break</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={workingHours}
                        onChange={(e) => setWorkingHours(Number(e.target.value))}
                        disabled={!canEditSalary}
                        placeholder="Hours"
                      />
                      <Input
                        type="number"
                        value={breakTime}
                        onChange={(e) => setBreakTime(Number(e.target.value))}
                        disabled={!canEditSalary}
                        placeholder="Mins break"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Components Breakdown Grid matching wireframe */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Earnings Components */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="font-bold uppercase tracking-wider text-indigo-400">
                      Salary Components
                    </h4>
                    <span className="text-slate-400 font-mono text-[11px]">Computation (%)</span>
                  </div>

                  <div className="space-y-3 divide-y divide-slate-800/60">
                    {/* Basic Salary */}
                    <div className="pt-2 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white block">Basic Salary</span>
                        <span className="text-[10px] text-slate-400">50% of Wage</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-white block">{formatCurrency(s.basicSalary)}</span>
                        <span className="text-[10px] text-slate-400 font-mono">50.00 %</span>
                      </div>
                    </div>

                    {/* HRA */}
                    <div className="pt-2 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white block">House Rent Allowance (HRA)</span>
                        <span className="text-[10px] text-slate-400">50% of Basic Salary</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-white block">{formatCurrency(s.houseRentAllowance)}</span>
                        <span className="text-[10px] text-slate-400 font-mono">25.00 %</span>
                      </div>
                    </div>

                    {/* Standard Allowance */}
                    <div className="pt-2 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white block">Standard Allowance</span>
                        <span className="text-[10px] text-slate-400">8.33% of Wage</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-white block">{formatCurrency(s.standardAllowance)}</span>
                        <span className="text-[10px] text-slate-400 font-mono">8.33 %</span>
                      </div>
                    </div>

                    {/* Performance Bonus */}
                    <div className="pt-2 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white block">Performance Bonus</span>
                        <span className="text-[10px] text-slate-400">8.33% of Basic</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-white block">{formatCurrency(s.performanceBonus)}</span>
                        <span className="text-[10px] text-slate-400 font-mono">4.17 %</span>
                      </div>
                    </div>

                    {/* Leave Travel Allowance (LTA) */}
                    <div className="pt-2 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white block">Leave Travel Allowance (LTA)</span>
                        <span className="text-[10px] text-slate-400">8.33% of Basic</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-white block">{formatCurrency(s.leaveTravelAllowance)}</span>
                        <span className="text-[10px] text-slate-400 font-mono">4.17 %</span>
                      </div>
                    </div>

                    {/* Fixed Allowance */}
                    <div className="pt-2 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white block">Fixed Allowance</span>
                        <span className="text-[10px] text-slate-400">Remainder (Wage - Total)</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-white block">{formatCurrency(s.fixedAllowance)}</span>
                        <span className="text-[10px] text-indigo-400 font-mono">
                          {Math.round((s.fixedAllowance / s.monthlyWage) * 100)} %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: PF & Deductions */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="font-bold uppercase tracking-wider text-rose-400">
                      Provident Fund & Statutory Tax
                    </h4>
                    <span className="text-slate-400 font-mono text-[11px]">Deductions</span>
                  </div>

                  <div className="space-y-3 divide-y divide-slate-800/60">
                    <div className="pt-2 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white block">Employee PF (12%)</span>
                        <span className="text-[10px] text-slate-400">12% calculated on Basic</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-rose-400 block">-{formatCurrency(s.employeePf)}</span>
                        <span className="text-[10px] text-slate-400 font-mono">12.00 %</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white block">Employer PF (12%)</span>
                        <span className="text-[10px] text-slate-400">Company matching contribution</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-300 block">{formatCurrency(s.employerPf)}</span>
                        <span className="text-[10px] text-slate-400 font-mono">12.00 %</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white block">Professional Tax</span>
                        <span className="text-[10px] text-slate-400">State statutory deduction</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-rose-400 block">-{formatCurrency(s.professionalTax)}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Fixed</span>
                      </div>
                    </div>

                    {/* Net Payout Calculation */}
                    <div className="pt-4 flex items-center justify-between bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/30">
                      <div>
                        <span className="font-bold text-white text-sm block">Net Monthly Take-Home</span>
                        <span className="text-[11px] text-emerald-400">Gross Wage - (PF + Tax)</span>
                      </div>
                      <span className="text-xl font-bold font-mono text-emerald-400">
                        {formatCurrency(s.netSalary)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {canEditSalary && (
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="submit" variant="primary" size="md" className="gap-1.5 font-semibold">
                    <Sparkles className="h-4 w-4" />
                    Recalculate & Save Structure
                  </Button>
                </div>
              )}
            </form>
          )}

          {/* TAB 4: SECURITY & ACCESS */}
          {activeTab === "security" && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-indigo-400">
                Security & Authentication Credentials
              </h4>
              <p className="text-slate-400">
                Manage login identity, password authentication, and session security.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">System Generated Login ID</span>
                  <span className="font-mono text-indigo-300 font-bold text-sm">{employee.employeeId}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Two-Factor Authentication (2FA)</span>
                  <span className="text-emerald-400 font-semibold">Enforced via Corporate SSO</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
