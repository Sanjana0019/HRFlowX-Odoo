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

  const navItems = [
    {
      id: "dashboard",
      label: "Executive Dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "employee"],
    },
    {
      id: "employees",
      label: "Workforce Directory",
      icon: Users,
      badge: "25 Team",
      roles: ["admin", "employee"],
    },
    {
      id: "attendance",
      label: "Biometric Attendance",
      icon: Clock,
      badge: isAdmin && pendingAtts > 0 ? `${pendingAtts}` : undefined,
      roles: ["admin", "employee"],
    },
    {
      id: "leave",
      label: "Time Off & Leave",
      icon: CalendarDays,
      badge: isAdmin && pendingLeaves > 0 ? `${pendingLeaves}` : undefined,
      roles: ["admin", "employee"],
    },
    {
      id: "payroll",
      label: "Payroll & Compensation",
      icon: CreditCard,
      roles: ["admin", "employee"],
    },
    {
      id: "analytics",
      label: "Analytics & Reports",
      icon: BarChart3,
      roles: ["admin", "employee"],
    },
    {
      id: "company",
      label: "Company & Policies",
      icon: Building,
      badge: "Governance",
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
      label: "Corporate Holidays",
      icon: Calendar,
      roles: ["admin", "employee"],
    },
    {
      id: "assets",
      label: "Hardware Assets",
      icon: Laptop,
      roles: ["admin", "employee"],
    },
    {
      id: "support",
      label: "Help & Support Desk",
      icon: HelpCircle,
      roles: ["admin", "employee"],
    },
    {
      id: "audit",
      label: "Audit Trail",
      icon: ShieldCheck,
      badge: "SOC2",
      roles: ["admin"],
    },
    {
      id: "settings",
      label: "System Settings",
      icon: Settings,
      roles: ["admin", "employee"],
    },
  ];

  const handleNavClick = (id: string) => {
    setActiveView(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-800/80 bg-slate-950/90 p-4 transition-all">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-white">HRFlowX</span>
              <Badge variant="purple" size="sm">v3.0</Badge>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Enterprise HRMS</span>
          </div>
        </div>

        {/* Role Pill Banner */}
        <div className="px-2 mb-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-900/90 border border-slate-800 p-2.5">
            <div className="flex items-center gap-2">
              <Shield className={`h-4 w-4 ${isAdmin ? "text-purple-400" : "text-indigo-400"}`} />
              <span className="text-xs font-bold text-white capitalize">
                {isAdmin ? "Admin Console" : "Employee Portal"}
              </span>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
          {navItems
            .filter((item) => item.roles.includes(isAdmin ? "admin" : "employee"))
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20 font-bold"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-800 text-indigo-300 border border-slate-700"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="pt-3 border-t border-slate-800/80 px-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>HRFlowX Cloud</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Operational
          </span>
        </div>
      </div>
    </aside>
  );
}
