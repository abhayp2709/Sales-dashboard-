import { NextResponse } from "next/server";

const salesData = {
  "2022": [
    { month: "Jan", sales: 20000 },
    { month: "Feb", sales: 24000 },
    { month: "Mar", sales: 23000 },
    { month: "Apr", sales: 26000 },
    { month: "May", sales: 28000 },
    { month: "Jun", sales: 30000 },
  ],
  "2023": [
    { month: "Jan", sales: 22000 },
    { month: "Feb", sales: 26000 },
    { month: "Mar", sales: 25000 },
    { month: "Apr", sales: 29000 },
    { month: "May", sales: 32000 },
    { month: "Jun", sales: 34000 },
  ],
  "2024": [
    { month: "Jan", sales: 26000 },
    { month: "Feb", sales: 30000 },
    { month: "Mar", sales: 28000 },
    { month: "Apr", sales: 32000 },
    { month: "May", sales: 35000 },
    { month: "Jun", sales: 33000 },
  ],
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year") || "2024";

  return NextResponse.json(salesData[year as keyof typeof salesData]);
}
