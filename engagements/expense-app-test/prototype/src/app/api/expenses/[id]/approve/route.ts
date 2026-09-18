// US-3 — traces to WS-4 (manager + finance admin approval over $500)
import { NextRequest, NextResponse } from "next/server";
import { approveExpense } from "@/lib/mock-data";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const role = body.role as "manager" | "finance";

  if (role !== "manager" && role !== "finance") {
    return NextResponse.json(
      { error: "role must be 'manager' or 'finance'." },
      { status: 400 }
    );
  }

  const expense = approveExpense(id, role);
  if (!expense) {
    return NextResponse.json({ error: "Expense not found." }, { status: 404 });
  }

  return NextResponse.json(expense);
}
