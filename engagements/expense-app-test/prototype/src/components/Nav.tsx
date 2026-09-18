// Shared nav shell across US-1/US-2/US-3 screens.
import Link from "next/link";

export function Nav() {
  return (
    <header className="border-b border-black/10 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold">
          Expense Approval — Prototype
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/submit" className="hover:underline">
            Submit expense
          </Link>
          <Link href="/approvals" className="hover:underline">
            Approvals queue
          </Link>
        </nav>
      </div>
    </header>
  );
}
