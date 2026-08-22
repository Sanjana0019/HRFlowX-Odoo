"use client";

import React, { useState } from "react";
import { Calendar, Plus, Trash2, Sparkles, MapPin } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Holiday } from "@/types";

export function HolidaysView() {
  const { holidays, addHoliday, deleteHoliday, currentUser } = useStore();
  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "hr";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<Holiday["type"]>("National Holiday");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const d = new Date(date);
    const dayOfWeek = d.toLocaleDateString("en-US", { weekday: "long" });
    addHoliday({
      name,
      date,
      dayOfWeek,
      type,
      description: description || "Corporate observance",
    });
    setIsModalOpen(false);
    setName("");
    setDate("");
    setDescription("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <Calendar className="h-6 w-6 text-indigo-500" />
            Corporate Holiday Calendar (2026)
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">
            Official paid holidays and observed non-working office closures across all branches.
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="gap-1.5 font-semibold text-xs shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Holiday
          </Button>
        )}
      </div>

      {/* Holidays Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {holidays.map((h) => (
          <div
            key={h.id}
            className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-card)] space-y-3 text-xs"
          >
            <div className="flex items-start justify-between">
              <span className="font-bold text-[var(--foreground)] text-sm">{h.name}</span>
              <Badge variant="purple" size="xs">
                {h.type}
              </Badge>
            </div>

            <div className="p-3 rounded-xl bg-[var(--secondary)] border border-[var(--border-subtle)] space-y-0.5">
              <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold block text-sm">
                {h.date}
              </span>
              <span className="text-[11px] text-[var(--foreground-subtle)] font-medium block">
                {h.dayOfWeek}
              </span>
            </div>

            <p className="text-[var(--foreground-muted)] leading-relaxed">{h.description}</p>

            {isAdmin && (
              <div className="flex justify-end pt-1">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => deleteHoliday(h.id)}
                  className="text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Holiday Modal */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Corporate Holiday">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
              Holiday Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Independence Day"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="h-10 w-full px-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              >
                <option value="National Holiday">National Holiday</option>
                <option value="Regional Holiday">Regional Holiday</option>
                <option value="Optional Holiday">Optional Floating</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
              Description Note
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Office closed globally"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Holiday →
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
