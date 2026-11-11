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
  Receipt,
  Calendar,
  Car,
  PiggyBank,
} from "lucide-react";
import Link from "next/link";
import { useBudget } from "@/context/BudgeContext";
import { useExpense } from "@/context/ExpenseContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export default function Home() {
  const router = useRouter();
  const { budget } = useBudget();
  const { expense, setExpense } = useExpense();
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    categoryId: "",
    date: "",
  });
  const getCategoryIcon = (category) => {
    const name = category?.toLowerCase();

    switch (name) {
      case "food":
        return Utensils;

      case "shopping":
        return ShoppingBag;

      case "travel":
        return Car;
      case "clothes":
        return Shirt;

      case "home":
        return Home;

      case "health":
        return HeartPulse;

      case "education":
        return GraduationCap;

      default:
        return Receipt;
    }
  };
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      date: new Date().toISOString().split("T")[0],
    }));
  }, []);

  useEffect(() => {
    async function fetchRecentCategories() {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();

        if (res.ok) {
          setCategories(data?.categories);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchRecentCategories();
  }, []);

  useEffect(() => {
    async function fetchRecentExpenses() {
      try {
        const res = await fetch("/api/expense/recent");
        const data = await res.json();

        if (res.ok) {
          setExpenses(data.expenses);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchRecentExpenses();
  }, []);
  const fetchSummary = async () => {
    try {
      const res = await fetch(`/api/expense/summary`);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setSummary(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);
  const handleAddExpense = async (e) => {
    e.preventDefault();

    const payload = {
      item: form.title,
      categoryId: form.categoryId,
      date: form.date,
      price: Number(form.amount),
    };

    try {
      const res = await fetch("/api/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add expense");
      }
      router.refresh();

      setExpense((e) => ({
        ...e,
        totalExpense: e.totalExpense + Number(form.amount),
      }));
      fetchSummary();

      setForm({
        title: "",
        amount: "",
        categoryId: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };
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
                  <strong className="text-lg">
                    {money(
                      (Number(budget?.budget) || 0) -
                        (Number(expense?.totalExpense) || 0),
                    )}
                  </strong>
                </div>
              </div>

              {/* Savings */}
              <div className="flex items-center gap-3 rounded-2xl bg-blue-100 px-5 py-3 text-blue-900">
                <PiggyBank size={21} />
                <div>
                  <p className="text-xs font-medium">Savings Available</p>
                  <strong className="text-lg">
                    {" "}
                    {money(Number(budget?.saving) || 0)}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-7">
              {/* Budget banner */}
              <section className="rounded-2xl bg-gradient-to-r from-emerald-900 to-emerald-700 p-6 text-white shadow-sm md:p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-2xl bg-white/15 p-4">
                    <Plus size={28} />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">Add Expense</h2>
                    <p className="mt-1 text-sm text-emerald-100">
                      Track your spending and manage your money.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleAddExpense}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                  {/* Item */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Item
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="e.g. Biriyani"
                      required
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-emerald-200 outline-none focus:border-white"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={form.amount}
                      onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                      }
                      placeholder="e.g. 150"
                      min="0.01"
                      step="0.01"
                      required
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-emerald-200 outline-none focus:border-white"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Category
                    </label>
                    <select
                      value={form.categoryId}
                      onChange={(e) =>
                        setForm({ ...form, categoryId: e.target.value })
                      }
                      required
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none focus:border-white"
                    >
                      <option value="" disabled className="text-slate-900">
                        Select category
                      </option>

                      {categories.map((category) => (
                        <option
                          key={category._id}
                          value={category._id}
                          className="text-slate-900"
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Date
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                      required
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none focus:border-white"
                    />
                  </div>

                  {/* Submit */}
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-emerald-900 transition hover:bg-emerald-50"
                    >
                      <Plus size={18} />
                      Add Expense
                    </button>
                  </div>
                </form>
              </section>

              {/* Categories */}
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Categories</h2>
                  <Link href={`/category`}>
                    <button className="flex items-center gap-1 text-sm font-medium text-emerald-700">
                      View all <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {categories.slice(0, 4).map((category, i) => {
                    const name = category.name;
                    const description =
                      category.description || "No description";
                    const Icon = getCategoryIcon(category.icon);
                    const color =
                      i % 3 === 0 ? "green" : i % 3 === 1 ? "blue" : "violet";

                    return (
                      <div
                        key={category._id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div
                          className={`mb-4 inline-flex rounded-xl p-3 ${
                            color === "green"
                              ? "bg-emerald-50 text-emerald-700"
                              : color === "blue"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-violet-50 text-violet-600"
                          }`}
                        >
                          <Icon size={22} />
                        </div>

                        <h3 className="font-semibold">{name}</h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {description}
                        </p>

                        <Link href={`/category/${category._id}`}>
                          <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-50 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">
                            <Plus size={15} /> Add
                          </button>
                        </Link>
                      </div>
                    );
                  })}
                  {/* <button className="flex min-h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white text-slate-500 transition hover:border-emerald-400 hover:text-emerald-700">
                    <Plus size={24} />
                    <span className="mt-2 text-sm font-semibold">
                      Add category
                    </span>
                    <span className="mt-1 text-xs">
                      Create a custom category
                    </span>
                  </button> */}
                </div>
              </section>

              {/* Recent expenses */}
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Recent activity</h2>

                  {/* <button className="flex items-center gap-1 text-sm font-medium text-emerald-700">
                    View all <ArrowRight size={16} />
                  </button> */}
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  {expenses.map((expense, i) => {
                    const Icon = getCategoryIcon(expense.categoryId?.name);

                    const title = expense.item;
                    const category =
                      expense.categoryId?.name || "Uncategorized";
                    const detail = expense.note || "";
                    const amount = expense.price;

                    return (
                      <div
                        key={expense._id}
                        className={`flex items-center gap-4 px-5 py-4 ${
                          i !== expenses.length - 1
                            ? "border-b border-slate-100"
                            : ""
                        }`}
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
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Summary */}
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Monthly summary</h2>

                <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600">
                  {new Date(
                    summary?.year,
                    summary?.month - 1,
                  ).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                  ⌄
                </span>
              </div>

              {/* Donut chart */}
              <div
                className="mx-auto my-8 flex h-48 w-48 items-center justify-center rounded-full"
                style={{
                  background:
                    summary?.categorySummary.length > 0
                      ? `conic-gradient(${summary?.categorySummary
                          .map((category, i, arr) => {
                            const colors = [
                              "#15803d",
                              "#86efac",
                              "#d1fae5",
                              "#e2e8f0",
                              "#60a5fa",
                              "#c4b5fd",
                            ];

                            const start = arr
                              .slice(0, i)
                              .reduce(
                                (total, item) => total + item.percentage,
                                0,
                              );

                            const end = start + category?.percentage;

                            return `${colors[i % colors.length]} ${start}% ${end}%`;
                          })
                          .join(", ")})`
                      : "#e2e8f0",
                }}
              >
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                  <strong className="text-xl text-emerald-900">
                    {money(summary?.totalExpense)}
                  </strong>

                  <span className="mt-1 text-sm text-slate-500">Spent</span>
                </div>
              </div>

              {/* Category summary */}
              <div className="space-y-4">
                {summary?.categorySummary.map((category, i) => {
                  const colors = [
                    "bg-emerald-700",
                    "bg-green-300",
                    "bg-emerald-100",
                    "bg-slate-300",
                    "bg-blue-300",
                    "bg-violet-300",
                  ];

                  return (
                    <div
                      key={category.name}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span
                        className={`h-3 w-3 rounded-full ${
                          colors[i % colors.length]
                        }`}
                      />

                      <span className="flex-1">{category.name}</span>

                      <span className="font-medium">
                        {money(category.price)}
                      </span>

                      <span className="w-10 text-right text-slate-500">
                        {category.percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Budget remaining */}
              <div className="mt-6 rounded-xl bg-emerald-50 p-4">
                <p className="text-xs text-emerald-700">Budget remaining</p>

                <p className="mt-1 text-xl font-bold text-emerald-900">
                  {money(summary?.budgetRemaining)}
                </p>

                {/* Progress bar */}
                <div className="mt-3 h-2 rounded-full bg-emerald-100">
                  <div
                    className="h-2 rounded-full bg-emerald-600 transition-all duration-500"
                    style={{
                      width: `${summary?.budgetUsedPercentage}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-emerald-700">
                  {summary?.budgetUsedPercentage}% of budget used
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
