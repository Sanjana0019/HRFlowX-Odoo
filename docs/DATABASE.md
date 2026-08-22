# HRFlowX — Database Schema & RLS Security Specifications

HRFlowX utilizes PostgreSQL with Row-Level Security (RLS) policies to ensure data isolation.

---

## 1. Primary Entity Relationship Overview

```
[ companies ] ──┬──► [ departments ]
                ├──► [ branches ]
                └──► [ employees ] ──┬──► [ attendance ]
                                     ├──► [ leave_requests ]
                                     ├──► [ salary_slips ]
                                     ├──► [ documents ]
                                     ├──► [ notifications ]
                                     ├──► [ goals ]
                                     ├──► [ performance_reviews ]
                                     ├──► [ assets ]
                                     └──► [ support_requests ]
```

---

## 2. Core Tables Summary

| Table Name | Description | Key Security Rule |
| :--- | :--- | :--- |
| `companies` | Multi-tenant organization records | Admin accessible |
| `employees` | Employee master profiles & role bindings | Employee reads own profile; Admin manages company employees |
| `attendance` | Daily check-in/out records | Employee reads/writes own attendance; Admin manages company |
| `leave_requests` | Time-off requests and balances | Employee submits/views own requests; Admin approves/rejects |
| `salary_components` | Dynamic salary structure definitions | Confidential; Admin manages; Employee reads own payslips |
| `payroll_records` | Processed payroll batches | Admin creates/processes; Employee views own payroll slips |
| `documents` | Metadata for vault files | Private files accessible only via RLS and signed URLs |
| `notifications` | In-app push notifications | Realtime channels filtered by `employee_id` |
| `audit_logs` | Immutable system audit log | Append-only; Admin reads company logs |
