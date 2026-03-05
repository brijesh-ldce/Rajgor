import type { Metadata } from "next"
import { Poppins, JetBrains_Mono, Inter } from "next/font/google"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

import "../globals.css"
const poppins = Poppins({
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: 'swap',
})

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: 'swap',
})

// Fallback font just in case
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Morphix | Enterprise Data Transformation",
  description: "Transform messy spreadsheets into perfect databases instantly with AI-powered data transformation.",
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${mono.variable} ${inter.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light" // Default to light mode for the corporate feel, allow toggle
            enableSystem={false} // Force light mode default initially as per design vibes usually being light for SaaS landing, but support dark
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
