
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
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
      { status: 500 }
    );
  }
}

// POST - Create budget
export async function POST(request) {
  try {
    await connectDB();

    const { bType, budget, saving, userId } =
      await request.json();

    if (!bType || budget == null || budget === "") {
      return NextResponse.json(
        { success: false, message: "Budget type and amount are required" },
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

    const newBudget = await Budget.create({
      bType,
      budget: String(budgetAmount),
      saving: String(savingAmount),
      userId: userId || null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Budget created successfully",
        budget: newBudget,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST budget:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create budget" },
      { status: 500 }
    );
  }
}
