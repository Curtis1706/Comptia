import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Ceilow — Comptabilité, TVA et Facturation automatisées au Bénin",
  description:
    "La plateforme de gestion financière pour les PME et indépendants au Bénin : facturation certifiée e-MECeF, TVA, comptabilité et trésorerie sans prise de tête.",
  authors: [{ name: "Ceilow" }],
  icons: {
    icon: "/logo/picto_ceilow_web_jaune.svg",
    shortcut: "/logo/picto_ceilow_web_jaune.svg",
    apple: "/logo/picto_ceilow_web_jaune.svg",
  },
  openGraph: {
    title: "Ceilow — Comptabilité, TVA et Facturation au Bénin",
    description: "La gestion financière des entreprises béninoises, simplifiée et automatisée.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-ink`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
