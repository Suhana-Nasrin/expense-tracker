"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Leaf,
  TrendingUp,
} from "lucide-react";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* Left Side */}
      <section className="relative hidden overflow-hidden bg-emerald-50 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="relative z-10 max-w-xl">
          <h2 className="text-5xl font-bold leading-tight tracking-tight text-slate-900">
            Manage Your
            <br />
            Expenses Smartly
          </h2>

          <p className="mt-6 max-w-md text-lg leading-8 text-slate-600">
            Track your spending, set budgets, and achieve your financial goals.
          </p>

          <div className="mt-12 flex h-64 items-center justify-center rounded-3xl bg-emerald-100/70">
            <div className="flex items-center gap-6">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <TrendingUp size={70} className="text-emerald-600" />
              </div>
              <div className="space-y-3">
                <div className="h-3 w-32 rounded-full bg-emerald-300" />
                <div className="h-3 w-24 rounded-full bg-emerald-200" />
                <div className="h-3 w-40 rounded-full bg-emerald-300" />
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-emerald-700">
          Your money. Your goals. Your future.
        </p>

        <Leaf className="absolute -bottom-16 -left-16 h-64 w-64 text-emerald-200/50" />
      </section>

      {/* Right Side */}
      <section className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-10 flex items-center justify-center gap-2 lg:hidden">
            <Wallet className="text-emerald-600" size={28} />
            <span className="text-xl font-bold text-slate-900">
              Food Budget
            </span>
          </div>

          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
              Sign In
            </h2>
            <p className="mt-4 text-slate-500">
              Welcome back! Please sign in to your account.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Connect your login API here
            }}
            className="space-y-5"
          >
            {/* Email */}
            <div className="relative">
              <Mail
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                required
                placeholder="Email address"
                className="w-full rounded-xl border border-slate-200 py-4 pl-12 pr-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                className="w-full rounded-xl border border-slate-200 py-4 pl-12 pr-12 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 py-4 font-semibold text-white transition hover:bg-emerald-700"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm text-slate-500">Or continue with</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 py-3.5 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <span className="font-bold text-blue-600">G</span>
              Continue with Google
            </button>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 py-3.5 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <span className="font-bold text-slate-900">GitHub</span>
              Continue with GitHub
            </button>
          </div>

          {/* Signup */}
          <p className="mt-10 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
