import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "EdgeSync — Personalization at the speed of context",
    template: "%s · EdgeSync",
  },
  description: "An edge-powered personalization engine that adapts content to each visitor's context.",
  icons: {
    icon: "/26A1_color.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
