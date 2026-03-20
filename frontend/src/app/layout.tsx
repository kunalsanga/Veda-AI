import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VedaAI - AI-Powered Assignment Management",
  description:
    "Create, manage, and grade assignments with AI assistance. Set up rubrics, define marking criteria, and streamline your teaching workflow.",
  keywords: ["AI", "assignment", "education", "grading", "VedaAI"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
