import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Expense from "@/models/Expense";
import { getAuthUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    console.log("========== EXPENSE DEBUG START ==========");

    // No connection() here
    const auth = await getAuthUser();

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    console.log("MongoDB connected");

    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type");
    const date = searchParams.get("date");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    console.log("Query params:", { type, date, month, year });

    let startDate;
    let endDate;

    if (type === "daily") {
      if (!date) {
        return NextResponse.json({ message: "Date required" }, { status: 400 });
      }

      startDate = new Date(`${date}T00:00:00.000Z`);
      endDate = new Date(`${date}T23:59:59.999Z`);
    } else if (type === "monthly") {
      if (!month || !year) {
        return NextResponse.json(
          { message: "Month and year required" },
          { status: 400 },
        );
      }

      const monthNumber = new Date(`${month} 1, ${year}`).getMonth();

      startDate = new Date(Date.UTC(Number(year), monthNumber, 1));
      endDate = new Date(Date.UTC(Number(year), monthNumber + 1, 1));
    } else {
      return NextResponse.json(
        { message: "Invalid expense type" },
        { status: 400 },
      );
    }

    console.log("Start date:", startDate);
    console.log("End date:", endDate);

    // DEBUG 1: Find all expenses for this user
    const userExpenses = await Expense.find({
      userId: auth.userId,
    }).lean();

    console.log("User expenses count:", userExpenses.length);
    console.log("User expenses:", userExpenses);

    // DEBUG 2: Check date field types and values
    userExpenses.forEach((expense) => {
      console.log({
        expenseId: expense._id,
        userId: expense.userId,
        date: expense.date,
        dateType: typeof expense.date,
        price: expense.price,
      });
    });

    // DEBUG 3: Check matching documents
    const matchedExpenses = await Expense.find({
      userId: auth.userId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).lean();

    console.log("Matched expenses count:", matchedExpenses.length);
    console.log("Matched expenses:", matchedExpenses);

    // DEBUG 4: Aggregation
    const result = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(auth.userId),
          date: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$price" },
        },
      },
    ]);

    console.log("Aggregation result:", result);
    console.log("Total expense:", result[0]?.totalExpense ?? 0);

    console.log("========== EXPENSE DEBUG END ==========");

    return NextResponse.json({
      type,
      totalExpense: result[0]?.totalExpense ?? 0,
    });
  } catch (error) {
    console.error("EXPENSE API ERROR:", error);

    return NextResponse.json(
      { message: "Failed to calculate expenses" },
      { status: 500 },
    );
  }
}
