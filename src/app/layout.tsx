import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Banarsi Fabric Management",
  description: "Internal management system for Banarsi fabric business",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-dvh bg-bg-primary font-body text-text-primary antialiased">
        <div className="flex min-h-dvh">
          <Sidebar />
          <main className="flex-1 min-w-0 px-3 pb-6 pt-[4.5rem] sm:px-4 sm:pb-8 lg:ml-64 lg:px-8 lg:pt-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
