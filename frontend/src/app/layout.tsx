import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Veda AI - Intelligent Assessment Creator",
  description:
    "Create professional, AI-powered question papers and assessments in seconds. Powered by advanced language models for educators.",
  keywords: ["AI", "assessment", "question paper", "education", "exam generator"],
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
