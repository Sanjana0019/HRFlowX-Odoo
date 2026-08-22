"use client";

import React, { useState } from "react";
import {
  Megaphone,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  AlertCircle,
  Tag,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Announcement } from "@/types";

export function AnnouncementsView() {
  const { announcements, addAnnouncement, deleteAnnouncement, currentUser } = useStore();
  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "hr";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<Announcement["priority"]>("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement({
      title,
      content,
      priority,
      publishDate: new Date().toISOString().split("T")[0],
      status: "active",
      authorName: currentUser?.name || "Corporate Operations",
    });
    setIsModalOpen(false);
    setTitle("");
    setContent("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Megaphone className="h-6 w-6 text-indigo-400" />
            Company Announcements & Town Hall News
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Broadcast updates, executive announcements, and event notices to the global workforce.
          </p>
        </div>

        {isAdmin && (
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} className="gap-1.5 font-semibold">
            <Plus className="h-4 w-4" /> Post Announcement
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {announcements.map((a) => (
          <Card key={a.id} className="p-5 border-slate-800 bg-slate-900/90 hover:border-slate-700 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge
                    variant={a.priority === "high" ? "destructive" : a.priority === "medium" ? "amber" : "blue"}
                    size="sm"
                    className="capitalize"
                  >
                    {a.priority} Priority
                  </Badge>
                  <h3 className="text-base font-bold text-white">{a.title}</h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">{a.content}</p>

                <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono pt-1">
                  <span>Author: {a.authorName}</span>
                  <span>•</span>
                  <span>Published: {a.publishDate}</span>
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={() => deleteAnnouncement(a.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors self-end sm:self-start"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Broadcast Announcement" maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Headline</label>
            <Input placeholder="Announcement Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white"
            >
              <option value="high">High Priority (Urgent)</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority / General Notice</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Message Content</label>
            <Textarea placeholder="Details for the announcement..." value={content} onChange={(e) => setContent(e.target.value)} rows={4} required />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Broadcast</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
