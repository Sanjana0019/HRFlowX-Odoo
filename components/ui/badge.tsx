import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "success"
    | "warning"
    | "amber"
    | "destructive"
    | "purple"
    | "blue"
    | "neutral";
  size?: "xs" | "sm" | "md";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const normalizedVariant = variant === "amber" ? "warning" : variant;

  const variantStyles = {
    default: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    secondary: "bg-[var(--secondary)] text-[var(--foreground-muted)] border-[var(--border)]",
    outline: "bg-transparent text-[var(--foreground)] border-[var(--border)]",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
    destructive: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25",
    blue: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25",
    neutral: "bg-[var(--secondary)] text-[var(--foreground-subtle)] border-[var(--border-subtle)]",
  };

  const dotColors = {
    default: "bg-indigo-500",
    secondary: "bg-[var(--foreground-subtle)]",
    outline: "bg-[var(--foreground)]",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    destructive: "bg-rose-500",
    purple: "bg-purple-500",
    blue: "bg-sky-500",
    neutral: "bg-slate-400",
  };

  const sizeStyles = {
    xs: "px-2 py-0.5 text-[10px] gap-1",
    sm: "px-2.5 py-0.5 text-[11px] gap-1.5",
    md: "px-3 py-1 text-xs gap-1.5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center font-medium rounded-full border tracking-wide transition-colors",
        variantStyles[normalizedVariant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0",
            dotColors[normalizedVariant]
          )}
        />
      )}
      {children}
    </div>
  );
}
