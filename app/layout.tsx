import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Munchies",
  description:
    "Find the best restaurants in your city and get it delivered to your place!",
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
