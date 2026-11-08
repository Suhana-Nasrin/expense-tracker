"use client";

import { useState } from "react";
import {
  Plus,
  Smartphone,
  Watch,
  Heart,
  Wallet,
  X,
  Target,
  ArrowUpRight,
} from "lucide-react";

type WishlistItem = {
  id: number;
  name: string;
  amount: number;
  saved: number;
  icon: "phone" | "watch";
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([
    { id: 1, name: "IPHONE", amount: 123000, saved: 0, icon: "phone" },
    { id: 2, name: "WATCH", amount: 23000, saved: 0, icon: "watch" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [saved, setSaved] = useState("");

  const addWishlist = () => {
    if (!name.trim() || !amount) return;

    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: name.toUpperCase(),
        amount: Number(amount),
        saved: Number(saved || 0),
        icon: "phone",
      },
    ]);

    setName("");
    setAmount("");
    setSaved("");
    setShowModal(false);
  };

  const claimItem = (id: number) => {
    const item = items.find((item) => item.id === id);
    if (!item) return;

    if (item.saved >= item.amount) {
      alert(`${item.name} goal completed!`);
    } else {
      alert(`₹${(item.amount - item.saved).toLocaleString("en-IN")} remaining to reach ${item.name}`);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-emerald-600">
              Personal Finance
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Wishlist
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Save money for the things you really want.
            </p>
          </div>

         
        </div>

        {/* Summary */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Wishlist Items</span>
              <Heart className="text-pink-500" size={20} />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {items.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Total Target</span>
              <Target className="text-emerald-600" size={20} />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              ₹{items.reduce((sum, item) => sum + item.amount, 0).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Amount Saved</span>
              <Wallet className="text-blue-600" size={20} />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              ₹{items.reduce((sum, item) => sum + item.saved, 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Wishlist Grid */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Your Savings Goals
            </h2>
            <span className="text-sm text-slate-500">
              {items.length} goals
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

            {/* Add Budget Card */}
            <button
              onClick={() => setShowModal(true)}
              className="group flex min-h-[230px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6 transition hover:border-emerald-400 hover:bg-emerald-50/40"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100">
                <Plus size={34} />
              </div>
              <span className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition group-hover:bg-emerald-700">
                ADD BUDGET
              </span>
              <p className="mt-3 text-sm text-slate-400">
                Create a new savings goal
              </p>
            </button>

            {/* Wishlist Cards */}
            {items.map((item) => {
              const progress = Math.min(
                (item.saved / item.amount) * 100,
                100
              );

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      {item.icon === "watch" ? (
                        <Watch size={24} />
                      ) : (
                        <Smartphone size={24} />
                      )}
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      SAVING GOAL
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold tracking-wide text-slate-800">
                    {item.name}
                  </h3>

                  <div className="mt-3 rounded-xl bg-amber-100 px-4 py-4">
                    <p className="text-xs text-amber-800">Target Amount</p>
                    <p className="mt-1 text-xl font-bold text-slate-900">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-xs text-slate-500">
                      <span>Saved ₹{item.saved.toLocaleString("en-IN")}</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => claimItem(item.id)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    CLAIM
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Add Wishlist Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Add Wishlist
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Create a new savings target
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
                    Item Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Laptop, iPhone..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Target Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter target amount"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Already Saved (₹)
                  </label>
                  <input
                    type="number"
                    value={saved}
                    onChange={(e) => setSaved(e.target.value)}
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
                  onClick={addWishlist}
                  className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Create Goal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}