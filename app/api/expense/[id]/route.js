import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Expense from "@/models/Expense";
import Category from "@/models/Category";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate category ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid category ID" },
        { status: 400 }
      );
    }

    const category = await Category.findById(id);
    // Fetch expenses belonging to this category
    const expenses = await Expense.find({
      categoryId: id,
    })
      .populate("categoryId", "name icon")
      .sort({ date: -1 });

    return NextResponse.json({
      success: true,
      expenses,
      category,
    });
  } catch (error) {
    console.error("GET category expenses:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch category expenses" },
      { status: 500 }
    );
  }
}
