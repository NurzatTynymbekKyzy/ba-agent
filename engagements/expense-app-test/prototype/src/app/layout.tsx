import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Expense Approval — Prototype",
  description: "Clickable prototype for US-1/US-2/US-3 — not production code.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-red-500 text-white font-sans">
        <Nav />
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">{children}</main>
        <footer className="border-t border-black/10 px-6 py-4 text-center text-xs text-gray-500">
          Prototype for stakeholder review — mock data only, not connected to real systems.
        </footer>
      </body>
    </html>
  );
}
