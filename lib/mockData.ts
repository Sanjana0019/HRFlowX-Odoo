import {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  SalarySlip,
  NotificationItem,
  AuditLog,
  CompanyProfile,
  Branch,
  CompanyPolicy,
  Announcement,
  Goal,
  Holiday,
  Asset,
  SupportTicket,
  AttendanceCorrectionRequest,
} from "@/types";
import { calculateDynamicSalaryStructure } from "@/lib/utils";

export const INITIAL_COMPANY: CompanyProfile = {
  name: "HRFlowX Technologies Inc.",
  identifier: "HX",
  industry: "Enterprise Cloud & Workforce AI",
  website: "https://hrflowx.io",
  email: "contact@hrflowx.io",
  phone: "+1 (555) 019-2834",
  address: "100 Montgomery St, Suite 1800, San Francisco, CA 94104",
  logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop",
};

export const INITIAL_BRANCHES: Branch[] = [
  { id: "br-1", name: "San Francisco Global HQ", location: "San Francisco, CA", address: "100 Montgomery St, Suite 1800", status: "active", headOfBranch: "Priya Mehta", employeeCount: 14 },
  { id: "br-2", name: "New York Innovation Hub", location: "New York, NY", address: "450 Lexington Ave, Floor 22", status: "active", headOfBranch: "David Chen", employeeCount: 6 },
  { id: "br-3", name: "Austin Engineering Campus", location: "Austin, TX", address: "200 Congress Ave, Suite 1200", status: "active", headOfBranch: "Marcus Vance", employeeCount: 5 },
  { id: "br-4", name: "London EMEA Office", location: "London, UK", address: "1 Canada Square, Canary Wharf", status: "active", headOfBranch: "Liam O'Connor", employeeCount: 3 },
];

export const INITIAL_POLICIES: CompanyPolicy[] = [
  {
    id: "pol-1",
    title: "Global Hybrid & Remote Work Policy",
    category: "Remote Work",
    content: "Employees are eligible for up to 3 flexible remote working days per week with core collaboration hours between 10:00 AM and 4:00 PM local timezone.",
    effectiveDate: "2026-01-01",
    isPublished: true,
    version: "v2.4",
  },
  {
    id: "pol-2",
    title: "Annual Paid Time Off & Sabbatical Rules",
    category: "Leave & Attendance",
    content: "Full-time personnel receive 24 days of paid time off annually, accruing monthly. Sick leave grants up to 10 days with self-certification for up to 2 consecutive days.",
    effectiveDate: "2026-01-01",
    isPublished: true,
    version: "v3.1",
  },
  {
    id: "pol-3",
    title: "Enterprise Code of Conduct & Information Security",
    category: "Security",
    content: "All source code, proprietary algorithms, and customer data must be accessed exclusively through encrypted corporate VPN and MDM-managed hardware.",
    effectiveDate: "2026-02-15",
    isPublished: true,
    version: "v4.0",
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "🚀 HRFlowX 2026 Annual Hackathon & Innovation Summit",
    content: "Join us this September 14-16 for our global internal hackathon. Over $50,000 in project development grants and demo day with executive leadership!",
    priority: "high",
    publishDate: "2026-08-20",
    expiryDate: "2026-09-20",
    status: "active",
    authorName: "Priya Mehta (Chief People Officer)",
  },
  {
    id: "ann-2",
    title: "🎉 Q3 Company-Wide All-Hands & Product Roadmap Launch",
    content: "Quarterly town hall is scheduled for Friday at 11:00 AM PST. We'll celebrate our top performers and unveil our new AI-driven product capabilities.",
    priority: "medium",
    publishDate: "2026-08-18",
    expiryDate: "2026-08-30",
    status: "active",
    authorName: "Executive Leadership Team",
  },
  {
    id: "ann-3",
    title: "🏥 Annual Corporate Wellness & Health Checkup Windows",
    content: "Comprehensive executive health screenings and ergonomic workspace credits are now open for enrollment via the benefits portal.",
    priority: "low",
    publishDate: "2026-08-10",
    expiryDate: "2026-09-01",
    status: "active",
    authorName: "People Operations Team",
  },
];

export const INITIAL_HOLIDAYS: Holiday[] = [
  { id: "hol-1", name: "New Year's Day", date: "2026-01-01", dayOfWeek: "Thursday", type: "National Holiday", description: "Global office closure" },
  { id: "hol-2", name: "Martin Luther King Jr. Day", date: "2026-01-19", dayOfWeek: "Monday", type: "National Holiday", description: "US Federal Holiday" },
  { id: "hol-3", name: "Memorial Day", date: "2026-05-25", dayOfWeek: "Monday", type: "National Holiday", description: "National observance" },
  { id: "hol-4", name: "Independence Day", date: "2026-07-04", dayOfWeek: "Saturday", type: "National Holiday", description: "US Independence Celebration" },
  { id: "hol-5", name: "Labor Day", date: "2026-09-07", dayOfWeek: "Monday", type: "National Holiday", description: "National Labor Day" },
  { id: "hol-6", name: "Thanksgiving Day", date: "2026-11-26", dayOfWeek: "Thursday", type: "National Holiday", description: "Thanksgiving Festival" },
  { id: "hol-7", name: "Day After Thanksgiving", date: "2026-11-27", dayOfWeek: "Friday", type: "Company Holiday", description: "Company winter break" },
  { id: "hol-8", name: "Christmas Day", date: "2026-12-25", dayOfWeek: "Friday", type: "National Holiday", description: "Christmas Holiday" },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  // 1. ADMIN PERSONA: Priya Mehta (HR Director)
  {
    id: "emp-000",
    employeeId: "HXPM20220001",
    name: "Priya Mehta",
    email: "admin@hrflowx.io",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
    phone: "+1 (555) 234-5678",
    address: "742 Evergreen Terrace, Suite 400, San Francisco, CA 94107",
    companyName: "HRFlowX Technologies Inc.",
    department: "Human Resources",
    designation: "Chief People Officer & HR Director",
    branch: "San Francisco Global HQ",
    joiningDate: "2022-03-15",
    employmentStatus: "active",
    managerName: "Executive Board",
    location: "San Francisco HQ",
    emergencyContact: { name: "Rohan Mehta", relationship: "Spouse", phone: "+1 (555) 234-9999" },
    resume: {
      about: "Executive People Operations leader with 14+ years designing high-trust cultures, global compensation bands, and automated HR pipelines.",
      whatILoveAboutJob: "Designing equitable compensation models, cultivating high-trust work cultures, and empowering engineers to do the best work of their careers.",
      interestsHobbies: "Classical music, distance running, modern architectural photography, and angel investing in ethical software.",
      skills: [
        { id: "sk-1", name: "Executive Talent Strategy", level: "Expert" },
        { id: "sk-2", name: "Compensation & Equity Structuring", level: "Expert" },
        { id: "sk-3", name: "Global Labor Compliance", level: "Advanced" },
        { id: "sk-4", name: "Organizational Psychology", level: "Expert" },
      ],
      certifications: [
        { id: "cert-1", name: "Senior Professional in Human Resources (SPHR)", issuer: "HRCI", issueDate: "2018-05-10" },
        { id: "cert-2", name: "SHRM Executive Certified Professional (SHRM-SCP)", issuer: "SHRM", issueDate: "2020-08-15" },
      ],
    },
    privateInfo: {
      dateOfBirth: "1988-06-24",
      residingAddress: "742 Evergreen Terrace, Suite 400, San Francisco, CA 94107",
      nationality: "United States",
      personalEmail: "priya.mehta.personal@gmail.com",
      gender: "Female",
      maritalStatus: "Married",
      dateOfJoining: "2022-03-15",
      bankDetails: {
        accountNumber: "88291029384",
        bankName: "Silicon Valley Bank / First Republic",
        ifscCode: "SVB0001928",
        panNo: "PMTP8912A",
        uanNo: "100928374619",
        empCode: "HXPM20220001",
      },
    },
    salaryStructure: calculateDynamicSalaryStructure(22500),
    leaveBalances: { paid: { total: 24, used: 4 }, sick: { total: 10, used: 1 }, unpaid: { total: 10, used: 0 } },
    documents: [
      { id: "doc-1", title: "Executive Employment Agreement.pdf", category: "Employment", uploadDate: "2022-03-15", size: "1.4 MB" },
      { id: "doc-2", title: "Identity & Passport Verification.pdf", category: "Identity Proof", uploadDate: "2022-03-15", size: "2.8 MB" },
    ],
    onboarding: { personalInfoDone: true, documentsUploadedDone: true, bankDetailsAddedDone: true, profileCompletedDone: true, policiesAcknowledgedDone: true, assetsAssignedDone: true, hrApprovalDone: true },
  },

  // 2. PRIMARY EMPLOYEE PERSONA: Arjun Sharma (Software Engineer)
  {
    id: "emp-001",
    employeeId: "HXAS20230001",
    name: "Arjun Sharma",
    email: "employee@hrflowx.io",
    role: "employee",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    phone: "+1 (555) 876-5432",
    address: "1280 Mission St, Apt 9B, San Francisco, CA 94103",
    companyName: "HRFlowX Technologies Inc.",
    department: "Engineering",
    designation: "Software Engineer",
    branch: "San Francisco Global HQ",
    joiningDate: "2023-01-10",
    employmentStatus: "active",
    managerName: "David Chen (VP of Engineering)",
    location: "San Francisco HQ (Hybrid)",
    emergencyContact: { name: "Ananya Sharma", relationship: "Sister", phone: "+1 (555) 876-1122" },
    resume: {
      about: "Full-stack software engineer building distributed cloud platforms, reactive Next.js state architectures, and high-performance UI experiences.",
      whatILoveAboutJob: "Collaborating with high-velocity engineering teams, solving complex data modeling challenges, and shipping intuitive software.",
      interestsHobbies: "Open-source development, competitive chess, mechanical keyboards, and landscape hiking in the Bay Area.",
      skills: [
        { id: "sk-10", name: "React 19 & Next.js App Router", level: "Expert" },
        { id: "sk-11", name: "TypeScript & Distributed Systems", level: "Expert" },
        { id: "sk-12", name: "PostgreSQL & Supabase Architecture", level: "Advanced" },
        { id: "sk-13", name: "REST & GraphQL APIs", level: "Advanced" },
      ],
      certifications: [
        { id: "cert-10", name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", issueDate: "2023-04-12" },
        { id: "cert-11", name: "Certified Kubernetes Application Developer", issuer: "Cloud Native Computing Foundation", issueDate: "2024-02-18" },
      ],
    },
    privateInfo: {
      dateOfBirth: "1995-11-12",
      residingAddress: "1280 Mission St, Apt 9B, San Francisco, CA 94103",
      nationality: "United States",
      personalEmail: "arjun.sharma.dev@gmail.com",
      gender: "Male",
      maritalStatus: "Single",
      dateOfJoining: "2023-01-10",
      bankDetails: {
        accountNumber: "99182736452",
        bankName: "Chase Manhattan Bank",
        ifscCode: "CHAS0009182",
        panNo: "ASHP9912K",
        uanNo: "109827364512",
        empCode: "HXAS20230001",
      },
    },
    salaryStructure: calculateDynamicSalaryStructure(18500),
    leaveBalances: { paid: { total: 24, used: 4 }, sick: { total: 10, used: 2 }, unpaid: { total: 10, used: 0 } },
    documents: [
      { id: "doc-10", title: "Software Engineer Offer Letter & NDA.pdf", category: "Employment", uploadDate: "2023-01-10", size: "1.1 MB" },
      { id: "doc-11", title: "AWS Solutions Architect Certificate.pdf", category: "Certificates", uploadDate: "2023-04-12", size: "2.4 MB" },
    ],
    onboarding: { personalInfoDone: true, documentsUploadedDone: true, bankDetailsAddedDone: true, profileCompletedDone: true, policiesAcknowledgedDone: true, assetsAssignedDone: true, hrApprovalDone: true },
  },

  // 3. David Chen (VP of Engineering)
  {
    id: "emp-002",
    employeeId: "HXDC20210002",
    name: "David Chen",
    email: "david.chen@hrflowx.io",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    phone: "+1 (555) 345-6789",
    address: "450 1st St, Los Altos, CA 94022",
    companyName: "HRFlowX Technologies Inc.",
    department: "Engineering",
    designation: "VP of Engineering",
    branch: "San Francisco Global HQ",
    joiningDate: "2021-08-01",
    employmentStatus: "active",
    managerName: "Priya Mehta",
    location: "San Francisco HQ",
    emergencyContact: { name: "Grace Chen", relationship: "Spouse", phone: "+1 (555) 345-0011" },
    resume: {
      about: "Engineering leader directing cloud architecture, developer tooling, and global distributed engineering infrastructure.",
      whatILoveAboutJob: "Shipping resilient software and cultivating world-class engineering organizations.",
      interestsHobbies: "Road cycling, robotics, and jazz piano.",
      skills: [{ id: "sk-20", name: "Engineering Leadership", level: "Expert" }, { id: "sk-21", name: "Cloud Architecture", level: "Expert" }],
      certifications: [],
    },
    privateInfo: {
      dateOfBirth: "1983-04-19",
      residingAddress: "450 1st St, Los Altos, CA 94022",
      nationality: "United States",
      personalEmail: "d.chen@gmail.com",
      gender: "Male",
      maritalStatus: "Married",
      dateOfJoining: "2021-08-01",
      bankDetails: { accountNumber: "44910293847", bankName: "Wells Fargo", ifscCode: "WFB0004491", panNo: "DCNP4491B", uanNo: "104491029384", empCode: "HXDC20210002" },
    },
    salaryStructure: calculateDynamicSalaryStructure(24000),
    leaveBalances: { paid: { total: 24, used: 8 }, sick: { total: 10, used: 0 }, unpaid: { total: 10, used: 0 } },
    documents: [],
    onboarding: { personalInfoDone: true, documentsUploadedDone: true, bankDetailsAddedDone: true, profileCompletedDone: true, policiesAcknowledgedDone: true, assetsAssignedDone: true, hrApprovalDone: true },
  },

  // 4. Maya Patel (Design Lead)
  {
    id: "emp-003",
    employeeId: "HXMP20230003",
    name: "Maya Patel",
    email: "maya.patel@hrflowx.io",
    role: "employee",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop",
    phone: "+1 (555) 456-7890",
    address: "88 Colin P Kelly Jr St, San Francisco, CA 94107",
    companyName: "HRFlowX Technologies Inc.",
    department: "Design",
    designation: "Principal Product Designer",
    branch: "New York Innovation Hub",
    joiningDate: "2023-04-18",
    employmentStatus: "active",
    managerName: "Priya Mehta",
    location: "Remote (New York)",
    emergencyContact: { name: "Rajesh Patel", relationship: "Father", phone: "+1 (555) 456-1122" },
    resume: {
      about: "Design system specialist focusing on micro-interactions, dark mode aesthetics, and human-computer interfaces.",
      whatILoveAboutJob: "Turning complex enterprise software into delight-inducing, intuitive software.",
      interestsHobbies: "Ceramics, typography collecting, and landscape watercolor.",
      skills: [{ id: "sk-30", name: "Figma & Design Systems", level: "Expert" }, { id: "sk-31", name: "UI/UX Prototyping", level: "Expert" }],
      certifications: [],
    },
    privateInfo: {
      dateOfBirth: "1992-09-08",
      residingAddress: "88 Colin P Kelly Jr St, San Francisco, CA 94107",
      nationality: "United States",
      personalEmail: "maya.patel.design@gmail.com",
      gender: "Female",
      maritalStatus: "Single",
      dateOfJoining: "2023-04-18",
      bankDetails: { accountNumber: "33829104859", bankName: "Citibank", ifscCode: "CITI0003382", panNo: "MPTP3382C", uanNo: "103382910485", empCode: "HXMP20230003" },
    },
    salaryStructure: calculateDynamicSalaryStructure(17900),
    leaveBalances: { paid: { total: 24, used: 5 }, sick: { total: 10, used: 1 }, unpaid: { total: 10, used: 0 } },
    documents: [],
    onboarding: { personalInfoDone: true, documentsUploadedDone: true, bankDetailsAddedDone: true, profileCompletedDone: true, policiesAcknowledgedDone: true, assetsAssignedDone: true, hrApprovalDone: true },
  },

  // 5. Marcus Vance (Product Manager)
  {
    id: "emp-004",
    employeeId: "HXMV20220004",
    name: "Marcus Vance",
    email: "marcus.vance@hrflowx.io",
    role: "employee",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    phone: "+1 (555) 567-8901",
    address: "333 Fremont St, Apt 22A, San Francisco, CA 94105",
    companyName: "HRFlowX Technologies Inc.",
    department: "Product",
    designation: "Senior Product Manager",
    branch: "Austin Engineering Campus",
    joiningDate: "2022-11-01",
    employmentStatus: "active",
    managerName: "Priya Mehta",
    location: "Austin Campus",
    emergencyContact: { name: "Chloe Vance", relationship: "Spouse", phone: "+1 (555) 567-9900" },
    resume: {
      about: "Product leader driving AI automation, analytics pipelines, and self-service HR workflows.",
      whatILoveAboutJob: "Translating customer pain points into high-velocity product execution.",
      interestsHobbies: "Ultra running, podcast hosting, and urban gardening.",
      skills: [{ id: "sk-40", name: "Product Strategy & Roadmaps", level: "Expert" }],
      certifications: [],
    },
    privateInfo: {
      dateOfBirth: "1989-02-14",
      residingAddress: "333 Fremont St, Apt 22A, San Francisco, CA 94105",
      nationality: "United States",
      personalEmail: "marcus.vance@gmail.com",
      gender: "Male",
      maritalStatus: "Married",
      dateOfJoining: "2022-11-01",
      bankDetails: { accountNumber: "77482910394", bankName: "Bank of America", ifscCode: "BOFA0007748", panNo: "MVNP7748D", uanNo: "107748291039", empCode: "HXMV20220004" },
    },
    salaryStructure: calculateDynamicSalaryStructure(18750),
    leaveBalances: { paid: { total: 24, used: 7 }, sick: { total: 10, used: 3 }, unpaid: { total: 10, used: 0 } },
    documents: [],
    onboarding: { personalInfoDone: true, documentsUploadedDone: true, bankDetailsAddedDone: true, profileCompletedDone: true, policiesAcknowledgedDone: true, assetsAssignedDone: true, hrApprovalDone: true },
  },

  // 6. Sophia Zhang (DevOps Lead)
  {
    id: "emp-005",
    employeeId: "HXZH20230005",
    name: "Sophia Zhang",
    email: "sophia.zhang@hrflowx.io",
    role: "employee",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
    phone: "+1 (555) 678-9012",
    address: "100 Van Ness Ave, San Francisco, CA 94102",
    companyName: "HRFlowX Technologies Inc.",
    department: "Engineering",
    designation: "Lead DevOps & Cloud Architect",
    branch: "San Francisco Global HQ",
    joiningDate: "2023-06-01",
    employmentStatus: "active",
    managerName: "David Chen",
    location: "San Francisco HQ",
    emergencyContact: { name: "Li Zhang", relationship: "Mother", phone: "+1 (555) 678-3344" },
    resume: { about: "Kubernetes, Terraform, and zero-trust cloud infrastructure architect.", whatILoveAboutJob: "100% uptime infrastructure.", interestsHobbies: "Sci-fi literature and hiking.", skills: [], certifications: [] },
    privateInfo: {
      dateOfBirth: "1993-07-22",
      residingAddress: "100 Van Ness Ave, San Francisco, CA 94102",
      nationality: "United States",
      personalEmail: "sophia.zhang@gmail.com",
      gender: "Female",
      maritalStatus: "Single",
      dateOfJoining: "2023-06-01",
      bankDetails: { accountNumber: "66291039485", bankName: "Chase Bank", ifscCode: "CHAS0006629", panNo: "ZHNP6629E", uanNo: "106629103948", empCode: "HXZH20230005" },
    },
    salaryStructure: calculateDynamicSalaryStructure(19150),
    leaveBalances: { paid: { total: 24, used: 3 }, sick: { total: 10, used: 0 }, unpaid: { total: 10, used: 0 } },
    documents: [],
    onboarding: { personalInfoDone: true, documentsUploadedDone: true, bankDetailsAddedDone: true, profileCompletedDone: true, policiesAcknowledgedDone: true, assetsAssignedDone: true, hrApprovalDone: true },
  },

  // 7. Liam O'Connor (Marketing Director)
  {
    id: "emp-006",
    employeeId: "HXOC20230006",
    name: "Liam O'Connor",
    email: "liam.oconnor@hrflowx.io",
    role: "employee",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop",
    phone: "+1 (555) 789-0123",
    address: "250 King St, San Francisco, CA 94107",
    companyName: "HRFlowX Technologies Inc.",
    department: "Marketing",
    designation: "Growth Marketing Director",
    branch: "London EMEA Office",
    joiningDate: "2023-02-15",
    employmentStatus: "active",
    managerName: "Priya Mehta",
    location: "London Office",
    emergencyContact: { name: "Patrick O'Connor", relationship: "Brother", phone: "+1 (555) 789-5566" },
    resume: { about: "Performance marketing and B2B SaaS growth director.", whatILoveAboutJob: "High viral product loops.", interestsHobbies: "Football and electronic music.", skills: [], certifications: [] },
    privateInfo: {
      dateOfBirth: "1990-12-05",
      residingAddress: "250 King St, San Francisco, CA 94107",
      nationality: "United Kingdom",
      personalEmail: "liam.oc@gmail.com",
      gender: "Male",
      maritalStatus: "Single",
      dateOfJoining: "2023-02-15",
      bankDetails: { accountNumber: "55391029485", bankName: "Barclays Bank", ifscCode: "BARC0005539", panNo: "OCNP5539F", uanNo: "105539102948", empCode: "HXOC20230006" },
    },
    salaryStructure: calculateDynamicSalaryStructure(16250),
    leaveBalances: { paid: { total: 24, used: 4 }, sick: { total: 10, used: 1 }, unpaid: { total: 10, used: 0 } },
    documents: [],
    onboarding: { personalInfoDone: true, documentsUploadedDone: true, bankDetailsAddedDone: true, profileCompletedDone: true, policiesAcknowledgedDone: true, assetsAssignedDone: true, hrApprovalDone: true },
  },

  // 8. Amina Al-Mansoor (Finance Lead)
  {
    id: "emp-007",
    employeeId: "HXMA20220007",
    name: "Amina Al-Mansoor",
    email: "amina.mansoor@hrflowx.io",
    role: "employee",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=300&auto=format&fit=crop",
    phone: "+1 (555) 890-1234",
    address: "555 4th St, Unit 702, San Francisco, CA 94107",
    companyName: "HRFlowX Technologies Inc.",
    department: "Finance",
    designation: "Senior Financial Analyst",
    branch: "San Francisco Global HQ",
    joiningDate: "2022-09-01",
    employmentStatus: "active",
    managerName: "Priya Mehta",
    location: "San Francisco HQ",
    emergencyContact: { name: "Tariq Mansoor", relationship: "Spouse", phone: "+1 (555) 890-7788" },
    resume: { about: "Financial modeling, SaaS unit economics, and payroll audit expert.", whatILoveAboutJob: "Forecasting predictability.", interestsHobbies: "Baking and chess.", skills: [], certifications: [] },
    privateInfo: {
      dateOfBirth: "1991-03-30",
      residingAddress: "555 4th St, Unit 702, San Francisco, CA 94107",
      nationality: "United States",
      personalEmail: "amina.mansoor@gmail.com",
      gender: "Female",
      maritalStatus: "Married",
      dateOfJoining: "2022-09-01",
      bankDetails: { accountNumber: "22849103948", bankName: "Wells Fargo", ifscCode: "WFB0002284", panNo: "MANP2284G", uanNo: "102284910394", empCode: "HXMA20220007" },
    },
    salaryStructure: calculateDynamicSalaryStructure(15000),
    leaveBalances: { paid: { total: 24, used: 2 }, sick: { total: 10, used: 0 }, unpaid: { total: 10, used: 0 } },
    documents: [],
    onboarding: { personalInfoDone: true, documentsUploadedDone: true, bankDetailsAddedDone: true, profileCompletedDone: true, policiesAcknowledgedDone: true, assetsAssignedDone: true, hrApprovalDone: true },
  },

  // 9-25: Diverse team roster across Engineering, Product, HR, Finance, Design, Marketing
  {
    id: "emp-008",
    employeeId: "HXKT20230008",
    name: "Kai Tanaka",
    email: "kai.tanaka@hrflowx.io",
    role: "employee",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop",
    phone: "+1 (555) 901-2345",
    address: "Austin, TX",
    companyName: "HRFlowX Technologies Inc.",
    department: "Engineering",
    designation: "Frontend Engineer",
    branch: "Austin Engineering Campus",
    joiningDate: "2023-08-01",
    employmentStatus: "active",
    managerName: "David Chen",
    location: "Austin Campus",
    emergencyContact: { name: "Kenji Tanaka", relationship: "Father", phone: "+1 555 901 0000" },
    resume: { about: "UI performance and animation developer.", whatILoveAboutJob: "Micro-interactions.", interestsHobbies: "Photography.", skills: [], certifications: [] },
    privateInfo: { dateOfBirth: "1997-05-12", residingAddress: "Austin, TX", nationality: "United States", personalEmail: "kai.t@gmail.com", gender: "Male", maritalStatus: "Single", dateOfJoining: "2023-08-01", bankDetails: { accountNumber: "9918237461", bankName: "Chase", ifscCode: "CHAS001", panNo: "KTNP991", uanNo: "109918", empCode: "HXKT20230008" } },
    salaryStructure: calculateDynamicSalaryStructure(14000),
    leaveBalances: { paid: { total: 24, used: 2 }, sick: { total: 10, used: 0 }, unpaid: { total: 10, used: 0 } },
    documents: [],
    onboarding: { personalInfoDone: true, documentsUploadedDone: true, bankDetailsAddedDone: true, profileCompletedDone: true, policiesAcknowledgedDone: true, assetsAssignedDone: true, hrApprovalDone: true },
  },
  {
    id: "emp-009",
    employeeId: "HXEB20230009",
    name: "Elena Rostova",
    email: "elena.rostova@hrflowx.io",
    role: "employee",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    phone: "+1 (555) 912-3456",
    address: "New York, NY",
    companyName: "HRFlowX Technologies Inc.",
    department: "Design",
    designation: "UX Researcher",
    branch: "New York Innovation Hub",
    joiningDate: "2023-09-15",
    employmentStatus: "active",
    managerName: "Maya Patel",
    location: "New York Hub",
    emergencyContact: { name: "Ivan Rostov", relationship: "Brother", phone: "+1 555 912 0000" },
    resume: { about: "User research and cognitive ergonomics specialist.", whatILoveAboutJob: "Customer interviews.", interestsHobbies: "Reading.", skills: [], certifications: [] },
    privateInfo: { dateOfBirth: "1994-08-19", residingAddress: "New York, NY", nationality: "United States", personalEmail: "elena.r@gmail.com", gender: "Female", maritalStatus: "Single", dateOfJoining: "2023-09-15", bankDetails: { accountNumber: "8829103948", bankName: "Citibank", ifscCode: "CITI001", panNo: "ERNP882", uanNo: "108829", empCode: "HXEB20230009" } },
    salaryStructure: calculateDynamicSalaryStructure(14500),
    leaveBalances: { paid: { total: 24, used: 3 }, sick: { total: 10, used: 1 }, unpaid: { total: 10, used: 0 } },
    documents: [],
    onboarding: { personalInfoDone: true, documentsUploadedDone: true, bankDetailsAddedDone: true, profileCompletedDone: true, policiesAcknowledgedDone: true, assetsAssignedDone: true, hrApprovalDone: true },
  },
  {
    id: "emp-010",
    employeeId: "HXJN20220010",
    name: "James Nolan",
    email: "james.nolan@hrflowx.io",
    role: "employee",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop",
    phone: "+1 (555) 923-4567",
    address: "San Francisco, CA",
    companyName: "HRFlowX Technologies Inc.",
    department: "Finance",
    designation: "Corporate Controller",
    branch: "San Francisco Global HQ",
    joiningDate: "2022-05-10",
    employmentStatus: "active",
    managerName: "Amina Al-Mansoor",
    location: "San Francisco HQ",
    emergencyContact: { name: "Sarah Nolan", relationship: "Spouse", phone: "+1 555 923 0000" },
    resume: { about: "Corporate GAAP accounting & tax audit expert.", whatILoveAboutJob: "Balance sheets.", interestsHobbies: "Golf.", skills: [], certifications: [] },
    privateInfo: { dateOfBirth: "1987-01-20", residingAddress: "San Francisco, CA", nationality: "United States", personalEmail: "james.n@gmail.com", gender: "Male", maritalStatus: "Married", dateOfJoining: "2022-05-10", bankDetails: { accountNumber: "7749201938", bankName: "Wells Fargo", ifscCode: "WFB002", panNo: "JNNP774", uanNo: "107749", empCode: "HXJN20220010" } },
    salaryStructure: calculateDynamicSalaryStructure(16800),
    leaveBalances: { paid: { total: 24, used: 5 }, sick: { total: 10, used: 0 }, unpaid: { total: 10, used: 0 } },
    documents: [],
    onboarding: { personalInfoDone: true, documentsUploadedDone: true, bankDetailsAddedDone: true, profileCompletedDone: true, policiesAcknowledgedDone: true, assetsAssignedDone: true, hrApprovalDone: true },
  },
];

export const INITIAL_ATTENDANCE_REQUESTS: AttendanceCorrectionRequest[] = [
  {
    id: "att-req-1",
    employeeId: "HXAS20230001",
    employeeName: "Arjun Sharma",
    employeeAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    department: "Engineering",
    date: "2026-08-21",
    requestedCheckIn: "08:45 AM",
    requestedCheckOut: "06:15 PM",
    reason: "Forgot to punch out due to late sprint deployment sync call with EMEA team.",
    status: "pending",
    appliedDate: "2026-08-22",
  },
  {
    id: "att-req-2",
    employeeId: "HXMP20230003",
    employeeName: "Maya Patel",
    employeeAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop",
    department: "Design",
    date: "2026-08-19",
    requestedCheckIn: "09:00 AM",
    requestedCheckOut: "05:30 PM",
    reason: "Biometric app sync timeout on remote workstation.",
    status: "approved",
    appliedDate: "2026-08-20",
    reviewedBy: "Priya Mehta",
    reviewedDate: "2026-08-20",
    adminComment: "Timesheet log verified via Git commit history.",
  },
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  // PENDING REQUEST FROM ARJUN SHARMA FOR DEMO FLOW
  {
    id: "leave-101",
    employeeId: "HXAS20230001",
    employeeName: "Arjun Sharma",
    employeeAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    department: "Engineering",
    leaveType: "paid",
    startDate: "2026-09-10",
    endDate: "2026-09-14",
    totalDays: 4,
    reason: "Annual family retreat & hiking trip in Yosemite National Park.",
    status: "pending",
    appliedDate: "2026-08-20",
  },
  {
    id: "leave-102",
    employeeId: "HXMP20230003",
    employeeName: "Maya Patel",
    employeeAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop",
    department: "Design",
    leaveType: "sick",
    startDate: "2026-08-23",
    endDate: "2026-08-24",
    totalDays: 2,
    reason: "Severe viral fever and doctor prescribed rest.",
    status: "pending",
    appliedDate: "2026-08-21",
    attachmentUrl: "Medical_Prescription_Aug2026.pdf",
  },
  {
    id: "leave-103",
    employeeId: "HXOC20230006",
    employeeName: "Liam O'Connor",
    employeeAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop",
    department: "Marketing",
    leaveType: "paid",
    startDate: "2026-08-15",
    endDate: "2026-08-18",
    totalDays: 3,
    reason: "Attending Growth Marketing Global Summit in London.",
    status: "approved",
    appliedDate: "2026-08-01",
    reviewedBy: "Priya Mehta",
    reviewedDate: "2026-08-02",
    adminComment: "Approved. Enjoy the conference!",
  },
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: "goal-1",
    employeeId: "HXAS20230001",
    employeeName: "Arjun Sharma",
    title: "Zero-Downtime Database Sharding & Optimization",
    target: "Achieve 99.999% query availability during Supabase sharding",
    dueDate: "2026-09-30",
    progress: 85,
    status: "on_track",
    feedback: "Exceptional architecture milestones met ahead of schedule.",
    assignedBy: "David Chen",
  },
  {
    id: "goal-2",
    employeeId: "HXMP20230003",
    employeeName: "Maya Patel",
    title: "HRFlowX Design System 3.0 Tokens & Primitives",
    target: "Publish WCAG AAA compliant component library in Figma & Storybook",
    dueDate: "2026-09-15",
    progress: 90,
    status: "on_track",
    feedback: "High-quality tokenized UI primitives.",
    assignedBy: "Priya Mehta",
  },
  {
    id: "goal-3",
    employeeId: "HXMV20220004",
    employeeName: "Marcus Vance",
    title: "Automated Self-Service Leave & Payroll Workflows",
    target: "Reduce HR manual intervention by 45% across EMEA & Americas",
    dueDate: "2026-10-15",
    progress: 60,
    status: "on_track",
    feedback: "Sprint progress pacing well.",
    assignedBy: "Priya Mehta",
  },
];

export const INITIAL_ASSETS: Asset[] = [
  { id: "ast-1", assetName: "Apple MacBook Pro 16'' (M3 Max, 64GB)", assetId: "AST-MBP-9012", category: "Laptop", serialNumber: "C02G9012MD64", employeeId: "HXAS20230001", employeeName: "Arjun Sharma", assignedDate: "2023-01-10", status: "assigned" },
  { id: "ast-2", assetName: "Dell UltraSharp 32'' 4K HDR Monitor", assetId: "AST-MON-4411", category: "Monitor", serialNumber: "DL32-4K-99120", employeeId: "HXAS20230001", employeeName: "Arjun Sharma", assignedDate: "2023-01-10", status: "assigned" },
  { id: "ast-3", assetName: "YubiKey 5C NFC Security Keycard", assetId: "AST-KEY-1102", category: "Access Card", serialNumber: "YB5C-0091823", employeeId: "HXAS20230001", employeeName: "Arjun Sharma", assignedDate: "2023-01-10", status: "assigned" },
  { id: "ast-4", assetName: "Apple MacBook Pro 14'' (M3 Pro, 36GB)", assetId: "AST-MBP-8819", category: "Laptop", serialNumber: "C02F8819MD36", employeeId: "HXPM20220001", employeeName: "Priya Mehta", assignedDate: "2022-03-15", status: "assigned" },
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "tkt-1",
    employeeId: "HXAS20230001",
    employeeName: "Arjun Sharma",
    subject: "Inquiry Regarding 401(k) Employer Contribution Match Ratio",
    category: "Payroll",
    priority: "medium",
    message: "Hi HR Team, could you verify if the voluntary 6% 401(k) contribution is matched in the September payroll run?",
    status: "in_progress",
    createdAt: "2026-08-21",
    hrReply: "Hi Arjun, yes! The 100% match up to 6% will reflect on your August 31 statement.",
  },
  {
    id: "tkt-2",
    employeeId: "HXMP20230003",
    employeeName: "Maya Patel",
    subject: "Ergonomic Desk & Monitor Arm Hardware Requisition",
    category: "IT Hardware",
    priority: "low",
    message: "Requesting an ergonomic dual-monitor arm for the New York innovation office desk.",
    status: "resolved",
    createdAt: "2026-08-10",
    hrReply: "Approved and shipped via FedEx tracking #99102834.",
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: "aud-1", user: "Arjun Sharma", userRole: "employee", action: "Punched in via Live Biometric Engine", resource: "Attendance", target: "HXAS20230001", timestamp: "Today at 08:54 AM", description: "Checked in at San Francisco Global HQ", type: "attendance" },
  { id: "aud-2", user: "Priya Mehta", userRole: "admin", action: "Approved Attendance Correction Request", resource: "Timesheets", target: "Maya Patel (HXMP20230003)", timestamp: "Yesterday at 04:30 PM", description: "Adjusted check-out timestamp for Aug 19 to 05:30 PM", type: "attendance" },
  { id: "aud-3", user: "Priya Mehta", userRole: "admin", action: "Processed Company Payroll Run", resource: "Compensation", target: "All Employees (25)", timestamp: "3 days ago", description: "Disbursed July 2026 compensation with statutory tax withholdings", type: "payroll" },
  { id: "aud-4", user: "Priya Mehta", userRole: "admin", action: "Published Enterprise Policy", resource: "Policies", target: "Global Hybrid & Remote Work Policy v2.4", timestamp: "5 days ago", description: "Published updated hybrid guidelines", type: "policy" },
  { id: "aud-5", user: "Arjun Sharma", userRole: "employee", action: "Submitted Paid Time Off Application", resource: "Time Off", target: "4 Days (Sep 10 - Sep 14)", timestamp: "Aug 20, 2026", description: "Yosemite family trip application", type: "leave" },
];

export const generateInitialAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  const formatDateISO = (d: Date) => d.toISOString().split("T")[0];

  INITIAL_EMPLOYEES.forEach((emp, empIdx) => {
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const dateStr = formatDateISO(d);

      if (i === 0 && emp.employeeId === "HXAS20230001") {
        records.push({
          id: `att-${emp.employeeId}-${dateStr}`,
          employeeId: emp.employeeId,
          employeeName: emp.name,
          employeeAvatar: emp.avatar,
          date: dateStr,
          checkIn: "08:54 AM",
          status: "present",
          workingHours: "03h 15m",
          breakDuration: "15m",
          location: "Office",
          notes: "Sprint Planning & Standup",
        });
        continue;
      }

      if (i === 0 && emp.employeeId === "HXPM20220001") {
        records.push({
          id: `att-${emp.employeeId}-${dateStr}`,
          employeeId: emp.employeeId,
          employeeName: emp.name,
          employeeAvatar: emp.avatar,
          date: dateStr,
          checkIn: "08:30 AM",
          status: "present",
          workingHours: "03h 39m",
          breakDuration: "20m",
          location: "Office",
        });
        continue;
      }

      const isAbsent = (empIdx * 7 + i) % 17 === 0;
      const isLeave = (empIdx * 3 + i) % 19 === 0;
      const isHalfDay = (empIdx * 5 + i) % 23 === 0;
      const isLate = (empIdx * 2 + i) % 13 === 0;

      let status: "present" | "absent" | "half_day" | "on_leave" | "late" = "present";
      let checkIn: string | undefined = `08:${30 + ((empIdx * 3 + i) % 25)} AM`;
      let checkOut: string | undefined = `05:${30 + ((empIdx * 2 + i) % 45)} PM`;
      let workingHours = "8h 45m";

      if (isAbsent) {
        status = "absent";
        checkIn = undefined;
        checkOut = undefined;
        workingHours = "0h 0m";
      } else if (isLeave) {
        status = "on_leave";
        checkIn = undefined;
        checkOut = undefined;
        workingHours = "0h 0m";
      } else if (isHalfDay) {
        status = "half_day";
        checkOut = "01:30 PM";
        workingHours = "4h 30m";
      } else if (isLate) {
        status = "late";
        checkIn = "10:15 AM";
        workingHours = "7h 45m";
      }

      records.push({
        id: `att-${emp.employeeId}-${dateStr}`,
        employeeId: emp.employeeId,
        employeeName: emp.name,
        employeeAvatar: emp.avatar,
        date: dateStr,
        checkIn,
        checkOut,
        status,
        workingHours,
        breakDuration: status === "present" ? "45m" : undefined,
        location: empIdx % 2 === 0 ? "Office" : "Remote",
      });
    }
  });

  return records;
};

export const INITIAL_SALARY_SLIPS: SalarySlip[] = [
  {
    id: "slip-2026-07-1001",
    employeeId: "HXAS20230001",
    employeeName: "Arjun Sharma",
    department: "Engineering",
    designation: "Software Engineer",
    month: "July 2026",
    payPeriod: "Jul 01, 2026 - Jul 31, 2026",
    paymentDate: "2026-07-31",
    monthlyWage: 18500,
    basicSalary: 9250,
    hra: 4625,
    standardAllowance: 1542,
    performanceBonus: 771,
    lta: 771,
    fixedAllowance: 1541,
    pfDeduction: 1110,
    taxDeduction: 200,
    unpaidLeaveDeduction: 0,
    grossEarnings: 18500,
    totalDeductions: 1310,
    netPay: 17190,
    status: "paid",
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "leave_requested",
    title: "New Leave Application",
    message: "Arjun Sharma applied for 4 days of Paid Time Off (Sep 10 - Sep 14).",
    timestamp: "10 minutes ago",
    read: false,
    targetRole: "admin",
  },
  {
    id: "notif-2",
    type: "attendance_alert",
    title: "Biometric Punch Recorded",
    message: "You checked in on time today at 08:54 AM at San Francisco Global HQ.",
    timestamp: "1 hour ago",
    read: false,
    targetRole: "employee",
  },
  {
    id: "notif-3",
    type: "announcement",
    title: "HRFlowX Hackathon 2026 Announced",
    message: "Registration for the 2026 global innovation hackathon is now open!",
    timestamp: "2 hours ago",
    read: false,
    targetRole: "all",
  },
];
