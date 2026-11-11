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

    const { searchParams } = new URL(request.url);

    const year = Number(searchParams.get("year"));
    const monthName = searchParams.get("month");
    const month = new Date(`${monthName} 1, 2000`).getMonth() + 1;

    if (!year || !month || month < 1 || month > 12) {
      return NextResponse.json(
        { message: "Invalid year or month" },
        { status: 400 },
      );
    }

    // Start and end dates of selected month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const expenses = await Expense.find({
      userId: auth.userId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .populate("categoryId", "name")
      .sort({ date: -1 });

    // Calculate total expense
    const totalExpense = expenses.reduce(
      (total, expense) => total + expense.price,
      0,
    );

    // Fetch budgets for selected month

    const budgets = await Budget.find({
      userId: auth.userId,
      year: String(year) || year,
      month: monthName,
    });

    const monthwiseBudget = budgets.find(
      (budget) => budget.bType === "monthly",
    );

    const daywiseBudgets = budgets.filter((budget) => budget.bType === "daily");

    return NextResponse.json({
      year,
      month,
      expenses,
      totalExpense,
      monthwiseBudget: monthwiseBudget || null,
      daywiseBudgets,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch monthly report" },
      { status: 500 },
    );
  }
}
