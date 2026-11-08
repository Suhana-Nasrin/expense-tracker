"use client";

import { useState } from "react";
import {
  Plus,
  Wallet,
  CalendarDays,
  X,
  ArrowUpRight,
  PartyPopper,
} from "lucide-react";

type EventBudget = {
  id: number;
  name: string;
  target: number;
  allocated: number;
};

export default function OtherExpensePage() {
  const [balance, setBalance] = useState(23000);

  const [events, setEvents] = useState<EventBudget[]>([
    {
      id: 1,
      name: "AN OPERATION IN NEXT MONTH",
      target: 100000,
      allocated: 23000,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [target, setTarget] = useState("");
  const [allocated, setAllocated] = useState("");

  const addEvent = () => {
    if (!eventName.trim() || !target) return;

    setEvents((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: eventName.toUpperCase(),
        target: Number(target),
        allocated: Number(allocated || 0),
      },
    ]);

    setEventName("");
    setTarget("");
    setAllocated("");
    setShowModal(false);
  };

  const updateAllocated = (id: number, amount: number) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? { ...event, allocated: amount }
          : event
      )
    );
  };

  const totalAllocated = events.reduce(
    (sum, event) => sum + event.allocated,
    0
  );

  const totalTarget = events.reduce(
    (sum, event) => sum + event.target,
    0
  );

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-emerald-600">
              Financial Planning
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Other Expense
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Plan your upcoming events and special expenses.
            </p>
          </div>

          {/* Balance */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="rounded-xl bg-amber-100 p-3">
              <Wallet className="text-amber-600" size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Available Balance</p>
              <p className="text-xl font-bold text-slate-900">
                ₹{balance.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </header>

        {/* Summary */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Upcoming Events</p>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {events.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Total Event Budget</p>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              ₹{totalTarget.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Total Allocated</p>
            <p className="mt-3 text-2xl font-bold text-emerald-600">
              ₹{totalAllocated.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Event Budget Cards */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Upcoming Events
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage your future financial commitments.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

            {/* Existing Event Cards */}
            {events.map((event) => {
              const progress = Math.min(
                (event.allocated / event.target) * 100,
                100
              );

              return (
                <div
                  key={event.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <PartyPopper size={24} />
                    </div>

                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                      UPCOMING
                    </span>
                  </div>

                  <h3 className="min-h-10 text-sm font-semibold leading-5 text-slate-800">
                    {event.name}
                  </h3>

                  {/* Target Budget */}
                  <div className="mt-4 rounded-xl bg-emerald-50 p-4">
                    <p className="text-xs text-emerald-700">
                      Target Budget
                    </p>
                    <p className="mt-1 text-xl font-bold text-slate-900">
                      ₹{event.target.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Allocated Amount */}
                  <div className="mt-3 rounded-xl bg-emerald-600 p-4 text-white">
                    <p className="text-xs text-emerald-100">
                      Allocated Amount
                    </p>
                    <p className="mt-1 text-xl font-bold">
                      ₹{event.allocated.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-xs text-slate-500">
                      <span>Budget Progress</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Update Allocation */}
                  <button
                    onClick={() => {
                      const amount = prompt(
                        "Enter allocated amount:",
                        String(event.allocated)
                      );
                      if (amount !== null && !isNaN(Number(amount))) {
                        updateAllocated(event.id, Number(amount));
                      }
                    }}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                  >
                    Update Budget
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              );
            })}

            {/* Add Event Card */}
            <button
              onClick={() => setShowModal(true)}
              className="group flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6 transition hover:border-emerald-400 hover:bg-emerald-50/30"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 transition group-hover:bg-emerald-100 group-hover:text-emerald-600">
                <Plus size={36} />
              </div>

              <p className="text-sm font-semibold text-slate-800">
                ADD EVENT
              </p>

              <span className="mt-4 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition group-hover:bg-emerald-700">
                ADD BUDGET
              </span>

              <p className="mt-3 text-sm text-slate-400">
                Create a new event budget
              </p>
            </button>
          </div>
        </section>

        {/* Add Event Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Add Event Budget
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Create a budget for an upcoming event.
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Event Name
                  </label>
                  <input
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. Wedding, Trip, Festival"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Target Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Enter target amount"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Allocated Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={allocated}
                    onChange={(e) => setAllocated(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={addEvent}
                  className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Create Budget
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}