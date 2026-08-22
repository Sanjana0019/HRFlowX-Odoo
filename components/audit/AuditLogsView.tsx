"use client";

import React, { useState } from "react";
import { ShieldCheck, Search, Filter, Clock, Activity, Download } from "lucide-react";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-indigo-400" />
            Compliance & Enterprise Audit Trail
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Immutable log stream of user actions, timesheet overrides, payroll disbursements, and policy changes.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2 text-xs">
          <Download className="h-4 w-4" /> Export Audit Log (.CSV)
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit trail by actor, action, target..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-slate-800/80 p-1 border border-slate-700/80">
            {["all", "attendance", "leave", "payroll", "employee", "policy"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-all ${
                  filterType === t
                    ? "bg-indigo-600 text-white shadow-sm font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <CardTitle className="text-base">Event Stream ({filteredLogs.length})</CardTitle>
            <p className="text-xs text-slate-400">Cryptographically verified operational sequence</p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-slate-800/60">
            {filteredLogs.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-500">No matching audit events.</p>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-800/40 transition-colors flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 p-2 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{log.user}</span>
                        <Badge variant={log.userRole === "admin" ? "purple" : "blue"} size="sm">
                          {log.userRole}
                        </Badge>
                        <span className="text-xs text-indigo-300 font-semibold">{log.action}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{log.description}</p>
                      <span className="text-[10px] text-slate-500 font-mono mt-1.5 block">
                        Target: {log.target} • {log.timestamp}
                      </span>
                    </div>
                  </div>

                  <Badge variant="outline" size="sm" className="capitalize text-[10px] flex-shrink-0">
                    {log.resource}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
