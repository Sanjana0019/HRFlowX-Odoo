# HRFlowX — Next-Generation Enterprise HR Management System

HRFlowX is a modern, high-performance Human Resource Management System (HRMS) built for enterprise team administration, real-time biometric attendance tracking, leave request management, automated payroll generation, document vault security, dynamic analytics, and goal tracking.

---

## 🚀 Key Features

* **Authentication & Role-Based Access**: Supabase Auth with server-verified employee profiles, persistent sessions, role routing, and route protection.
* **Employee Directory**: Full lifecycle management, skill tracking, document vaults, salary structures, and department assignments.
* **Biometric Attendance Tracking**: Real-time punch in/out with geolocation tracking, breakdown of working hours, and correction request approval workflows.
* **Leave & Time Off Engine**: Multi-type balance calculations (paid, sick, casual, maternity), multi-day request processing, admin approval controls, and notifications.
* **Automated Payroll & Salary Component Calculations**: Dynamic salary structures (Basic, HRA, LTA, Standard Allowance, PF, Tax, Gross & Net Pay), automated slip generation, and employee-level access control.
* **Secure Document Vault**: Supabase Storage file management with private buckets, time-limited signed download URLs, and metadata persistence.
* **Realtime Push Notifications**: Supabase Realtime WebSocket subscriptions (`postgres_changes`) for automated system alerts.
* **Live Analytics & KPI Reporting**: Real-time PostgreSQL database aggregation for attendance rates, payroll distribution, leave statistics, and department headcount.
* **Performance, Goals & Asset Tracking**: Objectives and Key Results (OKRs), reviewer performance assessments, support ticket management, and company hardware assignments.
* **Audit Logging & Security**: Immutable audit log tracing for key administrative actions.

---

## 🛠️ Technology Stack

* **Frontend Framework**: Next.js 16.3 (App Router with Turbopack) & React 19
* **State Management**: React Context API with state synchronization
* **Styling & UI**: Vanilla CSS Design Tokens, Glassmorphism Aesthetics, Dark/Light Mode Engine, Lucide Icons
* **Backend & Database**: Supabase PostgreSQL, Row-Level Security (RLS) Policies, Stored Procedures
* **Realtime Engine**: Supabase Realtime Broadcast Channels
* **File Storage**: Supabase Storage Buckets with Signed URLs

---

## 🏗️ System Architecture

```
[ Next.js 16 Client App Router ]
           │
           ├──► [ Supabase Browser Client ] ──► [ Supabase Auth ]
           │
           ├──► [ Row-Level Security (RLS) ] ──► [ PostgreSQL Database ]
           │
           ├──► [ Storage Private Buckets ] ──► [ Supabase Storage ]
           │
           └──► [ Realtime WebSockets ] ──► [ Push Notifications ]
```

---

## 🔒 Security & Row-Level Security (RLS)

HRFlowX enforces security directly at the PostgreSQL layer through Row-Level Security policies:
* **Employee Isolation**: Employees can only read and update their own profiles, attendance records, leave balances, payslips, goals, and documents.
* **Company Isolation**: Multi-tenant database boundary functions (`current_company_id()`, `current_employee_id()`, `is_admin_or_hr()`) prevent cross-company data exposure.
* **Private Storage**: Documents and confidential files are stored in private Supabase Storage buckets accessible only through short-lived signed URLs.

---

## ⚙️ Environment Variables Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

*Note: Never commit `.env.local` or expose `service_role` keys.*

---

## 💻 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/HRFlowX-Odoo.git
   cd HRFlowX-Odoo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run database migrations**:
   Apply SQL files from `supabase/migrations/` in your Supabase SQL Editor.

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🔑 Demo Accounts & Live Presentation Instructions

For live presentation and evaluation purposes, use the following demo credentials or toggle demo mode:

* **Admin / HR Account**:
  * Email: `admin@hrflowx-demo.com`
  * Role: `Admin / HR Administrator`
* **Employee Account**:
  * Email: `employee@hrflowx-demo.com`
  * Role: `Software Engineer`

*Refer to `docs/DEMO_CHECKLIST.md` for the complete step-by-step presentation script.*
