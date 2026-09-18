// US-1, US-2, US-3 — traces to WS-1, WS-2, WS-4
import { NextRequest, NextResponse } from "next/server";
import { addExpense, listExpenses, ExpenseCategory } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(listExpenses());
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const amount = Number(body.amount);
  const category = body.category as ExpenseCategory;
  const receiptFileName = body.receiptFileName ?? null;

  if (!amount || amount <= 0) {
    return NextResponse.json(
      { error: "Amount must be greater than 0." },
      { status: 400 }
    );
  }
  if (!category) {
    return NextResponse.json({ error: "Category is required." }, { status: 400 });
  }
  if (!receiptFileName) {
    return NextResponse.json({ error: "A receipt is required." }, { status: 400 });
  }

  const expense = addExpense({
    amount,
    category,
    receiptFileName,
    submittedBy: "Aida (Employee)", // mock current user — no auth in this prototype
  });

  return NextResponse.json(expense, { status: 201 });
}
