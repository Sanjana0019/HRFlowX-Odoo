"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { LeaveType, LeaveStatus } from "@/types";
import confetti from "canvas-confetti";

export function LeaveManagementView() {
  const { currentEmployee, leaveRequests, applyLeave } = useStore();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType>("paid");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentEmployee) return null;

  const myLeaves = leaveRequests.filter(
    (l) => l.employeeId === currentEmployee.employeeId
  );

  // Calculate day difference
  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = e.getTime() - s.getTime();
    if (diffTime < 0) return 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  };

  const calculatedDays = calculateDays(startDate, endDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!startDate || !endDate) {
      setErrorMsg("Please select both start and end dates.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setErrorMsg("End date cannot be earlier than start date.");
      return;
    }

    if (!reason.trim()) {
      setErrorMsg("Please provide a reason for the leave request.");
      return;
    }

    setIsSubmitting(true);
    try {
      applyLeave({
        leaveType,
        startDate,
        endDate,
        reason,
        totalDays: calculatedDays,
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      setIsApplyModalOpen(false);
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit leave request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="h-3 w-3" /> Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" /> Declined
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge variant="amber" className="gap-1">
            <Clock className="h-3 w-3" /> Pending Review
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <CalendarDays className="h-6 w-6 text-indigo-400" />
            Leave & Time-Off Management
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Apply for planned leaves, view remaining balance, and track manager approvals.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsApplyModalOpen(true)}
          className="gap-2 shadow-indigo-500/25 font-semibold"
        >
          <Plus className="h-4 w-4" />
          Apply for Time Off
        </Button>
      </div>

      {/* Quotas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Paid Leave Card */}
        <Card className="border-indigo-500/20 bg-gradient-to-br from-slate-900 to-indigo-950/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-200">
                Paid / Annual Leave
              </CardTitle>
              <Badge variant="blue">Standard Quota</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-bold text-white font-mono">
                {currentEmployee.leaveBalances.paid.total -
                  currentEmployee.leaveBalances.paid.used}
              </span>
              <span className="text-xs text-slate-400">
                of {currentEmployee.leaveBalances.paid.total} Days Left
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full"
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
            <p className="mt-2 text-[11px] text-slate-400">
              {currentEmployee.leaveBalances.paid.used} days utilized this fiscal year
            </p>
          </CardContent>
        </Card>

        {/* Sick Leave Card */}
        <Card className="border-amber-500/20 bg-gradient-to-br from-slate-900 to-amber-950/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-200">
                Sick & Medical Leave
              </CardTitle>
              <Badge variant="amber">Health Cover</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-bold text-white font-mono">
                {currentEmployee.leaveBalances.sick.total -
                  currentEmployee.leaveBalances.sick.used}
              </span>
              <span className="text-xs text-slate-400">
                of {currentEmployee.leaveBalances.sick.total} Days Left
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
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
            <p className="mt-2 text-[11px] text-slate-400">
              {currentEmployee.leaveBalances.sick.used} days utilized this fiscal year
            </p>
          </CardContent>
        </Card>

        {/* Unpaid Leave Card */}
        <Card className="border-slate-700/60 bg-gradient-to-br from-slate-900 to-slate-950">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-200">
                Unpaid / Sabbatical
              </CardTitle>
              <Badge variant="outline">On-Demand</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-bold text-white font-mono">
                {currentEmployee.leaveBalances.unpaid.total -
                  currentEmployee.leaveBalances.unpaid.used}
              </span>
              <span className="text-xs text-slate-400">
                of {currentEmployee.leaveBalances.unpaid.total} Days Available
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-slate-500 rounded-full"
                style={{ width: "100%" }}
              />
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              Subject to department manager pre-approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests Table Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <CardTitle className="text-base">Leave Applications History</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              All submitted time-off requests and administrative review records
            </p>
          </div>
          <Badge variant="default" size="md">
            {myLeaves.length} Total Requests
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Leave Type</th>
                  <th className="px-5 py-3.5">Date Range</th>
                  <th className="px-5 py-3.5">Duration</th>
                  <th className="px-5 py-3.5">Reason</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Applied Date</th>
                  <th className="px-5 py-3.5">Manager Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {myLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No leave requests filed yet. Click "Apply for Time Off" above.
                    </td>
                  </tr>
                ) : (
                  myLeaves.map((leave) => (
                    <tr
                      key={leave.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-medium text-white capitalize whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                          {leave.leaveType} Leave
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-200 whitespace-nowrap">
                        {leave.startDate} → {leave.endDate}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-indigo-300 whitespace-nowrap">
                        {leave.totalDays} {leave.totalDays === 1 ? "Day" : "Days"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300 max-w-xs truncate">
                        {leave.reason}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {getStatusBadge(leave.status)}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">
                        {leave.appliedDate}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 italic max-w-xs truncate">
                        {leave.adminComment || (leave.status === "pending" ? "Awaiting HR review" : "-")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Apply Leave Modal */}
      <Dialog
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Time Off"
        description="Submit a leave request for administrative review and quota deduction."
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Leave Type Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Leave Category
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: "paid", label: "Paid Leave", left: currentEmployee.leaveBalances.paid.total - currentEmployee.leaveBalances.paid.used },
                { id: "sick", label: "Sick Leave", left: currentEmployee.leaveBalances.sick.total - currentEmployee.leaveBalances.sick.used },
                { id: "unpaid", label: "Unpaid Leave", left: currentEmployee.leaveBalances.unpaid.total - currentEmployee.leaveBalances.unpaid.used },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setLeaveType(item.id as LeaveType)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs ${
                    leaveType === item.id
                      ? "bg-indigo-600/20 border-indigo-500 text-white font-semibold shadow-inner"
                      : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                    ({item.left} left)
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Duration info */}
          {startDate && endDate && (
            <div className="flex items-center justify-between rounded-xl bg-indigo-950/40 border border-indigo-800/40 p-3 text-xs">
              <span className="text-slate-300">Calculated Leave Duration:</span>
              <span className="font-bold text-indigo-400 font-mono text-sm">
                {calculatedDays} {calculatedDays === 1 ? "Day" : "Days"}
              </span>
            </div>
          )}

          {/* Reason / Remarks */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Reason / Remarks
            </label>
            <Textarea
              placeholder="Please provide details regarding your leave request..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsApplyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className="gap-1.5 font-semibold"
            >
              <Sparkles className="h-4 w-4" />
              Submit Application
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
