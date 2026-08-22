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
  const [selectedEmpId, setSelectedEmpId] = useState(currentUser?.employeeId || "HXAS20230001");
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
        return <Badge variant="success" size="xs">Completed 100%</Badge>;
      case "at_risk":
        return <Badge variant="destructive" size="xs">At Risk</Badge>;
      default:
        return <Badge variant="purple" size="xs">On Track</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <Target className="h-6 w-6 text-indigo-500" />
            Goals, OKRs & Performance Reviews
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">
            Track key results, quarterly deliverables, and employee career development progress.
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="gap-1.5 font-semibold text-xs shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Set New Objective
          </Button>
        )}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myGoals.map((goal) => (
          <div
            key={goal.id}
            className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-card)] space-y-4 text-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-bold text-[var(--foreground)] text-sm leading-snug">
                {goal.title}
              </span>
              {getStatusBadge(goal.status)}
            </div>

            <p className="text-[var(--foreground-muted)] leading-relaxed">{goal.target}</p>

            {/* Progress Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-[var(--foreground-subtle)]">Completion:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{goal.progress}%</span>
              </div>
              <div className="w-full bg-[var(--secondary)] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--foreground-subtle)]">
              <span className="font-mono">Due: {goal.dueDate}</span>
              <span>{goal.employeeName}</span>
            </div>

            {isAdmin && (
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => updateGoalProgress(goal.id, Math.min(100, goal.progress + 25))}
                  className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold"
                >
                  +25% Progress
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => deleteGoal(goal.id)}
                  className="text-rose-600 dark:text-rose-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Set Goal Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign Performance Objective"
        description="Establish quarterly OKR target for organizational alignment."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
              Assign to Team Member
            </label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="h-10 w-full px-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.employeeId}>
                  {emp.name} ({emp.department})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
              Objective Title
            </label>
            <Input
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder="e.g. Architect Automated Biometric Synchronization"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
              Target Key Deliverable
            </label>
            <textarea
              value={goalTarget}
              onChange={(e) => setGoalTarget(e.target.value)}
              placeholder="e.g. Reduce sync latency under 200ms across 4 regional branches..."
              className="w-full h-20 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
              Target Completion Date
            </label>
            <Input
              type="date"
              value={goalDueDate}
              onChange={(e) => setGoalDueDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Assign Objective →
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
