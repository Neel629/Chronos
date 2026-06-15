import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers/providers";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Chronos — Your Productivity Companion",
    template: "%s | Chronos",
  },
  description:
    "The next-generation timetable and productivity app designed for Gen Z. Beautiful, fast, and addictive — in the best way.",
  keywords: [
    "timetable",
    "productivity",
    "student",
    "planner",
    "schedule",
    "gen z",
    "study",
    "focus",
  ],
  authors: [{ name: "Chronos" }],
  openGraph: {
    title: "Chronos — Your Productivity Companion",
    description:
      "The next-generation timetable and productivity app designed for Gen Z.",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
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
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <Providers>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
