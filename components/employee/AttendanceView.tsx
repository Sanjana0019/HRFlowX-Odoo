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
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
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
    link.setAttribute("download", `HRFlowX_Timesheet_${currentEmployee?.employeeId || "emp"}_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    raiseAttendanceCorrectionRequest({
      date: reqDate,
      requestedCheckIn: reqIn,
      requestedCheckOut: reqOut,
      reason: reqReason,
    });
    setIsCorrectionModalOpen(false);
    setReqReason("");
  };

  // Status Badge Helper
  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return <Badge variant="success">Present</Badge>;
      case "late":
        return <Badge variant="amber">Late</Badge>;
      case "half_day":
        return <Badge variant="purple">Half Day</Badge>;
      case "on_leave":
        return <Badge variant="blue">On Leave</Badge>;
      case "absent":
        return <Badge variant="destructive">Absent</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Clock className="h-6 w-6 text-indigo-400" />
            Biometric Attendance & Timesheets
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Track daily work hours, biometric punches, on-time punctuality, and request timesheet adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCorrectionModalOpen(true)}
            className="gap-1.5 text-xs font-semibold"
          >
            <FileEdit className="h-3.5 w-3.5" /> Request Correction
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-1.5 text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" /> Export (.CSV)
          </Button>
        </div>
      </div>

      {/* Live Punch Card Widget */}
      <LivePunchCard />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <span className="text-xs text-slate-400 font-medium">On-Time Accuracy</span>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">{onTimePercentage}%</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Punctuality Score</span>
        </Card>

        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Present Days</span>
          <p className="text-2xl font-extrabold text-white mt-1">{presentDays}</p>
          <span className="text-[10px] text-emerald-400 mt-1 block">Full Shifts Logged</span>
        </Card>

        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Late Arrivals</span>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">{lateDays}</p>
          <span className="text-[10px] text-amber-400/80 mt-1 block">Grace period applies</span>
        </Card>

        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Approved Leaves</span>
          <p className="text-2xl font-extrabold text-indigo-400 mt-1">{leaveDays}</p>
          <span className="text-[10px] text-indigo-400/80 mt-1 block">Vacation & Sick</span>
        </Card>
      </div>

      {/* Interactive Monthly Attendance Calendar */}
      <Card className="p-5">
        <CardHeader className="p-0 pb-4 border-b border-slate-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-indigo-400" />
              Interactive Attendance Calendar (August 2026)
            </CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Green = Present, Red = Absent, Purple = Half Day, Blue = On Leave, Orange = Late
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="font-bold text-slate-500 py-1">
                {day}
              </div>
            ))}
            {/* Days Matrix for Aug 2026 */}
            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-08-${String(dayNum).padStart(2, "0")}`;
              const rec = myRecords.find((r) => r.date === dateStr);

              let bg = "bg-slate-900/40 border-slate-800/60 text-slate-500";
              let label = "Off";

              if (rec) {
                if (rec.status === "present") {
                  bg = "bg-emerald-500/20 border-emerald-500/40 text-emerald-300";
                  label = "Present";
                } else if (rec.status === "late") {
                  bg = "bg-amber-500/20 border-amber-500/40 text-amber-300";
                  label = "Late";
                } else if (rec.status === "half_day") {
                  bg = "bg-purple-500/20 border-purple-500/40 text-purple-300";
                  label = "Half Day";
                } else if (rec.status === "on_leave") {
                  bg = "bg-blue-500/20 border-blue-500/40 text-blue-300";
                  label = "On Leave";
                } else if (rec.status === "absent") {
                  bg = "bg-rose-500/20 border-rose-500/40 text-rose-300";
                  label = "Absent";
                }
              }

              return (
                <div
                  key={dayNum}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-between min-h-[60px] transition-all hover:scale-105 ${bg}`}
                >
                  <span className="font-bold text-xs">{dayNum}</span>
                  <span className="text-[10px] font-medium mt-1 truncate">{label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Attendance History Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <CardTitle className="text-base">Logged Timesheet Logs</CardTitle>
            <p className="text-xs text-slate-400">Timestamp records recorded by biometric auth</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-700 bg-slate-900 text-xs text-slate-200"
            >
              <option value="all">All Statuses</option>
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
              <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Check In</th>
                  <th className="px-5 py-3.5">Check Out</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Total Hours</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No attendance records found for this period.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40">
                      <td className="px-5 py-3.5 font-medium text-white whitespace-nowrap">{r.date}</td>
                      <td className="px-5 py-3.5 font-mono text-emerald-400 whitespace-nowrap">{r.checkIn || "--:--"}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-300 whitespace-nowrap">{r.checkOut || "--:--"}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">{getStatusBadge(r.status)}</td>
                      <td className="px-5 py-3.5 font-mono text-white whitespace-nowrap">{r.workingHours || "--"}</td>
                      <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">{r.location || "Office"}</td>
                      <td className="px-5 py-3.5 text-slate-400 max-w-xs truncate">{r.notes || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Correction Modal */}
      <Dialog
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
        title="Request Timesheet Correction"
        description="Submit a punch adjustment request to HR with the reason for missing punch."
        maxWidth="md"
      >
        <form onSubmit={handleCorrectionSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Date</label>
            <Input type="date" value={reqDate} onChange={(e) => setReqDate(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Check In Time</label>
              <Input placeholder="09:00 AM" value={reqIn} onChange={(e) => setReqIn(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Check Out Time</label>
              <Input placeholder="06:00 PM" value={reqOut} onChange={(e) => setReqOut(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Reason for Adjustment</label>
            <Textarea
              placeholder="e.g. Forgot to clock out due to offsite client deployment..."
              value={reqReason}
              onChange={(e) => setReqReason(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCorrectionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Submit Request
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
