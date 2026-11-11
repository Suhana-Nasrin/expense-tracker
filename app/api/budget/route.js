import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Budget from "@/models/Budget";

// GET - Fetch budgets
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const bType = searchParams.get("bType");

    const filter = bType ? { bType } : {};

    const budgets = await Budget.find(filter).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      budgets,
    });
  } catch (error) {
    console.error("GET budgets:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch budgets" },
      { status: 500 },
    );
  }
}

// POST - Create budget
export async function POST(request) {
  try {
    await connectDB();

    const { bType, budget, saving, userId, date, month } = await request.json();

    if (!["daily", "monthly"].includes(bType)) {
      return NextResponse.json(
        { success: false, message: "Invalid budget type" },
        { status: 400 },
      );
    }

    if (budget == null || budget === "") {
      return NextResponse.json(
        { success: false, message: "Budget amount is required" },
        { status: 400 },
      );
    }

    const budgetAmount = Number(budget);
    const savingAmount = Number(saving ?? 0);

    if (
      !Number.isFinite(budgetAmount) ||
      budgetAmount <= 0 ||
      !Number.isFinite(savingAmount) ||
      savingAmount < 0
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid budget or saving amount" },
        { status: 400 },
      );
    }

    const ownerId = userId || null;

    // DAILY BUDGET
    if (bType === "daily") {
      const selectedDate = date ? new Date(date) : new Date();

      if (Number.isNaN(selectedDate.getTime())) {
        return NextResponse.json(
          { success: false, message: "Invalid date" },
          { status: 400 },
        );
      }

      // Normalize to UTC day boundaries
      const startOfDay = new Date(selectedDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const existingBudget = await Budget.findOne({
        userId: ownerId,
        bType: "daily",
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });

      if (existingBudget) {
        return NextResponse.json(
          {
            success: false,
            message: "Daily budget already exists for this date",
            budget: existingBudget,
          },
          { status: 409 },
        );
      }

      const newBudget = await Budget.create({
        bType,
        budget: String(budgetAmount),
        saving: String(savingAmount),
        userId: ownerId,
        date: startOfDay,
        month: selectedDate.toLocaleString("en-US", {
          month: "long",
          timeZone: "UTC",
        }),
        year: String(selectedDate.getUTCFullYear()),
      });

      return NextResponse.json(
        {
          success: true,
          message: "Daily budget created successfully",
          budget: newBudget,
        },
        { status: 201 },
      );
    }

    // MONTHLY BUDGET
    if (bType === "monthly") {
      const selectedMonth =
        month || new Date().toLocaleString("en-US", { month: "long" });

      const selectedYear = new Date().getFullYear().toString();

      const existingBudget = await Budget.findOne({
        userId: ownerId,
        bType: "monthly",
        month: selectedMonth,
        year: selectedYear,
      });

      if (existingBudget) {
        return NextResponse.json(
          {
            success: false,
            message: "Monthly budget already exists for this month",
            budget: existingBudget,
          },
          { status: 409 },
        );
      }

      const budgetData = {
        bType,
        budget: String(budgetAmount),
        saving: String(savingAmount),
        userId: ownerId,
      };

      if (bType === "daily") {
        const selectedDate = new Date(date);

        budgetData.date = selectedDate;
        budgetData.month = selectedDate.toLocaleString("en-US", {
          month: "long",
          timeZone: "UTC",
        });
        budgetData.year = String(selectedDate.getUTCFullYear());
      }

      if (bType === "monthly") {
        budgetData.month = month; // from request body
        budgetData.year = year; // from request body
      }

      const newBudget = await Budget.create(budgetData);
      return NextResponse.json(
        {
          success: true,
          message: "Monthly budget created successfully",
          budget: newBudget,
        },
        { status: 201 },
      );
    }
  } catch (error) {
    console.error("POST budget:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create budget" },
      { status: 500 },
    );
  }
}
