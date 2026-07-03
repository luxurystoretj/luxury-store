import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, PT_Sans } from "next/font/google";
import "./globals.css";

// DESIGN.md §2: display font, weights 400/500 only, no italic, no bold (700).
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500"],
  style: ["normal"],
});

// DESIGN.md §2: body/UI font, weights 400/500/600 only, no bold (700).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600"],
});

// DESIGN.md §2: Cyrillic fallback safety net, weight 400 only.
const ptSans = PT_Sans({
  variable: "--font-pt-sans",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Luxury Store",
  description:
    "Премиальный мужской бутик. Каталог, бренды, эксклюзивные образы.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${cormorantGaramond.variable} ${inter.variable} ${ptSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
