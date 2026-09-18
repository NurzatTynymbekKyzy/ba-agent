"use client";
// US-3 — traces to WS-4 (manager + finance admin approval over $500)

import { useEffect, useState } from "react";
import { Expense } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";

export default function ApprovalsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/expenses");
    const data = await res.json();
    setExpenses(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id: string, role: "manager" | "finance") {
    await fetch(`/api/expenses/${id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    load();
  }

  const pending = expenses.filter((e) => e.status !== "auto_approved");

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Approvals queue</h1>
      <p className="text-sm text-gray-600">
        Reports over $500 need both a manager and a finance admin to approve
        — approving as one role alone leaves the report pending.
      </p>

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : pending.length === 0 ? (
        <p className="text-sm text-gray-500">Nothing needs approval right now.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {pending.map((e) => (
            <div key={e.id} className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    ${e.amount.toFixed(2)} — {e.category}
                  </p>
                  <p className="text-xs text-gray-500">
                    Submitted by {e.submittedBy} · {e.receiptFileName}
                  </p>
                </div>
                <StatusBadge status={e.status} />
              </div>

              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => approve(e.id, "manager")}
                  disabled={e.managerApproved}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-50"
                >
                  {e.managerApproved ? "Manager ✓ approved" : "Approve as manager"}
                </button>
                <button
                  onClick={() => approve(e.id, "finance")}
                  disabled={e.financeApproved}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-50"
                >
                  {e.financeApproved
                    ? "Finance ✓ approved"
                    : "Approve as finance admin"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
