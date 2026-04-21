import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulse",
  description: "Your personal research analyst that never sleeps.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const hasClerk = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_stub",
  );
  if (!hasClerk) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
