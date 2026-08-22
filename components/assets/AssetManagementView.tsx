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
  const [selectedEmpId, setSelectedEmpId] = useState(currentUser?.employeeId || "HXAS20230001");

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
      case "Laptop":
        return <Laptop className="h-5 w-5 text-indigo-500" />;
      case "Monitor":
        return <Monitor className="h-5 w-5 text-purple-500" />;
      case "Phone":
        return <Smartphone className="h-5 w-5 text-emerald-500" />;
      default:
        return <HardDrive className="h-5 w-5 text-sky-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <Laptop className="h-6 w-6 text-indigo-500" />
            Hardware Assets & Equipment Registry
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">
            Track corporate hardware inventory, serial numbers, and employee assignments.
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="gap-1.5 font-semibold text-xs shadow-sm"
          >
            <Plus className="h-4 w-4" /> Provision Asset
          </Button>
        )}
      </div>

      {/* Filter / Search Bar */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search hardware by name, asset ID, or assigned employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </CardContent>
      </Card>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-card)] space-y-4 text-xs"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--secondary)] border border-[var(--border-subtle)]">
                  {getCategoryIcon(asset.category)}
                </div>
                <div>
                  <span className="font-bold text-[var(--foreground)] text-sm block">{asset.assetName}</span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-semibold">
                    {asset.assetId}
                  </span>
                </div>
              </div>

              <Badge variant={asset.status === "assigned" ? "purple" : "success"} size="xs">
                {asset.status === "assigned" ? "Assigned" : "Available"}
              </Badge>
            </div>

            <div className="p-3 rounded-xl bg-[var(--secondary)] border border-[var(--border-subtle)] space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">Serial:</span>
                <span className="text-[var(--foreground)]">{asset.serialNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">Assigned To:</span>
                <span className="font-bold text-[var(--foreground)] font-sans">
                  {asset.employeeName || "Unassigned"}
                </span>
              </div>
            </div>

            {isAdmin && (
              <div className="flex justify-end pt-1">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => deleteAsset(asset.id)}
                  className="text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Provision Asset Modal */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Provision Hardware Asset">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
              Asset Model Name
            </label>
            <Input
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              placeholder="e.g. MacBook Pro M3 Max 16-inch (64GB)"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="h-10 w-full px-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              >
                <option value="Laptop">Laptop / Notebook</option>
                <option value="Monitor">External Monitor</option>
                <option value="Phone">Corporate Mobile</option>
                <option value="Accessory">Accessory / Peripherals</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
                Serial Number
              </label>
              <Input
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. C02G12ABMD6T"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[var(--foreground-muted)] mb-1">
              Assign to Team Member
            </label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="h-10 w-full px-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.employeeId}>
                  {emp.name} ({emp.department})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Provision Asset →
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
