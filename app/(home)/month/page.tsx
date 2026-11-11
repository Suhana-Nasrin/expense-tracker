"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarDays,
  Heart,
  ReceiptText,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  X,
  Wallet,
} from "lucide-react";


const months = [
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
];

export default function MonthlyOverviewPage() {
  const [year, setYear] = useState(2026);
  const [activeSection, setActiveSection] = useState<
    "month" | "wishlist" | "other"
  >("month");

  const changeYear = (step: number) => setYear((current) => current + step);

 
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        {/* Sidebar: add this Monthly Overview item to your app's main sidebar */}

        <section className="min-w-0 flex-1 p-5 sm:p-8">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">
                Monthly overview
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Browse your budget month by month.
              </p>
            </div>
            <Link
              href="/"
              aria-label="Close and return home"
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-100"
            >
              <X size={20} />
            </Link>
          </header>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-emerald-100 p-2.5 text-emerald-800">
                <CalendarDays size={20} />
              </span>
              <div>
                <p className="text-sm text-slate-500">Selected year</p>
                <p className="text-lg font-bold">{year}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeYear(-1)}
                aria-label="Previous year"
                className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => changeYear(1)}
                aria-label="Next year"
                className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="">
            <div>
              <div className="mb-4 rounded-xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                {year}
              </div>
              {activeSection === "month" ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {months.map((month, index) => (
                    <Link
                      key={month}
                      href={`/month/${month}-${year}`}
                      className="group flex min-h-32 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                    >
                      <span className="mb-3 rounded-xl bg-slate-100 p-2.5 text-slate-600 transition group-hover:bg-emerald-100 group-hover:text-emerald-800">
                        <CalendarDays size={20} />
                      </span>
                      <span className="font-semibold">{month}</span>
                      <span className="mt-3 rounded-lg bg-gradient-to-b from-emerald-700 to-green-500 px-6 py-2 text-xs font-semibold text-white shadow-sm">
                        VIEW
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                  {activeSection === "wishlist" ? (
                    <Heart
                      className="mx-auto mb-3 text-emerald-700"
                      size={28}
                    />
                  ) : (
                    <ReceiptText
                      className="mx-auto mb-3 text-emerald-700"
                      size={28}
                    />
                  )}
                  <h2 className="text-lg font-semibold">
                    {activeSection === "wishlist"
                      ? "Wishlist"
                      : "Other expenses"}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    This section can be connected to its own page and data.
                  </p>
                  <button
                    onClick={() => setActiveSection("month")}
                    className="mt-5 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    Back to months
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
