
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find().sort({ createdAt: -1 }).limit(4);

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("GET categories:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

