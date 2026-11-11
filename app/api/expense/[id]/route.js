import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Expense from "@/models/Expense";
import Category from "@/models/Category";
import mongoose from "mongoose";
import {getAuthUser} from "@/lib/auth"

export async function GET(request, { params }) {
  try {
    const auth = await getAuthUser();

    if (!auth) {
      return NextResponse.json(
        { message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

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
    const expenses = await Expense.find({
      categoryId: id,
      userId: auth.userId
    })
      .populate("categoryId", "name icon")
      .sort({ date: -1 });

    return NextResponse.json({
      success: true,
      expenses,
      category,
    });
  } catch (error) {
   

    return NextResponse.json(
      { success: false, message: "Failed to fetch category expenses" },
      { status: 500 }
    );
  }
}
