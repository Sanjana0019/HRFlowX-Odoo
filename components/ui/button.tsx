import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "glass" | "subtle" | "emerald" | "warning";
  size?: "xs" | "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium tracking-tight rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-sm shadow-indigo-500/25 border border-indigo-400/30",
    emerald:
      "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/20 border border-emerald-500/30",
    warning:
      "bg-amber-600 hover:bg-amber-500 text-white shadow-sm shadow-amber-600/20 border border-amber-500/30",
    secondary:
      "bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-[var(--secondary-foreground)] border border-[var(--border)] shadow-xs",
    outline:
      "bg-transparent hover:bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)]",
    ghost:
      "bg-transparent hover:bg-[var(--secondary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
    destructive:
      "bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/20 border border-rose-500/30",
    glass:
      "bg-[var(--card)] hover:bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--card-border)] backdrop-blur-md shadow-xs",
    subtle:
      "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20",
  };

  const sizeStyles = {
    xs: "h-7 px-2.5 text-[11px] gap-1.5 rounded-lg",
    sm: "h-8.5 px-3 text-xs gap-1.5 rounded-lg",
    md: "h-10 px-4 text-xs sm:text-sm gap-2",
    lg: "h-11 px-5 text-sm sm:text-base gap-2.5 rounded-2xl",
    icon: "h-9 w-9 p-0 rounded-xl",
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-current" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
