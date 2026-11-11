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
  User,
} from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      setSuccess("Account created successfully!");

      window.location.href = "/";
    } catch (error) {
      console.error("Signup error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">

      {/* Left Side */}
      <section className="relative hidden overflow-hidden bg-emerald-50 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="relative z-10 max-w-xl">
          <h2 className="text-5xl font-bold leading-tight tracking-tight text-slate-900">
            Start Your
            <br />
            Financial Journey
          </h2>

          <p className="mt-6 max-w-md text-lg leading-8 text-slate-600">
            Take control of your money. Track expenses, manage budgets, and
            build better financial habits.
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

        <p className="relative z-10 text-sm text-emerald-700">
          Your money. Your goals. Your future.
        </p>

        <Leaf className="absolute -bottom-16 -left-16 h-64 w-64 text-emerald-200/50" />
      </section>

      {/* Right Side */}
      <section className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <Wallet className="text-emerald-600" size={28} />
            <span className="text-xl font-bold text-slate-900">
              Food Budget
            </span>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
              Create Account
            </h2>

            <p className="mt-4 text-slate-500">
              Sign up to start managing your expenses.
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">

            {/* Name */}
            <div className="relative">
              <User
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Full name"
                className="w-full rounded-xl border border-slate-200 py-4 pl-12 pr-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Password (min. 8 characters)"
                className="w-full rounded-xl border border-slate-200 py-4 pl-12 pr-12 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Confirm password"
                className="w-full rounded-xl border border-slate-200 py-4 pl-12 pr-12 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Success */}
            {success && (
              <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-600">
                {success}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-4 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {/* Login */}
          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Sign In
            </Link>
          </p>

        </div>
      </section>
    </main>
  );
}