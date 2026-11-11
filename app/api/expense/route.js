import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Expense from "@/models/Expense";
import Category from "@/models/Category";
import mongoose from "mongoose";
import { getAuthUser } from "@/lib/auth";

// GET - Fetch all expenses
export async function GET() {
  try {
    const auth = await getAuthUser();

    if (!auth) {
      return NextResponse.json(
        { message: "Unauthorized. Please login." },
        { status: 401 },
      );
    }

    await connectDB();

    const expenses = await Expense.find({userId: auth.userId})
      .populate("categoryId", "name icon")
      .sort({ date: -1 });

    return NextResponse.json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.error("GET expenses:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch expenses" },
      { status: 500 },
    );
  }
}

// POST - Create expense
export async function POST(request) {
  try {
    const auth = await getAuthUser();

    if (!auth) {
      return NextResponse.json(
        { message: "Unauthorized. Please login." },
        { status: 401 },
      );
    }
    await connectDB();

    const { categoryId, item, date, price } = await request.json();

    // Validate required fields
    if (!categoryId || !item?.trim() || !date || price == null) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    // Validate category ID
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { success: false, message: "Invalid category ID" },
        { status: 400 },
      );
    }

    // Check category exists
    const categoryExists = await Category.findById(categoryId);

    if (!categoryExists) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 },
      );
    }

    // Validate price
    const amount = Number(price);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Price must be greater than zero" },
        { status: 400 },
      );
    }

    // Create expense
    const expense = await Expense.create({
      categoryId,
      item: item.trim(),
      date: new Date(date),
      price: amount,
      userId: auth.userId,
    });

    const populatedExpense = await Expense.findById(expense._id).populate(
      "categoryId",
      "name icon",
    );

    return NextResponse.json(
      {
        success: true,
        message: "Expense created successfully",
        expense: populatedExpense,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST expense:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create expense" },
      { status: 500 },
    );
  }
}
