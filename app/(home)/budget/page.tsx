"use client";

import { useState } from "react";
import {
  Clock3,
  CalendarDays,
  Wallet,
  ArrowLeft,
  Check,
  IndianRupee,
} from "lucide-react";

type BudgetPeriod = "daily" | "monthly";

export default function BudgetOptionsPage() {
  const [period, setPeriod] = useState<BudgetPeriod | null>(null);
  const [amount, setAmount] = useState("");
  const [saved, setSaved] = useState(false);
  const [savingAmount, setSavingAmount] = useState("");

  const choosePeriod = (value: BudgetPeriod) => {
    setPeriod(value);
    setSaved(false);
  };

 const saveBudget = async () => {
  if (!amount || Number(amount) <= 0) return;

  try {
    const res = await fetch("/api/budgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bType: "monthly",
        budget: String(amount),
        saving: "0",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to save budget");
    }

    setSaved(true);
  } catch (error) {
    console.error("Budget saving error:", error);
  }
};
  return (
    <main className="min-h-screen bg-[#f7f8f6] px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
              <Wallet size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                Budget planning
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
            <IndianRupee size={16} /> 23,000
          </div>
        </header>

        <section className="mb-8">
          <p className="mb-2 text-sm font-medium text-emerald-700">
            STEP 01 · CHOOSE A PERIOD
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            How do you want to budget?
          </h2>
          <p className="mt-2 max-w-xl text-slate-500">
            Set a daily limit for everyday spending or plan your entire month.
          </p>
        </section>

        {/* Period choices */}
        <div className="grid gap-5 md:grid-cols-2">
          <button
            onClick={() => choosePeriod("daily")}
            className={`group rounded-3xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-8 ${period === "daily" ? "border-emerald-500 ring-2 ring-emerald-100" : "border-slate-200"}`}
          >
            <div className="mb-8 flex items-start justify-between">
              <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-700 transition group-hover:bg-emerald-100">
                <Clock3 size={30} />
              </div>
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border ${period === "daily" ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 text-transparent"}`}
              >
                <Check size={14} />
              </span>
            </div>
            <h3 className="text-xl font-semibold">Daily budget</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Keep your daily expenses under control with a simple spending
              limit.
            </p>
            <div className="mt-7 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-500">Best for</span>
              <span className="text-sm font-medium">Everyday tracking</span>
            </div>
          </button>

          <button
            onClick={() => choosePeriod("monthly")}
            className={`group rounded-3xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-8 ${period === "monthly" ? "border-emerald-500 ring-2 ring-emerald-100" : "border-slate-200"}`}
          >
            <div className="mb-8 flex items-start justify-between">
              <div className="rounded-2xl bg-blue-50 p-4 text-blue-700 transition group-hover:bg-blue-100">
                <CalendarDays size={30} />
              </div>
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border ${period === "monthly" ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 text-transparent"}`}
              >
                <Check size={14} />
              </span>
            </div>
            <h3 className="text-xl font-semibold">Monthly budget</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Plan ahead, set a monthly spending goal, and monitor your
              progress.
            </p>
            <div className="mt-7 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-500">Best for</span>
              <span className="text-sm font-medium">Monthly planning</span>
            </div>
          </button>
        </div>

        {/* Budget form */}
        {period && (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium text-emerald-700">
              STEP 02 · SET YOUR LIMIT
            </p>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Budget */}
              <div>
                <label
                  htmlFor="budget"
                  className="block text-sm font-medium text-slate-700"
                >
                  Budget amount (₹)
                </label>

                <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50">
                  <IndianRupee size={18} className="text-slate-400" />

                  <input
                    id="budget"
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={period === "daily" ? "e.g. 500" : "e.g. 15000"}
                    className="w-full py-3 outline-none"
                  />
                </div>
              </div>

              {/* Saving */}
              <div>
                <label
                  htmlFor="saving"
                  className="block text-sm font-medium text-slate-700"
                >
                  Saving amount (₹)
                </label>

                <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50">
                  <IndianRupee size={18} className="text-slate-400" />

                  <input
                    id="saving"
                    type="number"
                    min="0"
                    value={savingAmount}
                    onChange={(e) => setSavingAmount(e.target.value)}
                    placeholder="e.g. 2000"
                    className="w-full py-3 outline-none"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={saveBudget}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              <Check size={17} /> Save budget
            </button>
            {saved && (
              <p className="mt-3 text-sm font-medium text-emerald-700">
                Budget saved in this preview. Connect your API to persist it.
              </p>
            )}
          </section>
        )}

        <footer className="mt-8 flex items-center justify-between text-sm text-slate-500">
          <button className="inline-flex items-center gap-2 hover:text-slate-900">
            <ArrowLeft size={16} /> Back to dashboard
          </button>
          <span>Food Budget · Budget setup</span>
        </footer>
      </div>
    </main>
  );
}
