"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  CreditCard,
  BarChart3,
  Building,
  FolderLock,
  Target,
  Megaphone,
  Calendar,
  Laptop,
  HelpCircle,
  ShieldCheck,
  Settings,
  Sparkles,
  ChevronRight,
  Shield,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

export function Sidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const {
    activeView,
    setActiveView,
    currentUser,
    unreadNotificationsCount,
    attendanceRequests,
    leaveRequests,
  } = useStore();

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "hr";

  const pendingLeaves = leaveRequests.filter((l) => l.status === "pending").length;
  const pendingAtts = attendanceRequests.filter((a) => a.status === "pending").length;

  const navSections = [
    {
      title: "OVERVIEW",
      items: [
        {
          id: "dashboard",
          label: isAdmin ? "Executive Dashboard" : "Personal Dashboard",
          icon: LayoutDashboard,
          roles: ["admin", "employee"],
        },
        {
          id: "employees",
          label: "Workforce Directory",
          icon: Users,
          badge: "25 Team",
          badgeVariant: "neutral" as const,
          roles: ["admin", "employee"],
        },
      ],
    },
    {
      title: "TIME & COMPENSATION",
      items: [
        {
          id: "attendance",
          label: isAdmin ? "Attendance Master" : "Biometric Timesheets",
          icon: Clock,
          badge: isAdmin && pendingAtts > 0 ? `${pendingAtts}` : undefined,
          badgeVariant: "warning" as const,
          roles: ["admin", "employee"],
        },
        {
          id: "leave",
          label: isAdmin ? "Leave Approvals" : "Time Off & Leaves",
          icon: CalendarDays,
          badge: isAdmin && pendingLeaves > 0 ? `${pendingLeaves}` : undefined,
          badgeVariant: "purple" as const,
          roles: ["admin", "employee"],
        },
        {
          id: "payroll",
          label: isAdmin ? "Compensation & Payroll" : "My Salary & Payslips",
          icon: CreditCard,
          roles: ["admin", "employee"],
        },
        {
          id: "analytics",
          label: "Executive Analytics",
          icon: BarChart3,
          roles: ["admin"],
        },
      ],
    },
    {
      title: "GOVERNANCE & TALENT",
      items: [
        {
          id: "company",
          label: "Branches & Governance",
          icon: Building,
          roles: ["admin", "employee"],
        },
        {
          id: "documents",
          label: "Documents Vault",
          icon: FolderLock,
          roles: ["admin", "employee"],
        },
        {
          id: "goals",
          label: "Goals & OKRs",
          icon: Target,
          roles: ["admin", "employee"],
        },
        {
          id: "announcements",
          label: "Announcements",
          icon: Megaphone,
          roles: ["admin", "employee"],
        },
        {
          id: "holidays",
          label: "Holidays Calendar",
          icon: Calendar,
          roles: ["admin", "employee"],
        },
      ],
    },
    {
      title: "OPERATIONS & COMPLIANCE",
      items: [
        {
          id: "assets",
          label: "Hardware Assets",
          icon: Laptop,
          roles: ["admin", "employee"],
        },
        {
          id: "support",
          label: "Support & Helpdesk",
          icon: HelpCircle,
          roles: ["admin", "employee"],
        },
        {
          id: "audit",
          label: "SOC2 Audit Trail",
          icon: ShieldCheck,
          roles: ["admin"],
        },
        {
          id: "settings",
          label: "System Settings",
          icon: Settings,
          roles: ["admin", "employee"],
        },
      ],
    },
  ];

  return (
    <aside className="flex flex-col h-full w-64 border-r border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground)] select-none transition-colors">
      {/* Navigation Groups Container */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section) => {
          const visibleItems = section.items.filter(
            (item) => !item.roles || item.roles.includes(currentUser?.role || "employee")
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--foreground-subtle)]">
                {section.title}
              </span>
              <nav className="mt-1 space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id as any);
                        onCloseMobile?.();
                      }}
                      className={`group relative flex w-full items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                        isActive
                          ? "bg-[var(--card)] text-[var(--foreground)] font-semibold shadow-xs border border-[var(--border)]"
                          : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`h-4 w-4 shrink-0 transition-colors ${
                            isActive
                              ? "text-indigo-600 dark:text-indigo-400"
                              : "text-[var(--foreground-subtle)] group-hover:text-[var(--foreground)]"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <Badge
                            variant={item.badgeVariant || "default"}
                            size="xs"
                            className="font-mono text-[9px] px-1.5 py-0.2"
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {isActive && (
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* Compact Workspace Status Footer */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--card)]">
        <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--secondary)] border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <div className="truncate text-left leading-tight">
              <span className="text-[11px] font-bold text-[var(--foreground)] block truncate">
                HRFlowX Cloud
              </span>
              <span className="text-[9px] text-[var(--foreground-subtle)] font-mono">
                {isAdmin ? "Enterprise Tier" : "Team Member"}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-md">
            99.9%
          </span>
        </div>
      </div>
    </aside>
  );
}
