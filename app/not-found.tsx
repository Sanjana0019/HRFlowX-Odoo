"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-xl shadow-indigo-500/20 mx-auto">
          <Sparkles className="h-7 w-7 text-white" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
            404 • Page Not Found
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Workforce Portal Node Missing
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The workspace route you are looking for has been relocated, archived, or does not exist on this cluster.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link href="/">
            <Button variant="primary" size="md" className="gap-2 font-semibold">
              <Home className="h-4 w-4" />
              Return to Workspace
            </Button>
          </Link>
        </div>

        <p className="text-[11px] text-slate-600 font-mono pt-4">
          HRFlowX • Human Resource Management System
        </p>
      </div>
    </div>
  );
}
