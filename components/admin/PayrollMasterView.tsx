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
    (acc, e) => acc + e.salaryStructure.grossSalary,
    0
  );
  const totalMonthlyTax = employees.reduce(
    (acc, e) => acc + e.salaryStructure.professionalTax,
    0
  );
  const totalMonthlyPF = employees.reduce(
    (acc, e) => acc + e.salaryStructure.employeePf,
    0
  );
  const totalMonthlyNet = employees.reduce(
    (acc, e) => acc + e.salaryStructure.netSalary,
    0
  );

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmp(emp);
    setEditWage(emp.salaryStructure.monthlyWage);
  };

  const handleSaveStructure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmp) return;
    updateEmployeeSalary(editingEmp.employeeId, editWage);
    setEditingEmp(null);
  };

  const handleBatchGenerate = () => {
    runBatchPayroll("August 2026");

    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch {}

    setBatchGenerated(true);
    setTimeout(() => setBatchGenerated(false), 4000);
  };

  const handleExportCSV = () => {
    const headers = [
      "Employee ID",
      "Name",
      "Department",
      "Designation",
      "Monthly Base",
      "Monthly Gross",
      "PF Deduction",
      "Tax Deduction",
      "Monthly Net Take-Home",
    ];

    const rows = filteredEmployees.map((e) => {
      const s = e.salaryStructure;
      return [
        e.employeeId,
        `"${e.name}"`,
        e.department,
        `"${e.designation}"`,
        s.basicSalary,
        s.grossSalary,
        s.employeePf,
        s.professionalTax,
        s.netSalary,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HRFlowX_Payroll_Run_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <CreditCard className="h-6 w-6 text-indigo-400" />
            Payroll Master & Compensation Governance
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Dynamic wage component calculator, automated statutory withholdings, and bulk payslip generator.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-1.5 text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" /> Export Payroll (.CSV)
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleBatchGenerate}
            className="gap-2 text-xs font-bold shadow-indigo-600/30"
          >
            <Sparkles className="h-4 w-4" /> Run August 2026 Payroll
          </Button>
        </div>
      </div>

      {batchGenerated && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs font-medium text-emerald-400">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          August 2026 monthly payroll disbursed for {employees.length} active employees!
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Payroll Spend"
          value={formatCurrency(totalMonthlyGross)}
          description="Gross Compensation"
          icon={DollarSign}
        />
        <StatCard
          title="Net Take-Home Disbursed"
          value={formatCurrency(totalMonthlyNet)}
          description="After PF & Tax Withholdings"
          icon={CreditCard}
        />
        <StatCard
          title="Provident Fund (12%)"
          value={formatCurrency(totalMonthlyPF)}
          description="Employee + Matching Pool"
          icon={TrendingUp}
        />
        <StatCard
          title="Tax Withholdings"
          value={formatCurrency(totalMonthlyTax)}
          description="State Statutory Compliance"
          icon={FileText}
        />
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by employee, login ID, job title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-slate-200"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Salary Breakdown Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <CardTitle className="text-base">Workforce Compensation Roster ({filteredEmployees.length})</CardTitle>
            <p className="text-xs text-slate-400">Calculated dynamically via HRFlowX salary component rules</p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Employee</th>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5">Monthly Base</th>
                  <th className="px-5 py-3.5">HRA (50%)</th>
                  <th className="px-5 py-3.5">Standard Allowance</th>
                  <th className="px-5 py-3.5">PF & Tax</th>
                  <th className="px-5 py-3.5">Net Monthly Pay</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredEmployees.map((emp) => {
                  const s = emp.salaryStructure;
                  return (
                    <tr key={emp.employeeId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <Avatar src={emp.avatar} name={emp.name} size="xs" />
                          <div>
                            <span className="font-semibold text-white block">{emp.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{emp.employeeId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <Badge variant="outline">{emp.department}</Badge>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-white font-medium whitespace-nowrap">
                        {formatCurrency(s.basicSalary)}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-300 whitespace-nowrap">
                        {formatCurrency(s.houseRentAllowance)}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-300 whitespace-nowrap">
                        {formatCurrency(s.standardAllowance)}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-rose-400 whitespace-nowrap">
                        -{formatCurrency(s.employeePf + s.professionalTax)}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-emerald-400 whitespace-nowrap">
                        {formatCurrency(s.netSalary)}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(emp)}
                          className="h-8 text-xs gap-1.5"
                        >
                          <Edit3 className="h-3 w-3" /> Adjust Wage
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Adjust Wage Modal */}
      {editingEmp && (
        <Dialog
          isOpen={Boolean(editingEmp)}
          onClose={() => setEditingEmp(null)}
          title={`Adjust Compensation: ${editingEmp.name}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveStructure} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Monthly Wage ($)</label>
              <Input
                type="number"
                value={editWage}
                onChange={(e) => setEditWage(Number(e.target.value))}
                required
                className="font-mono font-bold text-base text-emerald-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Components (Basic 50%, HRA 50% of Basic, PF 12%, Tax) will automatically recalculate.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingEmp(null)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">Recalculate & Save</Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
