"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "lg",
  className,
}: DialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-[95vw]",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      {/* Deep Frosted Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div
        className={cn(
          "relative w-full rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-[var(--popover)] p-6 sm:p-7 shadow-[var(--shadow-modal)] z-10 my-auto text-[var(--foreground)] transition-all transform duration-200",
          maxWidthStyles[maxWidth],
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border)] mb-5">
            <div className="space-y-1">
              {title && (
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--foreground)]">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs sm:text-sm text-[var(--foreground-muted)] font-normal">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-xl bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] flex items-center justify-center transition-colors border border-[var(--border-subtle)] shrink-0 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
