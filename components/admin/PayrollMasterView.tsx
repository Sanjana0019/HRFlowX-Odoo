"use client";

import React, { useState } from "react";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Edit3,
  Sparkles,
  Users,
  Search,
  Filter,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/ui/stat-card";
import { Employee, DynamicSalaryStructure, SalarySlip } from "@/types";
import { formatCurrency } from "@/lib/utils";
import confetti from "canvas-confetti";

export function PayrollMasterView() {
  const {
    employees,
    salarySlips,
    updateEmployeeSalary,
    generateMonthlyPayslip,
    runBatchPayroll,
  } = useStore();

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [editWage, setEditWage] = useState(15000);
  const [batchGenerated, setBatchGenerated] = useState(false);

  const departments = Array.from(new Set(employees.map((e) => e.department)));

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase());
    const matchesDept =
      departmentFilter === "all" || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  // Calculate totals
  const totalMonthlyGross = employees.reduce(
    (acc, e) => acc + (e.salaryStructure.grossSalary || 0),
    0
  );
  const totalMonthlyTax = employees.reduce(
    (acc, e) => acc + (e.salaryStructure.professionalTax || 0),
    0
  );
  const totalMonthlyPF = employees.reduce(
    (acc, e) => acc + (e.salaryStructure.employeePf || 0),
    0
  );
  const totalMonthlyNet = employees.reduce(
    (acc, e) => acc + (e.salaryStructure.netSalary || 0),
    0
  );

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmp(emp);
    setEditWage(emp.salaryStructure.monthlyWage);
  };

  const handleSaveWage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmp) return;

    updateEmployeeSalary(editingEmp.id, Number(editWage));

    setEditingEmp(null);
  };

  const handleRunBatch = () => {
    try {
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    } catch {}

    runBatchPayroll("August 2026");
    setBatchGenerated(true);
    setTimeout(() => setBatchGenerated(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <CreditCard className="h-6 w-6 text-indigo-500" />
            Compensation Bands & Payroll Master
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">
            Manage company salary structures, audit statutory withholdings, and execute monthly batch payroll.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleRunBatch}
          className="gap-2 font-semibold text-xs shadow-sm"
        >
          <Sparkles className="h-4 w-4" />
          Run August 2026 Payroll →
        </Button>
      </div>

      {batchGenerated && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 p-3.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold animate-fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Batch Payroll for August 2026 executed successfully! Payslips generated for {employees.length} personnel.
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Payroll Spend"
          value={formatCurrency(totalMonthlyGross)}
          change="Gross Budget"
          isPositive={true}
          icon={DollarSign}
          accentColor="indigo"
          description="Fixed gross compensation spend"
        />
        <StatCard
          title="Net Take-Home Disbursed"
          value={formatCurrency(totalMonthlyNet)}
          change="Direct Deposit Pool"
          isPositive={true}
          icon={CreditCard}
          accentColor="emerald"
          description="Net disbursed to employees"
        />
        <StatCard
          title="Provident Fund (12%)"
          value={formatCurrency(totalMonthlyPF)}
          change="Statutory Matching"
          isPositive={true}
          icon={TrendingUp}
          accentColor="purple"
          description="Employee + Employer PF pool"
        />
        <StatCard
          title="Tax Withholdings"
          value={formatCurrency(totalMonthlyTax)}
          change="State Compliance"
          isPositive={false}
          icon={FileText}
          accentColor="rose"
          description="Professional tax withholdings"
        />
      </div>

      {/* Employee Compensation Management Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-500" />
            Active Employee Salary Bands ({filteredEmployees.length})
          </CardTitle>

          <div className="flex items-center gap-2.5">
            <Input
              type="text"
              placeholder="Search by name, ID, or job title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              className="w-64"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-muted)] font-semibold uppercase tracking-wider text-[10px] font-sans">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Monthly Wage</th>
                  <th className="px-4 py-3">Basic (50%)</th>
                  <th className="px-4 py-3">HRA (50%)</th>
                  <th className="px-4 py-3">PF (12%)</th>
                  <th className="px-4 py-3">Net Take-Home</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-[var(--secondary)] transition-colors">
                    <td className="px-4 py-3 font-sans">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={emp.avatar} alt={emp.name} size="xs" />
                        <div>
                          <span className="font-bold text-[var(--foreground)] block">{emp.name}</span>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">{emp.employeeId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-[var(--foreground-muted)]">{emp.department}</td>
                    <td className="px-4 py-3 font-bold text-[var(--foreground)]">
                      {formatCurrency(emp.salaryStructure.monthlyWage)}
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground)]">
                      {formatCurrency(emp.salaryStructure.basicSalary)}
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground)]">
                      {formatCurrency(emp.salaryStructure.houseRentAllowance)}
                    </td>
                    <td className="px-4 py-3 text-rose-500">
                      -{formatCurrency(emp.salaryStructure.employeePf)}
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(emp.salaryStructure.netSalary)}
                    </td>
                    <td className="px-4 py-3 text-right font-sans">
                      <Button variant="ghost" size="xs" onClick={() => handleOpenEdit(emp)} className="text-xs">
                        <Edit3 className="h-3.5 w-3.5" /> Adjust
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Adjust Wage Dialog */}
      {editingEmp && (
        <Dialog
          isOpen={Boolean(editingEmp)}
          onClose={() => setEditingEmp(null)}
          title={`Adjust Monthly Wage — ${editingEmp.name}`}
          description="Engine will automatically recalculate Basic (50%), HRA (50%), PF (12%), and Net Take-Home."
        >
          <form onSubmit={handleSaveWage} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                New Monthly Wage (INR / USD)
              </label>
              <Input
                type="number"
                value={editWage}
                onChange={(e) => setEditWage(Number(e.target.value))}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
              <Button variant="secondary" size="sm" type="button" onClick={() => setEditingEmp(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save & Recalculate →
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
