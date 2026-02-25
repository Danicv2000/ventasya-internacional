import type React from "react"
import type { Metadata } from "next"
import { Poppins, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ClientWrapper } from "@/src/core/providers/client-wrapper"
import { Toaster } from "sileo"
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
        url: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/icon-ligth.png`,
        media: "(prefers-color-scheme: light)",
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/icon-dark.png`,
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/icon-dark.png`,
        type: "image/png",
      },
    ],
    apple: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/apple-icon.png`,
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
        <ClientWrapper>
          {children}
        </ClientWrapper>
        <Toaster position="top-center" />
        <Analytics/>
      </body>
    </html>
  )
}
