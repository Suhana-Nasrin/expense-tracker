"use client";

import {
  Utensils,
  LayoutDashboard,
  PieChart,
  Grid2X2,
  Settings,
  Calendar,
  ChartNoAxesCombined,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Month", icon: Calendar, href: "/month" },
  { label: "Budget", icon: PieChart, href: "/budget" },
  { label: "Categories", icon: Grid2X2, href: "/category" },
];
export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div>
      <aside className="hidden w-64 h-full shrink-0 border-r border-slate-200 bg-white p-6 md:flex md:flex-col">
        <div className="mb-10 flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
            <ChartNoAxesCombined size={22} />
          </span>
          Expense<span className="text-emerald-600">Tracker</span>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  active
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-slate-100 pt-5">
          <button className="flex items-center gap-3 px-4 py-3 text-sm text-slate-500">
            <Settings size={18} /> Settings
          </button>
        </div>
      </aside>
    </div>
  );
}
