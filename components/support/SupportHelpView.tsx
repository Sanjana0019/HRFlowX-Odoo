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
import { Input, Textarea } from "@/components/ui/input";
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

  const faqs = [
    { q: "How are my monthly salary components computed?", a: "Salary components auto-recalculate from your base wage: Basic (50%), HRA (50% of Basic), Standard Allowance (8.33%), Bonus (8.33% of Basic), and LTA." },
    { q: "What should I do if I forgot to punch out?", a: "Go to Attendance -> Request Timesheet Correction, specify your exact clock out time and reason. HR reviews and updates records in real-time." },
    { q: "How many paid leaves can I carry forward?", a: "Up to 10 unused paid annual leave days automatically rollover to the next fiscal year." },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <HelpCircle className="h-6 w-6 text-indigo-400" />
            HR Support Desk & Employee Help Center
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Submit confidential HR inquiries, hardware requests, or review corporate guidelines.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} className="gap-1.5 font-semibold">
          <Plus className="h-4 w-4" /> Open Support Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Tickets */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <CardTitle className="text-base">Inquiries & Support Tickets</CardTitle>
              <p className="text-xs text-slate-400">Direct resolution channel with People Operations</p>
            </div>
            <Badge variant="purple" size="sm">{myTickets.length} Tickets</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-800/60">
              {myTickets.length === 0 ? (
                <p className="p-8 text-center text-xs text-slate-500">No active support tickets.</p>
              ) : (
                myTickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className="p-4 hover:bg-slate-800/40 transition-colors cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={t.status === "resolved" ? "success" : "amber"} size="sm" className="capitalize">
                          {t.status.replace("_", " ")}
                        </Badge>
                        <h4 className="text-xs font-bold text-white">{t.subject}</h4>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{t.createdAt}</span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">{t.message}</p>

                    {t.hrReply && (
                      <div className="bg-indigo-950/40 p-2 rounded-xl border border-indigo-500/20 text-xs text-indigo-200">
                        <span className="font-semibold text-indigo-300">HR Resolution: </span>
                        {t.hrReply}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right 1 col: Quick FAQs */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <FileQuestion className="h-4 w-4" /> Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div key={i} className="space-y-1 text-xs">
                  <p className="font-semibold text-white">{f.q}</p>
                  <p className="text-slate-400 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Create Ticket Modal */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit HR Inquiry / Request" maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Subject</label>
            <Input placeholder="Brief summary of inquiry" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white"
              >
                <option value="Payroll">Payroll</option>
                <option value="Attendance">Attendance</option>
                <option value="Leave">Leave</option>
                <option value="IT Hardware">IT Hardware</option>
                <option value="General HR">General HR</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Urgency</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Message Details</label>
            <Textarea placeholder="Explain your request in detail..." value={message} onChange={(e) => setMessage(e.target.value)} rows={4} required />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Submit Ticket</Button>
          </div>
        </form>
      </Dialog>

      {/* Reply Ticket Modal for Admin */}
      {selectedTicket && (
        <Dialog isOpen={Boolean(selectedTicket)} onClose={() => setSelectedTicket(null)} title={`Ticket: ${selectedTicket.subject}`} maxWidth="md">
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold">{selectedTicket.employeeName} wrote:</span>
              <p className="text-slate-200">{selectedTicket.message}</p>
            </div>

            {isAdmin && (
              <form onSubmit={handleSendReply} className="space-y-3 pt-2">
                <label className="block font-semibold uppercase text-indigo-400">HR Resolution Reply</label>
                <Textarea
                  placeholder="Type official response..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                  required
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setSelectedTicket(null)}>Close</Button>
                  <Button type="submit" variant="primary" size="sm" className="gap-1">
                    <Send className="h-3.5 w-3.5" /> Resolve & Reply
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Dialog>
      )}
    </div>
  );
}
