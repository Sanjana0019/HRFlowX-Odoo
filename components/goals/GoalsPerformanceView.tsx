"use client";

import React, { useState } from "react";
import {
  Target,
  Plus,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Edit3,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Goal } from "@/types";

export function GoalsPerformanceView() {
  const { goals, addGoal, updateGoalProgress, deleteGoal, currentUser, employees } = useStore();
  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "hr";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(currentUser?.employeeId || "HXAR20230001");
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalDueDate, setGoalDueDate] = useState("2026-10-31");

  const myGoals = isAdmin
    ? goals
    : goals.filter((g) => g.employeeId === currentUser?.employeeId);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.employeeId === selectedEmpId) || employees[0];
    addGoal({
      employeeId: emp.employeeId,
      employeeName: emp.name,
      title: goalTitle,
      target: goalTarget,
      dueDate: goalDueDate,
      progress: 10,
      status: "on_track",
      assignedBy: currentUser?.name || "HR Director",
    });
    setIsModalOpen(false);
    setGoalTitle("");
    setGoalTarget("");
  };

  const getStatusBadge = (st: Goal["status"]) => {
    switch (st) {
      case "completed":
        return <Badge variant="success">Completed 100%</Badge>;
      case "at_risk":
        return <Badge variant="destructive">At Risk</Badge>;
      case "behind":
        return <Badge variant="warning">Behind Schedule</Badge>;
      case "on_track":
      default:
        return <Badge variant="blue">On Track</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Target className="h-6 w-6 text-indigo-400" />
            Goals, OKRs & Performance
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Quarterly objectives, key target metrics, and real-time progress indicators.
          </p>
        </div>

        {isAdmin && (
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} className="gap-1.5 font-semibold">
            <Plus className="h-4 w-4" /> Create Objective
          </Button>
        )}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {myGoals.length === 0 ? (
          <Card className="col-span-full p-12 text-center text-slate-500">
            <Target className="h-10 w-10 mx-auto mb-2 opacity-30 text-indigo-400" />
            <p className="text-sm font-medium text-slate-300">No active goals assigned yet.</p>
          </Card>
        ) : (
          myGoals.map((g) => (
            <Card key={g.id} className="p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                      {g.employeeName} ({g.employeeId})
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{g.title}</h3>
                  </div>
                  {getStatusBadge(g.status)}
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="font-semibold text-indigo-300">Target: </span>
                  {g.target}
                </p>

                {g.feedback && (
                  <p className="text-[11px] text-slate-400 italic">
                    "{g.feedback}"
                  </p>
                )}

                {/* Progress Bar & Slider */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-mono text-emerald-400">{g.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all"
                      style={{ width: `${g.progress}%` }}
                    />
                  </div>
                </div>

                {/* Interactive Slider for owner/admin */}
                <div className="pt-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={g.progress}
                    onChange={(e) => updateGoalProgress(g.id, Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
                <span>Due: {g.dueDate}</span>
                {isAdmin && (
                  <button
                    onClick={() => deleteGoal(g.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Goal Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign Performance Objective / OKR"
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Assignee</label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white"
            >
              {employees.map((e) => (
                <option key={e.employeeId} value={e.employeeId}>
                  {e.name} ({e.department} - {e.employeeId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Objective Title</label>
            <Input placeholder="e.g. Accelerate Core App Load Times" value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} required />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Measurable Key Result</label>
            <Input placeholder="e.g. Lower LCP below 800ms across all dashboards" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} required />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Target Completion Date</label>
            <Input type="date" value={goalDueDate} onChange={(e) => setGoalDueDate(e.target.value)} required />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Create Goal</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
