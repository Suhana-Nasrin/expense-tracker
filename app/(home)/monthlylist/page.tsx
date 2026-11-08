"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Wallet,
  TrendingDown,
  Plus,
  Filter,
  } from "lucide-react";

type Expense = {
  id: number;
  date: string;
  item: string;
  category: string;
  price: number;
};

const initialExpenses: Expense[] = [
  { id: 1, date: "2026-11-02", item: "Biriyani", category: "Food", price: 100 },
  { id: 2, date: "2026-11-02", item: "Jean", category: "Clothes", price: 500 },
  { id: 3, date: "2026-11-02", item: "Kozhikode", category: "Travel", price: 130 },
];

const categories = ["Food", "Clothes", "Travel", "Shopping", "Other"];

export default function MonthlyOverviewPage() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [month, setMonth] = useState("2026-11");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [balance, setBalance] = useState(23000);

  const [newExpense, setNewExpense] = useState({
    date: "2026-11-08",
    item: "",
    category: "",
    price: "",
  });

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesMonth = expense.date.startsWith(month);
      const matchesCategory =
        categoryFilter === "All" ||
        expense.category === categoryFilter;

      return matchesMonth && matchesCategory;
    });
  }, [expenses, month, categoryFilter]);

  const total = filteredExpenses.reduce(
    (sum, expense) => sum + expense.price,
    0
  );

  const addExpense = () => {
    if (!newExpense.item || !newExpense.category || !newExpense.price) {
      alert("Please enter item, category and price.");
      return;
    }

    setExpenses((prev) => [
      ...prev,
      {
        id: Date.now(),
        date: newExpense.date,
        item: newExpense.item,
        category: newExpense.category,
        price: Number(newExpense.price),
      },
    ]);

    setNewExpense({
      date: "2026-11-08",
      item: "",
      category: "",
      price: "",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
    
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Monthly Overview
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Track and manage all your monthly expenses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <CalendarDays size={18} className="text-emerald-600" />
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-transparent text-sm font-medium text-slate-700 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Available Balance</p>
              <div className="rounded-xl bg-emerald-50 p-2">
                <Wallet size={20} className="text-emerald-600" />
              </div>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              ₹{balance.toLocaleString("en-IN")}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Current available amount
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Total Expenses</p>
              <div className="rounded-xl bg-orange-50 p-2">
                <TrendingDown size={20} className="text-orange-500" />
              </div>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              ₹{total.toLocaleString("en-IN")}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Expenses for selected month
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Total Transactions</p>
              <div className="rounded-xl bg-blue-50 p-2">
                <CalendarDays size={20} className="text-blue-600" />
              </div>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              {filteredExpenses.length}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Recorded transactions
            </p>
          </div>
        </div>

        {/* Table Section */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Expense Transactions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                View expenses and add new transactions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
              >
                <option value="All">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-slate-50">
                <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-4">Sl No.</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Items</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4 text-right">Price</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((expense, index) => (
                  <tr key={expense.id} className="hover:bg-emerald-50/40">
                    <td className="px-5 py-4 text-sm text-slate-400">
                      {index + 1}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {new Date(expense.date + "T00:00:00").toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        }
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-800">
                      {expense.item}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-semibold text-slate-800">
                      ₹{expense.price.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}

                {/* Add Expense Row */}
                <tr className="bg-slate-50/70">
                  <td className="px-5 py-3 text-sm text-slate-400">
                    <Plus size={16} />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, date: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs outline-none"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      placeholder="Item name"
                      value={newExpense.item}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, item: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={newExpense.category}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          category: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs outline-none"
                    >
                      <option value="">Select</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      placeholder="₹ Amount"
                      value={newExpense.price}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, price: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-right text-sm outline-none focus:border-emerald-500"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredExpenses.length}
              </span>{" "}
              transactions
            </div>

            <div className="flex items-center justify-between gap-6 sm:justify-end">
              <div>
                <p className="text-xs text-slate-500">Total Expenses</p>
                <p className="text-xl font-bold text-slate-900">
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>

              <button
                onClick={addExpense}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
              >
                <Plus size={16} />
                Add Expense
              </button>
            </div>
          </div>
        </section>

        {/* Balance Footer */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-emerald-600 p-5 text-white sm:flex-row">
          <div>
            <p className="text-sm text-emerald-100">Remaining Balance</p>
            <p className="mt-1 text-2xl font-bold">
              ₹{(balance - total).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-sm text-emerald-100">Total Spent</p>
            <p className="mt-1 text-2xl font-bold">
              ₹{total.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}

