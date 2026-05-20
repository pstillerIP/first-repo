import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Northland Composites - Production Order Tracker",
  description: "Plant floor production order tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col" style={{ fontFamily: '"Inter", "Segoe UI", sans-serif' }}>
        <nav style={{ backgroundColor: '#1A4D2E' }} className="px-6 py-4 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-lg tracking-tight">Northland Composites</span>
              <span style={{ color: '#D97706' }} className="text-sm font-medium">Production Order Tracker</span>
            </div>
            <a
              href="/orders/new"
              style={{ backgroundColor: '#D97706' }}
              className="text-white text-sm font-semibold px-4 py-2 rounded hover:opacity-90 transition-opacity"
            >
              + New Order
            </a>
          </div>
        </nav>
        <main className="flex-1" style={{ backgroundColor: '#F0F4F1' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
