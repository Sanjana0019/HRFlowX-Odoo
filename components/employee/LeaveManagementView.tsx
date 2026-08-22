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
  Plane,
  HeartPulse,
  Coffee,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch {}

      setIsApplyModalOpen(false);
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <CalendarDays className="h-6 w-6 text-indigo-500" />
            Time Off & Leave Allocations
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">
            Track remaining holiday allowances, sick leaves, and submit new leave requests.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsApplyModalOpen(true)}
          className="gap-1.5 font-semibold text-xs shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Request Time Off
        </Button>
      </div>

      {/* Quota Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Paid Vacation */}
        <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-card)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)] flex items-center gap-2">
              <Plane className="h-4 w-4 text-indigo-500" />
              Paid Vacation Leave
            </span>
            <Badge variant="purple" size="xs">
              Annual Quota
            </Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[var(--foreground)] font-mono">
              {currentEmployee.leaveBalances.paid.total - currentEmployee.leaveBalances.paid.used}
            </span>
            <span className="text-xs text-[var(--foreground-muted)] font-mono">
              / {currentEmployee.leaveBalances.paid.total} Days Remaining
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

        {/* Sick Leave */}
        <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-card)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)] flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-rose-500" />
              Sick & Medical Leave
            </span>
            <Badge variant="destructive" size="xs">
              Annual Quota
            </Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[var(--foreground)] font-mono">
              {currentEmployee.leaveBalances.sick.total - currentEmployee.leaveBalances.sick.used}
            </span>
            <span className="text-xs text-[var(--foreground-muted)] font-mono">
              / {currentEmployee.leaveBalances.sick.total} Days Remaining
            </span>
          </div>
          <div className="w-full bg-[var(--secondary)] h-2 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${((currentEmployee.leaveBalances.sick.total - currentEmployee.leaveBalances.sick.used) / currentEmployee.leaveBalances.sick.total) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Unpaid / Casual */}
        <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-card)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)] flex items-center gap-2">
              <Coffee className="h-4 w-4 text-amber-500" />
              Unpaid Leave Allowance
            </span>
            <Badge variant="warning" size="xs">
              As Needed
            </Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[var(--foreground)] font-mono">
              {currentEmployee.leaveBalances.unpaid?.total || 10}
            </span>
            <span className="text-xs text-[var(--foreground-muted)] font-mono">
              Days Maximum Band
            </span>
          </div>
          <div className="w-full bg-[var(--secondary)] h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full w-full" />
          </div>
        </div>
      </div>

      {/* Leave Application History */}
      <Card>
        <CardHeader className="pb-3 border-b border-[var(--border)]">
          <CardTitle className="text-sm">My Leave Request History ({myLeaves.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-muted)] font-semibold uppercase tracking-wider text-[10px] font-sans">
                <tr>
                  <th className="px-4 py-3">Leave Type</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Days</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Applied Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {myLeaves.map((l) => (
                  <tr key={l.id} className="hover:bg-[var(--secondary)] transition-colors">
                    <td className="px-4 py-3 font-sans capitalize font-bold text-[var(--foreground)]">
                      {l.leaveType} Leave
                    </td>
                    <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400">
                      {l.startDate} → {l.endDate}
                    </td>
                    <td className="px-4 py-3 font-bold text-[var(--foreground)]">
                      {l.totalDays} Day{l.totalDays > 1 ? "s" : ""}
                    </td>
                    <td className="px-4 py-3 font-sans text-[var(--foreground-muted)] max-w-xs truncate">
                      {l.reason}
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground-subtle)]">{l.appliedDate}</td>
                    <td className="px-4 py-3 font-sans">
                      <Badge
                        variant={
                          l.status === "approved"
                            ? "success"
                            : l.status === "pending"
                            ? "warning"
                            : "destructive"
                        }
                        size="xs"
                        dot
                      >
                        {l.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
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
        description="Select duration and specify purpose for executive approval."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
              Time Off Category
            </label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              className="h-10 w-full px-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              <option value="paid">Paid Annual Vacation</option>
              <option value="sick">Sick & Medical Leave</option>
              <option value="unpaid">Unpaid Personal Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
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
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
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

          {startDate && endDate && (
            <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-between text-xs">
              <span className="text-[var(--foreground-muted)]">Calculated Days Off:</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {calculatedDays} Day{calculatedDays > 1 ? "s" : ""}
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
              Reason / Destination Context
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Annual family retreat in Yosemite..."
              className="w-full h-24 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
              Submit Request →
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
