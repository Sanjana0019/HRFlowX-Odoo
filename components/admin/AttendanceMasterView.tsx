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
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
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
    approveAttendanceCorrectionRequest(id, reviewComment || "Approved by HR.");
    setSelectedReq(null);
    setReviewComment("");
  };

  const handleReject = (id: string) => {
    rejectAttendanceCorrectionRequest(id, reviewComment || "Declined.");
    setSelectedReq(null);
    setReviewComment("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Clock className="h-6 w-6 text-indigo-400" />
            Company-Wide Attendance Master & Timesheet Approvals
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Audit workforce punctuality, analyze timesheets, and review punch correction requests.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 text-xs font-semibold">
            <Download className="h-3.5 w-3.5" /> Export Company Master (.CSV)
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("master")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "master"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <Clock className="h-3.5 w-3.5" /> All Timesheet Records ({attendanceRecords.length})
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
            activeTab === "requests"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <FileCheck className="h-3.5 w-3.5" /> Correction Requests
          {pendingRequests.length > 0 && (
            <span className="h-5 min-w-5 px-1.5 rounded-full bg-amber-500 text-[10px] font-bold text-black flex items-center justify-center">
              {pendingRequests.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "master" ? (
        <Card>
          <CardHeader className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pb-4 border-b border-slate-800">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by employee, login ID, date..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="h-10 px-3 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-slate-200"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-slate-200"
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
                    <th className="px-5 py-3.5">Employee</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Check In</th>
                    <th className="px-5 py-3.5">Check Out</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Hours</th>
                    <th className="px-5 py-3.5">Location</th>
                    <th className="px-5 py-3.5">Audit Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredRecords.slice(0, 50).map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40">
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <Avatar src={r.employeeAvatar} name={r.employeeName} size="xs" />
                          <div>
                            <span className="font-bold text-white block">{r.employeeName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{r.employeeId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-white font-medium whitespace-nowrap">{r.date}</td>
                      <td className="px-5 py-3.5 font-mono text-emerald-400 whitespace-nowrap">{r.checkIn || "--:--"}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-300 whitespace-nowrap">{r.checkOut || "--:--"}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <Badge variant={r.status === "present" ? "success" : r.status === "late" ? "amber" : r.status === "on_leave" ? "purple" : "outline"} size="sm" className="capitalize">
                          {r.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-white whitespace-nowrap">{r.workingHours || "--"}</td>
                      <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">{r.location || "Office"}</td>
                      <td className="px-5 py-3.5 text-slate-400 max-w-xs truncate">{r.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Correction Requests Tab */
        <Card>
          <CardHeader className="pb-4 border-b border-slate-800">
            <CardTitle className="text-base">Timesheet Correction Requests</CardTitle>
            <p className="text-xs text-slate-400">Review employee punch adjustment requests</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-800/60">
              {attendanceRequests.map((req) => (
                <div key={req.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <Avatar src={req.employeeAvatar} name={req.employeeName} size="xs" />
                      <span className="text-sm font-bold text-white">{req.employeeName}</span>
                      <Badge variant="blue" size="sm">{req.department}</Badge>
                      <Badge variant={req.status === "approved" ? "success" : req.status === "rejected" ? "destructive" : "amber"} size="sm" className="capitalize">
                        {req.status}
                      </Badge>
                    </div>

                    <div className="text-xs text-slate-300">
                      <span className="text-slate-400">Target Date: </span>
                      <span className="font-semibold text-white">{req.date}</span>
                      <span className="text-slate-500 mx-2">•</span>
                      <span className="text-slate-400">Requested Shift: </span>
                      <span className="font-mono text-emerald-400 font-bold">{req.requestedCheckIn} - {req.requestedCheckOut}</span>
                    </div>

                    <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-indigo-300 font-semibold">Reason: </span>
                      {req.reason}
                    </p>
                  </div>

                  {req.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApprove(req.id)}
                        className="gap-1.5 text-xs font-semibold"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve Adjustment
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(req.id)}
                        className="gap-1.5 text-xs font-semibold"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
