import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Expense from "@/models/Expense";
import Budget from "@/models/Budget";
import Category from "@/models/Category";
import { getAuthUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const auth = await getAuthUser();

    if (!auth) {
      return NextResponse.json(
        { message: "Unauthorized. Please login." },
        { status: 401 },
      );
    }

    await connectDB();

    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const monthName = currentDate.toLocaleString("en-IN", {
      month: "long",
    });

    if (!year || !month || month < 1 || month > 12) {
      return NextResponse.json(
        { message: "Invalid year or month" },
        { status: 400 },
      );
    }

    // Monthly date range
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    // Fetch expenses and category names
    const expenses = await Expense.find({
      userId: auth.userId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .populate("categoryId", "name")
      .lean();

    //   console.log("EXPENSES",expenses);

    // Total expenses
    const totalExpense = expenses.reduce(
      (total, expense) => total + (Number(expense.price) || 0),
      0,
    );

    // Group expenses by category
    const categoryMap = {};

    expenses.forEach((expense) => {
      const categoryName = expense.categoryId?.name || "Others";

      if (!categoryMap[categoryName]) {
        categoryMap[categoryName] = 0;
      }

      categoryMap[categoryName] += Number(expense.price) || 0;
    });

    console.log("CATEGORYMAP", categoryMap);
    // Category summary
    const categorySummary = Object.entries(categoryMap).map(
      ([name, price]) => ({
        name,
        price,
        percentage:
          totalExpense > 0 ? Math.round((price / totalExpense) * 100) : 0,
      }),
    );

    // Fetch monthwise budget
    const monthwiseBudget = await Budget.findOne({
      year: String(year) || year,
      month: monthName,
      bType: "monthly",
      userId: auth.userId
    }).lean();

    let monthlyBudget = 0;

    if (monthwiseBudget) {
      // Priority 1: Monthwise budget
      monthlyBudget = Number(monthwiseBudget.budget) || 0;
    } else {
      // Priority 2: Sum all daywise budgets
      const daywiseBudgets = await Budget.find({
        year: String(year) || year,
        month: monthName,
        bType: "daily",
        userId: auth.userId
      }).lean();

      monthlyBudget = daywiseBudgets.reduce(
        (total, budget) => total + (Number(budget.budget) || 0),
        0,
      );
    }

    // Budget calculations
    const budgetRemaining = monthlyBudget - totalExpense;

    const budgetUsedPercentage =
      monthlyBudget > 0
        ? Math.min(100, Math.round((totalExpense / monthlyBudget) * 100))
        : 0;

    return NextResponse.json({
      success: true,
      year,
      month,
      totalExpense,
      categorySummary,
      monthlyBudget,
      budgetRemaining,
      budgetUsedPercentage,
    });
  } catch (error) {
    console.error("Monthly summary error:", error);

    return NextResponse.json(
      { message: "Failed to fetch monthly summary" },
      { status: 500 },
    );
  }
}
