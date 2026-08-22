export type UserRole = "employee" | "admin" | "hr";

export type EmploymentStatus = "active" | "on_leave" | "probation" | "terminated" | "deactivated";

export type AttendanceStatus = "present" | "absent" | "half_day" | "on_leave" | "late";

export type LeaveType = "paid" | "sick" | "unpaid" | "casual" | "maternity" | "paternity";

export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";

export type NotificationType =
  | "leave_approved"
  | "leave_rejected"
  | "leave_requested"
  | "attendance_correction_approved"
  | "attendance_correction_rejected"
  | "attendance_correction_requested"
  | "payroll_ready"
  | "attendance_alert"
  | "announcement"
  | "system"
  | "profile_updated"
  | "goal_assigned"
  | "document_shared";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  employeeId: string;
  name?: string;
  avatar?: string;
  created_at?: string;
}

export interface BankDetails {
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  panNo: string;
  uanNo: string;
  empCode: string;
}

export interface PrivateInfo {
  dateOfBirth: string;
  residingAddress: string;
  nationality: string;
  personalEmail: string;
  gender: "Male" | "Female" | "Other" | "Prefer not to say";
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
  dateOfJoining: string;
  bankDetails: BankDetails;
}

export interface SkillItem {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface ResumeInfo {
  about: string;
  whatILoveAboutJob: string;
  interestsHobbies: string;
  skills: SkillItem[];
  certifications: CertificationItem[];
}

export interface DynamicSalaryStructure {
  wageType: "Fixed wage" | "Hourly wage";
  monthlyWage: number; // e.g. 50000
  yearlyWage: number; // e.g. 600000
  workingDaysPerWeek: number; // e.g. 5
  workingHoursPerWeek: number; // e.g. 40
  breakTimeMinutes: number; // e.g. 60
  
  // Percentages & Amounts
  basicPercentage: number; // 50% of Wage
  basicSalary: number; // e.g. 25000
  
  hraPercentageOfBasic: number; // 50% of Basic
  houseRentAllowance: number; // e.g. 12500
  
  standardAllowance: number; // e.g. 4167 (8.33% of wage)
  performanceBonusPercentage: number; // 8.33% of Basic
  performanceBonus: number; // e.g. 2082.50
  
  leaveTravelAllowancePercentage: number; // 8.33% of Basic
  leaveTravelAllowance: number; // e.g. 2082.50
  
  fixedAllowance: number; // Remainder: Monthly Wage - (Basic + HRA + Standard + Bonus + LTA)
  
  // Deductions
  pfPercentage: number; // 12% of Basic
  employeePf: number; // e.g. 3000
  employerPf: number; // e.g. 3000
  
  professionalTax: number; // e.g. 200
  
  grossSalary: number;
  netSalary: number;
}

export interface OnboardingChecklist {
  personalInfoDone: boolean;
  documentsUploadedDone: boolean;
  bankDetailsAddedDone: boolean;
  profileCompletedDone: boolean;
  policiesAcknowledgedDone: boolean;
  assetsAssignedDone: boolean;
  hrApprovalDone: boolean;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: "Identity Proof" | "Employment" | "Payroll" | "Policy" | "Certificates" | "Other";
  uploadDate: string;
  size: string;
  fileUrl?: string;
  uploadedBy?: string;
}

export type SalaryStructure = DynamicSalaryStructure;

export interface Employee {
  id: string;
  auth_user_id?: string;
  employeeId: string; // e.g. "OIJO20220001" or "HXAR20230001"
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  address: string;
  companyName: string;
  department: string;
  designation: string; // Job Title
  jobTitle?: string; // alias
  branch: string;
  managerName: string;
  location: string;
  joiningDate: string;
  employmentStatus: EmploymentStatus;
  
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  
  // Extended Sections
  resume: ResumeInfo;
  privateInfo: PrivateInfo;
  salaryStructure: DynamicSalaryStructure;
  
  leaveBalances: {
    paid: { total: number; used: number };
    sick: { total: number; used: number };
    unpaid: { total: number; used: number };
  };
  
  documents: DocumentItem[];
  onboarding: OnboardingChecklist;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // e.g. "09:00 AM"
  checkOut?: string; // e.g. "06:00 PM"
  status: AttendanceStatus;
  workingHours?: string;
  extraHours?: string;
  breakDuration?: string;
  notes?: string;
  location?: "Office" | "Remote" | "Client Site";
}

export interface AttendanceCorrectionRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  date: string;
  requestedCheckIn: string;
  requestedCheckOut: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  adminComment?: string;
  attachmentUrl?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  attachmentUrl?: string;
  reviewedBy?: string;
  reviewedDate?: string;
  adminComment?: string;
}

export interface SalarySlip {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  month: string; // e.g. "August 2026"
  payPeriod: string;
  paymentDate: string;
  monthlyWage: number;
  basicSalary: number;
  hra: number;
  standardAllowance: number;
  performanceBonus: number;
  lta: number;
  fixedAllowance: number;
  pfDeduction: number;
  taxDeduction: number;
  unpaidLeaveDeduction: number;
  grossEarnings: number;
  totalDeductions: number;
  netPay: number;
  status: "paid" | "processed" | "draft";
}

export interface CompanyProfile {
  name: string;
  identifier: string; // 2-letter code e.g. "HX" or "OI"
  industry: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  address: string;
  status: "active" | "inactive";
  headOfBranch?: string;
  employeeCount?: number;
}

export interface CompanyPolicy {
  id: string;
  title: string;
  category: "Conduct" | "Leave & Attendance" | "Compensation" | "Security" | "Remote Work";
  content: string;
  effectiveDate: string;
  isPublished: boolean;
  version: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "high" | "medium" | "low";
  publishDate: string;
  expiryDate?: string;
  status: "active" | "archived";
  authorName: string;
}

export interface Goal {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  target: string;
  dueDate: string;
  progress: number; // 0 - 100
  status: "on_track" | "behind" | "completed" | "at_risk";
  feedback?: string;
  assignedBy: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  type: "National Holiday" | "Company Holiday" | "Optional Holiday";
  description: string;
}

export interface Asset {
  id: string;
  assetName: string;
  assetId: string;
  category: "Laptop" | "Monitor" | "Phone" | "Access Card" | "Peripheral";
  serialNumber: string;
  employeeId?: string;
  employeeName?: string;
  assignedDate?: string;
  returnDate?: string;
  status: "assigned" | "available" | "maintenance";
}

export interface SupportTicket {
  id: string;
  employeeId: string;
  employeeName: string;
  subject: string;
  category: "Payroll" | "Attendance" | "Leave" | "IT Hardware" | "General HR";
  priority: "low" | "medium" | "high" | "urgent";
  message: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
  hrReply?: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  targetRole?: "all" | "employee" | "admin";
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLink?: string;
}

export interface AuditLog {
  id: string;
  user: string;
  userRole: UserRole;
  action: string;
  resource: string;
  target: string;
  description: string;
  timestamp: string;
  type: "employee" | "attendance" | "leave" | "salary" | "payroll" | "policy" | "system" | "asset";
}
