# HRFlowX — System Architecture & Technical Specifications

HRFlowX is built using a modern decoupled cloud architecture featuring Next.js 16 (App Router), Supabase (Auth, PostgreSQL, Realtime, Storage), and Vanilla CSS design tokens.

---

## 1. Architectural Blueprint

```
+-------------------------------------------------------------------------+
|                              CLIENT LAYER                               |
|   Next.js 16 React Client Components | State Provider Context Store      |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                             SECURITY LAYER                              |
|   Middleware Proxy | Supabase Auth JWT Validation | RLS Policies        |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                              BACKEND LAYER                              |
|  PostgreSQL Database  |  Supabase Storage  |  Realtime WebSocket Engine |
+-------------------------------------------------------------------------+
```

---

## 2. Core Subsystems

### A. Authentication & Session Management
- Client-side auth state managed via `createBrowserClient()`.
- Server-side route validation via `middleware.ts` proxy checking JWT tokens.
- User identity is mapped to the `employees` PostgreSQL table to resolve application roles (`admin`, `hr`, `employee`).

### B. Biometric Attendance Engine
- Stores daily records in `attendance` with `check_in`, `check_out`, location, and working hours calculations.
- Correction request workflow handles edits via `attendance_correction_requests`.

### C. Leave & Payroll Engine
- Dynamic salary calculations (Basic 50%, HRA 50% of Basic, LTA, Standard Allowance, PF 12%, PT, Tax).
- Leave deduction calculation linked to employee unpaid leave totals.

### D. Document Vault & Storage
- Document metadata stored in `documents` table.
- Raw document files uploaded to `documents` bucket in Supabase Storage.
- Download links generated via short-lived signed URLs (`getSignedUrl`).

### E. Realtime Notifications & Audit Engine
- Changes on `notifications` table trigger WebSocket messages via `subscribeToNotificationsInSupabase()`.
- Administrative mutations emit audit entries into the append-only `audit_logs` table.
