import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Conexão WhatsApp - SecretáriaPlus",
  description: "Guia completo e intuitivo para conectar seu WhatsApp Business na plataforma SecretáriaPlus de forma rápida e segura.",
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🔌</text></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
  openGraph: {
    title: "Conexão WhatsApp Business - SecretáriaPlus",
    description: "Conecte seu WhatsApp Business de forma simples e segura. Passo a passo completo para sua conexão.",
    type: "website",
    locale: "pt_BR",
    siteName: "SecretáriaPlus",
    images: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" style="background:%23f3f4f6"><rect width="1200" height="630" fill="%23f3f4f6"/><text x="600" y="315" font-size="240" text-anchor="middle" dominant-baseline="middle">🔌</text><text x="600" y="500" font-size="48" text-anchor="middle" fill="%2311182a" font-family="system-ui,-apple-system,sans-serif" font-weight="600">Conexão WhatsApp Business</text></svg>',
        width: 1200,
        height: 630,
        alt: "Conexão WhatsApp Business - SecretáriaPlus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Conexão WhatsApp Business - SecretáriaPlus",
    description: "Conecte seu WhatsApp Business de forma simples e segura. Passo a passo completo.",
    images: ['data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" style="background:%23f3f4f6"><rect width="1200" height="630" fill="%23f3f4f6"/><text x="600" y="315" font-size="240" text-anchor="middle" dominant-baseline="middle">🔌</text><text x="600" y="500" font-size="48" text-anchor="middle" fill="%2311182a" font-family="system-ui,-apple-system,sans-serif" font-weight="600">Conexão WhatsApp Business</text></svg>'],
  },
  keywords: ["WhatsApp Business", "Conexão", "SecretáriaPlus", "Integração", "Tutorial", "Guia"],
  authors: [{ name: "SecretáriaPlus" }],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
