import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "TN Scheme Guide | Tamil Nadu",
  description:
    "Explore Tamil Nadu government schemes, eligibility information and official sources in English and Tamil."
};

export default function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
