"use client";

import React, { useState } from "react";
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

  // Total monthly payroll expenditure across all employees
  const totalMonthlyPayroll = employees.reduce(
    (acc, emp) => acc + Math.round(emp.salaryStructure.grossSalary / 12),
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-900/40 p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                HR Executive Control Center
              </h1>
              <Badge variant="purple" size="sm">
                Director Access
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Workforce intelligence, pending approvals, and real-time attendance oversight.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveView("employees")}
            className="text-xs"
          >
            <UserPlus className="h-3.5 w-3.5 mr-1" />
            Add Employee
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveView("analytics")}
            className="text-xs"
          >
            <BarChart3 className="h-3.5 w-3.5 mr-1" />
            View Reports
          </Button>
        </div>
      </div>

      {/* 5 High-Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Workforce"
          value={employees.length}
          change="100% Active"
          isPositive={true}
          icon={Users}
          description="Enrolled team members"
          accentColor="indigo"
          onClick={() => setActiveView("employees")}
        />
        <StatCard
          title="Present Today"
          value={`${presentToday || 16} / ${employees.length}`}
          change="92% On-Site / Remote"
          isPositive={true}
          icon={CalendarCheck}
          description="Punched in today"
          accentColor="emerald"
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          onClick={() => setActiveView("attendance")}
        />
        <StatCard
          title="On Leave Today"
          value={onLeaveToday || 2}
          change="Planned Absence"
          isPositive={true}
          icon={CalendarDays}
          description="Approved time-off"
          accentColor="amber"
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10 border-amber-500/20"
          onClick={() => setActiveView("leave")}
        />
        <StatCard
          title="Pending Leaves"
          value={pendingLeaves.length}
          change={pendingLeaves.length > 0 ? "Requires Action" : "Up to Date"}
          isPositive={pendingLeaves.length === 0}
          icon={AlertCircle}
          description="Awaiting HR approval"
          accentColor="rose"
          iconColor="text-rose-400"
          iconBg="bg-rose-500/10 border-rose-500/20"
          onClick={() => setActiveView("leave")}
        />
        <StatCard
          title="Monthly Payroll"
          value={formatCurrency(totalMonthlyPayroll)}
          change="All Departments"
          isPositive={true}
          icon={Receipt}
          description="Current monthly run"
          accentColor="purple"
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10 border-purple-500/20"
          onClick={() => setActiveView("payroll")}
        />
      </div>

      {/* Urgent Pending Leave Approvals Section */}
      <Card className="border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertCircle className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base">Pending Leave Approvals Queue</CardTitle>
              <p className="text-xs text-slate-400">
                Action required: review and approve or decline pending time-off requests.
              </p>
            </div>
          </div>
          <Badge variant="amber" size="md">
            {pendingLeaves.length} Pending
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          {pendingLeaves.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              All leave requests have been reviewed and processed.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {pendingLeaves.slice(0, 4).map((leave) => (
                <div
                  key={leave.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <Avatar
                      src={leave.employeeAvatar}
                      name={leave.employeeName}
                      size="md"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {leave.employeeName}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          ({leave.employeeId})
                        </span>
                        <Badge variant="blue" size="sm">
                          {leave.department}
                        </Badge>
                        <Badge variant="amber" size="sm" className="capitalize">
                          {leave.leaveType} ({leave.totalDays}d)
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        <span className="font-mono text-indigo-300">
                          {leave.startDate} → {leave.endDate}
                        </span>{" "}
                        • "{leave.reason}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      variant="emerald"
                      size="sm"
                      onClick={() => handleQuickApprove(leave.id)}
                      className="text-xs h-8 gap-1 font-semibold"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleQuickReject(leave.id)}
                      className="text-xs h-8 gap-1"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Middle Grid: Department Distribution & Recent HR Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Building className="h-4 w-4 text-indigo-400" />
              Department Headcount Distribution
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveView("employees")}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              All Employees <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {deptCounts.map((dept) => {
              const pct = Math.round((dept.count / employees.length) * 100);
              return (
                <div key={dept.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-200">{dept.name}</span>
                    <span className="text-indigo-300 font-mono">
                      {dept.count} Members ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Company Activity Stream */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-400" />
              System Audit & Activity Stream
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {auditLogs.slice(0, 5).map((act: any) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/80"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar src={act.actorAvatar} name={act.actorName} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-200 truncate">
                      <span className="font-semibold text-white">{act.actorName}</span>{" "}
                      {act.action} <span className="text-indigo-400 font-medium">{act.target}</span>
                    </p>
                    <span className="text-[10px] text-slate-500">{act.timestamp}</span>
                  </div>
                </div>
                <Badge variant="outline" size="sm" className="capitalize text-[10px] flex-shrink-0 ml-2">
                  {act.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
