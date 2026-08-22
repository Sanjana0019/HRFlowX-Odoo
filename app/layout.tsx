import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HRFlowX — Human Resource Management System",
  description:
    "HRFlowX: Streamline People, Power Performance. Enterprise HRMS platform with biometric attendance tracking, dynamic wage formulas, automated leave balance management, and compliance governance.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-150`}>
        {children}
      </body>
    </html>
  );
}
