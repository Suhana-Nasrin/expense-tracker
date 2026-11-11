import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Budget from "@/models/Budget";
import {getAuthUser} from "@/lib/auth"

export async function GET() {
  try {
    await connectDB();

    const auth = await getAuthUser();

    if (!auth) {
      return NextResponse.json(
        { message: "Unauthorized. Please login." },
        { status: 401 },
      );
    }

    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const month = now.toLocaleString("en-US", {
      month: "long",
    });

    const year = String(now.getFullYear());

    // Find today's daily budget OR current monthly budget
    const budget = await Budget.findOne({
      userId: auth.userId,
      $or: [
        {
          bType: "daily",
          date: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
        {
          bType: "monthly",
          month,
          year,
        },
      ],
    });

    return NextResponse.json({ budget });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch budget" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const auth = await getAuthUser();

    if (!auth) {
      return NextResponse.json(
        { message: "Unauthorized. Please login." },
        { status: 401 },
      );
    }
    await connectDB();

    const { budgetId, bType, budget, saving, date, month } =
      await request.json();

    const year = String(new Date().getFullYear());
    if (!budgetId) {
      return NextResponse.json(
        { success: false, message: "Budget ID is required" },
        { status: 400 },
      );
    }

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

    const existingBudget = await Budget.findOne({
      _id: budgetId,
      userId: auth.userId,
    });

    if (!existingBudget) {
      return NextResponse.json(
        { success: false, message: "Budget not found" },
        { status: 404 },
      );
    }

    const updateData = {
      bType,
      budget: String(budgetAmount),
      saving: String(savingAmount),
    };

    if (bType === "daily") {
      if (!date) {
        return NextResponse.json(
          { success: false, message: "Date is required" },
          { status: 400 },
        );
      }

      const selectedDate = new Date(`${date}T00:00:00.000Z`);

      if (Number.isNaN(selectedDate.getTime())) {
        return NextResponse.json(
          { success: false, message: "Invalid date" },
          { status: 400 },
        );
      }

      const startOfDay = new Date(selectedDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const duplicate = await Budget.findOne({
        _id: { $ne: budgetId },
        userId: auth.userId,
        bType: "daily",
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            message: "A daily budget already exists for this date",
          },
          { status: 409 },
        );
      }

      updateData.date = startOfDay;

      updateData.month = selectedDate.toLocaleString("en-US", {
        month: "long",
        timeZone: "UTC",
      });

      updateData.year = String(selectedDate.getUTCFullYear());
    }

    if (bType === "monthly") {
      if (!month || !year) {
        return NextResponse.json(
          {
            success: false,
            message: "Month and year are required",
          },
          { status: 400 },
        );
      }

      const duplicate = await Budget.findOne({
        _id: { $ne: budgetId },
        userId: auth.userId,
        bType: "monthly",
        month,
        year: String(year),
      });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            message: "A monthly budget already exists for this month",
          },
          { status: 409 },
        );
      }

      updateData.month = month;
      updateData.year = String(year);
      updateData.date = null;
    }

    const updatedBudget = await Budget.findOneAndUpdate(
      {
        _id: budgetId,
        userId: auth.userId,
      },
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return NextResponse.json({
      success: true,
      message: "Budget updated successfully",
      budget: updatedBudget,
    });
  } catch (error) {
    console.error("PATCH budget:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update budget",
      },
      { status: 500 },
    );
  }
}
