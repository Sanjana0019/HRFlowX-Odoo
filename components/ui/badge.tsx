import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "purple" | "blue" | "outline" | "amber";
  size?: "sm" | "md";
}

export function Badge({ className, variant = "default", size = "sm", children, ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium rounded-full border tracking-wide transition-colors";

  const variants = {
    default: "bg-slate-800/80 text-slate-300 border-slate-700/80",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    destructive: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    outline: "border-slate-700 text-slate-400 bg-transparent",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-0.5 gap-1",
    md: "text-xs px-3 py-1 gap-1.5 font-medium",
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
