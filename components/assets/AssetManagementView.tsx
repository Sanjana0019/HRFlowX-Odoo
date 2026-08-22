"use client";

import React, { useState } from "react";
import {
  Laptop,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  Monitor,
  Smartphone,
  CreditCard,
  HardDrive,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Asset } from "@/types";

export function AssetManagementView() {
  const { assets, addAsset, assignAssetToEmployee, deleteAsset, employees, currentUser } = useStore();
  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "hr";

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetName, setAssetName] = useState("");
  const [category, setCategory] = useState<Asset["category"]>("Laptop");
  const [serialNumber, setSerialNumber] = useState("");
  const [selectedEmpId, setSelectedEmpId] = useState(currentUser?.employeeId || "HXAR20230001");

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.assetName.toLowerCase().includes(search.toLowerCase()) ||
      a.assetId.toLowerCase().includes(search.toLowerCase()) ||
      (a.employeeName && a.employeeName.toLowerCase().includes(search.toLowerCase()));
    
    if (!isAdmin) {
      return matchesSearch && a.employeeId === currentUser?.employeeId;
    }
    return matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextNum = 1000 + assets.length + 1;
    const assetId = `AST-${category.substring(0, 3).toUpperCase()}-${nextNum}`;
    const emp = employees.find((e) => e.employeeId === selectedEmpId);

    addAsset({
      assetName,
      assetId,
      category,
      serialNumber,
      employeeId: emp?.employeeId,
      employeeName: emp?.name,
      assignedDate: new Date().toISOString().split("T")[0],
      status: emp ? "assigned" : "available",
    });

    setIsModalOpen(false);
    setAssetName("");
    setSerialNumber("");
  };

  const getCategoryIcon = (cat: Asset["category"]) => {
    switch (cat) {
      case "Laptop": return <Laptop className="h-4 w-4 text-indigo-400" />;
      case "Monitor": return <Monitor className="h-4 w-4 text-blue-400" />;
      case "Phone": return <Smartphone className="h-4 w-4 text-emerald-400" />;
      default: return <HardDrive className="h-4 w-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Laptop className="h-6 w-6 text-indigo-400" />
            Hardware & Corporate Asset Vault
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Track hardware provisions, developer workstations, monitor assignments, and security badges.
          </p>
        </div>

        {isAdmin && (
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} className="gap-1.5 font-semibold">
            <Plus className="h-4 w-4" /> Register Asset
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <CardTitle className="text-base">Asset Inventory ({filteredAssets.length})</CardTitle>
            <p className="text-xs text-slate-400">Assigned hardware encrypted with corporate MDM profiles</p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Asset</th>
                  <th className="px-5 py-3.5">Asset Tag</th>
                  <th className="px-5 py-3.5">Serial Number</th>
                  <th className="px-5 py-3.5">Assigned To</th>
                  <th className="px-5 py-3.5">Assigned Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  {isAdmin && <th className="px-5 py-3.5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No assets found.
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-800/40">
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                            {getCategoryIcon(a.category)}
                          </div>
                          <div>
                            <span className="font-semibold text-white block">{a.assetName}</span>
                            <span className="text-[10px] text-slate-400">{a.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-indigo-300 whitespace-nowrap font-medium">
                        {a.assetId}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-300 whitespace-nowrap">
                        {a.serialNumber}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {a.employeeName ? (
                          <div>
                            <span className="font-semibold text-white block">{a.employeeName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{a.employeeId}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Unassigned (In Inventory)</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">
                        {a.assignedDate || "-"}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <Badge variant={a.status === "assigned" ? "success" : "blue"} size="sm" className="capitalize">
                          {a.status}
                        </Badge>
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={() => deleteAsset(a.id)}
                            className="p-1 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Corporate Asset" maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Asset Name & Model</label>
            <Input placeholder="e.g. Apple MacBook Pro 16 M3 Max" value={assetName} onChange={(e) => setAssetName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white"
              >
                <option value="Laptop">Laptop</option>
                <option value="Monitor">Monitor</option>
                <option value="Phone">Phone</option>
                <option value="Access Card">Access Card</option>
                <option value="Peripheral">Peripheral</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Serial Number</label>
              <Input placeholder="SN-991823" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Assign to Employee</label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white"
            >
              {employees.map((e) => (
                <option key={e.employeeId} value={e.employeeId}>
                  {e.name} ({e.employeeId})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Register</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
