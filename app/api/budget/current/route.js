import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Budget from "@/models/Budget";
import { getAuthUser } from "@/lib/auth";

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

    const { budgetId, bType, budget, saving, date, month, year } =
      await request.json();

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

    // Find existing budget
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

    // =========================
    // DAILY BUDGET UPDATE
    // =========================
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

      const selectedMonth = selectedDate.toLocaleString("en-US", {
        month: "long",
        timeZone: "UTC",
      });

      const selectedYear = String(selectedDate.getUTCFullYear());

      // Check monthly budget for selected month
      const monthlyBudgetExists = await Budget.findOne({
        _id: { $ne: budgetId },
        userId: auth.userId,
        bType: "monthly",
        month: selectedMonth,
        year: selectedYear,
      });

      if (monthlyBudgetExists) {
        return NextResponse.json(
          {
            success: false,
            message: `Cannot update daily budget because monthly budget already exists for ${selectedMonth} ${selectedYear}`,
          },
          { status: 409 },
        );
      }

      // Check duplicate daily budget for same date
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
      updateData.month = selectedMonth;
      updateData.year = selectedYear;
    }

    // =========================
    // MONTHLY BUDGET UPDATE
    // =========================
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

      const selectedYear = String(year);

      // Check if daily budgets exist in selected month
      const dailyBudgetExists = await Budget.findOne({
        _id: { $ne: budgetId },
        userId: auth.userId,
        bType: "daily",
        month,
        year: selectedYear,
      });

      if (dailyBudgetExists) {
        return NextResponse.json(
          {
            success: false,
            message: `Cannot update monthly budget because daily budgets already exist for ${month} ${selectedYear}`,
          },
          { status: 409 },
        );
      }

      // Check duplicate monthly budget
      const duplicate = await Budget.findOne({
        _id: { $ne: budgetId },
        userId: auth.userId,
        bType: "monthly",
        month,
        year: selectedYear,
      });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            message: `A monthly budget already exists for ${month} ${selectedYear}`,
          },
          { status: 409 },
        );
      }

      updateData.month = month;
      updateData.year = selectedYear;
      updateData.date = null;
    }

    // Update budget
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
