"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useBudget } from "@/context/BudgeContext";

const ExpenseContext = createContext(null);

export function ExpenseProvider({ children }) {
  const { budget, loading: budgetLoading } = useBudget();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (budgetLoading) return;

    if (!budget) {
      setExpense(null);
      setLoading(false);
      return;
    }

    async function fetchExpense() {
      setLoading(true);

      try {
        const params = new URLSearchParams();

        params.set("type", budget.bType);

        if (budget.bType === "daily") {
          params.set(
            "date",
            new Date(budget.date).toISOString().split("T")[0]
          );
        }

        if (budget.bType === "monthly") {
          params.set("month", budget.month);
          params.set("year", budget.year);
        }

        const res = await fetch(
          `/api/expense/current?${params.toString()}`
        );

        const data = await res.json();

        if (res.ok) {
          setExpense(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchExpense();
  }, [budget, budgetLoading]);

  return (
    <ExpenseContext.Provider
      value={{ expense, setExpense, loading }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  return useContext(ExpenseContext);
}