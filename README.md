# HRFlowX — Human Resource Management System (HRMS)
> *"Streamline People, Power Performance."*

**HRFlowX** is an enterprise-grade, full-stack Human Resource Management SaaS platform designed for high-growth tech enterprises, engineering organizations, and distributed global workforces.

---

## 🌟 Key Functional Modules

### 1. Enterprise Authentication & Deterministic ID Generation
- Deterministic Employee / Login ID generation formula:  
  `[Company Initials][Employee Initials][Joining Year][4-Digit Sequence]` (e.g. `HXAR20230001` or `HXadmin0000`).
- Role-Based Access Control (**ADMIN / HR** vs **EMPLOYEE**) with server-side and client-side view guards.
- 1-Click Interactive Demo Access for instant evaluator testing.

### 2. Live Biometric Punch & Systray Widget
- Real-time work timer with active status dot indicators (*Green = Present, Red = Offline, Airplane = On Leave, Yellow = Absent*).
- Interactive Attendance Calendar (*Green = Present, Red = Absent, Purple = Half Day, Blue = On Leave, Orange = Late*).
- Attendance Correction Request workflow with HR approval and live timesheet updating.

### 3. Dynamic Salary Engine & Wage Calculation
- Percentage-based auto-rebalancing of monthly wages:
  - **Basic Salary**: 50.00% of Monthly Wage
  - **House Rent Allowance (HRA)**: 50.00% of Basic (25% of Wage)
  - **Standard Allowance**: 8.33% of Wage
  - **Performance Bonus**: 8.33% of Basic
  - **Leave Travel Allowance (LTA)**: 8.33% of Basic
  - **Fixed Allowance**: Remainder ($Wage - \sum Components$)
  - **Statutory Deductions**: Provident Fund (12.00% of Basic) & Professional Tax.
  - **Net Take-Home Pay**: Gross Earnings minus statutory deductions.
- Printable/downloadable receipt-style Payslip Modal and batch payroll disbursement cycles.

### 4. Time Off / Leave Quota Automation
- Automated balance calculations ($Allocated - Approved$).
- Leave Types: Paid Leave, Sick Leave (with medical certificate attachment), Unpaid Leave.
- Real-time notification dispatch upon approval/rejection.

### 5. Corporate Governance & Global Branches
- Company profile & branding with logo management.
- Regional Office Branches (San Francisco HQ, New York, Austin, London EMEA).
- Published Enterprise Policies and Employee Handbook.
- Roles & Permissions (RBAC) Matrix.

### 6. Performance, OKRs & Hardware Assets
- Goal tracking with interactive progress sliders ($0-100\%$) and target milestones.
- Corporate Hardware Vault (MacBook Pros, UltraSharp 4K Monitors, YubiKeys).
- Internal Help & Support ticketing system.

### 7. SOC2 Compliance & Audit Trail
- Timestamped audit logs for all CRUD operations, timesheet overrides, payroll runs, and policy changes with `.CSV` export.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + Turbopack
- **Language**: TypeScript 5.0+ (Strict Typings)
- **Styling**: Tailwind CSS + Custom Dark/Light Theme System
- **Icons**: Lucide React Icons
- **Visualizations**: Recharts Interactive Analytics
- **Micro-Interactions**: Canvas Confetti & Framer Motion
- **Database Schema**: PostgreSQL / Supabase Relational Schema ([`supabase/schema.sql`](file:///c:/Users/ronak/OneDrive/Desktop/odoo/supabase/schema.sql))
- **State Management**: Unified Reactive LocalStorage State Provider

---

## 🔑 Demo Credentials

| Role | Name | Email | Login ID | Password | Access Level |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Employee** | Arjun Sharma | `employee@hrflowx.io` | `HXAS20230001` | `password123` | Self-Service Portal |
| **HR Admin** | Priya Mehta | `admin@hrflowx.io` | `HXPM20220001` | `admin123` | Full HR Governance |

*(Instant 1-Click demo logins are also available directly on the sign-in screen, or toggle roles in the top navbar / `⌘K` command center)*

---

## 🚀 Quickstart & Local Installation

### Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm 9+ or pnpm 8+

### Setup Commands
```bash
# 1. Clone or navigate to the project repository
cd odoo

# 2. Install dependencies
npm.cmd install

# 3. Start development server
npm.cmd run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📦 Production Build & Deployment

### Production Build Verification
```bash
# Run strict TypeScript check and Next.js static build
npm.cmd run build

# Start the production server locally
npm.cmd run start
```

### Vercel Deployment Instructions
1. Push this repository to GitHub / GitLab.
2. Import the repository in [Vercel Dashboard](https://vercel.com/new).
3. Framework Preset: **Next.js**.
4. Root Directory: `./`.
5. Environment Variables: copy from [`.env.example`](file:///c:/Users/ronak/OneDrive/Desktop/odoo/.env.example) if Supabase Cloud is configured.
6. Click **Deploy**.

---

## 📁 Project Architecture

```text
├── app/
│   ├── globals.css         # CSS Variables, dark/light theme tokens
│   ├── layout.tsx          # Root HTML layout with Inter font
│   ├── page.tsx            # Entry view wrapped with StoreProvider
│   ├── not-found.tsx       # Branded 404 error page
│   ├── error.tsx           # Client exception boundary
│   └── loading.tsx         # Animated loading skeleton
├── components/
│   ├── admin/              # Executive Dashboard, Directory, Attendance, Payroll, Analytics
│   ├── employee/           # Personal Dashboard, Timesheets, Time Off, Payslips, Profile
│   ├── common/             # Navbar, Sidebar, CommandPalette, LivePunchCard, Settings
│   ├── company/            # Company Profile, Branches, Policies, Permissions Matrix
│   ├── goals/              # OKRs & Performance tracking
│   ├── assets/             # Hardware provisions and equipment tracking
│   ├── support/            # HR Support desk & FAQ
│   ├── audit/              # SOC2 audit trail & event log
│   ├── auth/               # Sign In / Sign Up matching wireframes
│   └── ui/                 # Reusable UI primitives (Button, Card, Badge, Dialog, Input)
├── lib/
│   ├── mockData.ts         # 25+ Seeded employees, attendance, leaves, payslips, assets
│   ├── store.tsx           # Reactive unified state store with LocalStorage auto-persistence
│   ├── utils.ts            # Dynamic wage calculation engine & deterministic ID generator
│   └── supabase.ts         # Supabase client connector
├── supabase/
│   └── schema.sql          # 12 Relational tables with foreign keys and RLS policies
└── types/
    └── index.ts            # Strict TypeScript interfaces
```
