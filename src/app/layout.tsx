import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Avans Keuze Kompas",
  description:
    "Vind je ideale Avans Vrije Keuze Module dankzij AI-gestuurde aanbevelingen en een moderne zoekervaring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="h-full">
      <body
        className={`${lexend.variable} min-h-full bg-surface text-text antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
