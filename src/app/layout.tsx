import type { Metadata } from "next";
import Link from "next/link";
import { Anton, Caveat, Geist, Geist_Mono } from "next/font/google";

import Footer from "@/components/Footer";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { ThemeProvider } from "@/context/ThemeContext";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Tienda de ropa | Comprá y alquilá",
    template: "%s | Tienda de ropa",
  },
  description: "Venta y alquiler de vestidos y trajes",
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {/* TEMPORAL*/}
          <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
              <Link href="/" className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl uppercase tracking-tight">
                  Tienda
                </span>
                <span className="font-script text-2xl text-muted">de ropa</span>
              </Link>
              <ThemeToggle />
            </div>
          </header>
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}