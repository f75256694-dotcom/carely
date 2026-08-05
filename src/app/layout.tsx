import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigation } from "@/components/layout/Navigation";
import { FamilyDataProvider } from "@/components/dashboard/FamilyDataContext";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const interDisplay = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Carely — Nachbarschaftshilfe mit Herz",
  description: "Carely verbindet Hilfesuchende mit verifizierten Alltagshelfer:innen aus der Nachbarschaft. Menschliche Unterstützung für Einkäufe, Gesellschaft und Alltagshilfe.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${interDisplay.variable}`}>
      <body className="antialiased bg-warm-50">
        <FamilyDataProvider>
          <Navigation />
          <div className="min-h-screen">{children}</div>
        </FamilyDataProvider>
      </body>
    </html>
  );
}
