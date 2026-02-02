import type React from "react"
import type { Metadata } from "next"
import { Poppins, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ShippingProvider } from "@/src/core/contexts/shipping-context"
import { AuthProvider } from "@/src/core/contexts/auth-context"
import { I18nProvider } from "@/src/i18n/i18n"
import "../../styles/globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
})
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EncargosYa - Compras Internacionales en Cuba",
  description: "Servicio de compras por encargo de Temu, Shein y Amazon con envío a Cuba",
  generator: "encargos.ya",
  icons: {
    icon: [
      {
        url: "/icon-ligth.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        //url: "/icon.svg",
        //type: "image/svg+xml",
        url: "/icon-dark.svg",
        type: "image/png",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <I18nProvider>
          <AuthProvider>
            <ShippingProvider>
              {children}
            </ShippingProvider>
          </AuthProvider>
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
