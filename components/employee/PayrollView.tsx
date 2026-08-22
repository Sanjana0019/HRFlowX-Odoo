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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Receipt className="h-6 w-6 text-indigo-400" />
            Compensation & Payroll
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Read-only breakdown of salary components, allowances, tax deductions, and historical pay slips.
          </p>
        </div>

        {mySlips[0] && (
          <Button
            variant="primary"
            size="md"
            onClick={() => setSelectedSlip(mySlips[0])}
            className="gap-2 shadow-indigo-500/25 font-semibold"
          >
            <FileText className="h-4 w-4" />
            View Latest Payslip ({mySlips[0].month})
          </Button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Annual CTC"
          value={formatCurrency(salaryStructure.grossSalary)}
          change="Full Package"
          isPositive={true}
          icon={CreditCard}
          description="Gross total compensation"
          accentColor="indigo"
        />
        <StatCard
          title="Monthly Net Pay"
          value={formatCurrency(monthlyNet)}
          change="Direct Deposit"
          isPositive={true}
          icon={DollarSign}
          description="Take-home after tax & PF"
          accentColor="emerald"
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
        />
        <StatCard
          title="Monthly Allowances"
          value={formatCurrency(monthlyHra + monthlyMedical + monthlySpecial)}
          change="HRA + Medical"
          isPositive={true}
          icon={TrendingUp}
          description="Total pre-tax benefits"
          accentColor="blue"
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10 border-blue-500/20"
        />
        <StatCard
          title="Monthly Deductions"
          value={formatCurrency(monthlyDeductions)}
          change="PF + Withholding"
          isPositive={false}
          icon={Building}
          description="Statutory contributions"
          accentColor="rose"
          iconColor="text-rose-400"
          iconBg="bg-rose-500/10 border-rose-500/20"
        />
      </div>

      {/* Salary Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings & Allowances */}
        <Card className="border-indigo-500/20">
          <CardHeader className="pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-white">Monthly Earnings & Allowances</CardTitle>
              <Badge variant="success">Active Structure</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60 text-xs">
              <span className="text-slate-300 font-medium">Basic Pay</span>
              <span className="font-mono font-semibold text-white">{formatCurrency(monthlyBase)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60 text-xs">
              <span className="text-slate-300 font-medium">House Rent Allowance (HRA)</span>
              <span className="font-mono font-semibold text-white">{formatCurrency(monthlyHra)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60 text-xs">
              <span className="text-slate-300 font-medium">Medical Allowance</span>
              <span className="font-mono font-semibold text-white">{formatCurrency(monthlyMedical)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60 text-xs">
              <span className="text-slate-300 font-medium">Special / Flexibility Allowance</span>
              <span className="font-mono font-semibold text-white">{formatCurrency(monthlySpecial)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 text-sm font-bold text-indigo-400">
              <span>Gross Monthly Earnings</span>
              <span className="font-mono">{formatCurrency(monthlyGross)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Deductions & Net Salary */}
        <Card className="border-rose-500/20">
          <CardHeader className="pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-white">Deductions & Net Disbursal</CardTitle>
              <Badge variant="amber">Statutory</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60 text-xs">
              <span className="text-slate-300 font-medium">Provident Fund (PF - Employee Share)</span>
              <span className="font-mono font-semibold text-rose-400">-{formatCurrency(monthlyPf)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60 text-xs">
              <span className="text-slate-300 font-medium">Professional Tax & State Withholding</span>
              <span className="font-mono font-semibold text-rose-400">-{formatCurrency(monthlyTax)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60 text-xs">
              <span className="text-slate-300 font-medium">Unpaid Leave Deductions</span>
              <span className="font-mono font-semibold text-emerald-400">$0 (0 Absent)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60 text-xs text-rose-400 font-semibold">
              <span>Total Monthly Deductions</span>
              <span className="font-mono">-{formatCurrency(monthlyDeductions)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 text-sm font-bold text-emerald-400">
              <span>Net In-Hand Pay</span>
              <span className="font-mono">{formatCurrency(monthlyNet)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Slips History Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <CardTitle className="text-base">Payslip History</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical monthly salary credits, bonus disbursements, and tax statements.
            </p>
          </div>
          <Badge variant="default" size="md">
            {mySlips.length} Statements
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Month / Period</th>
                  <th className="px-5 py-3.5">Disbursal Date</th>
                  <th className="px-5 py-3.5">Gross Earnings</th>
                  <th className="px-5 py-3.5">Deductions</th>
                  <th className="px-5 py-3.5">Net Pay</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {mySlips.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No payslips available yet.
                    </td>
                  </tr>
                ) : (
                  mySlips.map((slip) => (
                    <tr key={slip.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-white whitespace-nowrap">
                        <span className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-indigo-400" />
                          {slip.month}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">
                        {slip.paymentDate}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-white whitespace-nowrap">
                        {formatCurrency(slip.grossEarnings)}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-rose-400 whitespace-nowrap">
                        -{formatCurrency(slip.totalDeductions)}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-emerald-400 whitespace-nowrap">
                        {formatCurrency(slip.netPay)}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <Badge variant="success" size="sm" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Paid
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSlip(slip)}
                          className="h-8 text-xs gap-1.5"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          View Payslip
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Printable Payslip Modal */}
      {selectedSlip && (
        <Dialog
          isOpen={Boolean(selectedSlip)}
          onClose={() => setSelectedSlip(null)}
          title={`Payslip — ${selectedSlip.month}`}
          description={`Payment confirmation for ${selectedSlip.employeeName}`}
          maxWidth="2xl"
        >
          <div className="space-y-6 print:m-0 print:p-0">
            {/* Header / Receipt Style */}
            <div className="rounded-2xl border border-slate-700/80 bg-slate-950 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-lg">
                    DF
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">HRFLOWX TECHNOLOGIES INC.</h3>
                    <p className="text-xs text-slate-400">742 Evergreen Terrace, San Francisco, CA</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <Badge variant="success" size="md">
                    Direct Deposit Verified
                  </Badge>
                  <p className="text-xs text-slate-400 mt-1">Paid on: {selectedSlip.paymentDate}</p>
                </div>
              </div>

              {/* Employee & Pay Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Employee Name</span>
                  <span className="font-semibold text-white">{selectedSlip.employeeName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Employee ID</span>
                  <span className="font-mono text-indigo-300 font-semibold">{selectedSlip.employeeId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Department</span>
                  <span className="font-semibold text-white">{selectedSlip.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Designation</span>
                  <span className="font-semibold text-white">{selectedSlip.designation}</span>
                </div>
              </div>

              {/* Earnings & Deductions Tables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* Earnings */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Earnings
                  </h4>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Basic Salary</span>
                      <span className="font-mono font-medium">{formatCurrency(selectedSlip.basicSalary)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>House Rent Allowance (HRA)</span>
                      <span className="font-mono font-medium">{formatCurrency(selectedSlip.hra)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Standard Allowance</span>
                      <span className="font-mono font-medium">{formatCurrency(selectedSlip.standardAllowance)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Special & Bonus Allowances</span>
                      <span className="font-mono font-medium">{formatCurrency(selectedSlip.performanceBonus + selectedSlip.lta + selectedSlip.fixedAllowance)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-2 font-bold text-white">
                      <span>Total Earnings</span>
                      <span className="font-mono text-indigo-300">{formatCurrency(selectedSlip.grossEarnings)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    Deductions
                  </h4>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Provident Fund (PF 12%)</span>
                      <span className="font-mono font-medium">-{formatCurrency(selectedSlip.pfDeduction)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Professional Tax</span>
                      <span className="font-mono font-medium">-{formatCurrency(selectedSlip.taxDeduction)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Unpaid Leave Deductions</span>
                      <span className="font-mono font-medium">-{formatCurrency(selectedSlip.unpaidLeaveDeduction)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-2 font-bold text-rose-400">
                      <span>Total Deductions</span>
                      <span className="font-mono">-{formatCurrency(selectedSlip.totalDeductions)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Payout Banner */}
              <div className="flex items-center justify-between rounded-xl bg-emerald-950/40 border border-emerald-800/40 p-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold block">
                    Net Take-Home Pay
                  </span>
                  <span className="text-[11px] text-slate-400">Transferred to Bank Account (•••• 8912)</span>
                </div>
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  {formatCurrency(selectedSlip.netPay)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 print:hidden">
              <Button variant="outline" size="md" onClick={handlePrint} className="gap-1.5">
                <Printer className="h-4 w-4" />
                Print Payslip
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setSelectedSlip(null)}
                className="gap-1.5"
              >
                Close
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
