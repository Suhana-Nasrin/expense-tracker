import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Budget from "@/models/Budget";
import {getAuthUser} from "@/lib/auth"

// GET - Fetch budgets
export async function GET(request) {
  try {
    const auth = await getAuthUser();

    if (!auth) {
      return NextResponse.json(
        { message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const bType = searchParams.get("bType");

    const filter = bType ? { bType, userId: auth.userId } : {userId: auth.userId};

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
    const auth = await getAuthUser();

    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    await connectDB();

    const {
      bType,
      budget,
      saving,
      date,
      month,
      year,
    } = await request.json();

    
    if (!["daily", "monthly"].includes(bType)) {
      return NextResponse.json(
        { success: false, message: "Invalid budget type" },
        { status: 400 }
      );
    }

    // Validate budget amount
    if (budget == null || budget === "") {
      return NextResponse.json(
        { success: false, message: "Budget amount is required" },
        { status: 400 }
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
        { status: 400 }
      );
    }

    // =========================
    // DAILY BUDGET
    // =========================
    if (bType === "daily") {
      const selectedDate = date ? new Date(date) : new Date();

      if (Number.isNaN(selectedDate.getTime())) {
        return NextResponse.json(
          { success: false, message: "Invalid date" },
          { status: 400 }
        );
      }

      // Normalize to UTC day boundaries
      const startOfDay = new Date(selectedDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const selectedMonth = startOfDay.toLocaleString("en-US", {
        month: "long",
        timeZone: "UTC",
      });

      const selectedYear = String(startOfDay.getUTCFullYear());

      // Check if monthly budget exists for this month
      const monthlyBudgetExists = await Budget.findOne({
        userId: auth.userId,
        bType: "monthly",
        month: selectedMonth,
        year: selectedYear,
      });

      if (monthlyBudgetExists) {
        return NextResponse.json(
          {
            success: false,
            message: `Cannot create daily budget because monthly budget already exists for ${selectedMonth} ${selectedYear}`,
          },
          { status: 409 }
        );
      }

      // Check duplicate daily budget for same date
      const existingBudget = await Budget.findOne({
        userId: auth.userId,
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
          { status: 409 }
        );
      }

      // Create daily budget
      const newBudget = await Budget.create({
        bType: "daily",
        userId: auth.userId,
        budget: String(budgetAmount),
        saving: String(savingAmount),
        date: startOfDay,
        month: selectedMonth,
        year: selectedYear,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Daily budget created successfully",
          budget: newBudget,
        },
        { status: 201 }
      );
    }

    // =========================
    // MONTHLY BUDGET
    // =========================
    if (bType === "monthly") {
      const selectedMonth =
        month || new Date().toLocaleString("en-US", {
          month: "long",
        });

      const selectedYear = String(
        year || new Date().getFullYear()
      );

      // Check if any daily budget exists for this month
      const dailyBudgetExists = await Budget.findOne({
        userId: auth.userId,
        bType: "daily",
        month: selectedMonth,
        year: selectedYear,
      });

      if (dailyBudgetExists) {
        return NextResponse.json(
          {
            success: false,
            message: `Cannot create monthly budget because daily budgets already exist for ${selectedMonth} ${selectedYear}`,
          },
          { status: 409 }
        );
      }

      // Check duplicate monthly budget
      const existingBudget = await Budget.findOne({
        userId: auth.userId,
        bType: "monthly",
        month: selectedMonth,
        year: selectedYear,
      });

      if (existingBudget) {
        return NextResponse.json(
          {
            success: false,
            message: `Monthly budget already exists for ${selectedMonth} ${selectedYear}`,
            budget: existingBudget,
          },
          { status: 409 }
        );
      }

      // Create monthly budget
      const newBudget = await Budget.create({
        bType: "monthly",
        userId: auth.userId,
        budget: String(budgetAmount),
        saving: String(savingAmount),
        month: selectedMonth,
        year: selectedYear,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Monthly budget created successfully",
          budget: newBudget,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("POST budget:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create budget" },
      { status: 500 }
    );
  }
}
