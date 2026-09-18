// Shared status pill for US-1/US-2/US-3 screens.
import { ExpenseStatus } from "@/lib/mock-data";

const LABELS: Record<ExpenseStatus, string> = {
  auto_approved: "Auto-approved",
  pending_approval: "Pending manager + finance approval",
  approved: "Approved",
};

const STYLES: Record<ExpenseStatus, string> = {
  auto_approved: "bg-green-100 text-green-800 border-green-300",
  pending_approval: "bg-amber-100 text-amber-800 border-amber-300",
  approved: "bg-blue-100 text-blue-800 border-blue-300",
};

export function StatusBadge({ status }: { status: ExpenseStatus }) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
