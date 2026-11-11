"use client";

import { useEffect, useState } from "react";
import {
  Utensils,
  Plus,
  ArrowRight,
  MapPin,
  ShoppingBag,
  Shirt,
  Tag,
  X,
  Check,
  Heart,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const iconOptions = [
  { name: "Food", icon: Utensils },
  { name: "Travel", icon: MapPin },
  { name: "Shopping", icon: ShoppingBag },
  { name: "Clothes", icon: Shirt },
  { name: "Wishlist", icon: Heart },
  { name: "Other", icon: Tag },
];
const categoryColors = [
  "bg-emerald-50 text-emerald-700",
  "bg-blue-50 text-blue-600",
  "bg-violet-50 text-violet-600",
  "bg-amber-50 text-amber-700",
  "bg-rose-50 text-rose-600",
  "bg-cyan-50 text-cyan-700",
];

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Other");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resp = await fetch("/api/category", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await resp.json();
        console.log("data", data);
        setCategories(data?.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);
  const createCategory = async () => {
    const categoryName = name.trim();

    const resp = await fetch("/api/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: categoryName,
        icon: selectedIcon,
      }),
    });
    console.log(resp);

    setCategories((prevCategories) => [
      ...prevCategories,
      { name: categoryName, icon: selectedIcon },
    ]);

    setName("");
    setSelectedIcon("Other");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f9f8] text-slate-900">
      <div className="mx-auto max-w-[1400px] p-5 md:p-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-700">
              Workspace / Categories
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              Categories
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Organize your expenses and manage spending categories.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            <Plus size={17} />
            Add Category
          </button>
        </div>

        {/* Category Overview */}
        <div className="mb-7 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <p className="text-sm text-slate-500">Total categories</p>
            <h2 className="mt-2 text-2xl font-bold">{categories.length}</h2>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <p className="text-sm text-slate-500">Expense groups</p>
            <h2 className="mt-2 text-2xl font-bold">Personal</h2>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm text-emerald-700">Category management</p>
            <h2 className="mt-2 text-lg font-semibold text-emerald-950">
              Stay organized
            </h2>
          </div>
        </div>

        {/* Categories Section */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Your categories</h2>
              <p className="mt-1 text-sm text-slate-500">
                {categories.length} categories available
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories?.map(({ _id, name, icon }, index) => {
              const Icon =
                iconOptions.find((item) => item.name === icon)?.icon || Tag;
              const color = categoryColors[index % categoryColors.length];
              console.log("category", { _id, name, icon});

              return (
                <div
                  key={name}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className={`inline-flex rounded-xl p-3 ${color}`}>
                      <Icon size={22} />
                    </div>

                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                      ACTIVE
                    </span>
                  </div>

                  <h3 className="mt-5 text-base font-semibold">{name}</h3>

                  <Link href={`/category/${_id}`}>
                    <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100">
                      Add Expense
                      <ArrowRight size={15} />
                    </button>
                  </Link>
                </div>
              );
            })}

            {/* Add Category Card */}
            <button
              onClick={() => setShowModal(true)}
              className="flex min-h-[190px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-5 text-slate-500 transition hover:border-emerald-400 hover:bg-emerald-50/30 hover:text-emerald-700"
            >
              <div className="rounded-xl bg-slate-100 p-3 transition group-hover:bg-emerald-100">
                <Plus size={24} />
              </div>
              <span className="mt-3 text-sm font-semibold">
                Create category
              </span>
              <span className="mt-1 text-xs">Add a custom category</span>
            </button>
          </div>
        </section>

        {/* Add Category Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <div className="mb-3 inline-flex rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
                    <Sparkles size={20} />
                  </div>
                  <h2 className="text-xl font-bold">Create category</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Add a new expense category.
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <label className="mb-2 block text-sm font-medium">
                Category name
              </label>

              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createCategory()}
                placeholder="e.g. Entertainment"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
              />

              <label className="mb-3 mt-5 block text-sm font-medium">
                Select an icon
              </label>

              <div className="grid grid-cols-3 gap-2">
                {iconOptions.map(({ name: iconName, icon: Icon }) => (
                  <button
                    key={iconName}
                    onClick={() => setSelectedIcon(iconName)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-xs transition ${
                      selectedIcon === iconName
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={20} />
                    {iconName}
                  </button>
                ))}
              </div>

              <div className="mt-7 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={createCategory}
                  disabled={!name.trim()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  <Check size={16} />
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
