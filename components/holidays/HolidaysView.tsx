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
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Calendar className="h-6 w-6 text-indigo-400" />
            Corporate Holiday Calendar (2026)
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Official paid holidays and observed non-working office closures.
          </p>
        </div>

        {isAdmin && (
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} className="gap-1.5 font-semibold">
            <Plus className="h-4 w-4" /> Add Holiday
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {holidays.map((h) => (
          <Card key={h.id} className="p-4 border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant={h.type === "National Holiday" ? "blue" : "purple"} size="sm">
                  {h.type}
                </Badge>
                {isAdmin && (
                  <button onClick={() => deleteHoliday(h.id)} className="text-slate-500 hover:text-rose-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <h3 className="text-sm font-bold text-white mt-1">{h.name}</h3>
              <p className="text-xs text-slate-400">{h.description}</p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-indigo-300 font-semibold">{h.date}</span>
              <span className="text-slate-400">{h.dayOfWeek}</span>
            </div>
          </Card>
        ))}
      </div>

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Holiday" maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Holiday Name</label>
            <Input placeholder="e.g. Thanksgiving Day" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white"
            >
              <option value="National Holiday">National Holiday</option>
              <option value="Company Holiday">Company Holiday</option>
              <option value="Optional Holiday">Optional Holiday</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Description</label>
            <Input placeholder="Observance note" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Save Holiday</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
