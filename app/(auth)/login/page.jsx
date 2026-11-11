"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // JWT cookie is automatically set by the API
      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-white">
      {/* LEFT SECTION */}
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-emerald-50 p-12 lg:flex">
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold leading-tight text-slate-900">
            Your money.
            <br />
            Your control.
            <br />
            Your future.
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Manage your daily expenses, plan budgets, and achieve your financial
            goals effortlessly.
          </p>

          <div className="mt-12 rounded-3xl border border-emerald-100 bg-white/70 p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Monthly Savings</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  ₹12,500
                </h3>
              </div>

              <div className="rounded-2xl bg-emerald-100 p-4 text-emerald-600">
                <TrendingUp size={30} />
              </div>
            </div>

            <div className="mt-6 flex h-24 items-end gap-3">
              {[35, 55, 45, 75, 60, 90, 70].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-lg bg-emerald-500/80"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm text-emerald-700">
          Simplify your finances. Start saving smarter.
        </p>
      </section>

      {/* RIGHT SECTION */}
      <section className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link
            href="/"
            className="mb-10 flex items-center justify-center gap-2 lg:hidden"
          >
            <Wallet className="text-emerald-600" size={26} />
            <span className="text-xl font-bold text-slate-900">
              Food Budget
            </span>
          </Link>

          <div className="mb-10">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
              Welcome back!
            </h2>
            <p className="mt-3 text-slate-500">
              Enter your details to access your account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 py-4 pl-12 pr-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 py-4 pl-12 pr-12 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}
            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

       

          {/* Signup */}
          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/sign"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Create account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
