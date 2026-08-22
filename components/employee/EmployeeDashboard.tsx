"use client";

import React, { useState } from "react";
import {
  CalendarCheck,
  CalendarDays,
  Receipt,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Award,
  Zap,
  Target,
  FileText,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LivePunchCard } from "@/components/common/LivePunchCard";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";

export function EmployeeDashboard() {
  const {
    currentEmployee,
    attendanceRecords,
    leaveRequests,
    salarySlips,
    auditLogs,
    setActiveView,
    isPunchedIn,
    punchInTime,
  } = useStore();

  if (!currentEmployee) return null;

  // Filter records for this employee
  const myAttendance = attendanceRecords.filter(
    (r) => r.employeeId === currentEmployee.employeeId
  );
  const myLeaves = leaveRequests.filter(
    (l) => l.employeeId === currentEmployee.employeeId
  );
  const mySlips = salarySlips.filter(
    (s) => s.employeeId === currentEmployee.employeeId
  );

  // Stats calculation
  const totalRecords = myAttendance.length || 1;
  const presentDays = myAttendance.filter((r) => r.status === "present").length;
  const attendanceRate = Math.min(100, Math.round((presentDays / totalRecords) * 100));

  const totalLeaveQuota =
    currentEmployee.leaveBalances.paid.total +
    currentEmployee.leaveBalances.sick.total;
  const usedLeaves =
    currentEmployee.leaveBalances.paid.used +
    currentEmployee.leaveBalances.sick.used;
  const remainingLeaves = Math.max(0, totalLeaveQuota - usedLeaves);

  // Latest payslip
  const latestSlip = mySlips[0];

  // Weekly Attendance Days (Mon - Sun)
  const weekdays = [
    { day: "Mon", status: "present", hours: "8h 45m", date: "Aug 17" },
    { day: "Tue", status: "present", hours: "8h 30m", date: "Aug 18" },
    { day: "Wed", status: "present", hours: "9h 10m", date: "Aug 19" },
    { day: "Thu", status: "present", hours: "8h 15m", date: "Aug 20" },
    { day: "Fri", status: "present", hours: "8h 50m", date: "Aug 21" },
    { day: "Sat", status: "weekend", hours: "Off", date: "Aug 22" },
    { day: "Sun", status: "weekend", hours: "Off", date: "Aug 23" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent p-6 sm:p-8 shadow-[var(--shadow-card)] glass-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <Avatar
              src={currentEmployee.avatar}
              alt={currentEmployee.name}
              size="lg"
              status={isPunchedIn ? "online" : "offline"}
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
                  Good morning, {currentEmployee.name.split(" ")[0]}!
                </h1>
                <Badge variant="purple" size="xs">
                  {currentEmployee.designation}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-[var(--foreground-muted)] flex items-center gap-2">
                <span>{currentEmployee.department}</span>
                <span>•</span>
                <span>{currentEmployee.location}</span>
                <span>•</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                  {currentEmployee.employeeId}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveView("leave")}
              className="font-semibold text-xs"
            >
              Request Time Off
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveView("profile")}
              className="font-semibold text-xs shadow-sm"
            >
              View My Profile →
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance Velocity"
          value={`${attendanceRate}%`}
          change="+4.2% vs last month"
          isPositive={true}
          icon={CalendarCheck}
          accentColor="indigo"
          description="Consistent punctuality score"
        />
        <StatCard
          title="Leave Balance"
          value={`${remainingLeaves} Days`}
          change={`${usedLeaves} Used`}
          isPositive={true}
          icon={CalendarDays}
          accentColor="purple"
          description="Paid + Sick annual allocation"
        />
        <StatCard
          title="Net Take-Home Pay"
          value={formatCurrency(currentEmployee.salaryStructure.netSalary)}
          change="Processed on time"
          isPositive={true}
          icon={Receipt}
          accentColor="emerald"
          description="Monthly post-tax compensation"
        />
        <StatCard
          title="Shift Status"
          value={isPunchedIn ? "Active Shift" : "Shift Offline"}
          change={isPunchedIn ? `Since ${punchInTime || "08:54 AM"}` : "Standby"}
          isPositive={isPunchedIn}
          icon={Clock}
          accentColor={isPunchedIn ? "emerald" : "amber"}
          description="Biometric live punch engine"
        />
      </div>

      {/* Main Content Grid: Live Punch & Weekly Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Punch Action Card */}
        <div className="lg:col-span-5 space-y-6">
          <LivePunchCard />

          {/* Quick Leave Quota Card */}
          <Card>
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-purple-500" />
                  Leave Balances Summary
                </CardTitle>
                <button
                  onClick={() => setActiveView("leave")}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Manage →
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[var(--foreground)]">Paid Vacation Leave</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                    {currentEmployee.leaveBalances.paid.total - currentEmployee.leaveBalances.paid.used} / {currentEmployee.leaveBalances.paid.total} Days
                  </span>
                </div>
                <div className="w-full bg-[var(--secondary)] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${((currentEmployee.leaveBalances.paid.total - currentEmployee.leaveBalances.paid.used) / currentEmployee.leaveBalances.paid.total) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[var(--foreground)]">Sick & Wellness Leave</span>
                  <span className="text-purple-600 dark:text-purple-400 font-mono">
                    {currentEmployee.leaveBalances.sick.total - currentEmployee.leaveBalances.sick.used} / {currentEmployee.leaveBalances.sick.total} Days
                  </span>
                </div>
                <div className="w-full bg-[var(--secondary)] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${((currentEmployee.leaveBalances.sick.total - currentEmployee.leaveBalances.sick.used) / currentEmployee.leaveBalances.sick.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Weekly Attendance & Recent Activity */}
        <div className="lg:col-span-7 space-y-6">
          {/* Weekly Attendance Matrix */}
          <Card>
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-emerald-500" />
                  This Week's Attendance Rhythm
                </CardTitle>
                <button
                  onClick={() => setActiveView("attendance")}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Full Calendar →
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-7 gap-2 text-center">
                {weekdays.map((d) => (
                  <div
                    key={d.day}
                    className={`p-2.5 rounded-xl border transition-all ${
                      d.status === "present"
                        ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400"
                        : "bg-[var(--secondary)] border-[var(--border-subtle)] text-[var(--foreground-subtle)]"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-wider block">
                      {d.day}
                    </span>
                    <span className="text-[11px] font-bold block mt-1 text-[var(--foreground)]">
                      {d.hours}
                    </span>
                    <span className="text-[9px] block text-[var(--foreground-subtle)] font-mono mt-0.5">
                      {d.date}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Applications & Recent Activity */}
          <Card>
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                Recent Time Off & Activity Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {myLeaves.length > 0 ? (
                myLeaves.slice(0, 3).map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--secondary)] border border-[var(--border-subtle)]"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--foreground)] capitalize">
                          {l.leaveType} Leave ({l.totalDays} Days)
                        </span>
                        <Badge
                          variant={
                            l.status === "approved"
                              ? "success"
                              : l.status === "pending"
                              ? "warning"
                              : "destructive"
                          }
                          size="xs"
                        >
                          {l.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[var(--foreground-muted)]">
                        {l.startDate} to {l.endDate} • {l.reason}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[var(--foreground-subtle)] text-center py-4">
                  No active time off applications.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
