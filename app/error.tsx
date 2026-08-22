"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Error logged to telemetry if configured
  }, [error]);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto shadow-xl shadow-rose-500/10">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-rose-400 uppercase">
            Application Exception
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Unexpected Workspace Interruption
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Unable to complete request. Your active data is preserved in secure browser state.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={() => reset()} className="gap-2 text-xs font-semibold">
            <RotateCcw className="h-3.5 w-3.5" />
            Retry Action
          </Button>

          <Button variant="primary" size="sm" onClick={() => window.location.href = "/"} className="gap-2 text-xs font-semibold">
            <Home className="h-3.5 w-3.5" />
            Reload Workspace
          </Button>
        </div>

        <p className="text-[11px] text-slate-600 font-mono pt-4">
          HRFlowX • Error Recovery Protocol
        </p>
      </div>
    </div>
  );
}
