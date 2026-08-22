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
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function AuthLanding() {
  const { login, addEmployee, company, updateCompanyProfile } = useStore();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const success = login(loginIdentifier);
    if (!success) {
      setErrorMsg("Invalid credentials. Please verify your Login ID / Email.");
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (companyName) {
      updateCompanyProfile({ name: companyName, logo: logoUrl });
    }

    const created = addEmployee({
      name: fullName,
      email,
      role: "admin",
      jobTitle: "Founder & Chief Executive Officer",
      department: "Executive Leadership",
      phone,
      monthlyWage: 25000,
    });

    login(created.employeeId);
  };

  const handleOneClickLogin = (type: "employee" | "admin") => {
    if (type === "employee") {
      setLoginIdentifier("employee@hrflowx.io");
      setPassword("password123");
      login("employee@hrflowx.io", "employee");
    } else {
      setLoginIdentifier("admin@hrflowx.io");
      setPassword("admin123");
      login("admin@hrflowx.io", "admin");
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Brand Bar */}
      <header className="flex h-20 items-center justify-between px-6 sm:px-12 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/25">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white">HRFlowX</span>
              <Badge variant="purple" size="sm">Enterprise</Badge>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Human Resource Management System</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOneClickLogin("employee")}
            className="text-xs font-semibold text-indigo-400 hover:text-white hidden sm:flex"
          >
            ⚡ Demo Employee
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOneClickLogin("admin")}
            className="text-xs font-semibold text-purple-400 hover:text-white border-purple-500/30 bg-purple-500/10"
          >
            ⚡ Demo Admin
          </Button>
        </div>
      </header>

      {/* Hero & Authentication Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Product Manifesto */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" /> Streamline People, Power Performance.
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              The Modern OS for{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                High-Performance
              </span>{" "}
              Workforces.
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Biometric timesheets, dynamic salary formulas, leave quota recalculations, and SOC2-ready governance in one unified platform.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-medium text-slate-300 text-left max-w-md mx-auto lg:mx-0">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Auto ID Generation</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                <span>Dynamic Wage Engine</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Punch Systray Engine</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-pink-400 flex-shrink-0" />
                <span>Encrypted Vault</span>
              </div>
            </div>
          </div>

          {/* Right: Auth Form Container Matching Wireframe 3 */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-2xl p-6 sm:p-8 space-y-6">
              {/* Form Mode Switcher */}
              <div className="flex items-center rounded-2xl bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mode === "signin"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mode === "signup"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Create Company Space
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 font-medium">
                  {errorMsg}
                </div>
              )}

              {/* MODE 1: SIGN IN MATCHING WIREFRAME 3 */}
              {mode === "signin" ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Login ID or Work Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="e.g. HXAR20230001 or employee@hrflowx.io"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Password
                      </label>
                      <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">
                        Forgot password?
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full font-bold shadow-indigo-600/30">
                    SIGN IN →
                  </Button>

                  {/* 1-Click Demo Buttons */}
                  <div className="pt-3 border-t border-slate-800/80">
                    <p className="text-[11px] text-center text-slate-400 mb-2 font-medium">
                      Instant 1-Click Interactive Logins:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleOneClickLogin("employee")}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 font-semibold transition-all text-left"
                      >
                        <span className="text-white block font-bold">Arjun Sharma</span>
                        <span className="text-[10px] text-indigo-400 font-mono">HXAS20230001</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOneClickLogin("admin")}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-300 font-semibold transition-all text-left"
                      >
                        <span className="text-white block font-bold">Priya Mehta</span>
                        <span className="text-[10px] text-purple-400 font-mono">HXPM20220001</span>
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                /* MODE 2: SIGN UP MATCHING WIREFRAME 3 */
                <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold uppercase text-slate-400 mb-1">Company Name</label>
                    <Input placeholder="e.g. Acme Corporation" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase text-slate-400 mb-1">Full Name</label>
                    <Input placeholder="Sarah Connor" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold uppercase text-slate-400 mb-1">Work Email</label>
                      <Input type="email" placeholder="sarah@acme.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block font-semibold uppercase text-slate-400 mb-1">Phone</label>
                      <Input placeholder="+1 555 0192" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold uppercase text-slate-400 mb-1">Password</label>
                      <Input type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block font-semibold uppercase text-slate-400 mb-1">Confirm Password</label>
                      <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full font-bold">
                    Create Company Space →
                  </Button>

                  {/* Explanatory note matching Wireframe 3 */}
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-300">Automatic Login ID Generation:</p>
                    <p>Format: <span className="font-mono text-indigo-300 font-bold">[CO][NAME][YEAR][SEQ]</span></p>
                    <p className="text-[10px] text-slate-500">
                      Standard personnel accounts are created by HR Officers and receive auto-generated IDs and credentials.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 px-6 py-4 text-center text-xs text-slate-500">
        HRFlowX • Human Resource Management System • "Streamline People, Power Performance."
      </footer>
    </div>
  );
}
