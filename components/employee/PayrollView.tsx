"use client";

import React, { useState } from "react";
import {
  Receipt,
  Download,
  Printer,
  ShieldCheck,
  Building,
  Calendar,
  CreditCard,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  FileText,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SalarySlip } from "@/types";

export function PayrollView() {
  const { currentEmployee, salarySlips } = useStore();
  const [selectedSlip, setSelectedSlip] = useState<SalarySlip | null>(null);

  if (!currentEmployee) return null;

  const mySlips = salarySlips.filter(
    (s) => s.employeeId === currentEmployee.employeeId
  );

  const { salaryStructure } = currentEmployee;

  // Monthly values directly from dynamic structure
  const monthlyBase = salaryStructure.basicSalary;
  const monthlyHra = salaryStructure.houseRentAllowance;
  const monthlyMedical = salaryStructure.standardAllowance;
  const monthlySpecial = salaryStructure.performanceBonus + salaryStructure.leaveTravelAllowance;
  const monthlyPf = salaryStructure.employeePf;
  const monthlyTax = salaryStructure.professionalTax;

  const monthlyGross = salaryStructure.grossSalary;
  const monthlyDeductions = monthlyPf + monthlyTax;
  const monthlyNet = salaryStructure.netSalary;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <Receipt className="h-6 w-6 text-indigo-500" />
            Compensation & Monthly Payslips
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">
            Breakdown of salary components, allowances, statutory PF/tax deductions, and payment receipts.
          </p>
        </div>

        {mySlips[0] && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setSelectedSlip(mySlips[0])}
            className="gap-2 font-semibold text-xs shadow-sm"
          >
            <FileText className="h-4 w-4" />
            View Latest Payslip ({mySlips[0].month})
          </Button>
        )}
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Monthly Fixed Gross"
          value={formatCurrency(monthlyGross)}
          change="Base Package"
          isPositive={true}
          icon={CreditCard}
          accentColor="indigo"
          description="Total compensation before withholdings"
        />
        <StatCard
          title="Monthly Net Take-Home"
          value={formatCurrency(monthlyNet)}
          change="Disbursed via Direct Deposit"
          isPositive={true}
          icon={DollarSign}
          accentColor="emerald"
          description="Net amount transferred to bank account"
        />
        <StatCard
          title="Total Withholdings"
          value={formatCurrency(monthlyDeductions)}
          change="12% PF + Statutory Tax"
          isPositive={false}
          icon={TrendingUp}
          accentColor="rose"
          description="Provident Fund and State Tax deductions"
        />
      </div>

      {/* Earnings vs Deductions Split Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Earnings */}
        <Card>
          <CardHeader className="pb-3 border-b border-[var(--border)]">
            <CardTitle className="text-sm flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              Earnings & Allowances Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between text-[var(--foreground)]">
              <span>Basic Salary (50%)</span>
              <span className="font-bold">{formatCurrency(monthlyBase)}</span>
            </div>
            <div className="flex justify-between text-[var(--foreground)]">
              <span>House Rent Allowance (HRA 50% of Basic)</span>
              <span className="font-bold">{formatCurrency(monthlyHra)}</span>
            </div>
            <div className="flex justify-between text-[var(--foreground)]">
              <span>Standard Allowance (8.33%)</span>
              <span className="font-bold">{formatCurrency(monthlyMedical)}</span>
            </div>
            <div className="flex justify-between text-[var(--foreground)]">
              <span>Special & Performance Bonus</span>
              <span className="font-bold">{formatCurrency(monthlySpecial)}</span>
            </div>
            <div className="flex justify-between text-[var(--foreground)]">
              <span>Fixed Remaining Allowance</span>
              <span className="font-bold">{formatCurrency(salaryStructure.fixedAllowance)}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-2 font-bold text-sm text-[var(--foreground)]">
              <span>Total Monthly Gross</span>
              <span className="text-indigo-600 dark:text-indigo-400">{formatCurrency(monthlyGross)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Deductions */}
        <Card>
          <CardHeader className="pb-3 border-b border-[var(--border)]">
            <CardTitle className="text-sm flex items-center gap-2 text-rose-600 dark:text-rose-400">
              Statutory Withholdings & Deductions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between text-[var(--foreground)]">
              <span>Employee Provident Fund (PF 12%)</span>
              <span className="font-bold text-rose-500">-{formatCurrency(monthlyPf)}</span>
            </div>
            <div className="flex justify-between text-[var(--foreground)]">
              <span>Professional Tax</span>
              <span className="font-bold text-rose-500">-{formatCurrency(monthlyTax)}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-2 font-bold text-sm text-[var(--foreground)]">
              <span>Total Monthly Deductions</span>
              <span className="text-rose-500">-{formatCurrency(monthlyDeductions)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historical Payslips Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-[var(--border)]">
          <CardTitle className="text-sm">Historical Disbursed Payslips ({mySlips.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-muted)] font-semibold uppercase tracking-wider text-[10px] font-sans">
                <tr>
                  <th className="px-4 py-3">Pay Period</th>
                  <th className="px-4 py-3">Payment Date</th>
                  <th className="px-4 py-3">Gross Earnings</th>
                  <th className="px-4 py-3">Deductions</th>
                  <th className="px-4 py-3">Net Payout</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {mySlips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-[var(--secondary)] transition-colors">
                    <td className="px-4 py-3 font-sans font-bold text-[var(--foreground)]">{slip.month}</td>
                    <td className="px-4 py-3 text-[var(--foreground-muted)]">{slip.paymentDate}</td>
                    <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400 font-bold">{formatCurrency(slip.grossEarnings)}</td>
                    <td className="px-4 py-3 text-rose-500">-{formatCurrency(slip.totalDeductions)}</td>
                    <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(slip.netPay)}</td>
                    <td className="px-4 py-3 font-sans">
                      <Badge variant="success" size="xs">
                        Paid
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-sans">
                      <Button variant="ghost" size="xs" onClick={() => setSelectedSlip(slip)}>
                        View Receipt →
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Printable Payslip Modal */}
      {selectedSlip && (
        <Dialog
          isOpen={Boolean(selectedSlip)}
          onClose={() => setSelectedSlip(null)}
          maxWidth="2xl"
          className="p-0 overflow-hidden"
        >
          <div className="p-6 sm:p-8 space-y-6 bg-[var(--card)] text-[var(--foreground)]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-5">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
                  HRFlowX Technologies Inc.
                </span>
                <h3 className="text-xl font-black text-[var(--foreground)] mt-0.5">
                  Official Statement of Earnings
                </h3>
                <p className="text-xs text-[var(--foreground-muted)] font-mono mt-0.5">
                  {selectedSlip.month} • Disbursed {selectedSlip.paymentDate}
                </p>
              </div>

              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 text-xs font-semibold">
                <Printer className="h-4 w-4" /> Print / PDF
              </Button>
            </div>

            {/* Employee Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] text-xs font-mono">
              <div>
                <span className="text-[10px] text-[var(--foreground-subtle)] uppercase block">Employee</span>
                <span className="font-bold text-[var(--foreground)]">{selectedSlip.employeeName}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--foreground-subtle)] uppercase block">Login ID</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedSlip.employeeId}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--foreground-subtle)] uppercase block">Department</span>
                <span className="text-[var(--foreground)]">{selectedSlip.department}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--foreground-subtle)] uppercase block">Designation</span>
                <span className="text-[var(--foreground)]">{selectedSlip.designation}</span>
              </div>
            </div>

            {/* Financial Component Breakdown */}
            <div className="grid grid-cols-2 gap-6 text-xs font-mono">
              <div className="space-y-2 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase block font-sans">
                  Earnings
                </span>
                <div className="flex justify-between">
                  <span>Basic Salary:</span>
                  <span className="font-bold">{formatCurrency(selectedSlip.basicSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span>HRA Allowance:</span>
                  <span className="font-bold">{formatCurrency(selectedSlip.hra)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Allowance:</span>
                  <span className="font-bold">{formatCurrency(selectedSlip.standardAllowance)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bonus & LTA:</span>
                  <span className="font-bold">{formatCurrency(selectedSlip.performanceBonus + selectedSlip.lta + selectedSlip.fixedAllowance)}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--border)] pt-2 font-bold text-indigo-600 dark:text-indigo-400 font-sans">
                  <span>Total Earnings:</span>
                  <span>{formatCurrency(selectedSlip.grossEarnings)}</span>
                </div>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase block font-sans">
                  Deductions
                </span>
                <div className="flex justify-between text-rose-500">
                  <span>Provident Fund (12%):</span>
                  <span className="font-bold">-{formatCurrency(selectedSlip.pfDeduction)}</span>
                </div>
                <div className="flex justify-between text-rose-500">
                  <span>Professional Tax:</span>
                  <span className="font-bold">-{formatCurrency(selectedSlip.taxDeduction)}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--border)] pt-2 font-bold text-rose-500 font-sans">
                  <span>Total Deductions:</span>
                  <span>-{formatCurrency(selectedSlip.totalDeductions)}</span>
                </div>
              </div>
            </div>

            {/* Net Payout Banner */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400">
              <span className="text-xs font-bold uppercase tracking-wider font-sans">Net Disbursed Take-Home</span>
              <span className="text-2xl font-black font-mono">{formatCurrency(selectedSlip.netPay)}</span>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
