import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "V-Chess",
  description:
    "Gamified AI-powered chess platform with Compound V abilities and online multiplayer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}