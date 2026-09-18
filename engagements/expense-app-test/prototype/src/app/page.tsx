// US-1, US-2, US-3 — dashboard entry point, traces to WS-1, WS-2, WS-4
import Link from "next/link";
import { listExpenses } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";

export default function HomePage() {
  const expenses = listExpenses();

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">Expense Approval App</h1>
        <p className="text-sm text-gray-600">
          Clickable prototype covering: submitting an expense report (US-1),
          automatic approval for reports under $500 (US-2), and manager +
          finance admin approval for reports over $500 (US-3).
        </p>
        <div className="flex gap-3">
          <Link
            href="/submit"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Submit an expense
          </Link>
          <Link
            href="/approvals"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Open approvals queue
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Recent expense reports</h2>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Submitted by</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">${e.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">{e.category}</td>
                  <td className="px-4 py-3">{e.submittedBy}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={e.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
