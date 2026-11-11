"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Utensils,
  Plus,
  Wallet,
  CalendarDays,
  Trash2,
  ArrowLeft,
  Search,
  Receipt,
  PiggyBank
} from "lucide-react";
import { useParams } from "next/navigation";
import { MapPin, ShoppingBag, Shirt, Heart, Tag } from "lucide-react";
import Link from "next/link";
import { useBudget } from "@/context/BudgeContext";
import { useExpense } from "@/context/ExpenseContext";



const inr = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function FoodCategoryPage() {
  const params = useParams();

  const { expense } = useExpense();
  const {budget} = useBudget();

  const categoryId = params.id ;
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(`/api/expense/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        const data = await response.json();

        console.log("Expenses:", data.expenses);

        setItems(data.expenses || []);
        setCategory(data?.category || null);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    if (id) {
      fetchExpenses();
    }
  }, [id]);

  const total = useMemo(
    () => items.reduce((sum, row) => sum + row.price, 0),
    [items],
  );
  const filtered = items.filter((row) =>
    row.item.toLowerCase().includes(query.toLowerCase()),
  );

  const addItem = async (e) => {
    try {
      e.preventDefault();
      if (!itemName.trim() || Number(price) <= 0) return;
      const response = await fetch("/api/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId,
          date,
          item: itemName.trim(),
          price: Number(price),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }
      setItems((current) => [
        ...current,
        { id: Date.now(), date, item: itemName.trim(), price: Number(price) },
      ]);

      setItemName("");
      setPrice("");
      setShowForm(false);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };
  const iconOptions = [
    { name: "Food", icon: Utensils },
    { name: "Travel", icon: MapPin },
    { name: "Shopping", icon: ShoppingBag },
    { name: "Clothes", icon: Shirt },
    { name: "Wishlist", icon: Heart },
    { name: "Other", icon: Tag },
  ];

  const categoryIconName = category?.icon;
  const CategoryIcon =
    iconOptions.find((item) => item.name === categoryIconName)?.icon || Tag;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Top bar */}

        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
              <CategoryIcon size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {category?.name} expenses
              </h1>

              <p className="mt-1 text-sm text-slate-500 capitalize">
                {budget?.bType} budget
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Available Budget */}
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-100 px-4 py-3 text-emerald-900">
              <Wallet size={18} />
              <div>
                <p className="text-xs font-medium">Available Budget</p>
                <p className="font-semibold">{inr(Number(budget?.budget) - (Number(expense?.totalExpense) ||0 ))}</p>
              </div>
            </div>

            {/* Savings */}
            <div className="flex items-center gap-2 rounded-2xl bg-blue-100 px-4 py-3 text-blue-900">
              <PiggyBank size={18} />
              <div>
                <p className="text-xs font-medium">Savings Available</p>
                <p className="font-semibold">{inr(budget?.saving)}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Category heading */}
        <section className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/category">
              <button className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-700">
                <ArrowLeft size={16} /> All categories
              </button>
            </Link>

            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
                <CategoryIcon size={22} />
              </span>
              <h2 className="text-2xl font-bold">{category?.name}</h2>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Keep track of your meals and daily food spending.
            </p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            <Plus size={17} /> Add expense
          </button>
        </section>

        {/* Add expense form */}
        {showForm && (
          <form
            onSubmit={addItem}
            className="mb-6 grid gap-3 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm sm:grid-cols-4"
          >
            <label className="text-sm font-medium">
              Item
              <input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Lunch"
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                required
              />
            </label>
            <label className="text-sm font-medium">
              Date
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                required
              />
            </label>
            <label className="text-sm font-medium">
              Price (₹)
              <input
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="100"
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                required
              />
            </label>
            <button className="self-end rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
              Save expense
            </button>
          </form>
        )}

        {/* Expense table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
            <div>
              <h3 className="font-semibold">Expense list</h3>
              <p className="mt-1 text-xs text-slate-500">
                Your food transactions
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search items..."
                className="w-36 text-sm outline-none"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">#</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Item</th>
                  <th className="px-5 py-4 text-right font-semibold">Price</th>
                  <th className="px-5 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, index) => (
                  <tr
                    key={row._id}
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 text-slate-400">{index + 1}</td>
                    <td className="px-5 py-4 text-slate-600">
                      {new Date(row?.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="rounded-lg bg-amber-50 p-2 text-amber-700">
                          <Receipt size={16} />
                        </span>
                        <span className="font-medium">{row.item}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold">
                      {inr(row.price)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() =>
                          setItems((current) =>
                            current.filter((item) => item._id !== row._id),
                          )
                        }
                        aria-label="Delete expense"
                        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      No food expenses found. Add your first expense.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="border-t border-slate-200 bg-slate-50">
                <tr>
                  <td colSpan={3} className="px-5 py-4 font-semibold">
                    TOTAL
                  </td>
                  <td className="px-5 py-4 text-right text-base font-bold text-emerald-800">
                    {inr(total)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
        <p className="mt-4 text-xs text-slate-400">
          Prototype data only · Connect your API to persist expenses.
        </p>
      </div>
    </main>
  );
}
