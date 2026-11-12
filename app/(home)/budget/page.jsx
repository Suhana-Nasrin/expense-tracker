"use client";

import { useEffect, useState } from "react";
import {
  Clock3,
  CalendarDays,
  Wallet,
  ArrowLeft,
  Check,
  IndianRupee,
  Calendar,
} from "lucide-react";
import { useBudget } from "@/context/BudgeContext";

export default function BudgetOptionsPage() {
  const { setBudget, budget } = useBudget();

  const [period, setPeriod] = useState(null);
  const [amount, setAmount] = useState("");
  const [saved, setSaved] = useState(false);
  const [savingAmount, setSavingAmount] = useState("");
  const [alreadySaved, setAlreadySaved] = useState(false);
  const [edit, setEdit] = useState(false);
  const [year, setYear] = useState("");
  const [budgetId, setBudgetId] = useState("");

  const choosePeriod = (value) => {
    setPeriod(value);
    setSaved(false);
  };
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const now = new Date();

    setMonth(now.toLocaleString("en-US", { month: "long" }));

    setDate(now.toISOString().split("T")[0]);
  }, []);
  useEffect(() => {
    const fetchCurrentBudget = async () => {
      try {
        const res = await fetch("/api/budget/current", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        console.log("current budget data", data?.budget);
        if (data?.budget) {
          setPeriod(data.budget.bType);
          setAmount(data.budget.budget);
          setSavingAmount(data.budget.saving);
          setMonth(data.budget.month || "");
          setDate(new Date(data.budget.date).toISOString().split("T")[0]);
          setYear(data?.budget?.year);
          setBudgetId(data.budget._id);
          setAlreadySaved(true);
        }
      } catch (error) {
        console.error("Error fetching current budget:", error);
      }
    };

    fetchCurrentBudget();
  }, []);
  console.log(date, month, year);

  const saveBudget = async () => {
    if (!amount || Number(amount) <= 0) return;

    try {
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bType: period,
          budget: String(amount),
          saving: String(savingAmount || 0),
          date: date,
          month: month,
        }),
      });

      const data = await res.json();
      setBudget(data?.budget);

      if (!res.ok) {
        throw new Error(data.message || "Failed to save budget");
      }

      setAlreadySaved(true);
    } catch (error) {
      console.error("Budget saving error:", error);
    }
  };

  const editBudget = async () => {
    const res = await fetch("/api/budget/current", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        budgetId: budgetId,
        bType: period,
        budget: amount,
        saving: savingAmount,
        date,
        month,
        year,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);

      return;
    }
    setBudget(data?.budget);
    setEdit(false);
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
            <IndianRupee size={16} /> {amount || "0"}
          </div>
        </header>

        {alreadySaved && !edit ? (
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Budget Already Created
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your budget has been saved successfully.
                </p>
              </div>
              <button
                onClick={() => setEdit(!edit)}
                className="flex items-center gap-2 rounded-xl border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
              >
                {edit ? "Cancel" : "Edit"}
              </button>

              {/* <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                Saved
              </span> */}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Budget Type</p>
                <p className="mt-1 font-semibold capitalize text-slate-900">
                  {period}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  {period === "daily" ? "Date" : "Month"}
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {period === "daily"
                    ? new Date(date).toLocaleDateString()
                    : `${month} ${year}`}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-sm text-emerald-700">Total Budget</p>
                <p className="mt-1 text-xl font-bold text-emerald-800">
                  ₹{amount}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-sm text-blue-700">Savings</p>
                <p className="mt-1 text-xl font-bold text-blue-800">
                  ₹{savingAmount}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Your existing budget creation form
          <div>
            <section className="mb-8">
              <p className="mb-2 text-sm font-medium text-emerald-700">
                STEP 01 · CHOOSE A PERIOD
              </p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                How do you want to budget?
              </h2>
              <p className="mt-2 max-w-xl text-slate-500">
                Set a daily limit for everyday spending or plan your entire
                month.
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
            {period && period === "monthly" && (
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
                        placeholder={"e.g. 500"}
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

                    <div>
                      <label
                        htmlFor="month"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Month
                      </label>

                      <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50">
                        <Calendar size={18} className="text-slate-400" />

                        <select
                          id="month"
                          value={month}
                          onChange={(e) => setMonth(e.target.value)}
                          className="w-full bg-transparent py-3 outline-none"
                        >
                          <option value="">Select month</option>
                          {[
                            "January",
                            "February",
                            "March",
                            "April",
                            "May",
                            "June",
                            "July",
                            "August",
                            "September",
                            "October",
                            "November",
                            "December",
                          ].map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={edit ? editBudget : saveBudget}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  <Check size={17} /> {edit ? "Edit budget" : "Save budget"}
                </button>
                {saved && (
                  <p className="mt-3 text-sm font-medium text-emerald-700">
                    Budget saved in this preview. Connect your API to persist
                    it.
                  </p>
                )}
              </section>
            )}
            {period && period === "daily" && (
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
                        placeholder={"e.g. 500"}
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

                    <div>
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Date
                      </label>

                      <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50">
                        <Calendar size={18} className="text-slate-400" />

                        <input
                          id="date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-transparent py-3 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={edit ? editBudget : saveBudget}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  <Check size={17} /> {edit ? "Edit budget" : "Save budget"}
                </button>
                {saved && (
                  <p className="mt-3 text-sm font-medium text-emerald-700">
                    Budget saved in this preview. Connect your API to persist
                    it.
                  </p>
                )}
              </section>
            )}
          </div>
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
