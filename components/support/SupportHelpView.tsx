"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Plus,
  MessageSquare,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  FileQuestion,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SupportTicket } from "@/types";

export function SupportHelpView() {
  const { supportTickets, createSupportTicket, replySupportTicket, currentUser } = useStore();
  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "hr";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState("");

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<SupportTicket["category"]>("General HR");
  const [priority, setPriority] = useState<SupportTicket["priority"]>("medium");
  const [message, setMessage] = useState("");

  const myTickets = isAdmin
    ? supportTickets
    : supportTickets.filter((t) => t.employeeId === currentUser?.employeeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    createSupportTicket({
      employeeId: currentUser.employeeId,
      employeeName: currentUser.name || "Employee",
      subject,
      category,
      priority,
      message,
    });
    setIsModalOpen(false);
    setSubject("");
    setMessage("");
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;
    replySupportTicket(selectedTicket.id, replyText, "resolved");
    setSelectedTicket(null);
    setReplyText("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <HelpCircle className="h-6 w-6 text-indigo-500" />
            Support Helpdesk & Employee Requests
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">
            Submit IT tickets, compensation queries, and HR policy inquiries directly to support.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-1.5 font-semibold text-xs shadow-sm"
        >
          <Plus className="h-4 w-4" /> Open New Ticket
        </Button>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myTickets.map((t) => (
          <div
            key={t.id}
            onClick={() => isAdmin && setSelectedTicket(t)}
            className={`p-5 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-card)] space-y-4 text-xs transition-all ${
              isAdmin ? "hover:border-indigo-500/40 cursor-pointer" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-bold text-[var(--foreground)] text-sm leading-snug">
                {t.subject}
              </span>
              <Badge
                variant={
                  t.status === "resolved"
                    ? "success"
                    : t.status === "in_progress"
                    ? "purple"
                    : "warning"
                }
                size="xs"
                className="capitalize"
              >
                {t.status}
              </Badge>
            </div>

            <p className="text-[var(--foreground-muted)] leading-relaxed">{t.message}</p>

            {t.hrReply && (
              <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/15 text-[11px] text-purple-700 dark:text-purple-300">
                <span className="font-bold block">Support Response:</span>
                {t.hrReply}
              </div>
            )}

            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--foreground-subtle)]">
              <span>{t.employeeName}</span>
              <span className="font-mono">{t.createdAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Open Ticket Modal */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Open Support Ticket">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
              Subject Summary
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Requesting Dual Monitor adapter for Desk #42"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="h-10 w-full px-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              >
                <option value="General HR">General HR</option>
                <option value="IT Support">IT & Hardware Support</option>
                <option value="Payroll Inquiry">Payroll & Taxes</option>
                <option value="Benefits">Benefits & Health</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="h-10 w-full px-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High Urgency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
              Detailed Description
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue or request in detail..."
              className="w-full h-24 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Ticket →
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Admin Reply Modal */}
      {selectedTicket && (
        <Dialog
          isOpen={Boolean(selectedTicket)}
          onClose={() => setSelectedTicket(null)}
          title={`Resolve Support Ticket #${selectedTicket.id.substring(0, 8)}`}
          description={`From ${selectedTicket.employeeName}: "${selectedTicket.subject}"`}
        >
          <form onSubmit={handleSendReply} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[var(--secondary)] border border-[var(--border-subtle)] text-xs text-[var(--foreground-muted)]">
              "{selectedTicket.message}"
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                Official Support Reply & Action Taken
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Enter response sent to employee..."
                className="w-full h-24 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
              <Button variant="secondary" size="sm" type="button" onClick={() => setSelectedTicket(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Resolve Ticket →
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
