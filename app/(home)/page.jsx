"use client";

import {
  Utensils,
  LayoutDashboard,
  PieChart,
  Grid2X2,
  ChartNoAxesColumn,
  Search,
  Bell,
  Plus,
  ArrowRight,
  Wallet,
  MapPin,
  ShoppingBag,
  Coffee,
  Bus,
  Shirt,
  Menu,
  Calendar,
  PiggyBank
} from "lucide-react";
import Link from "next/link";
import { useBudget } from "@/context/BudgeContext";
import { useExpense } from "@/context/ExpenseContext";

const categories = [
  {
    name: "Food",
    description: "Track food expenses",
    icon: Utensils,
    color: "green",
  },
  {
    name: "Travel",
    description: "Track travel expenses",
    icon: MapPin,
    color: "blue",
  },
  {
    name: "Shopping",
    description: "Track shopping expenses",
    icon: ShoppingBag,
    color: "purple",
  },
];

const expenses = [
  {
    title: "Lunch",
    category: "Food",
    detail: "Today · 1:20 PM",
    amount: 320,
    icon: Coffee,
  },
  {
    title: "Bus Ticket",
    category: "Travel",
    detail: "Yesterday · 6:45 PM",
    amount: 500,
    icon: Bus,
  },
  {
    title: "T-Shirt",
    category: "Shopping",
    detail: "Nov 6 · 11:30 AM",
    amount: 1200,
    icon: Shirt,
  },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Month", icon: Calendar },
  { label: "Budget", icon: PieChart },
  { label: "Categories", icon: Grid2X2 },
  { label: "Reports", icon: ChartNoAxesColumn },
];

const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export default function Home() {
  const { budget } = useBudget();
  const { expense } = useExpense();

  console.log("expense", expense);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      {/* Sidebar */}

      {/* Main content */}
      <main className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">
          <div className="flex items-center gap-3">
            <button className="text-slate-500 md:hidden">
              <Menu />
            </button>
            <div className="hidden w-72 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-sm text-slate-400 sm:flex">
              <Search size={16} /> Search expenses, categories...
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">
              S
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1400px] p-5 md:p-8">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Good morning, 👋
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage your expenses and stay on top of your budget.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Budget Type */}
              <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 capitalize">
                {budget?.bType} Budget
              </div>

              {/* Available Budget */}
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-100 px-5 py-3 text-emerald-900">
                <Wallet size={21} />
                <div>
                  <p className="text-xs font-medium">Available Budget</p>
                  <strong className="text-lg">{money(Number(budget?.budget) - (Number(expense?.totalExpense) || 0) )}</strong>
                </div>
              </div>

              {/* Savings */}
              <div className="flex items-center gap-3 rounded-2xl bg-blue-100 px-5 py-3 text-blue-900">
                <PiggyBank size={21} />
                <div>
                  <p className="text-xs font-medium">Savings Available</p>
                  <strong className="text-lg">{money(budget?.saving)}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-7">
              {/* Budget banner */}
              <section className="flex flex-wrap items-center justify-between gap-5 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 to-emerald-700 p-6 text-white shadow-sm md:p-8">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-white/15 p-4">
                    <PieChart size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Set your budget</h2>
                    <p className="mt-1 text-sm text-emerald-100">
                      Plan your monthly spending with confidence.
                    </p>
                  </div>
                </div>
                <Link href="/budget">
                  <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50">
                    <Plus size={17} /> Set Budget
                  </button>
                </Link>
              </section>

              {/* Categories */}
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Categories</h2>
                  <button className="flex items-center gap-1 text-sm font-medium text-emerald-700">
                    View all <ArrowRight size={16} />
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {categories.map(
                    ({ name, description, icon: Icon, color }) => (
                      <div
                        key={name}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div
                          className={`mb-4 inline-flex rounded-xl p-3 ${color === "green" ? "bg-emerald-50 text-emerald-700" : color === "blue" ? "bg-blue-50 text-blue-600" : "bg-violet-50 text-violet-600"}`}
                        >
                          <Icon size={22} />
                        </div>
                        <h3 className="font-semibold">{name}</h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {description}
                        </p>
                        <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-50 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">
                          <Plus size={15} /> Add
                        </button>
                      </div>
                    ),
                  )}
                  <button className="flex min-h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white text-slate-500 transition hover:border-emerald-400 hover:text-emerald-700">
                    <Plus size={24} />
                    <span className="mt-2 text-sm font-semibold">
                      Add category
                    </span>
                    <span className="mt-1 text-xs">
                      Create a custom category
                    </span>
                  </button>
                </div>
              </section>

              {/* Recent expenses */}
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Recent activity</h2>
                  <button className="flex items-center gap-1 text-sm font-medium text-emerald-700">
                    View all <ArrowRight size={16} />
                  </button>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  {expenses.map(
                    ({ title, category, detail, amount, icon: Icon }, i) => (
                      <div
                        key={title}
                        className={`flex items-center gap-4 px-5 py-4 ${i !== expenses.length - 1 ? "border-b border-slate-100" : ""}`}
                      >
                        <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">
                            {title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {category} · {detail}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-rose-600">
                          − {money(amount)}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </section>
            </div>

            {/* Summary */}
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Monthly summary</h2>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600">
                  Nov 2026⌄
                </span>
              </div>
              <div
                className="mx-auto my-8 flex h-48 w-48 items-center justify-center rounded-full"
                style={{
                  background:
                    "conic-gradient(#15803d 0 40%, #86efac 40% 67%, #d1fae5 67% 87%, #e2e8f0 87% 100%)",
                }}
              >
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                  <strong className="text-xl text-emerald-900">
                    {money(7500)}
                  </strong>
                  <span className="mt-1 text-sm text-slate-500">Spent</span>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  ["Food", "₹ 3,000", "40%", "bg-emerald-700"],
                  ["Travel", "₹ 2,000", "27%", "bg-green-300"],
                  ["Shopping", "₹ 1,500", "20%", "bg-emerald-100"],
                  ["Others", "₹ 1,000", "13%", "bg-slate-300"],
                ].map(([name, amount, percent, dot]) => (
                  <div key={name} className="flex items-center gap-3 text-sm">
                    <span className={`h-3 w-3 rounded-full ${dot}`} />
                    <span className="flex-1">{name}</span>
                    <span className="font-medium">{amount}</span>
                    <span className="w-10 text-right text-slate-500">
                      {percent}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-emerald-50 p-4">
                <p className="text-xs text-emerald-700">Budget remaining</p>
                <p className="mt-1 text-xl font-bold text-emerald-900">
                  {money(15500)}
                </p>
                <div className="mt-3 h-2 rounded-full bg-emerald-100">
                  <div className="h-2 w-[33%] rounded-full bg-emerald-600" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
