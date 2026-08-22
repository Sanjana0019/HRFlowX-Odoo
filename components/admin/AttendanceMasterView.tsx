"use client";

import React, { useState } from "react";
import {
  Clock,
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle2,
  XCircle,
  FileCheck,
  Building,
  UserCheck,
  Layers,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AttendanceRecord, AttendanceStatus, AttendanceCorrectionRequest } from "@/types";

export function AttendanceMasterView() {
  const {
    attendanceRecords,
    attendanceRequests,
    approveAttendanceCorrectionRequest,
    rejectAttendanceCorrectionRequest,
    employees,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"master" | "requests">("master");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const [selectedReq, setSelectedReq] = useState<AttendanceCorrectionRequest | null>(null);
  const [reviewComment, setReviewComment] = useState("");

  const departments = Array.from(new Set(employees.map((e) => e.department)));
  const pendingRequests = attendanceRequests.filter((r) => r.status === "pending");

  const filteredRecords = attendanceRecords.filter((rec) => {
    const emp = employees.find((e) => e.employeeId === rec.employeeId);
    const matchesSearch =
      rec.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      rec.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      rec.date.includes(search);

    const matchesStatus = statusFilter === "all" || rec.status === statusFilter;
    const matchesDept = departmentFilter === "all" || (emp && emp.department === departmentFilter);

    return matchesSearch && matchesStatus && matchesDept;
  });

  const handleExportCSV = () => {
    const headers = ["Employee ID", "Employee Name", "Date", "Check In", "Check Out", "Status", "Hours", "Location"];
    const rows = filteredRecords.map((r) => [
      r.employeeId,
      `"${r.employeeName}"`,
      r.date,
      r.checkIn || "-",
      r.checkOut || "-",
      r.status,
      r.workingHours || "-",
      r.location || "Office",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HRFlowX_Company_Attendance_Master_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApprove = (id: string) => {
    approveAttendanceCorrectionRequest(id, reviewComment || "Approved by HR Administrator");
    setSelectedReq(null);
    setReviewComment("");
  };

  const handleReject = (id: string) => {
    rejectAttendanceCorrectionRequest(id, reviewComment || "Declined: Record does not match badge logs.");
    setSelectedReq(null);
    setReviewComment("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <Clock className="h-6 w-6 text-indigo-500" />
            Company Timesheets & Biometric Master
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">
            Audit company-wide daily work records and review employee punch adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-1.5 font-semibold text-xs"
          >
            <Download className="h-4 w-4" />
            Export Master CSV
          </Button>
        </div>
      </div>

      {/* Tabs Switcher: Master Log vs Correction Requests */}
      <div className="flex p-1 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] max-w-md">
        <button
          onClick={() => setActiveTab("master")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === "master"
              ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
              : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          }`}
        >
          Company Timesheet Log ({attendanceRecords.length})
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "requests"
              ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
              : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          }`}
        >
          <span>Correction Requests</span>
          {pendingRequests.length > 0 && (
            <Badge variant="warning" size="xs">
              {pendingRequests.length}
            </Badge>
          )}
        </button>
      </div>

      {activeTab === "master" ? (
        <div className="space-y-4">
          {/* Filters Bar */}
          <Card>
            <CardContent className="p-4 flex flex-col md:flex-row items-center gap-3">
              <div className="w-full md:flex-1">
                <Input
                  type="text"
                  placeholder="Search by employee name, ID, or date (YYYY-MM-DD)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                >
                  <option value="all">All Departments</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="half_day">Half Day</option>
                  <option value="on_leave">On Leave</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Master Records Data Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-muted)] font-semibold uppercase tracking-wider text-[10px] font-sans">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Login ID</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Check In</th>
                    <th className="px-4 py-3">Check Out</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-[var(--secondary)] transition-colors">
                      <td className="px-4 py-3 font-sans">
                        <div className="flex items-center gap-2.5">
                          <Avatar src={r.employeeAvatar} alt={r.employeeName} size="xs" />
                          <span className="font-bold text-[var(--foreground)]">{r.employeeName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400 font-semibold">{r.employeeId}</td>
                      <td className="px-4 py-3 text-[var(--foreground)]">{r.date}</td>
                      <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">{r.checkIn || "—"}</td>
                      <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400">{r.checkOut || "—"}</td>
                      <td className="px-4 py-3 text-[var(--foreground-muted)]">{r.workingHours || "0h 0m"}</td>
                      <td className="px-4 py-3 font-sans text-[var(--foreground-subtle)]">{r.location || "Office"}</td>
                      <td className="px-4 py-3 font-sans">
                        <Badge
                          variant={
                            r.status === "present"
                              ? "success"
                              : r.status === "late"
                              ? "warning"
                              : r.status === "on_leave"
                              ? "purple"
                              : "neutral"
                          }
                          size="xs"
                          dot
                        >
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        /* Correction Requests Review Queue */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendanceRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-card)] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar src={req.employeeAvatar} alt={req.employeeName} size="sm" />
                    <div>
                      <span className="text-xs font-bold text-[var(--foreground)] block">{req.employeeName}</span>
                      <span className="text-[10px] text-[var(--foreground-subtle)] font-mono">{req.employeeId}</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      req.status === "approved"
                        ? "success"
                        : req.status === "pending"
                        ? "warning"
                        : "destructive"
                    }
                    size="xs"
                  >
                    {req.status}
                  </Badge>
                </div>

                <div className="p-3 rounded-xl bg-[var(--secondary)] border border-[var(--border-subtle)] space-y-1 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="text-[var(--foreground-muted)]">Target Date:</span>
                    <span className="font-bold text-[var(--foreground)]">{req.date}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-[var(--foreground-muted)]">Requested Punch:</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      {req.requestedCheckIn} – {req.requestedCheckOut}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[var(--foreground-muted)] italic leading-relaxed">
                  "{req.reason}"
                </p>

                {req.status === "pending" && (
                  <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleReject(req.id)}
                      className="flex-1 text-rose-600 dark:text-rose-400 font-semibold"
                    >
                      Decline
                    </Button>
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => handleApprove(req.id)}
                      className="flex-1 font-semibold"
                    >
                      Approve →
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
