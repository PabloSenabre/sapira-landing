import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4, Caveat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Editorial serif font - clean, readable, elegant
const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sapira | Enterprise AI Solutions",
  description: "El Palantir español. Transformamos datos empresariales en decisiones inteligentes con soluciones AI de nivel enterprise.",
  keywords: ["AI", "Enterprise", "Machine Learning", "Data Analytics", "Spain", "Palantir"],
  authors: [{ name: "Sapira" }],
  openGraph: {
    title: "Sapira | Enterprise AI Solutions",
    description: "El Palantir español. Transformamos datos empresariales en decisiones inteligentes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} ${caveat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
