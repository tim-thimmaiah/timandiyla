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
  title: {
    template: "%s | Tim & Iyla's Wedding",
    default: "Tim & Iyla's Wedding",
  },
  description: "Oakland, California on July 4-5, 2025.",
  keywords: ["wedding", "Tim and Iyla", "Oakland wedding", "July 2025 wedding"],
  authors: [{ name: "Tim and Iyla" }],
  creator: "Tim and Iyla",
  publisher: "Tim and Iyla",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://timandiyla.com"),
  openGraph: {
    title: "Tim & Iyla's Wedding",
    description: "Oakland, California on July 4-5, 2025.",
    url: "https://timandiyla.com",
    siteName: "Tim & Iyla's Wedding",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Tim & Iyla's Wedding",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tim & Iyla's Wedding",
    description: "Oakland, California on July 4-5, 2025.",
    images: ["/og.png"],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
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
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="antialiased bg-[#D9DCFA] font-serif italic">
        {children}
      </body>
    </html>
  );
}
