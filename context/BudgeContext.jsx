"use client";

import { createContext, useContext, useEffect, useState } from "react";

const BudgetContext = createContext(null);

export function BudgetProvider({ children }) {
  const [budget, setBudget] = useState(null);
  const [budgetLoading, setBudgetLoading] = useState(true);

  useEffect(() => {
    async function fetchBudget() {
      try {
        const res = await fetch("/api/budget/current");
        const data = await res.json();

        if (res.ok) {
          setBudget(data?.budget ?? null);
        }
      } catch (error) {
        console.error("Failed to fetch budget:", error);
      } finally {
        setBudgetLoading(false);
      }
    }

    fetchBudget();
  }, []);

  return (
    <BudgetContext.Provider value={{ budget, setBudget, budgetLoading }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);

  if (!context) {
    throw new Error("useBudget must be used inside BudgetProvider");
  }

  return context;
}
