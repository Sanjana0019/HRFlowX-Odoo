"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Sparkles,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LeaveRequest, LeaveStatus } from "@/types";
import confetti from "canvas-confetti";

export function LeaveApprovalsView() {
  const { leaveRequests, approveLeave, rejectLeave } = useStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [adminComment, setAdminComment] = useState("");

  const filteredLeaves = leaveRequests.filter((leave) => {
    const matchesSearch =
      leave.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      leave.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      leave.department.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || leave.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAction = (leave: LeaveRequest, action: "approve" | "reject") => {
    setSelectedLeave(leave);
    setActionType(action);
    setAdminComment(
      action === "approve"
        ? "Approved by HR Management."
        : "Declined due to team operational scheduling."
    );
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeave) return;

    if (actionType === "approve") {
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch {}
      approveLeave(selectedLeave.id, adminComment);
    } else {
      rejectLeave(selectedLeave.id, adminComment);
    }

    setSelectedLeave(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <CalendarDays className="h-6 w-6 text-indigo-500" />
            Leave Applications & Approvals
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">
            Review submitted employee time off requests, audit medical notes, and execute decisions.
          </p>
        </div>
      </div>

      {/* Filter & Status Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex p-1 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] w-full sm:w-auto">
          {["pending", "approved", "rejected", "all"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 text-xs font-bold rounded-xl capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {st === "all" ? "All Requests" : st}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <Input
            type="text"
            placeholder="Search by name, ID, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeaves.map((req) => (
          <div
            key={req.id}
            className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-card)] space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar src={req.employeeAvatar} alt={req.employeeName} size="sm" />
                <div>
                  <span className="text-xs font-bold text-[var(--foreground)] block">
                    {req.employeeName}
                  </span>
                  <span className="text-[10px] text-[var(--foreground-subtle)] font-mono">
                    {req.department} • {req.employeeId}
                  </span>
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
                className="capitalize"
              >
                {req.status}
              </Badge>
            </div>

            <div className="p-3 rounded-xl bg-[var(--secondary)] border border-[var(--border-subtle)] space-y-1 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-[var(--foreground-muted)]">Category:</span>
                <span className="font-bold text-[var(--foreground)] capitalize">{req.leaveType} Leave</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[var(--foreground-muted)]">Dates:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  {req.startDate} → {req.endDate} ({req.totalDays} Days)
                </span>
              </div>
            </div>

            <p className="text-xs text-[var(--foreground-muted)] italic leading-relaxed">
              "{req.reason}"
            </p>

            {req.adminComment && (
              <div className="p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/15 text-[11px] text-purple-600 dark:text-purple-400">
                <span className="font-bold block">HR Note:</span>
                {req.adminComment}
              </div>
            )}

            {req.status === "pending" && (
              <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => handleOpenAction(req, "reject")}
                  className="flex-1 text-rose-600 dark:text-rose-400 font-semibold"
                >
                  Decline
                </Button>
                <Button
                  variant="primary"
                  size="xs"
                  onClick={() => handleOpenAction(req, "approve")}
                  className="flex-1 font-semibold"
                >
                  Approve →
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Dialog Modal */}
      {selectedLeave && (
        <Dialog
          isOpen={Boolean(selectedLeave)}
          onClose={() => setSelectedLeave(null)}
          title={`${actionType === "approve" ? "Approve" : "Decline"} Time Off Request`}
          description={`Submit official decision for ${selectedLeave.employeeName} (${selectedLeave.totalDays} Days).`}
        >
          <form onSubmit={handleConfirmAction} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                Official Review Comment
              </label>
              <textarea
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                placeholder="Enter comments for the employee..."
                className="w-full h-24 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
              <Button variant="secondary" size="sm" type="button" onClick={() => setSelectedLeave(null)}>
                Cancel
              </Button>
              <Button
                variant={actionType === "approve" ? "primary" : "destructive"}
                size="sm"
                type="submit"
              >
                Confirm {actionType === "approve" ? "Approval" : "Rejection"}
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
