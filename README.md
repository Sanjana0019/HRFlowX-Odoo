# HRFlowX

HRFlowX is a modern Human Resource Management System built for organizations that need role-based access, attendance operations, leave workflows, payroll visibility, secure document handling, and administrative oversight in one product.

## Live Application

Production URL:
https://hrflowx-rhg2wsl8b-sanjanasp0019-7907s-projects.vercel.app

## Product Highlights

- Role-based authentication and protected routing for admin, HR, and employee personas
- Employee lifecycle management with profile, resume, private info, compensation, and documents
- Attendance workflows with punch in and punch out tracking and correction requests
- Leave application and approval flows with categorized balances
- Payroll views with earnings and deductions breakdown
- Secure document vault with restricted access and signed download links
- Real-time notifications for key user and admin events
- Analytics and operational dashboards for HR and leadership
- Audit logs for traceability of administrative actions
- Support, assets, goals and performance management modules

## Core Modules

- Admin Dashboard and Analytics
- Employee Directory and Detail Management
- Attendance Management
- Leave Approvals and Self-Service Leave Requests
- Payroll Master and Employee Payroll Views
- Documents Vault
- Announcements and Notification Center
- Audit Logs and Settings

## Technology Stack

Frontend and App Framework:
- Next.js 16.3.2 (App Router)
- React 19.2.8
- TypeScript 5

Data and Backend Services:
- Supabase Auth
- Supabase PostgreSQL
- Supabase Realtime
- Supabase Storage

UI and Experience:
- Custom design tokens and global CSS architecture
- Tailwind CSS 4 toolchain
- Lucide React icons
- Recharts for data visualization
- Framer Motion for interaction and transitions

Developer Tooling:
- ESLint 9
- next lint configuration

## Security Model

- Route-level protection through middleware
- Row-Level Security policies in PostgreSQL for tenant-safe data access
- Signed URLs for private document access
- Role checks for administrative actions and privileged views

## Project Structure

- app: Next.js app entry, layout, loading, error, and route-level UI shell
- components: Feature-oriented UI and module screens
- lib: Data utilities, Supabase clients, and state management
- supabase: Schema, seed data, and migration SQL
- docs: Architecture, database details, and demo walkthrough
- types: Shared TypeScript domain types

## Getting Started

1. Install dependencies.

```bash
npm install
```

2. Create an environment file named .env.local in the project root.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Apply database schema and migration SQL from the supabase folder to your Supabase project.

4. Run the development server.

```bash
npm run dev
```

5. Build for production.

```bash
npm run build
npm run start
```

## Available Scripts

- npm run dev: Starts local development server
- npm run build: Creates production build
- npm run start: Starts production server
- npm run lint: Runs lint checks

## Demo Flow

Use the presentation script in docs/DEMO_CHECKLIST.md for a complete admin-to-employee walkthrough.

## Additional Documentation

- docs/ARCHITECTURE.md
- docs/DATABASE.md
- docs/DEMO_CHECKLIST.md

## License

This repository is currently private and does not define a public license.
