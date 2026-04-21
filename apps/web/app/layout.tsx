import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulse",
  description: "Your personal research analyst that never sleeps.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
