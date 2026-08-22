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
      (acc, e) => acc + (e.salaryStructure.grossSalary || 0),
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
    { name: "Paid Vacation", applied: 14, approved: 12, rejected: 2 },
    { name: "Sick & Medical", applied: 8, approved: 7, rejected: 1 },
    { name: "Casual Leave", applied: 5, approved: 5, rejected: 0 },
    { name: "Unpaid / Other", applied: 3, approved: 1, rejected: 2 },
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <BarChart3 className="h-6 w-6 text-indigo-500" />
            Executive Analytics & Workforce Insights
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">
            Cross-department attendance velocity, headcount distribution, and compensation analytics.
          </p>
        </div>

        <div className="flex p-1 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)]">
          {(["30d", "90d", "1y"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl uppercase transition-all cursor-pointer ${
                timeframe === tf
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Row 1: Attendance Velocity & Headcount Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Area Chart */}
        <Card className="lg:col-span-8">
          <CardHeader className="pb-3 border-b border-[var(--border)]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-emerald-500" />
                Daily Workforce Attendance Velocity
              </CardTitle>
              <Badge variant="success" size="xs">
                96% Current Avg
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="remoteGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="day" stroke="var(--foreground-subtle)" fontSize={11} />
                  <YAxis stroke="var(--foreground-subtle)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "16px",
                      color: "var(--foreground)",
                      fontSize: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="present" name="Office Present" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#presentGrad)" />
                  <Area type="monotone" dataKey="remote" name="Remote Active" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#remoteGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Headcount Mix Pie Chart */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-3 border-b border-[var(--border)]">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-500" />
              Department Roster Mix
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={roleData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "16px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {roleData.slice(0, 4).map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-[11px]">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[var(--foreground-muted)] truncate">{d.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Row 2: Department Payroll Spend BarChart */}
      <Card>
        <CardHeader className="pb-3 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Receipt className="h-4 w-4 text-purple-500" />
              Monthly Departmental Payroll Allocation
            </CardTitle>
            <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
              Fixed Monthly Wage Bands
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="department" stroke="var(--foreground-subtle)" fontSize={11} />
                <YAxis stroke="var(--foreground-subtle)" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "16px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="monthlyPayroll" name="Monthly Payroll Spend" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
