"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  UserPlus,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  CheckCircle2,
  X,
  Sparkles,
  LayoutGrid,
  List,
  Plane,
  Clock,
  Briefcase,
  SlidersHorizontal,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Employee, UserRole } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { EmployeeDetailModal } from "@/components/employee/EmployeeDetailModal";

export function EmployeeManagementView() {
  const {
    employees,
    isLoadingEmployees,
    addEmployee,
    deleteEmployee,
    attendanceRecords,
    currentUser,
    employeeViewMode,
    setEmployeeViewMode,
  } = useStore();

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "hr";

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // New Employee Form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("employee");
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newDepartment, setNewDepartment] = useState("Engineering");
  const [newBranch, setNewBranch] = useState("San Francisco Global HQ");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newWage, setNewWage] = useState(15000);

  const departments = Array.from(new Set(employees.map((e) => e.department)));
  const todayStr = new Date().toISOString().split("T")[0];

  const getAttendanceStatusForEmp = (empId: string) => {
    const todayRec = attendanceRecords.find((r) => r.employeeId === empId && r.date === todayStr);
    if (!todayRec) return "absent";
    return todayRec.status;
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase());

    const matchesDept = departmentFilter === "all" || emp.department === departmentFilter;
    const matchesRole = roleFilter === "all" || emp.role === roleFilter;

    return matchesSearch && matchesDept && matchesRole;
  });

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    addEmployee({
      name: newName,
      email: newEmail,
      role: newRole,
      department: newDepartment,
      jobTitle: newJobTitle || "Software Engineer",
      branch: newBranch,
      phone: newPhone || "+1 (555) 000-1122",
      address: newAddress || "San Francisco, CA",
      monthlyWage: newWage,
    });

    setIsAddModalOpen(false);
    setNewName("");
    setNewEmail("");
    setNewJobTitle("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <Users className="h-6 w-6 text-indigo-500" />
            Workforce Directory
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">
            Manage organization members, role permissions, and compensation profiles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl bg-[var(--secondary)] border border-[var(--border)] p-1 shadow-2xs">
            <button
              onClick={() => setEmployeeViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                employeeViewMode === "grid"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
              title="Kanban Cards View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setEmployeeViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                employeeViewMode === "table"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
              title="Data Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {isAdmin && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="gap-1.5 font-semibold text-xs shadow-sm"
            >
              <UserPlus className="h-4 w-4" />
              Onboard Employee
            </Button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-3">
          <div className="w-full md:flex-1">
            <Input
              type="text"
              placeholder="Search by name, ID, department, or job title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              <option value="all">All Roles</option>
              <option value="employee">Staff Employees</option>
              <option value="admin">HR Admins</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* View Content: Kanban Grid or Data Table */}
      {employeeViewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map((emp) => {
            const status = getAttendanceStatusForEmp(emp.employeeId);
            return (
              <div
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                className="group relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)] hover:border-indigo-500/40 hover:shadow-[var(--shadow-elevated)] transition-all duration-200 cursor-pointer text-left space-y-4"
              >
                {/* Top Status & Role Pill */}
                <div className="flex items-start justify-between">
                  <Badge variant={emp.role === "admin" ? "purple" : "neutral"} size="xs">
                    {emp.role === "admin" ? "HR Admin" : "Staff"}
                  </Badge>

                  {/* Attendance status dot matching Wireframe 2 */}
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold">
                    {status === "present" && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        In Office
                      </span>
                    )}
                    {status === "on_leave" && (
                      <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400">
                        <Plane className="h-3 w-3" />
                        On Leave
                      </span>
                    )}
                    {status === "absent" && (
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        Offline
                      </span>
                    )}
                  </div>
                </div>

                {/* Avatar & Core Profile Info */}
                <div className="flex items-center gap-3.5">
                  <Avatar src={emp.avatar} alt={emp.name} size="md" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[var(--foreground)] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {emp.name}
                    </h4>
                    <p className="text-[11px] text-[var(--foreground-muted)] truncate">
                      {emp.designation}
                    </p>
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-semibold">
                      {emp.employeeId}
                    </p>
                  </div>
                </div>

                {/* Department & Branch Meta */}
                <div className="pt-2 border-t border-[var(--border-subtle)] grid grid-cols-2 gap-2 text-[11px] text-[var(--foreground-subtle)]">
                  <span className="truncate flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {emp.department}
                  </span>
                  <span className="truncate flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {emp.branch.split(" ")[0]}
                  </span>
                </div>

                {/* Compensation Indicator (Admin View) */}
                {isAdmin && (
                  <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-[var(--foreground-muted)]">
                    <span>Wage:</span>
                    <span className="font-bold text-[var(--foreground)]">
                      {formatCurrency(emp.salaryStructure.monthlyWage)}/mo
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Data Table View */
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-muted)] font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Login ID</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Status</th>
                  {isAdmin && <th className="px-4 py-3">Monthly Wage</th>}
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredEmployees.map((emp) => {
                  const status = getAttendanceStatusForEmp(emp.employeeId);
                  return (
                    <tr
                      key={emp.id}
                      onClick={() => setSelectedEmployee(emp)}
                      className="hover:bg-[var(--secondary)] transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={emp.avatar} alt={emp.name} size="sm" />
                          <div>
                            <span className="font-bold text-[var(--foreground)] block">
                              {emp.name}
                            </span>
                            <span className="text-[10px] text-[var(--foreground-subtle)]">
                              {emp.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                        {emp.employeeId}
                      </td>
                      <td className="px-4 py-3 text-[var(--foreground)]">{emp.department}</td>
                      <td className="px-4 py-3 text-[var(--foreground-muted)]">{emp.designation}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            status === "present"
                              ? "success"
                              : status === "on_leave"
                              ? "blue"
                              : "warning"
                          }
                          size="xs"
                          dot
                        >
                          {status === "present" ? "Present" : status === "on_leave" ? "Leave" : "Offline"}
                        </Badge>
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3 font-mono font-semibold text-[var(--foreground)]">
                          {formatCurrency(emp.salaryStructure.monthlyWage)}
                        </td>
                      )}
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="xs" className="text-xs">
                          Inspect →
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Selected Employee Detail Modal Drawer */}
      {selectedEmployee && (
        <EmployeeDetailModal
          isOpen={Boolean(selectedEmployee)}
          onClose={() => setSelectedEmployee(null)}
          employee={selectedEmployee}
        />
      )}

      {/* Onboard Employee Modal */}
      <Dialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard New Employee"
        description="System generates unique Login ID formula: [CO][NAME][YEAR][SEQ]"
        maxWidth="lg"
      >
        <form onSubmit={handleAddEmployeeSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                Full Name
              </label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Jordan Smith"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                Work Email
              </label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="jordan.smith@hrflowx.io"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                Department
              </label>
              <select
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="h-10 w-full px-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              >
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                Designation
              </label>
              <Input
                value={newJobTitle}
                onChange={(e) => setNewJobTitle(e.target.value)}
                placeholder="e.g. Senior DevOps Architect"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                Monthly Wage (Base Package)
              </label>
              <Input
                type="number"
                value={newWage}
                onChange={(e) => setNewWage(Number(e.target.value))}
                placeholder="15000"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                Role Permissions
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                className="h-10 w-full px-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              >
                <option value="employee">Staff Employee (Self-service)</option>
                <option value="admin">HR Administrator (Full Governance)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Complete Onboarding →
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
