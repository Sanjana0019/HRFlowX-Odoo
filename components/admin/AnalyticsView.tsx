"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  CalendarCheck,
  Receipt,
  CalendarDays,
  Download,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export function AnalyticsView() {
  const { employees, attendanceRecords, leaveRequests } = useStore();
  const [timeframe, setTimeframe] = useState<"30d" | "90d" | "1y">("30d");

  // 1. Attendance Trend Data
  const attendanceTrendData = [
    { day: "Aug 01", present: 18, remote: 4, onLeave: 1, attendanceRate: 95 },
    { day: "Aug 05", present: 17, remote: 5, onLeave: 2, attendanceRate: 91 },
    { day: "Aug 09", present: 19, remote: 3, onLeave: 0, attendanceRate: 98 },
    { day: "Aug 12", present: 18, remote: 4, onLeave: 1, attendanceRate: 95 },
    { day: "Aug 16", present: 16, remote: 6, onLeave: 2, attendanceRate: 89 },
    { day: "Aug 20", present: 19, remote: 4, onLeave: 1, attendanceRate: 96 },
    { day: "Aug 22", present: 18, remote: 5, onLeave: 1, attendanceRate: 96 },
  ];

  // 2. Department Headcount & Payroll Spend Data
  const departments = Array.from(new Set(employees.map((e) => e.department)));
  const deptData = departments.map((dept) => {
    const deptEmps = employees.filter((e) => e.department === dept);
    const totalPayroll = deptEmps.reduce(
      (acc, e) => acc + Math.round(e.salaryStructure.grossSalary / 12),
      0
    );
    return {
      department: dept,
      employees: deptEmps.length,
      monthlyPayroll: totalPayroll,
    };
  });

  // 3. Leave Utilization by Category
  const leaveData = [
    { name: "Paid / Vacation", applied: 14, approved: 12, rejected: 2 },
    { name: "Sick & Medical", applied: 8, approved: 7, rejected: 1 },
    { name: "Casual Leave", applied: 5, approved: 5, rejected: 0 },
    { name: "Unpaid / Sabbatical", applied: 3, approved: 1, rejected: 2 },
  ];

  // 4. Role Composition Data
  const roleData = [
    { name: "Engineering", value: employees.filter((e) => e.department === "Engineering").length, color: "#6366f1" },
    { name: "Product", value: employees.filter((e) => e.department === "Product").length, color: "#8b5cf6" },
    { name: "Design", value: employees.filter((e) => e.department === "Design").length, color: "#ec4899" },
    { name: "Marketing", value: employees.filter((e) => e.department === "Marketing").length, color: "#f59e0b" },
    { name: "Finance", value: employees.filter((e) => e.department === "Finance").length, color: "#10b981" },
    { name: "Human Resources", value: employees.filter((e) => e.department === "Human Resources").length, color: "#06b6d4" },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs">
          <p className="font-bold text-white mb-1.5">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="flex items-center gap-2" style={{ color: entry.color }}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-300">{entry.name}:</span>
              <span className="font-mono font-semibold text-white">
                {entry.name.toLowerCase().includes("payroll") || entry.name.toLowerCase().includes("spend")
                  ? formatCurrency(entry.value)
                  : entry.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <BarChart3 className="h-6 w-6 text-indigo-400" />
            Executive Workforce Analytics & Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Visual metrics covering daily attendance rate, department payroll allocations, and leave trends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-slate-800/80 p-1 border border-slate-700">
            {(["30d", "90d", "1y"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  timeframe === t
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 2 Charts: Attendance Trend Area Chart & Headcount Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-emerald-400" />
                Workforce Attendance Trend (30-Day Velocity)
              </CardTitle>
              <Badge variant="success">96% Avg Presence</Badge>
            </div>
            <p className="text-xs text-slate-400">On-site attendance vs remote active check-ins</p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorRemote" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Area
                    type="monotone"
                    dataKey="present"
                    name="On-Site Present"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPresent)"
                  />
                  <Area
                    type="monotone"
                    dataKey="remote"
                    name="Remote Check-In"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRemote)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Role & Department Composition Donut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-400" />
              Department Mix
            </CardTitle>
            <p className="text-xs text-slate-400">Headcount distribution</p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
              {roleData.map((r) => (
                <div key={r.name} className="flex items-center gap-1.5 truncate">
                  <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                  <span className="text-slate-300 truncate">{r.name}</span>
                  <span className="text-slate-500 font-mono">({r.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom 2 Charts: Departmental Payroll Spending & Leave Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Monthly Payroll Spending */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="h-4 w-4 text-indigo-400" />
                Monthly Payroll Spend by Department
              </CardTitle>
              <Badge variant="purple">Gross Monthly</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="department" stroke="#94a3b8" fontSize={10} angle={-15} textAnchor="end" height={45} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="monthlyPayroll"
                    name="Monthly Payroll ($)"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Leave Requests by Status & Type */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-amber-400" />
                Leave Request Volume & Approvals
              </CardTitle>
              <Badge variant="amber">2026 YTD</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leaveData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar dataKey="applied" name="Total Applied" fill="#64748b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="approved" name="Approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rejected" name="Declined" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
