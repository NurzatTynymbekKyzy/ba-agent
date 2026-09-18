// WS-1, WS-2, WS-4 — shared mock expense store for the prototype.
// In-memory only: no real database, resets whenever the dev/prod server restarts.
// This is demo data for stakeholder walkthroughs, not production logic.

export type ExpenseCategory =
  | "Travel"
  | "Meals"
  | "Software"
  | "Office Supplies"
  | "Other";

export type ExpenseStatus = "auto_approved" | "pending_approval" | "approved";

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  receiptFileName: string | null;
  submittedBy: string;
  submittedAt: string;
  status: ExpenseStatus;
  managerApproved: boolean;
  financeApproved: boolean;
}

// WS-2: reports under $500 are auto-approved without manager review.
// WS-4 (supersedes WS-3): reports over $500 require BOTH manager and finance admin approval.
export const APPROVAL_THRESHOLD = 500;

const store: Expense[] = [
  {
    id: "seed-1",
    amount: 42.5,
    category: "Meals",
    receiptFileName: "lunch-receipt.jpg",
    submittedBy: "Aida (Employee)",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    status: "auto_approved",
    managerApproved: false,
    financeApproved: false,
  },
  {
    id: "seed-2",
    amount: 1200,
    category: "Travel",
    receiptFileName: "flight-invoice.pdf",
    submittedBy: "Aida (Employee)",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    status: "pending_approval",
    managerApproved: false,
    financeApproved: false,
  },
];

let nextId = store.length + 1;

export function listExpenses(): Expense[] {
  return [...store].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
}

export function addExpense(input: {
  amount: number;
  category: ExpenseCategory;
  receiptFileName: string | null;
  submittedBy: string;
}): Expense {
  const status: ExpenseStatus =
    input.amount < APPROVAL_THRESHOLD ? "auto_approved" : "pending_approval";

  const expense: Expense = {
    id: `exp-${nextId++}`,
    amount: input.amount,
    category: input.category,
    receiptFileName: input.receiptFileName,
    submittedBy: input.submittedBy,
    submittedAt: new Date().toISOString(),
    status,
    managerApproved: false,
    financeApproved: false,
  };

  store.push(expense);
  return expense;
}

export function approveExpense(
  id: string,
  role: "manager" | "finance"
): Expense | null {
  const expense = store.find((e) => e.id === id);
  if (!expense) return null;

  if (role === "manager") expense.managerApproved = true;
  if (role === "finance") expense.financeApproved = true;

  // WS-4: both approvals required before the report counts as approved.
  if (expense.managerApproved && expense.financeApproved) {
    expense.status = "approved";
  }

  return expense;
}
