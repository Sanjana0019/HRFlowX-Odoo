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
    { day: "Mon", status: "present", hours: "8h 45m" },
    { day: "Tue", status: "present", hours: "8h 30m" },
    { day: "Wed", status: "present", hours: "9h 10m" },
    { day: "Thu", status: "present", hours: "8h 15m" },
    { day: "Fri", status: "present", hours: "8h 50m" },
    { day: "Sat", status: "weekend", hours: "Off" },
    { day: "Sun", status: "weekend", hours: "Off" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-900/40 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />

        <div className="flex items-center gap-4">
          <Avatar
            src={currentEmployee.avatar}
            name={currentEmployee.name}
            size="lg"
            className="ring-2 ring-indigo-500/50"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Good morning, {currentEmployee.name.split(" ")[0]}! 👋
              </h1>
              <Badge variant="blue" size="sm" className="hidden sm:inline-flex">
                {currentEmployee?.designation || "Staff Engineer"}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Welcome back to HRFlowX. You have 0 pending action items today.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveView("leave")}
            className="text-xs"
          >
            <CalendarDays className="h-3.5 w-3.5 mr-1" />
            Apply Leave
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveView("payroll")}
            className="text-xs"
          >
            <Receipt className="h-3.5 w-3.5 mr-1" />
            View Payslip
          </Button>
        </div>
      </div>

      {/* Live Punch Hero Widget */}
      <LivePunchCard />

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          change="+2.4% vs last month"
          isPositive={true}
          icon={CalendarCheck}
          description="Consistent on-time check-in"
          accentColor="indigo"
          onClick={() => setActiveView("attendance")}
        />
        <StatCard
          title="Remaining Leaves"
          value={`${remainingLeaves} Days`}
          change={`${usedLeaves} days utilized`}
          isPositive={true}
          icon={CalendarDays}
          description="Paid & Sick leave quota"
          accentColor="emerald"
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          onClick={() => setActiveView("leave")}
        />
        <StatCard
          title="Logged Days"
          value={`${presentDays} / ${totalRecords}`}
          change="100% Target Met"
          isPositive={true}
          icon={TrendingUp}
          description="Current monthly billing cycle"
          accentColor="blue"
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10 border-blue-500/20"
          onClick={() => setActiveView("attendance")}
        />
        <StatCard
          title="Next Payday"
          value="Aug 31, 2026"
          change={latestSlip ? formatCurrency(latestSlip.netPay) : "$18,250"}
          isPositive={true}
          icon={Receipt}
          description="Direct deposit scheduled"
          accentColor="purple"
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10 border-purple-500/20"
          onClick={() => setActiveView("payroll")}
        />
      </div>

      {/* Middle Section: Weekly Attendance + Leave Balance Quotas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Attendance Overview */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-indigo-400" />
                This Week's Attendance Matrix
              </CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily clock-in consistency and logged hours
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveView("attendance")}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Full Log <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 pt-2">
              {weekdays.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    item.status === "present"
                      ? "bg-indigo-950/30 border-indigo-500/30 hover:border-indigo-500/60"
                      : "bg-slate-900/50 border-slate-800"
                  }`}
                >
                  <span className="text-xs font-semibold text-slate-400">{item.day}</span>
                  <div
                    className={`my-2 h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs ${
                      item.status === "present"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-slate-800 text-slate-500 border border-slate-700"
                    }`}
                  >
                    {item.status === "present" ? "✓" : "-"}
                  </div>
                  <span
                    className={`text-[10px] font-mono font-medium ${
                      item.status === "present" ? "text-indigo-300" : "text-slate-500"
                    }`}
                  >
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Present (5 days)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-slate-500" /> Weekend Off
                </span>
              </div>
              <span className="font-mono text-indigo-300 font-semibold">Total: 43h 30m</span>
            </div>
          </CardContent>
        </Card>

        {/* Leave Balances Breakdown */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-emerald-400" />
              Leave Balances (2026)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Paid Leave */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Paid / Casual Leaves</span>
                <span className="text-emerald-400 font-semibold font-mono">
                  {currentEmployee.leaveBalances.paid.total - currentEmployee.leaveBalances.paid.used} /{" "}
                  {currentEmployee.leaveBalances.paid.total} Left
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all"
                  style={{
                    width: `${
                      ((currentEmployee.leaveBalances.paid.total -
                        currentEmployee.leaveBalances.paid.used) /
                        currentEmployee.leaveBalances.paid.total) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Sick Leave */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Sick & Medical</span>
                <span className="text-amber-400 font-semibold font-mono">
                  {currentEmployee.leaveBalances.sick.total - currentEmployee.leaveBalances.sick.used} /{" "}
                  {currentEmployee.leaveBalances.sick.total} Left
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all"
                  style={{
                    width: `${
                      ((currentEmployee.leaveBalances.sick.total -
                        currentEmployee.leaveBalances.sick.used) /
                        currentEmployee.leaveBalances.sick.total) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Unpaid Leave */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Unpaid Sabbatical</span>
                <span className="text-slate-400 font-semibold font-mono">
                  {currentEmployee.leaveBalances.unpaid.total - currentEmployee.leaveBalances.unpaid.used} /{" "}
                  {currentEmployee.leaveBalances.unpaid.total} Left
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-slate-600 rounded-full transition-all"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveView("leave")}
              className="w-full mt-2 text-xs"
            >
              Request Time Off
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Recent Activity + Leave Requests Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Company & Personal Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-400" />
              Recent Work Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {auditLogs.slice(0, 4).map((act: any) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/80"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={act.actorAvatar} name={act.actorName} size="sm" />
                  <div>
                    <p className="text-xs text-slate-200">
                      <span className="font-semibold text-white">{act.actorName}</span>{" "}
                      {act.action} <span className="text-indigo-400">{act.target}</span>
                    </p>
                    <span className="text-[10px] text-slate-500">{act.timestamp}</span>
                  </div>
                </div>
                <Badge variant="outline" size="sm" className="capitalize text-[10px]">
                  {act.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* My Active Leave Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-400" />
              My Leave Requests
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveView("leave")}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              View All <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {myLeaves.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-500">
                No leave requests filed yet.
              </p>
            ) : (
              myLeaves.slice(0, 3).map((leave) => (
                <div
                  key={leave.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800/80"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white capitalize">
                        {leave.leaveType} Leave ({leave.totalDays}d)
                      </span>
                      <Badge
                        variant={
                          leave.status === "approved"
                            ? "success"
                            : leave.status === "rejected"
                            ? "destructive"
                            : "amber"
                        }
                        size="sm"
                        className="capitalize"
                      >
                        {leave.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {leave.startDate} to {leave.endDate}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Applied {leave.appliedDate}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
