"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Shield,
  UserCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Building,
  Phone,
  Upload,
  CheckCircle2,
  Key,
  Users,
  Clock,
  CreditCard,
  Zap,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function AuthLanding() {
  const { login, signUpUser, resetPassword, company, authError, setAuthError } = useStore();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password reset modal state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetFeedback, setResetFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Sign In state
  const [loginIdentifier, setLoginIdentifier] = useState("employee@hrflowx.io");
  const [password, setPassword] = useState("password123");
  const [errorMsg, setErrorMsg] = useState("");

  // Sign Up state matching Wireframe 3
  const [companyName, setCompanyName] = useState(company.name);
  const [logoUrl, setLogoUrl] = useState(company.logo);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (setAuthError) setAuthError(null);
    setIsSubmitting(true);

    try {
      const success = await login(loginIdentifier, password);
      if (!success && !authError) {
        setErrorMsg("Invalid credentials. Please verify your Login ID / Email.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (setAuthError) setAuthError(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await signUpUser({
        companyName,
        fullName,
        email,
        phone,
        password: newPassword,
      });

      if (!success && !authError) {
        setErrorMsg("Failed to create workspace. Please verify email and credentials.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to register workspace. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOneClickLogin = async (type: "employee" | "admin") => {
    setErrorMsg("");
    if (setAuthError) setAuthError(null);
    setIsSubmitting(true);

    try {
      if (type === "employee") {
        setLoginIdentifier("employee@hrflowx.io");
        setPassword("password123");
        await login("employee@hrflowx.io", "password123", "employee");
      } else {
        setLoginIdentifier("admin@hrflowx.io");
        setPassword("admin123");
        await login("admin@hrflowx.io", "admin123", "admin");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetFeedback(null);
    if (!resetEmail) return;

    const res = await resetPassword(resetEmail);
    if (res.success) {
      setResetFeedback({ type: "success", msg: res.message });
    } else {
      setResetFeedback({ type: "error", msg: res.message });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between selection:bg-indigo-500 selection:text-white transition-colors">
      {/* Top Brand Bar */}
      <header className="flex h-20 items-center justify-between px-6 sm:px-12 border-b border-[var(--border)] glass-navbar">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-[var(--foreground)]">HRFlowX</span>
              <Badge variant="purple" size="xs">Enterprise SaaS</Badge>
            </div>
            <span className="text-[11px] text-[var(--foreground-subtle)] font-medium">Human Resource Management System</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOneClickLogin("employee")}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hidden sm:flex"
          >
            ⚡ Demo Employee
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOneClickLogin("admin")}
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 border-purple-500/30 bg-purple-500/10"
          >
            ⚡ Demo Admin
          </Button>
        </div>
      </header>

      {/* Hero & Authentication Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Product Manifesto */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-3.5 w-3.5" /> Streamline People, Power Performance.
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--foreground)] leading-tight">
              The Modern OS for{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                High-Velocity
              </span>{" "}
              Workforces.
            </h1>

            <p className="text-sm sm:text-base text-[var(--foreground-muted)] max-w-lg leading-relaxed mx-auto lg:mx-0">
              Automate biometric timesheets, multi-branch governance, dynamic salary recalculation, and employee self-service with SOC2-grade compliance.
            </p>

            {/* Feature Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2 max-w-md mx-auto lg:mx-0 text-left">
              <div className="p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-indigo-500 shrink-0" />
                <span className="text-xs font-semibold text-[var(--foreground)]">Live Punch Clock</span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs flex items-center gap-2.5">
                <CreditCard className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-semibold text-[var(--foreground)]">Dynamic Wage Math</span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs flex items-center gap-2.5">
                <Users className="h-4 w-4 text-purple-500 shrink-0" />
                <span className="text-xs font-semibold text-[var(--foreground)]">Kanban Directory</span>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs flex items-center gap-2.5">
                <Shield className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="text-xs font-semibold text-[var(--foreground)]">SOC2 Audit Stream</span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Glass Auth Form Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="rounded-3xl glass-card p-6 sm:p-8 shadow-[var(--shadow-modal)] border border-[var(--border)] space-y-6">
              {/* Segmented Mode Switcher */}
              <div className="flex p-1 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    mode === "signin"
                      ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Sign In to Workspace
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    mode === "signup"
                      ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Create Company Space
                </button>
              </div>

              {/* 1-Click Instant Demo Login Strip */}
              <div className="p-3.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5" /> Instant 1-Click Evaluator Logins:
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOneClickLogin("employee")}
                    className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 text-xs text-[var(--foreground)] font-semibold transition-all text-left shadow-2xs cursor-pointer active:scale-[0.98]"
                  >
                    <span className="text-[var(--foreground)] block font-bold">Arjun Sharma</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">HXAS20230001</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOneClickLogin("admin")}
                    className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-purple-500/40 text-xs text-[var(--foreground)] font-semibold transition-all text-left shadow-2xs cursor-pointer active:scale-[0.98]"
                  >
                    <span className="text-[var(--foreground)] block font-bold">Priya Mehta</span>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">HXPM20220001</span>
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {(errorMsg || authError) && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errorMsg || authError}
                </div>
              )}

              {/* Sign In Form */}
              {mode === "signin" ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)] mb-1.5">
                      Login ID or Work Email
                    </label>
                    <Input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="HXAS20230001 or employee@hrflowx.io"
                      leftIcon={<Mail className="h-4 w-4" />}
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setResetEmail(loginIdentifier);
                          setIsResetModalOpen(true);
                        }}
                        className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        leftIcon={<Lock className="h-4 w-4" />}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)] hover:text-[var(--foreground)]"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSubmitting}
                    className="w-full font-bold shadow-md"
                  >
                    Enter Workspace →
                  </Button>
                </form>
              ) : (
                /* Sign Up Form */
                <form onSubmit={handleSignUp} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                        Company Name
                      </label>
                      <Input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Acme Corp"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                        Full Name
                      </label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alex Rivera"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                      Work Email Address
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.io"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                        Password
                      </label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                        Confirm
                      </label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSubmitting}
                    className="w-full font-bold shadow-md"
                  >
                    Initialize Workspace →
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[var(--border)] text-center text-xs text-[var(--foreground-subtle)]">
        HRFlowX • Human Resource Management System • "Streamline People, Power Performance."
      </footer>

      {/* Password Reset Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-md rounded-3xl glass-modal p-6 space-y-4 border border-[var(--border)]">
            <h3 className="text-lg font-bold text-[var(--foreground)]">Reset Master Password</h3>
            <p className="text-xs text-[var(--foreground-muted)]">
              Enter your registered work email to receive verification credentials.
            </p>
            {resetFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-medium ${
                  resetFeedback.type === "success"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25"
                }`}
              >
                {resetFeedback.msg}
              </div>
            )}
            <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
              <Input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="employee@hrflowx.io"
                required
              />
              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" type="button" onClick={() => setIsResetModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Send Link
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
