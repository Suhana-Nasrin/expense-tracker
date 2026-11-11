import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Expense from "@/models/Expense";
import Category from "@/models/Category";
import {getAuthUser} from "@/lib/auth"

export async function GET() {
  try {
    const auth = await getAuthUser();

    if (!auth) {
      return NextResponse.json(
        { message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    await connectDB();

    const expenses = await Expense.find({userId: auth.userId})
      .populate("categoryId", "name")
      .sort({ date: -1, createdAt: -1 })
      .limit(3)
      .lean();

    return NextResponse.json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.error("Recent expenses error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch recent expenses" },
      { status: 500 },
    );
  }
}