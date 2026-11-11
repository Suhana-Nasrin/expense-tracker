import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Expense from "@/models/Expense";
// import { getUserId } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();

    // const userId = await getUserId();

    // if (!userId) {
    //   return NextResponse.json(
    //     { message: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type");
    const date = searchParams.get("date");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

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
    //   console.log("month", month);
    //   console.log("year", year);

      const monthNumber = new Date(`${month} 1, ${year}`).getMonth();

      startDate = new Date(Date.UTC(Number(year), monthNumber, 1));

      endDate = new Date(Date.UTC(Number(year), monthNumber + 1, 1));
      console.log("startDate", startDate);
      console.log("endrtDate", endDate);
    } else {
      return NextResponse.json(
        { message: "Invalid expense type" },
        { status: 400 },
      );
    }

    const result = await Expense.aggregate([
      {
        $match: {
          //   userId,
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
    // console.log(await Expense.find({}, { date: 1, price: 1, userId: 1 }));
    console.log("tesult idfjdif", result);

    return NextResponse.json({
      type,
      totalExpense: result[0]?.totalExpense ?? 0,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to calculate expenses" },
      { status: 500 },
    );
  }
}
