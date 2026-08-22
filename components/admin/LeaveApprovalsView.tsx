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
import { Textarea } from "@/components/ui/input";
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
            Time-Off Approval Hub
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Review employee time-off applications, append administrative comments, and update balances.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by applicant name, ID, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-slate-800/80 p-1 border border-slate-700/80">
            {["pending", "approved", "rejected", "all"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-3 py-1 text-xs font-medium capitalize transition-all ${
                  statusFilter === st
                    ? "bg-indigo-600 text-white shadow-sm font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <CardTitle className="text-base">Applications Queue ({filteredLeaves.length})</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Live updates directly synchronized to employee portal
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Employee</th>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5">Type & Duration</th>
                  <th className="px-5 py-3.5">Date Range</th>
                  <th className="px-5 py-3.5">Reason</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No leave requests found for this filter.
                    </td>
                  </tr>
                ) : (
                  filteredLeaves.map((leave) => (
                    <tr
                      key={leave.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            src={leave.employeeAvatar}
                            name={leave.employeeName}
                            size="sm"
                          />
                          <div>
                            <span className="font-semibold text-white block">
                              {leave.employeeName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {leave.employeeId}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <Badge variant="outline">{leave.department}</Badge>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-semibold text-indigo-300 capitalize block">
                          {leave.leaveType} Leave
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {leave.totalDays} {leave.totalDays === 1 ? "day" : "days"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-200 whitespace-nowrap">
                        {leave.startDate} → {leave.endDate}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300 max-w-xs truncate">
                        {leave.reason}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {getStatusBadge(leave.status)}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        {leave.status === "pending" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="emerald"
                              size="sm"
                              onClick={() => handleOpenAction(leave, "approve")}
                              className="h-8 text-xs gap-1 font-semibold"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleOpenAction(leave, "reject")}
                              className="h-8 text-xs gap-1"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Decline
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">
                            {leave.adminComment || "Processed"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      {selectedLeave && (
        <Dialog
          isOpen={Boolean(selectedLeave)}
          onClose={() => setSelectedLeave(null)}
          title={
            actionType === "approve"
              ? `Approve Leave — ${selectedLeave.employeeName}`
              : `Decline Leave — ${selectedLeave.employeeName}`
          }
          description={`Review request for ${selectedLeave.totalDays} days (${selectedLeave.startDate} to ${selectedLeave.endDate})`}
          maxWidth="md"
        >
          <form onSubmit={handleConfirmAction} className="space-y-4">
            <div className="rounded-xl bg-slate-800/40 p-3 text-xs border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold block">Applicant's Stated Reason:</span>
              <p className="text-slate-200 italic">"{selectedLeave.reason}"</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                HR / Admin Review Note
              </label>
              <Textarea
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                placeholder="Optional feedback or approval notes..."
                rows={3}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setSelectedLeave(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={actionType === "approve" ? "emerald" : "destructive"}
                size="md"
                className="gap-1.5 font-semibold"
              >
                {actionType === "approve" ? (
                  <>
                    <Sparkles className="h-4 w-4" /> Confirm Approval
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" /> Confirm Decline
                  </>
                )}
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
