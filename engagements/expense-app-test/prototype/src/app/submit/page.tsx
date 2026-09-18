"use client";
// US-1 — traces to WS-1 (submit amount + category + receipt)
// Also demonstrates US-2/US-3 (WS-2/WS-4) by showing the resulting approval status.

import { useState } from "react";
import { ExpenseCategory } from "@/lib/mock-data";

const CATEGORIES: ExpenseCategory[] = [
  "Travel",
  "Meals",
  "Software",
  "Office Supplies",
  "Other",
];

export default function SubmitExpensePage() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Travel");
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<null | { status: string; amount: number }>(
    null
  );
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          category,
          receiptFileName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setResult({ status: data.status, amount: data.amount });
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    const isAutoApproved = result.status === "auto_approved";
    return (
      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-6">
        <h1 className="text-xl font-semibold">Report submitted</h1>
        {isAutoApproved ? (
          <p className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
            ${result.amount.toFixed(2)} is under the $500 threshold — this
            report was auto-approved. No manager review needed.
          </p>
        ) : (
          <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            ${result.amount.toFixed(2)} is over the $500 threshold — this
            report now needs both manager and finance admin approval before
            payment.
          </p>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setResult(null);
              setAmount("");
              setReceiptFileName(null);
            }}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
          >
            Submit another
          </button>
          <a
            href="/"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700"
          >
            Back to dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-md flex-col gap-4 rounded-lg border border-gray-200 p-6"
    >
      <h1 className="text-xl font-semibold">Submit an expense report</h1>

      <label className="flex flex-col gap-1 text-sm">
        Amount ($)
        <input
          type="number"
          min="0.01"
          step="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Category
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          className="rounded-md border border-gray-300 px-3 py-2"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Receipt
        <input
          type="file"
          required
          onChange={(e) => setReceiptFileName(e.target.files?.[0]?.name ?? null)}
          className="text-sm"
        />
        <span className="text-xs text-gray-500">
          Prototype only — the file itself isn&apos;t uploaded anywhere, just
          its name.
        </span>
      </label>

      {error && (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit report"}
      </button>
    </form>
  );
}
