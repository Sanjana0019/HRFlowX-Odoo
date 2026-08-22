import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)] pointer-events-none transition-colors">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-xl border border-[var(--input-border)] bg-[var(--card)] px-3.5 py-2 text-xs sm:text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] shadow-xs transition-all duration-150",
            "hover:border-[var(--border-hover)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--secondary)]",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-rose-500/80 focus:ring-rose-500/30",
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]">
            {rightIcon}
          </div>
        )}
        {error && (
          <p className="mt-1.5 text-[11px] font-medium text-rose-500 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            "flex w-full rounded-xl border border-[var(--input-border)] bg-[var(--card)] px-3.5 py-2.5 text-xs sm:text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] shadow-xs transition-all duration-150",
            "hover:border-[var(--border-hover)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--secondary)]",
            error && "border-rose-500/80 focus:ring-rose-500/30",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-[11px] font-medium text-rose-500 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
