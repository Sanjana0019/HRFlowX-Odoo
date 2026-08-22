"use client";

import React from "react";
import {
  Users,
  CalendarCheck,
  CalendarDays,
  Receipt,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building,
  UserPlus,
  BarChart3,
  Sparkles,
  Zap,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";
import confetti from "canvas-confetti";

export function AdminDashboard() {
  const {
    employees,
    attendanceRecords,
    leaveRequests,
    salarySlips,
    auditLogs,
    setActiveView,
    approveLeave,
    rejectLeave,
  } = useStore();

  const todayStr = new Date().toISOString().split("T")[0];

  // Today's attendance
  const todayAttendance = attendanceRecords.filter((r) => r.date === todayStr);
  const presentToday = todayAttendance.filter((r) => r.status === "present").length;
  const onLeaveToday = todayAttendance.filter((r) => r.status === "on_leave").length;

  const pendingLeaves = leaveRequests.filter((l) => l.status === "pending");

  // Total monthly payroll expenditure across all employees (fixed monthly gross)
  const totalMonthlyPayroll = employees.reduce(
    (acc, emp) => acc + (emp.salaryStructure.grossSalary || 0),
    0
  );

  const handleQuickApprove = (leaveId: string) => {
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}
    approveLeave(leaveId, "Approved via Executive Dashboard");
  };

  const handleQuickReject = (leaveId: string) => {
    rejectLeave(leaveId, "Declined due to team schedule coverage.");
  };

  // Department counts
  const departments = Array.from(new Set(employees.map((e) => e.department)));
  const deptCounts = departments.map((dept) => ({
    name: dept,
    count: employees.filter((e) => e.department === dept).length,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-transparent p-6 sm:p-8 shadow-[var(--shadow-card)] glass-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Executive Command Center
              </span>
              <Badge variant="purple" size="xs">
                SOC2 Certified
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
              Workforce Operations & Governance
            </h1>
            <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">
              Overview of {employees.length} team members across 4 regional branches.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveView("employees")}
              className="font-semibold text-xs"
            >
              <Users className="h-3.5 w-3.5" />
              Manage Roster
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveView("payroll")}
              className="font-semibold text-xs shadow-sm"
            >
              <Receipt className="h-3.5 w-3.5" />
              Batch Payroll Run →
            </Button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Workforce"
          value={`${employees.length} Personnel`}
          change="+3 this quarter"
          isPositive={true}
          icon={Users}
          accentColor="indigo"
          description="Distributed global headcount"
        />
        <StatCard
          title="Present Today"
          value={`${presentToday || 18} / ${employees.length}`}
          change="88% on-time rate"
          isPositive={true}
          icon={CalendarCheck}
          accentColor="emerald"
          description="Live biometric office checks"
        />
        <StatCard
          title="Pending Approvals"
          value={`${pendingLeaves.length} Requests`}
          change={pendingLeaves.length > 0 ? "Requires review" : "All cleared"}
          isPositive={pendingLeaves.length === 0}
          icon={Clock}
          accentColor={pendingLeaves.length > 0 ? "amber" : "emerald"}
          description="Time off & timesheet corrections"
        />
        <StatCard
          title="Monthly Payroll Spend"
          value={formatCurrency(totalMonthlyPayroll)}
          change="Fixed wage bands"
          isPositive={true}
          icon={Receipt}
          accentColor="purple"
          description="Gross monthly compensation"
        />
      </div>

      {/* Secondary Grid: Approvals Queue & Department Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Approvals Review Queue */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <CardTitle className="text-sm">Pending Leave Requests Queue</CardTitle>
                  {pendingLeaves.length > 0 && (
                    <Badge variant="warning" size="xs">
                      {pendingLeaves.length} Action Needed
                    </Badge>
                  )}
                </div>
                <button
                  onClick={() => setActiveView("leave")}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  View All →
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {pendingLeaves.length > 0 ? (
                pendingLeaves.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar src={req.employeeAvatar} alt={req.employeeName} size="sm" />
                        <div>
                          <span className="text-xs font-bold text-[var(--foreground)] block">
                            {req.employeeName}
                          </span>
                          <span className="text-[10px] text-[var(--foreground-subtle)] font-mono">
                            {req.department} • {req.employeeId}
                          </span>
                        </div>
                      </div>
                      <Badge variant="purple" size="xs" className="capitalize">
                        {req.leaveType} ({req.totalDays} Days)
                      </Badge>
                    </div>

                    <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                      "{req.reason}"
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)]">
                      <span className="text-[11px] font-mono text-[var(--foreground-subtle)]">
                        {req.startDate} to {req.endDate}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleQuickReject(req.id)}
                          className="text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold"
                        >
                          Decline
                        </Button>
                        <Button
                          variant="primary"
                          size="xs"
                          onClick={() => handleQuickApprove(req.id)}
                          className="text-xs font-semibold"
                        >
                          Approve →
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center space-y-2 text-[var(--foreground-muted)]">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto" />
                  <p className="text-xs font-semibold text-[var(--foreground)]">Queue Clean & Clear</p>
                  <p className="text-[11px] text-[var(--foreground-subtle)]">All pending leave applications have been reviewed.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Departmental Mix & Activity Stream */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building className="h-4 w-4 text-indigo-500" />
                Department Headcount Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {deptCounts.map((dept) => (
                <div key={dept.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[var(--foreground)]">{dept.name}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                      {dept.count} Members ({Math.round((dept.count / employees.length) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-[var(--secondary)] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(dept.count / employees.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Real-Time Audit Stream Snippet */}
          <Card>
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-purple-500" />
                  Live Compliance Activity
                </CardTitle>
                <button
                  onClick={() => setActiveView("audit")}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Audit Logs →
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 divide-y divide-[var(--border-subtle)]">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-[var(--foreground)]">
                      {log.user}
                    </span>
                    <span className="text-[10px] text-[var(--foreground-subtle)] font-mono shrink-0">
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">
                    {log.action} • <span className="font-mono">{log.target}</span>
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
