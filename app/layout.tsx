import type React from "react"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }]
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Validate locale and fallback to 'en' if invalid
  const validLocale = ["en", "fr"].includes(locale) ? locale : "en"

  // Providing all messages to the client
  const messages = await getMessages({ locale: validLocale })

  return (
    <html lang={validLocale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
