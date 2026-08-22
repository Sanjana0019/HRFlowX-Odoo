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
      emp.designation.toLowerCase().includes(search.toLowerCase());

    const matchesDept = departmentFilter === "all" || emp.department === departmentFilter;
    const matchesRole = roleFilter === "all" || emp.role === roleFilter;

    return matchesSearch && matchesDept && matchesRole;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addEmployee({
      name: newName,
      email: newEmail,
      role: newRole,
      jobTitle: newJobTitle,
      department: newDepartment,
      branch: newBranch,
      monthlyWage: newWage,
      phone: newPhone,
      address: newAddress,
    });

    setIsAddModalOpen(false);
    setNewName("");
    setNewEmail("");
    setNewJobTitle("");
    setSelectedEmployee(created);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Users className="h-6 w-6 text-indigo-400" />
            Workforce Directory & Organization Roster
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Live directory across {employees.length} team members with attendance status tracking and profile access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid / Table Toggle matching Wireframe 2 */}
          <div className="flex items-center rounded-xl bg-slate-800/80 p-1 border border-slate-700/80">
            <button
              onClick={() => setEmployeeViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${
                employeeViewMode === "grid" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
              title="Kanban / Grid Cards View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setEmployeeViewMode("table")}
              className={`p-1.5 rounded-lg transition-all ${
                employeeViewMode === "table" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
              title="List Data Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {isAdmin && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsAddModalOpen(true)}
              className="gap-2 shadow-indigo-500/25 font-semibold"
            >
              <UserPlus className="h-4 w-4" />
              Onboard Employee
            </Button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, login ID, email, designation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Roles</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin / HR</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Status Legend Matching Wireframe */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <span className="font-semibold text-slate-300">Live Status Legend:</span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          Present in Office / Remote
        </span>
        <span className="flex items-center gap-1.5">
          <Plane className="h-3 w-3 text-indigo-400" />
          On Approved Leave
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
          Absent / Shift Pending
        </span>
      </div>

      {/* VIEW MODE 1: KANBAN GRID CARDS MATCHING EXCALIDRAW WIREFRAME 2 */}
      {employeeViewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map((emp) => {
            const attStatus = getAttendanceStatusForEmp(emp.employeeId);
            return (
              <div
                key={emp.employeeId}
                onClick={() => setSelectedEmployee(emp)}
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/80 p-5 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Top Right Status Indicator matching Wireframe 2 */}
                <div className="absolute top-4 right-4">
                  {attStatus === "present" ? (
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    </span>
                  ) : attStatus === "on_leave" ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      <Plane className="h-3 w-3" />
                    </span>
                  ) : (
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500/20 border border-amber-500">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3.5">
                  <Avatar src={emp.avatar} name={emp.name} size="md" />
                  <div className="min-w-0 pr-6">
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                      {emp.name}
                    </h3>
                    <p className="text-xs text-indigo-300 font-medium truncate">{emp.designation}</p>
                    <span className="text-[10px] text-slate-500 font-mono block">{emp.employeeId}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate">{emp.department}</span>
                  <Badge variant={emp.role === "admin" ? "purple" : "outline"} size="sm">
                    {emp.role === "admin" ? "Admin" : "Employee"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW MODE 2: TABLE VIEW */
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Employee</th>
                    <th className="px-5 py-3.5">Login ID</th>
                    <th className="px-5 py-3.5">Department</th>
                    <th className="px-5 py-3.5">Designation</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5">Monthly Wage</th>
                    <th className="px-5 py-3.5">Today Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredEmployees.map((emp) => {
                    const st = getAttendanceStatusForEmp(emp.employeeId);
                    return (
                      <tr
                        key={emp.employeeId}
                        onClick={() => setSelectedEmployee(emp)}
                        className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <Avatar src={emp.avatar} name={emp.name} size="xs" />
                            <div>
                              <span className="font-bold text-white hover:text-indigo-400 block">{emp.name}</span>
                              <span className="text-[10px] text-slate-400">{emp.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-indigo-300 font-bold whitespace-nowrap">
                          {emp.employeeId}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <Badge variant="outline">{emp.department}</Badge>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-200">
                          {emp.designation}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <Badge variant={emp.role === "admin" ? "purple" : "blue"} size="sm">
                            {emp.role}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 font-mono font-bold text-emerald-400 whitespace-nowrap">
                          {formatCurrency(emp.salaryStructure.monthlyWage)}/mo
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <Badge variant={st === "present" ? "success" : st === "on_leave" ? "purple" : "amber"} size="sm" className="capitalize">
                            {st.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedEmployee(emp)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => {
                                  if (confirm(`Remove ${emp.name}?`)) deleteEmployee(emp.employeeId);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Onboard Employee Modal */}
      <Dialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard New Employee"
        description="Login ID will be auto-generated according to [CO][NAME][YEAR][SEQ] formula."
        maxWidth="xl"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Full Name</label>
              <Input placeholder="e.g. Jordan Hayes" value={newName} onChange={(e) => setNewName(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Work Email</label>
              <Input type="email" placeholder="jordan.hayes@hrflowx.io" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Designation</label>
              <Input placeholder="Senior Frontend Architect" value={newJobTitle} onChange={(e) => setNewJobTitle(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Department</label>
              <select
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-slate-700 bg-slate-900 text-sm text-slate-100"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Access Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full h-11 px-3 rounded-xl border border-slate-700 bg-slate-900 text-sm text-slate-100"
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin / HR Officer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Monthly Wage ($)</label>
              <Input
                type="number"
                value={newWage}
                onChange={(e) => setNewWage(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm" className="gap-1.5 font-semibold">
              <Sparkles className="h-4 w-4" /> Complete Onboarding
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          isReadOnly={!isAdmin}
        />
      )}
    </div>
  );
}
