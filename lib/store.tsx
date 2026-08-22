"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  SalarySlip,
  NotificationItem,
  AuditLog,
  User,
  UserRole,
  LeaveType,
  CompanyProfile,
  Branch,
  CompanyPolicy,
  Announcement,
  Goal,
  Holiday,
  Asset,
  SupportTicket,
  AttendanceCorrectionRequest,
  SkillItem,
  CertificationItem,
  ResumeInfo,
  PrivateInfo,
  DynamicSalaryStructure,
} from "@/types";
import {
  INITIAL_COMPANY,
  INITIAL_BRANCHES,
  INITIAL_POLICIES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_HOLIDAYS,
  INITIAL_EMPLOYEES,
  generateInitialAttendance,
  INITIAL_ATTENDANCE_REQUESTS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_GOALS,
  INITIAL_ASSETS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SALARY_SLIPS,
  INITIAL_NOTIFICATIONS,
} from "@/lib/mockData";
import { generateEmployeeId, calculateDynamicSalaryStructure } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createBrowserClient } from "@/lib/supabase/client";
import {
  fetchEmployeesFromSupabase,
  createEmployeeInSupabase,
  updateEmployeeInSupabase,
  updateEmployeePrivateInfoInSupabase,
  updateEmployeeSalaryInSupabase,
  deleteEmployeeInSupabase,
} from "@/lib/supabase/supabaseEmployees";
import {
  fetchAttendanceRecordsFromSupabase,
  fetchAttendanceRequestsFromSupabase,
  punchInInSupabase,
  punchOutInSupabase,
  createAttendanceCorrectionRequestInSupabase,
  approveAttendanceCorrectionRequestInSupabase,
  rejectAttendanceCorrectionRequestInSupabase,
} from "@/lib/supabase/supabaseAttendance";
import {
  fetchLeaveRequestsFromSupabase,
  applyLeaveInSupabase,
  approveLeaveInSupabase,
  rejectLeaveInSupabase,
  cancelLeaveInSupabase,
} from "@/lib/supabase/supabaseLeave";
import {
  fetchSalarySlipsFromSupabase,
  processPayrollInSupabase,
} from "@/lib/supabase/supabasePayroll";
import {
  fetchDocumentsFromSupabase,
  uploadDocumentToSupabase,
  getSignedDocumentUrlFromSupabase,
  deleteDocumentFromSupabase,
  SupabaseDocumentRecord,
} from "@/lib/supabase/supabaseDocuments";
import {
  fetchNotificationsFromSupabase,
  createNotificationInSupabase,
  markNotificationAsReadInSupabase,
  markAllNotificationsAsReadInSupabase,
  subscribeToNotificationsInSupabase,
} from "@/lib/supabase/supabaseNotifications";
import {
  fetchGoalsFromSupabase,
  createGoalInSupabase,
  updateGoalProgressInSupabase,
  fetchPerformanceReviewsFromSupabase,
  fetchAssetsFromSupabase,
  assignAssetInSupabase,
  fetchSupportTicketsFromSupabase,
  createSupportTicketInSupabase,
  replySupportTicketInSupabase,
  fetchAnnouncementsFromSupabase,
  fetchHolidaysFromSupabase,
  fetchAuditLogsFromSupabase,
  createAuditLogInSupabase,
} from "@/lib/supabase/supabaseExtended";

interface AppStoreContextType {
  // Auth
  currentUser: User | null;
  currentEmployee: Employee | null;
  isAuthenticated: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  login: (identifier: string, pass?: string, role?: UserRole) => Promise<boolean>;
  signUpUser: (data: {
    companyName: string;
    fullName: string;
    email: string;
    phone?: string;
    password?: string;
  }) => Promise<boolean>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  changePassword: (newPass: string) => void;

  // Company & Branches
  company: CompanyProfile;
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void;
  branches: Branch[];
  addBranch: (branch: Omit<Branch, "id">) => void;
  updateBranch: (id: string, updates: Partial<Branch>) => void;
  deleteBranch: (id: string) => void;

  // Policies
  policies: CompanyPolicy[];
  addPolicy: (policy: Omit<CompanyPolicy, "id">) => void;
  updatePolicy: (id: string, updates: Partial<CompanyPolicy>) => void;
  deletePolicy: (id: string) => void;
  togglePolicyPublish: (id: string) => void;

  // Employees CRUD
  employees: Employee[];
  isLoadingEmployees: boolean;
  getEmployeeById: (id: string) => Employee | undefined;
  updateEmployee: (employeeId: string, updates: Partial<Employee>) => void;
  addEmployee: (empData: {
    name: string;
    email: string;
    role: UserRole;
    jobTitle: string;
    department: string;
    branch?: string;
    monthlyWage: number;
    phone?: string;
    address?: string;
    location?: string;
  }) => Employee;
  deleteEmployee: (employeeId: string) => void;
  updateEmployeeResume: (employeeId: string, resume: Partial<ResumeInfo>) => void;
  updateEmployeePrivateInfo: (employeeId: string, privateInfo: Partial<PrivateInfo>) => void;
  updateEmployeeSalary: (employeeId: string, wage: number, days?: number, hours?: number, breakTime?: number) => void;
  addSkillToEmployee: (employeeId: string, skill: Omit<SkillItem, "id">) => void;
  deleteSkillFromEmployee: (employeeId: string, skillId: string) => void;
  addCertificationToEmployee: (employeeId: string, cert: Omit<CertificationItem, "id">) => void;
  deleteCertificationFromEmployee: (employeeId: string, certId: string) => void;

  // Attendance
  attendanceRecords: AttendanceRecord[];
  todayAttendance: AttendanceRecord | undefined;
  isPunchedIn: boolean;
  punchInTime: string | null;
  punchIn: (location?: "Office" | "Remote") => void;
  punchOut: () => void;
  attendanceRequests: AttendanceCorrectionRequest[];
  raiseAttendanceCorrectionRequest: (data: {
    date: string;
    requestedCheckIn: string;
    requestedCheckOut: string;
    reason: string;
  }) => void;
  approveAttendanceCorrectionRequest: (id: string, comment?: string) => void;
  rejectAttendanceCorrectionRequest: (id: string, comment?: string) => void;

  // Time Off / Leaves
  leaveRequests: LeaveRequest[];
  applyLeave: (leaveData: {
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    totalDays: number;
    attachmentUrl?: string;
  }) => LeaveRequest;
  approveLeave: (leaveId: string, comment?: string) => void;
  rejectLeave: (leaveId: string, comment?: string) => void;
  cancelLeave: (leaveId: string) => void;

  // Payroll
  salarySlips: SalarySlip[];
  generateMonthlyPayslip: (employeeId: string, month: string) => SalarySlip;
  runBatchPayroll: (month: string) => void;

  // Announcements, Goals, Holidays, Assets, Support
  announcements: Announcement[];
  addAnnouncement: (item: Omit<Announcement, "id">) => void;
  deleteAnnouncement: (id: string) => void;

  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id">) => void;
  updateGoalProgress: (id: string, progress: number, status?: Goal["status"]) => void;
  deleteGoal: (id: string) => void;

  holidays: Holiday[];
  addHoliday: (holiday: Omit<Holiday, "id">) => void;
  deleteHoliday: (id: string) => void;

  assets: Asset[];
  addAsset: (asset: Omit<Asset, "id">) => void;
  assignAssetToEmployee: (assetId: string, employeeId: string, employeeName: string) => void;
  deleteAsset: (id: string) => void;

  supportTickets: SupportTicket[];
  createSupportTicket: (ticket: Omit<SupportTicket, "id" | "createdAt" | "status">) => void;
  replySupportTicket: (id: string, reply: string, status?: SupportTicket["status"]) => void;

  // Notifications & Audit Logs
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, "id" | "timestamp">) => void;

  // UI State
  theme: "dark" | "light";
  toggleTheme: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  employeeViewMode: "grid" | "table";
  setEmployeeViewMode: (mode: "grid" | "table") => void;
  selectedEmployeeForModal: Employee | null;
  setSelectedEmployeeForModal: (emp: Employee | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  resetToDefaultData: () => void;
}

const AppStoreContext = createContext<AppStoreContextType | undefined>(undefined);
const STORAGE_KEY = "hrflowx_master_storage_v2";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [company, setCompany] = useState<CompanyProfile>(INITIAL_COMPANY);
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [policies, setPolicies] = useState<CompanyPolicy[]>(INITIAL_POLICIES);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceRequests, setAttendanceRequests] = useState<AttendanceCorrectionRequest[]>(INITIAL_ATTENDANCE_REQUESTS);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [salarySlips, setSalarySlips] = useState<SalarySlip[]>(INITIAL_SALARY_SLIPS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [holidays, setHolidays] = useState<Holiday[]>(INITIAL_HOLIDAYS);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Auth User state & errors
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: "usr-001",
    email: "employee@hrflowx.io",
    role: "employee",
    employeeId: "HXAS20230001",
    name: "Arjun Sharma",
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState<boolean>(false);

  // UI state
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [employeeViewMode, setEmployeeViewMode] = useState<"grid" | "table">("grid");
  const [selectedEmployeeForModal, setSelectedEmployeeForModal] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Fetch employees from Supabase if configured
  useEffect(() => {
    async function loadEmployees() {
      if (isSupabaseConfigured()) {
        setIsLoadingEmployees(true);
        const fetched = await fetchEmployeesFromSupabase();
        if (fetched && fetched.length > 0) {
          setEmployees(fetched);
        } else if (fetched && fetched.length === 0) {
          // Table exists but is empty -> seed initial employees into Supabase
          for (let i = 0; i < INITIAL_EMPLOYEES.length; i++) {
            const initEmp = INITIAL_EMPLOYEES[i];
            await createEmployeeInSupabase(
              {
                name: initEmp.name,
                email: initEmp.email,
                role: initEmp.role,
                jobTitle: initEmp.designation,
                department: initEmp.department,
                monthlyWage: initEmp.salaryStructure.monthlyWage,
                phone: initEmp.phone,
                address: initEmp.address,
                location: initEmp.location,
                companyName: initEmp.companyName,
              },
              i
            );
          }
          const reFetched = await fetchEmployeesFromSupabase();
          if (reFetched && reFetched.length > 0) {
            setEmployees(reFetched);
          }
        }
        setIsLoadingEmployees(false);
      }
    }
    loadEmployees();
  }, []);

  const [isLoadingAttendance, setIsLoadingAttendance] = useState<boolean>(false);
  const [isLoadingLeaves, setIsLoadingLeaves] = useState<boolean>(false);
  const [isLoadingPayroll, setIsLoadingPayroll] = useState<boolean>(false);

  // Fetch Attendance from Supabase
  useEffect(() => {
    async function loadAttendanceData() {
      if (isSupabaseConfigured()) {
        setIsLoadingAttendance(true);
        const records = await fetchAttendanceRecordsFromSupabase();
        if (records) setAttendanceRecords(records);
        const reqs = await fetchAttendanceRequestsFromSupabase();
        if (reqs) setAttendanceRequests(reqs);
        setIsLoadingAttendance(false);
      }
    }
    loadAttendanceData();
  }, []);

  // Fetch Leave Requests from Supabase
  useEffect(() => {
    async function loadLeaveData() {
      if (isSupabaseConfigured()) {
        setIsLoadingLeaves(true);
        const reqs = await fetchLeaveRequestsFromSupabase();
        if (reqs) setLeaveRequests(reqs);
        setIsLoadingLeaves(false);
      }
    }
    loadLeaveData();
  }, []);

  const [vaultDocuments, setVaultDocuments] = useState<SupabaseDocumentRecord[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState<boolean>(false);

  // Fetch Salary Slips / Payroll from Supabase
  useEffect(() => {
    async function loadPayrollData() {
      if (isSupabaseConfigured()) {
        setIsLoadingPayroll(true);
        const slips = await fetchSalarySlipsFromSupabase();
        if (slips) setSalarySlips(slips);
        setIsLoadingPayroll(false);
      }
    }
    loadPayrollData();
  }, []);

  // Fetch Documents metadata from Supabase
  useEffect(() => {
    async function loadDocumentsData() {
      if (isSupabaseConfigured()) {
        setIsLoadingDocuments(true);
        const docs = await fetchDocumentsFromSupabase();
        if (docs) setVaultDocuments(docs);
        setIsLoadingDocuments(false);
      }
    }
    loadDocumentsData();
  }, []);

  const currentEmployee = currentUser
    ? employees.find((e) => e.employeeId === currentUser.employeeId || e.email.toLowerCase() === currentUser.email.toLowerCase()) || employees[1]
    : null;

  // Fetch Notifications & subscribe to Realtime
  useEffect(() => {
    async function loadNotificationsData() {
      if (isSupabaseConfigured()) {
        const empId = currentUser?.employeeId || currentEmployee?.employeeId;
        const fetched = await fetchNotificationsFromSupabase(empId);
        if (fetched) setNotifications(fetched);

        if (empId) {
          const unsubscribe = subscribeToNotificationsInSupabase(empId, (newNotif) => {
            setNotifications((prev) => {
              if (prev.some((n) => n.id === newNotif.id)) return prev;
              return [newNotif, ...prev];
            });
          });
          return () => unsubscribe();
        }
      }
    }
    loadNotificationsData();
  }, [currentUser, currentEmployee]);

  // Fetch Extended Modules (Goals, Performance, Assets, Support, Announcements, Holidays, Audit)
  useEffect(() => {
    async function loadExtendedData() {
      if (isSupabaseConfigured()) {
        const empId = currentUser?.employeeId || currentEmployee?.employeeId;
        const [g, p, a, s, ann, h, log] = await Promise.all([
          fetchGoalsFromSupabase(empId),
          fetchPerformanceReviewsFromSupabase(empId),
          fetchAssetsFromSupabase(),
          fetchSupportTicketsFromSupabase(),
          fetchAnnouncementsFromSupabase(),
          fetchHolidaysFromSupabase(),
          fetchAuditLogsFromSupabase(),
        ]);
        if (g) setGoals(g);
        if (a) setAssets(a);
        if (s) setSupportTickets(s);
        if (ann) setAnnouncements(ann);
        if (h) setHolidays(h);
        if (log) setAuditLogs(log);
      }
    }
    loadExtendedData();
  }, [currentUser, currentEmployee]);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (p.company) setCompany(p.company);
        if (p.branches) setBranches(p.branches);
        if (p.policies) setPolicies(p.policies);
        if (p.employees) setEmployees(p.employees);
        if (p.attendanceRecords) setAttendanceRecords(p.attendanceRecords);
        if (p.attendanceRequests) setAttendanceRequests(p.attendanceRequests);
        if (p.leaveRequests) setLeaveRequests(p.leaveRequests);
        if (p.salarySlips) setSalarySlips(p.salarySlips);
        if (p.announcements) setAnnouncements(p.announcements);
        if (p.goals) setGoals(p.goals);
        if (p.holidays) setHolidays(p.holidays);
        if (p.assets) setAssets(p.assets);
        if (p.supportTickets) setSupportTickets(p.supportTickets);
        if (p.notifications) setNotifications(p.notifications);
        if (p.auditLogs) setAuditLogs(p.auditLogs);
        if (p.currentUser) setCurrentUser(p.currentUser);
        if (p.theme) setTheme(p.theme);
      } else {
        setAttendanceRecords(generateInitialAttendance());
      }
    } catch (e) {
      console.error("Storage load error", e);
      setAttendanceRecords(generateInitialAttendance());
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          company,
          branches,
          policies,
          employees,
          attendanceRecords,
          attendanceRequests,
          leaveRequests,
          salarySlips,
          announcements,
          goals,
          holidays,
          assets,
          supportTickets,
          notifications,
          auditLogs,
          currentUser,
          theme,
        })
      );
    } catch (e) {
      console.error("Storage save error", e);
    }
  }, [
    company,
    branches,
    policies,
    employees,
    attendanceRecords,
    attendanceRequests,
    leaveRequests,
    salarySlips,
    announcements,
    goals,
    holidays,
    assets,
    supportTickets,
    notifications,
    auditLogs,
    currentUser,
    theme,
    isLoaded,
  ]);

  // Theme application
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [theme]);

  // Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Helper audit logger
  const addAuditLog = (log: Omit<AuditLog, "id" | "timestamp">) => {
    const newLog: AuditLog = {
      ...log,
      id: `aud-${Date.now()}`,
      timestamp: "Just now",
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    if (isSupabaseConfigured()) {
      const empId = currentUser?.employeeId || currentEmployee?.employeeId;
      createAuditLogInSupabase(log, empId);
    }
  };

  // Helper notification dispatcher
  const addNotification = (item: Omit<NotificationItem, "id" | "timestamp" | "read">) => {
    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [newItem, ...prev]);
    if (isSupabaseConfigured()) {
      const empId = currentUser?.employeeId || currentEmployee?.employeeId;
      if (empId) {
        createNotificationInSupabase(empId, item.title, item.message, item.type);
      }
    }
  };

  // Helper to map and verify Supabase Auth user to an employee record in state/DB
  const verifyAndBindSupabaseUser = (authUser: any) => {
    if (!authUser) {
      setCurrentUser(null);
      return;
    }
    const userEmail = authUser.email?.toLowerCase();
    
    // Find matching employee by auth_user_id or email
    const emp = employees.find(
      (e) => (e.auth_user_id && e.auth_user_id === authUser.id) || e.email.toLowerCase() === userEmail
    );

    if (!emp) {
      setAuthError("No active employee profile is linked to this account. Please contact your HR Administrator.");
      setCurrentUser(null);
      return;
    }

    // Role MUST be derived directly from the verified database/store employee record!
    const verifiedRole: UserRole = emp.role;

    if (!emp.auth_user_id) {
      emp.auth_user_id = authUser.id;
    }

    setCurrentUser({
      id: authUser.id || `usr-${emp.employeeId}`,
      email: emp.email,
      role: verifiedRole,
      employeeId: emp.employeeId,
      name: emp.name,
      avatar: emp.avatar,
    });
    setAuthError(null);
  };

  // Supabase auth state listener
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createBrowserClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        verifyAndBindSupabaseUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        verifyAndBindSupabaseUser(session.user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [employees]);

  // Authentication via Supabase Auth
  const login = async (identifier: string, pass: string = "password123", targetRole?: UserRole): Promise<boolean> => {
    setAuthError(null);
    const clean = identifier.trim().toLowerCase();

    // Map identifier to employee
    let emp = employees.find(
      (e) => e.email.toLowerCase() === clean || e.employeeId.toLowerCase() === clean
    );

    if (!emp) {
      if (clean.includes("admin") || targetRole === "admin") {
        emp = employees.find((e) => e.role === "admin") || employees[0];
      } else if (clean.includes("employee") || targetRole === "employee") {
        emp = employees.find((e) => e.role === "employee") || employees[1];
      }
    }

    const targetEmail = emp ? emp.email : (clean.includes("@") ? clean : `${clean}@hrflowx.io`);

    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();

      let authenticatedUser = null;
      let authErr: string | null = null;

      const signInRes = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: pass,
      });

      if (signInRes.data?.user) {
        authenticatedUser = signInRes.data.user;
      } else {
        authErr = signInRes.error?.message || "Authentication failed";
        if (
          signInRes.error &&
          (signInRes.error.message.includes("Invalid login credentials") ||
            signInRes.error.message.includes("User not found"))
        ) {
          const signUpRes = await supabase.auth.signUp({
            email: targetEmail,
            password: pass,
            options: {
              data: { full_name: emp ? emp.name : "HR Personnel" },
            },
          });
          if (signUpRes.data?.user) {
            authenticatedUser = signUpRes.data.user;
            authErr = null;
          }
        }
      }

      if (authErr || !authenticatedUser) {
        setAuthError(authErr || "Invalid credentials. Please verify your login details.");
        return false;
      }

      const currentEmpMatch = employees.find(
        (e) =>
          (e.auth_user_id && e.auth_user_id === authenticatedUser.id) ||
          e.email.toLowerCase() === targetEmail.toLowerCase()
      );

      if (!currentEmpMatch) {
        await supabase.auth.signOut();
        setAuthError(
          "No active employee profile is linked to this account. Please contact your HR Administrator."
        );
        setCurrentUser(null);
        return false;
      }

      verifyAndBindSupabaseUser(authenticatedUser);
      setActiveView("dashboard");

      addAuditLog({
        user: currentEmpMatch.name,
        userRole: currentEmpMatch.role,
        action: "Logged In (Supabase Auth)",
        resource: "Auth",
        target: currentEmpMatch.employeeId,
        description: `Authenticated via Supabase Auth as ${currentEmpMatch.role === "admin" ? "HR Admin" : "Employee"}`,
        type: "system",
      });

      return true;
    } else {
      if (!emp) {
        setAuthError("No active employee profile found. Please check your credentials.");
        return false;
      }

      setCurrentUser({
        id: `usr-${emp.employeeId}`,
        email: emp.email,
        role: emp.role,
        employeeId: emp.employeeId,
        name: emp.name,
        avatar: emp.avatar,
      });
      setAuthError(null);
      setActiveView("dashboard");
      addAuditLog({
        user: emp.name,
        userRole: emp.role,
        action: "Logged In to Workspace",
        resource: "Auth",
        target: emp.employeeId,
        description: `Signed in as ${emp.role === "admin" ? "HR Admin" : "Employee"}`,
        type: "system",
      });
      return true;
    }
  };

  const signUpUser = async (data: {
    companyName: string;
    fullName: string;
    email: string;
    phone?: string;
    password?: string;
  }): Promise<boolean> => {
    setAuthError(null);
    const pass = data.password || "password123";

    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: pass,
        options: {
          data: {
            full_name: data.fullName,
            company_name: data.companyName,
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        return false;
      }

      if (data.companyName) {
        updateCompanyProfile({ name: data.companyName });
      }

      const newEmp = addEmployee({
        name: data.fullName,
        email: data.email,
        role: "admin",
        jobTitle: "Founder & Chief Executive Officer",
        department: "Executive Leadership",
        phone: data.phone,
        monthlyWage: 25000,
      });

      if (authData.user) {
        newEmp.auth_user_id = authData.user.id;
        verifyAndBindSupabaseUser(authData.user);
      }
      return true;
    } else {
      if (data.companyName) {
        updateCompanyProfile({ name: data.companyName });
      }
      const created = addEmployee({
        name: data.fullName,
        email: data.email,
        role: "admin",
        jobTitle: "Founder & Chief Executive Officer",
        department: "Executive Leadership",
        phone: data.phone,
        monthlyWage: 25000,
      });
      await login(created.email, pass, "admin");
      return true;
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    setAuthError(null);
    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true, message: "Password reset instructions have been sent to your email." };
    }
    return { success: true, message: "Password reset link sent (demo mode)." };
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
    }
    if (currentEmployee) {
      addAuditLog({
        user: currentEmployee.name,
        userRole: currentEmployee.role,
        action: "Logged Out",
        resource: "Auth",
        target: currentEmployee.employeeId,
        description: "Session closed",
        type: "system",
      });
    }
    setCurrentUser(null);
    setActiveView("dashboard");
  };

  const switchDemoRole = (role: UserRole) => {
    if (role === "admin" || role === "hr") {
      const adminEmp = employees.find((e) => e.role === "admin") || employees[0];
      setCurrentUser({
        id: `usr-${adminEmp.employeeId}`,
        email: adminEmp.email,
        role: "admin",
        employeeId: adminEmp.employeeId,
        name: adminEmp.name,
        avatar: adminEmp.avatar,
      });
    } else {
      const regularEmp = employees.find((e) => e.employeeId === "HXAS20230001") || employees[1];
      setCurrentUser({
        id: `usr-${regularEmp.employeeId}`,
        email: regularEmp.email,
        role: "employee",
        employeeId: regularEmp.employeeId,
        name: regularEmp.name,
        avatar: regularEmp.avatar,
      });
    }
    setActiveView("dashboard");
  };

  const changePassword = (newPass: string) => {
    addNotification({
      type: "system",
      title: "Security Credentials Updated",
      message: "Your master login password has been changed successfully.",
      targetRole: "employee",
    });
  };

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCompany(INITIAL_COMPANY);
    setBranches(INITIAL_BRANCHES);
    setPolicies(INITIAL_POLICIES);
    setEmployees(INITIAL_EMPLOYEES);
    setAttendanceRecords(generateInitialAttendance());
    setAttendanceRequests(INITIAL_ATTENDANCE_REQUESTS);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setSalarySlips(INITIAL_SALARY_SLIPS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setGoals(INITIAL_GOALS);
    setHolidays(INITIAL_HOLIDAYS);
    setAssets(INITIAL_ASSETS);
    setSupportTickets(INITIAL_SUPPORT_TICKETS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentUser({
      id: "usr-001",
      email: "employee@hrflowx.io",
      role: "employee",
      employeeId: "HXAS20230001",
      name: "Arjun Sharma",
    });
  };

  // Company & Branches
  const updateCompanyProfile = (profile: Partial<CompanyProfile>) => {
    setCompany((prev) => ({ ...prev, ...profile }));
    addAuditLog({
      user: "HR Administrator",
      userRole: "admin",
      action: "Updated Company Profile",
      resource: "Company Settings",
      target: company.name,
      description: "Company details and branding updated",
      type: "system",
    });
  };

  const addBranch = (b: Omit<Branch, "id">) => {
    const newB: Branch = { ...b, id: `br-${Date.now()}` };
    setBranches((prev) => [...prev, newB]);
  };

  const updateBranch = (id: string, updates: Partial<Branch>) => {
    setBranches((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBranch = (id: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  // Policies
  const addPolicy = (p: Omit<CompanyPolicy, "id">) => {
    const newP: CompanyPolicy = { ...p, id: `pol-${Date.now()}` };
    setPolicies((prev) => [newP, ...prev]);
  };

  const updatePolicy = (id: string, updates: Partial<CompanyPolicy>) => {
    setPolicies((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePolicy = (id: string) => {
    setPolicies((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePolicyPublish = (id: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p))
    );
  };

  // Today's attendance state
  const todayStr = new Date().toISOString().split("T")[0];
  const todayAttendance = currentEmployee
    ? attendanceRecords.find(
        (rec) => rec.employeeId === currentEmployee.employeeId && rec.date === todayStr
      )
    : undefined;

  const isPunchedIn = Boolean(todayAttendance && todayAttendance.checkIn && !todayAttendance.checkOut);
  const punchInTime = todayAttendance?.checkIn || null;

  // Punch In
  const punchIn = (location: "Office" | "Remote" = "Office") => {
    if (!currentEmployee) return;
    const now = new Date();
    const formattedTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const newRecord: AttendanceRecord = {
      id: `att-${currentEmployee.employeeId}-${todayStr}`,
      employeeId: currentEmployee.employeeId,
      employeeName: currentEmployee.name,
      employeeAvatar: currentEmployee.avatar,
      date: todayStr,
      checkIn: formattedTime,
      status: "present",
      workingHours: "0h 01m",
      breakDuration: "0m",
      location,
    };

    setAttendanceRecords((prev) => {
      const filtered = prev.filter((r) => !(r.employeeId === currentEmployee.employeeId && r.date === todayStr));
      return [newRecord, ...filtered];
    });

    if (isSupabaseConfigured()) {
      punchInInSupabase(currentEmployee.employeeId, location).then((rec) => {
        if (rec) {
          setAttendanceRecords((prev) =>
            prev.map((r) => (r.date === todayStr && r.employeeId === currentEmployee.employeeId ? rec : r))
          );
        }
      });
    }

    addAuditLog({
      user: currentEmployee.name,
      userRole: currentEmployee.role,
      action: "Punched In",
      resource: "Attendance",
      target: currentEmployee.employeeId,
      description: `Checked in at ${formattedTime} (${location})`,
      type: "attendance",
    });

    addNotification({
      type: "attendance_alert",
      title: "Biometric Punch In Verified",
      message: `You successfully punched in at ${formattedTime}. Have an outstanding day!`,
      targetRole: "employee",
    });
  };

  // Punch Out
  const punchOut = () => {
    if (!currentEmployee || !todayAttendance) return;
    const now = new Date();
    const formattedTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const checkIn = todayAttendance.checkIn || "09:00 AM";
    const parseMins = (str: string) => {
      const [t, m] = str.split(" ");
      let [h, min] = t.split(":").map(Number);
      if (m === "PM" && h < 12) h += 12;
      if (m === "AM" && h === 12) h = 0;
      return h * 60 + min;
    };
    const diff = Math.max(1, parseMins(formattedTime) - parseMins(checkIn));
    const totalHours = `${Math.floor(diff / 60)}h ${diff % 60}m`;

    const updatedRecord: AttendanceRecord = {
      ...todayAttendance,
      checkOut: formattedTime,
      workingHours: totalHours,
    };

    setAttendanceRecords((prev) => prev.map((r) => (r.id === todayAttendance.id ? updatedRecord : r)));

    if (isSupabaseConfigured()) {
      punchOutInSupabase(currentEmployee.employeeId).then((rec) => {
        if (rec) {
          setAttendanceRecords((prev) => prev.map((r) => (r.id === todayAttendance.id ? rec : r)));
        }
      });
    }

    addAuditLog({
      user: currentEmployee.name,
      userRole: currentEmployee.role,
      action: "Punched Out",
      resource: "Attendance",
      target: currentEmployee.employeeId,
      description: `Ended shift at ${formattedTime} (Total logged: ${totalHours})`,
      type: "attendance",
    });
  };

  // Attendance Correction Requests
  const raiseAttendanceCorrectionRequest = (data: {
    date: string;
    requestedCheckIn: string;
    requestedCheckOut: string;
    reason: string;
  }) => {
    if (!currentEmployee) return;
    const newReq: AttendanceCorrectionRequest = {
      id: `att-req-${Date.now()}`,
      employeeId: currentEmployee.employeeId,
      employeeName: currentEmployee.name,
      employeeAvatar: currentEmployee.avatar,
      department: currentEmployee.department,
      date: data.date,
      requestedCheckIn: data.requestedCheckIn,
      requestedCheckOut: data.requestedCheckOut,
      reason: data.reason,
      status: "pending",
      appliedDate: new Date().toISOString().split("T")[0],
    };

    setAttendanceRequests((prev) => [newReq, ...prev]);

    if (isSupabaseConfigured()) {
      createAttendanceCorrectionRequestInSupabase(currentEmployee.employeeId, data).then((created) => {
        if (created) {
          setAttendanceRequests((prev) => prev.map((r) => (r.id === newReq.id ? created : r)));
        }
      });
    }

    addNotification({
      type: "attendance_correction_requested",
      title: "Attendance Correction Requested",
      message: `${currentEmployee.name} requested timesheet adjustment for ${data.date}.`,
      targetRole: "admin",
    });

    addAuditLog({
      user: currentEmployee.name,
      userRole: currentEmployee.role,
      action: "Submitted Attendance Correction Request",
      resource: "Attendance",
      target: `${data.date}`,
      description: `Requested in: ${data.requestedCheckIn}, out: ${data.requestedCheckOut}`,
      type: "attendance",
    });
  };

  const approveAttendanceCorrectionRequest = (id: string, comment: string = "Approved by HR.") => {
    const req = attendanceRequests.find((r) => r.id === id);
    if (!req) return;

    setAttendanceRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "approved",
              reviewedBy: "Sarah Jenkins (HR Director)",
              reviewedDate: new Date().toISOString().split("T")[0],
              adminComment: comment,
            }
          : r
      )
    );

    // Update actual attendance record
    setAttendanceRecords((prev) => {
      const existing = prev.find((r) => r.employeeId === req.employeeId && r.date === req.date);
      if (existing) {
        return prev.map((r) =>
          r.id === existing.id
            ? {
                ...r,
                checkIn: req.requestedCheckIn,
                checkOut: req.requestedCheckOut,
                status: "present",
                notes: `Corrected: ${comment}`,
              }
            : r
        );
      } else {
        const newRecord: AttendanceRecord = {
          id: `att-${req.employeeId}-${req.date}`,
          employeeId: req.employeeId,
          employeeName: req.employeeName,
          date: req.date,
          checkIn: req.requestedCheckIn,
          checkOut: req.requestedCheckOut,
          status: "present",
          workingHours: "8h 30m",
          notes: `Adjusted by HR: ${comment}`,
        };
        return [newRecord, ...prev];
      }
    });

    if (isSupabaseConfigured()) {
      approveAttendanceCorrectionRequestInSupabase(id, currentUser?.employeeId, comment);
    }

    addNotification({
      type: "attendance_correction_approved",
      title: "Attendance Correction Approved ✓",
      message: `Your timesheet request for ${req.date} has been adjusted.`,
      targetRole: "employee",
    });

    addAuditLog({
      user: "Sarah Jenkins",
      userRole: "admin",
      action: "Approved Attendance Correction",
      resource: "Attendance",
      target: `${req.employeeName} (${req.date})`,
      description: `Adjusted timesheet to ${req.requestedCheckIn} - ${req.requestedCheckOut}`,
      type: "attendance",
    });
  };

  const rejectAttendanceCorrectionRequest = (id: string, comment: string = "Declined.") => {
    setAttendanceRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "rejected",
              reviewedBy: "Sarah Jenkins (HR Director)",
              reviewedDate: new Date().toISOString().split("T")[0],
              adminComment: comment,
            }
          : r
      )
    );

    if (isSupabaseConfigured()) {
      rejectAttendanceCorrectionRequestInSupabase(id, currentUser?.employeeId, comment);
    }
  };

  // Employees CRUD
  const getEmployeeById = (id: string) => {
    return employees.find((e) => e.id === id || e.employeeId === id);
  };

  const updateEmployee = (employeeId: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((e) => (e.employeeId === employeeId || e.id === employeeId ? { ...e, ...updates } : e))
    );
    if (isSupabaseConfigured()) {
      updateEmployeeInSupabase(employeeId, updates);
    }
    addAuditLog({
      user: currentUser?.name || "Admin",
      userRole: currentUser?.role || "admin",
      action: "Updated Employee Profile",
      resource: "Employees",
      target: employeeId,
      description: "Employee record modified",
      type: "employee",
    });
  };

  const addEmployee = (data: {
    name: string;
    email: string;
    role: UserRole;
    jobTitle: string;
    department: string;
    branch?: string;
    monthlyWage: number;
    phone?: string;
    address?: string;
    location?: string;
  }): Employee => {
    const nextSeq = employees.length + 1;
    const currentYear = new Date().getFullYear();
    const generatedId = generateEmployeeId(company.name, data.name, currentYear, nextSeq);

    const salary = calculateDynamicSalaryStructure(data.monthlyWage);

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      employeeId: generatedId,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
      phone: data.phone || "+1 (555) 000-0000",
      address: data.address || "San Francisco, CA",
      companyName: company.name,
      department: data.department,
      designation: data.jobTitle,
      branch: data.branch || "San Francisco Global HQ",
      managerName: "Sarah Jenkins",
      location: data.location || "San Francisco HQ",
      joiningDate: new Date().toISOString().split("T")[0],
      employmentStatus: "active",
      emergencyContact: { name: "Primary Contact", relationship: "Family", phone: "+1 (555) 000-9999" },
      resume: {
        about: "Newly onboarded team member.",
        whatILoveAboutJob: "Collaborating with extraordinary peers and building great software.",
        interestsHobbies: "Reading, tech exploration, and outdoor sports.",
        skills: [{ id: "sk-init", name: "Core Specialization", level: "Intermediate" }],
        certifications: [],
      },
      privateInfo: {
        dateOfBirth: "1995-01-01",
        residingAddress: data.address || "San Francisco, CA",
        nationality: "United States",
        personalEmail: data.email,
        gender: "Prefer not to say",
        maritalStatus: "Single",
        dateOfJoining: new Date().toISOString().split("T")[0],
        bankDetails: {
          accountNumber: "00000000000",
          bankName: "Pending Verification",
          ifscCode: "BANK0000",
          panNo: "PENDING",
          uanNo: "PENDING",
          empCode: generatedId,
        },
      },
      salaryStructure: salary,
      leaveBalances: { paid: { total: 24, used: 0 }, sick: { total: 10, used: 0 }, unpaid: { total: 10, used: 0 } },
      documents: [],
      onboarding: { personalInfoDone: true, documentsUploadedDone: false, bankDetailsAddedDone: false, profileCompletedDone: true, policiesAcknowledgedDone: true, assetsAssignedDone: false, hrApprovalDone: true },
    };

    setEmployees((prev) => [newEmp, ...prev]);

    if (isSupabaseConfigured()) {
      createEmployeeInSupabase(
        {
          ...data,
          companyName: company.name,
        },
        employees.length
      ).then((createdDbEmp) => {
        if (createdDbEmp) {
          setEmployees((prev) =>
            prev.map((e) => (e.email === data.email ? createdDbEmp : e))
          );
        }
      });
    }

    addAuditLog({
      user: "Sarah Jenkins",
      userRole: "admin",
      action: "Created New Employee Account",
      resource: "Employees",
      target: `${newEmp.name} (${newEmp.employeeId})`,
      description: `Generated Login ID ${newEmp.employeeId} with default wage $${data.monthlyWage}/mo`,
      type: "employee",
    });

    addNotification({
      type: "system",
      title: "New Team Member Onboarded",
      message: `${newEmp.name} has joined the ${newEmp.department} department as ${newEmp.designation}.`,
      targetRole: "all",
    });

    return newEmp;
  };

  const deleteEmployee = (employeeId: string) => {
    setEmployees((prev) => prev.filter((e) => e.employeeId !== employeeId && e.id !== employeeId));
    if (isSupabaseConfigured()) {
      deleteEmployeeInSupabase(employeeId);
    }
  };

  const updateEmployeeResume = (employeeId: string, resume: Partial<ResumeInfo>) => {
    setEmployees((prev) =>
      prev.map((e) => (e.employeeId === employeeId ? { ...e, resume: { ...e.resume, ...resume } } : e))
    );
  };

  const updateEmployeePrivateInfo = (employeeId: string, privateInfo: Partial<PrivateInfo>) => {
    setEmployees((prev) =>
      prev.map((e) => (e.employeeId === employeeId ? { ...e, privateInfo: { ...e.privateInfo, ...privateInfo } } : e))
    );
    if (isSupabaseConfigured()) {
      updateEmployeePrivateInfoInSupabase(employeeId, privateInfo);
    }
  };

  const updateEmployeeSalary = (employeeId: string, wage: number, days: number = 5, hours: number = 40, breakTime: number = 60) => {
    const updatedStructure = calculateDynamicSalaryStructure(wage, days, hours, breakTime);
    setEmployees((prev) =>
      prev.map((e) => (e.employeeId === employeeId ? { ...e, salaryStructure: updatedStructure } : e))
    );
    if (isSupabaseConfigured()) {
      updateEmployeeSalaryInSupabase(employeeId, wage, days, hours, breakTime);
    }

    addAuditLog({
      user: "Sarah Jenkins",
      userRole: "admin",
      action: "Updated Dynamic Salary Structure",
      resource: "Payroll",
      target: employeeId,
      description: `Recalculated salary components for monthly wage: $${wage}`,
      type: "salary",
    });
  };

  const addSkillToEmployee = (employeeId: string, skill: Omit<SkillItem, "id">) => {
    const newSkill: SkillItem = { ...skill, id: `sk-${Date.now()}` };
    setEmployees((prev) =>
      prev.map((e) =>
        e.employeeId === employeeId
          ? { ...e, resume: { ...e.resume, skills: [...e.resume.skills, newSkill] } }
          : e
      )
    );
  };

  const deleteSkillFromEmployee = (employeeId: string, skillId: string) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e.employeeId === employeeId
          ? { ...e, resume: { ...e.resume, skills: e.resume.skills.filter((s) => s.id !== skillId) } }
          : e
      )
    );
  };

  const addCertificationToEmployee = (employeeId: string, cert: Omit<CertificationItem, "id">) => {
    const newCert: CertificationItem = { ...cert, id: `cert-${Date.now()}` };
    setEmployees((prev) =>
      prev.map((e) =>
        e.employeeId === employeeId
          ? { ...e, resume: { ...e.resume, certifications: [...e.resume.certifications, newCert] } }
          : e
      )
    );
  };

  const deleteCertificationFromEmployee = (employeeId: string, certId: string) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e.employeeId === employeeId
          ? { ...e, resume: { ...e.resume, certifications: e.resume.certifications.filter((c) => c.id !== certId) } }
          : e
      )
    );
  };

  // Leave Management
  const applyLeave = (data: {
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    totalDays: number;
    attachmentUrl?: string;
  }): LeaveRequest => {
    if (!currentEmployee) throw new Error("No active employee session");

    const newLeave: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: currentEmployee.employeeId,
      employeeName: currentEmployee.name,
      employeeAvatar: currentEmployee.avatar,
      department: currentEmployee.department,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays: data.totalDays,
      reason: data.reason,
      status: "pending",
      appliedDate: new Date().toISOString().split("T")[0],
      attachmentUrl: data.attachmentUrl,
    };

    setLeaveRequests((prev) => [newLeave, ...prev]);

    if (isSupabaseConfigured()) {
      applyLeaveInSupabase(currentEmployee.employeeId, data).then((created) => {
        if (created) {
          setLeaveRequests((prev) => prev.map((l) => (l.id === newLeave.id ? created : l)));
        }
      });
    }

    addAuditLog({
      user: currentEmployee.name,
      userRole: currentEmployee.role,
      action: "Applied for Time Off",
      resource: "Leave",
      target: `${data.totalDays} days (${data.leaveType})`,
      description: `${data.startDate} to ${data.endDate}: ${data.reason}`,
      type: "leave",
    });

    addNotification({
      type: "leave_requested",
      title: "New Leave Application",
      message: `${currentEmployee.name} requested ${data.totalDays} day(s) ${data.leaveType} leave.`,
      targetRole: "admin",
    });

    return newLeave;
  };

  const approveLeave = (leaveId: string, comment: string = "Approved by HR.") => {
    const leave = leaveRequests.find((l) => l.id === leaveId);
    if (!leave) return;

    setLeaveRequests((prev) =>
      prev.map((l) =>
        l.id === leaveId
          ? {
              ...l,
              status: "approved",
              reviewedBy: "Sarah Jenkins (HR Director)",
              reviewedDate: new Date().toISOString().split("T")[0],
              adminComment: comment,
            }
          : l
      )
    );

    // Deduct leave balance locally
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.employeeId === leave.employeeId) {
          const typeKey = leave.leaveType === "paid" ? "paid" : leave.leaveType === "sick" ? "sick" : "unpaid";
          const currentBal = emp.leaveBalances[typeKey];
          return {
            ...emp,
            leaveBalances: {
              ...emp.leaveBalances,
              [typeKey]: {
                ...currentBal,
                used: Math.min(currentBal.total, currentBal.used + leave.totalDays),
              },
            },
          };
        }
        return emp;
      })
    );

    if (isSupabaseConfigured()) {
      approveLeaveInSupabase(leaveId, currentUser?.employeeId, comment);
    }

    addAuditLog({
      user: "Sarah Jenkins",
      userRole: "admin",
      action: "Approved Leave Application",
      resource: "Leave",
      target: `${leave.employeeName} (${leave.totalDays} days)`,
      description: `Approved ${leave.leaveType} leave for ${leave.startDate} to ${leave.endDate}`,
      type: "leave",
    });

    addNotification({
      type: "leave_approved",
      title: "Time Off Approved ✓",
      message: `Your ${leave.leaveType} leave request for ${leave.startDate} has been approved.`,
      targetRole: "employee",
    });
  };

  const rejectLeave = (leaveId: string, comment: string = "Declined due to scheduling.") => {
    const leave = leaveRequests.find((l) => l.id === leaveId);
    if (!leave) return;

    setLeaveRequests((prev) =>
      prev.map((l) =>
        l.id === leaveId
          ? {
              ...l,
              status: "rejected",
              reviewedBy: "Sarah Jenkins (HR Director)",
              reviewedDate: new Date().toISOString().split("T")[0],
              adminComment: comment,
            }
          : l
      )
    );

    if (isSupabaseConfigured()) {
      rejectLeaveInSupabase(leaveId, currentUser?.employeeId, comment);
    }

    addNotification({
      type: "leave_rejected",
      title: "Time Off Request Declined",
      message: `Your leave request for ${leave.startDate} was not approved: "${comment}".`,
      targetRole: "employee",
    });
  };

  const cancelLeave = (leaveId: string) => {
    setLeaveRequests((prev) => prev.map((l) => (l.id === leaveId ? { ...l, status: "cancelled" } : l)));
    if (isSupabaseConfigured()) {
      cancelLeaveInSupabase(leaveId);
    }
  };

  // Payroll
  const generateMonthlyPayslip = (employeeId: string, month: string): SalarySlip => {
    const emp = getEmployeeById(employeeId);
    if (!emp) throw new Error("Employee not found");

    const s = emp.salaryStructure;
    const newSlip: SalarySlip = {
      id: `slip-${Date.now()}-${emp.employeeId}`,
      employeeId: emp.employeeId,
      employeeName: emp.name,
      department: emp.department,
      designation: emp.designation,
      month,
      payPeriod: `${month} 01 - ${month} 30`,
      paymentDate: new Date().toISOString().split("T")[0],
      monthlyWage: s.monthlyWage,
      basicSalary: s.basicSalary,
      hra: s.houseRentAllowance,
      standardAllowance: s.standardAllowance,
      performanceBonus: s.performanceBonus,
      lta: s.leaveTravelAllowance,
      fixedAllowance: s.fixedAllowance,
      pfDeduction: s.employeePf,
      taxDeduction: s.professionalTax,
      unpaidLeaveDeduction: 0,
      grossEarnings: s.grossSalary,
      totalDeductions: s.employeePf + s.professionalTax,
      netPay: s.netSalary,
      status: "paid",
    };

    setSalarySlips((prev) => [newSlip, ...prev]);
    return newSlip;
  };

  const runBatchPayroll = (month: string) => {
    employees.forEach((emp) => {
      try {
        generateMonthlyPayslip(emp.employeeId, month);
      } catch {}
    });

    addAuditLog({
      user: "Sarah Jenkins",
      userRole: "admin",
      action: "Disbursed Monthly Payroll Batch",
      resource: "Payroll",
      target: `${month} Run`,
      description: `Generated verified payslips for all ${employees.length} active personnel`,
      type: "payroll",
    });

    addNotification({
      type: "payroll_ready",
      title: `${month} Compensation Credited`,
      message: `Monthly salary slips and tax withholdings have been disbursed.`,
      targetRole: "all",
    });
  };

  // Announcements
  const addAnnouncement = (item: Omit<Announcement, "id">) => {
    const newAnn: Announcement = { ...item, id: `ann-${Date.now()}` };
    setAnnouncements((prev) => [newAnn, ...prev]);
    addNotification({
      type: "announcement",
      title: `Announcement: ${item.title}`,
      message: item.content,
      targetRole: "all",
    });
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Goals
  const addGoal = (g: Omit<Goal, "id">) => {
    const newGoal: Goal = { ...g, id: `goal-${Date.now()}` };
    setGoals((prev) => [newGoal, ...prev]);
    if (isSupabaseConfigured()) {
      const empId = currentUser?.employeeId || currentEmployee?.employeeId;
      if (empId) createGoalInSupabase(g, empId);
    }
  };

  const updateGoalProgress = (id: string, progress: number, status?: Goal["status"]) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, progress, ...(status ? { status } : {}) } : g))
    );
    if (isSupabaseConfigured()) {
      updateGoalProgressInSupabase(id, progress, status);
    }
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Holidays
  const addHoliday = (h: Omit<Holiday, "id">) => {
    const newH: Holiday = { ...h, id: `hol-${Date.now()}` };
    setHolidays((prev) => [...prev, newH]);
  };

  const deleteHoliday = (id: string) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  };

  // Assets
  const addAsset = (a: Omit<Asset, "id">) => {
    const newA: Asset = { ...a, id: `ast-${Date.now()}` };
    setAssets((prev) => [...prev, newA]);
  };

  const assignAssetToEmployee = (assetId: string, employeeId: string, employeeName: string) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId || a.assetId === assetId
          ? { ...a, employeeId, employeeName, status: "assigned", assignedDate: new Date().toISOString().split("T")[0] }
          : a
      )
    );
    if (isSupabaseConfigured()) {
      assignAssetInSupabase(assetId, employeeId);
    }
  };

  const deleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  // Support Tickets
  const createSupportTicket = (t: Omit<SupportTicket, "id" | "createdAt" | "status">) => {
    const newTicket: SupportTicket = {
      ...t,
      id: `tkt-${Date.now()}`,
      status: "open",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
    if (isSupabaseConfigured()) {
      const empId = currentUser?.employeeId || currentEmployee?.employeeId;
      if (empId) createSupportTicketInSupabase(t, empId);
    }
  };

  const replySupportTicket = (id: string, reply: string, status: SupportTicket["status"] = "in_progress") => {
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, hrReply: reply, status } : t))
    );
    if (isSupabaseConfigured()) {
      replySupportTicketInSupabase(id, reply, status);
    }
  };



  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    if (isSupabaseConfigured()) {
      markNotificationAsReadInSupabase(id);
    }
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (isSupabaseConfigured()) {
      const empId = currentUser?.employeeId || currentEmployee?.employeeId;
      if (empId) markAllNotificationsAsReadInSupabase(empId);
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppStoreContext.Provider
      value={{
        currentUser,
        currentEmployee,
        isAuthenticated: Boolean(currentUser),
        authError,
        setAuthError,
        login,
        signUpUser,
        resetPassword,
        logout,
        switchDemoRole,
        changePassword,

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

        employees,
        isLoadingEmployees,
        getEmployeeById,
        updateEmployee,
        addEmployee,
        deleteEmployee,
        updateEmployeeResume,
        updateEmployeePrivateInfo,
        updateEmployeeSalary,
        addSkillToEmployee,
        deleteSkillFromEmployee,
        addCertificationToEmployee,
        deleteCertificationFromEmployee,

        attendanceRecords,
        todayAttendance,
        isPunchedIn,
        punchInTime,
        punchIn,
        punchOut,
        attendanceRequests,
        raiseAttendanceCorrectionRequest,
        approveAttendanceCorrectionRequest,
        rejectAttendanceCorrectionRequest,

        leaveRequests,
        applyLeave,
        approveLeave,
        rejectLeave,
        cancelLeave,

        salarySlips,
        generateMonthlyPayslip,
        runBatchPayroll,

        announcements,
        addAnnouncement,
        deleteAnnouncement,

        goals,
        addGoal,
        updateGoalProgress,
        deleteGoal,

        holidays,
        addHoliday,
        deleteHoliday,

        assets,
        addAsset,
        assignAssetToEmployee,
        deleteAsset,

        supportTickets,
        createSupportTicket,
        replySupportTicket,

        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        auditLogs,
        addAuditLog,

        theme,
        toggleTheme,
        activeView,
        setActiveView,
        employeeViewMode,
        setEmployeeViewMode,
        selectedEmployeeForModal,
        setSelectedEmployeeForModal,
        searchQuery,
        setSearchQuery,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        resetToDefaultData,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
