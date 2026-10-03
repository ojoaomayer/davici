import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import SmoothScroll from "@/components/SmoothScroll";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "DeVici | Orçamentos de Obras com Alta Precisão & SINAPI",
  description:
    "Plataforma de engenharia de custos para orçamentistas e construtoras. Identificação inteligente na base SINAPI, BDI oficial do TCU e conciliação em segundos.",
  metadataBase: new URL("https://davici.vercel.app"),
  openGraph: {
    title: "DeVici | Orçamentos SINAPI com IA em minutos",
    description:
      "Esqueça o copia-e-cola em planilhas intermináveis. O DeVici identifica composições SINAPI e entrega seu orçamento fechado em minutos.",
    url: "https://davici.vercel.app",
    siteName: "DeVici",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DeVici | Orçamentos SINAPI com IA",
    description:
      "Plataforma de engenharia de custos. Match semântico com a base SINAPI em segundos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>

        {/* Preconnect para recursos externos críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        <link rel="dns-prefetch" href="https://identitytoolkit.googleapis.com" />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 selection:bg-blue-500/30 selection:text-white font-sans transition-colors duration-300"
      >
        <ThemeProvider>
          <AuthProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
