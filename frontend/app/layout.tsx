import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen`}
      >
        <aside className="w-56 bg-gray-900 text-white flex flex-col p-4 space-y-2">
          <h1 className="text-2xl font-bold mb-6">AI-BOS</h1>
          <nav className="flex flex-col space-y-2">
            <Link
              href="/dashboard"
              className="hover:bg-gray-800 rounded px-2 py-1"
            >
              Dashboard
            </Link>
            <Link href="/employees" className="hover:bg-gray-800 rounded px-2 py-1">
              Employees
            </Link>
            <Link href="/tasks" className="hover:bg-gray-800 rounded px-2 py-1">
              Tasks
            </Link>
            <Link href="/chats" className="hover:bg-gray-800 rounded px-2 py-1">
              Chats
            </Link>
            <Link
              href="/approvals"
              className="hover:bg-gray-800 rounded px-2 py-1"
            >
              Approvals
            </Link>
            <Link
              href="/documents"
              className="hover:bg-gray-800 rounded px-2 py-1"
            >
              Documents
            </Link>
            <Link
              href="/notifications"
              className="hover:bg-gray-800 rounded px-2 py-1"
            >
              Notifications
            </Link>
          </nav>
        </aside>
        <main className="flex-1 bg-gray-50 p-8">{children}</main>
      </body>
    </html>
  );
}
