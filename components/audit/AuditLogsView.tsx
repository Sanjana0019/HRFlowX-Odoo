"use client";

import React, { useState } from "react";
import { ShieldCheck, Search, Filter, Clock, Activity, Download } from "lucide-react";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuditLogsView() {
  const { auditLogs } = useStore();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.resource.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === "all" || log.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleExportCSV = () => {
    const headers = ["Timestamp", "User", "Role", "Action", "Resource", "Target", "Description"];
    const rows = filteredLogs.map((l) => [
      l.timestamp,
      `"${l.user}"`,
      l.userRole,
      `"${l.action}"`,
      l.resource,
      `"${l.target}"`,
      `"${l.description}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HRFlowX_Audit_Trail_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-indigo-500" />
            Compliance & Enterprise Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">
            Immutable log stream of user actions, timesheet overrides, payroll disbursements, and policy changes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Badge variant="purple" size="xs">
            SOC2 Type II Certified
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-1.5 font-semibold text-xs"
          >
            <Download className="h-4 w-4" />
            Export Audit CSV
          </Button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-3">
          <div className="w-full md:flex-1">
            <Input
              type="text"
              placeholder="Search audit trail by actor, action, resource, or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              <option value="all">All Action Types</option>
              <option value="auth">Authentication & Sessions</option>
              <option value="payroll">Payroll & Compensation</option>
              <option value="leave">Leave Approvals</option>
              <option value="attendance">Timesheets</option>
              <option value="admin">System Operations</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-muted)] font-semibold uppercase tracking-wider text-[10px] font-sans">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Actor / User</th>
                <th className="px-4 py-3">Action Event</th>
                <th className="px-4 py-3">Resource Target</th>
                <th className="px-4 py-3">Audit Details</th>
                <th className="px-4 py-3">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[var(--secondary)] transition-colors">
                  <td className="px-4 py-3 text-[var(--foreground-subtle)]">{log.timestamp}</td>
                  <td className="px-4 py-3 font-sans font-bold text-[var(--foreground)]">
                    {log.user}
                  </td>
                  <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400 font-semibold">{log.action}</td>
                  <td className="px-4 py-3 text-[var(--foreground)] font-bold">{log.target}</td>
                  <td className="px-4 py-3 font-sans text-[var(--foreground-muted)] max-w-sm truncate">
                    {log.description}
                  </td>
                  <td className="px-4 py-3 font-sans">
                    <Badge variant="neutral" size="xs" className="uppercase">
                      {log.type}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
