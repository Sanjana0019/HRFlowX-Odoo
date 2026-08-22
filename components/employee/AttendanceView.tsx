"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileEdit,
  Plus,
  Plane,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AttendanceRecord, AttendanceStatus } from "@/types";
import { LivePunchCard } from "@/components/common/LivePunchCard";

export function AttendanceView() {
  const {
    attendanceRecords,
    currentEmployee,
    attendanceRequests,
    raiseAttendanceCorrectionRequest,
  } = useStore();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-08");

  // Correction Request Modal
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [reqDate, setReqDate] = useState(new Date().toISOString().split("T")[0]);
  const [reqIn, setReqIn] = useState("09:00 AM");
  const [reqOut, setReqOut] = useState("06:00 PM");
  const [reqReason, setReqReason] = useState("");

  const myRecords = currentEmployee
    ? attendanceRecords.filter((r) => r.employeeId === currentEmployee.employeeId)
    : [];

  const myRequests = currentEmployee
    ? attendanceRequests.filter((r) => r.employeeId === currentEmployee.employeeId)
    : [];

  const filteredRecords = myRecords.filter((rec) => {
    if (statusFilter !== "all" && rec.status !== statusFilter) return false;
    if (selectedMonth && !rec.date.startsWith(selectedMonth)) return false;
    return true;
  });

  const presentDays = myRecords.filter((r) => r.status === "present").length;
  const lateDays = myRecords.filter((r) => r.status === "late").length;
  const halfDays = myRecords.filter((r) => r.status === "half_day").length;
  const leaveDays = myRecords.filter((r) => r.status === "on_leave").length;
  const totalDays = myRecords.length || 1;
  const onTimePercentage = Math.round(((presentDays) / totalDays) * 100);

  const handleExportCSV = () => {
    const headers = ["Date", "Check In", "Check Out", "Status", "Working Hours", "Location", "Notes"];
    const rows = filteredRecords.map((r) => [
      r.date,
      r.checkIn || "-",
      r.checkOut || "-",
      r.status,
      r.workingHours || "-",
      r.location || "Office",
      `"${r.notes || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HRFlowX_Attendance_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqReason.trim()) return;

    raiseAttendanceCorrectionRequest({
      date: reqDate,
      requestedCheckIn: reqIn,
      requestedCheckOut: reqOut,
      reason: reqReason,
    });

    setIsCorrectionModalOpen(false);
    setReqReason("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <Clock className="h-6 w-6 text-indigo-500" />
            Biometric Attendance & Timesheets
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">
            Verify real-time check-in logs, punctuality metrics, and attendance corrections.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-1.5 font-semibold text-xs"
          >
            <Download className="h-4 w-4" />
            Export Timesheet CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCorrectionModalOpen(true)}
            className="gap-1.5 font-semibold text-xs shadow-sm"
          >
            <FileEdit className="h-4 w-4" />
            Correction Request
          </Button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-card)]">
          <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase block">
            Present Days
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
            {presentDays} Days
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-card)]">
          <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase block">
            On-Time Velocity
          </span>
          <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono mt-1 block">
            {onTimePercentage}%
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-card)]">
          <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase block">
            Late / Half Days
          </span>
          <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-1 block">
            {lateDays + halfDays}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-card)]">
          <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase block">
            Approved Leaves
          </span>
          <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 font-mono mt-1 block">
            {leaveDays} Days
          </span>
        </div>
      </div>

      {/* Main Grid: Calendar & Daily Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Punch & Correction History */}
        <div className="lg:col-span-4 space-y-6">
          <LivePunchCard />

          {/* Correction Requests Card */}
          <Card>
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileEdit className="h-4 w-4 text-purple-500" />
                My Correction Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {myRequests.length > 0 ? (
                myRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[var(--foreground)]">
                        {req.date}
                      </span>
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
                    <p className="text-[11px] text-[var(--foreground-muted)]">
                      Requested: {req.requestedCheckIn} – {req.requestedCheckOut}
                    </p>
                    <p className="text-[10px] text-[var(--foreground-subtle)] italic">
                      "{req.reason}"
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[var(--foreground-subtle)] text-center py-4">
                  No attendance correction requests raised.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Attendance Records Table */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-indigo-500" />
                Monthly Attendance Log ({filteredRecords.length} Records)
              </CardTitle>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-8.5 px-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="half_day">Half Day</option>
                  <option value="on_leave">On Leave</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-muted)] font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Check In</th>
                      <th className="px-4 py-3">Check Out</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)] font-mono">
                    {filteredRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-[var(--secondary)] transition-colors">
                        <td className="px-4 py-3 font-semibold text-[var(--foreground)]">
                          {r.date}
                        </td>
                        <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">
                          {r.checkIn || "—"}
                        </td>
                        <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400">
                          {r.checkOut || "—"}
                        </td>
                        <td className="px-4 py-3 text-[var(--foreground-muted)]">
                          {r.workingHours || "0h 0m"}
                        </td>
                        <td className="px-4 py-3">
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
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Attendance Correction Modal */}
      <Dialog
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
        title="Request Attendance Correction"
        description="Submit punch adjustment for HR review and retroactive update."
      >
        <form onSubmit={handleCorrectionSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
              Date for Adjustment
            </label>
            <Input
              type="date"
              value={reqDate}
              onChange={(e) => setReqDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                Requested Check-In
              </label>
              <Input
                value={reqIn}
                onChange={(e) => setReqIn(e.target.value)}
                placeholder="09:00 AM"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                Requested Check-Out
              </label>
              <Input
                value={reqOut}
                onChange={(e) => setReqOut(e.target.value)}
                placeholder="06:00 PM"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
              Reason for Adjustment
            </label>
            <textarea
              value={reqReason}
              onChange={(e) => setReqReason(e.target.value)}
              placeholder="e.g. Forgot to punch out due to late sprint deployment sync..."
              className="w-full h-24 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setIsCorrectionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Correction →
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
