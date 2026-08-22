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
import { Input } from "@/components/ui/input";
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <Megaphone className="h-6 w-6 text-indigo-500" />
            Company Announcements & Town Hall News
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">
            Broadcast organizational updates, executive notices, and quarterly town hall schedules.
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="gap-1.5 font-semibold text-xs shadow-sm"
          >
            <Plus className="h-4 w-4" /> Post Announcement
          </Button>
        )}
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-card)] space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[var(--foreground)]">{a.title}</h3>
                  <Badge
                    variant={
                      a.priority === "high"
                        ? "destructive"
                        : a.priority === "medium"
                        ? "purple"
                        : "neutral"
                    }
                    size="xs"
                    className="uppercase"
                  >
                    {a.priority} Priority
                  </Badge>
                </div>
                <p className="text-[11px] text-[var(--foreground-subtle)] font-mono">
                  Posted by {a.authorName} • {a.publishDate}
                </p>
              </div>

              {isAdmin && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => deleteAnnouncement(a.id)}
                  className="text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">{a.content}</p>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Broadcast Announcement">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
              Headline Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q3 All-Hands Town Hall & Financial Review"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
              Priority Urgency
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="h-10 w-full px-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              <option value="low">Standard Info</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Urgency / Mandatory</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
              Broadcast Message
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the company-wide communication message..."
              className="w-full h-24 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Publish Broadcast →
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
