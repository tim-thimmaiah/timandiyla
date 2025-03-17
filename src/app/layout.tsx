import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Caveat, EB_Garamond } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-caveat",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
});

export const metadata: Metadata = {
  title: "Tim & Iyla's Wedding",
  description: "Wedding website for Tim and Iyla",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${caveat.variable} ${ebGaramond.variable}`}
    >
      <body className="antialiased bg-[#D9DCFA] font-serif italic">
        {children}
      </body>
    </html>
  );
}
