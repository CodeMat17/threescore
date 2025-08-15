import { ConvexProviderClient } from "@/components/providers/convex-provider";
import { AppToaster } from "@/components/providers/toaster";
import CulturalPattern from "@/components/site/CulturalPattern";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import {
  OrganizationStructuredData,
  WebSiteStructuredData,
} from "@/components/StructuredData";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

// Using system fonts to avoid network fetch during build

export const metadata: Metadata = {
  title: {
    default: "Threescore Tours — Award‑Winning Travels & Safaris",
    template: "%s — Threescore Tours",
  },
  description:
    "Threescore Exquisite Ltd Tours crafts unforgettable safaris, beach escapes, and international trips across Kenya, East Africa, and beyond.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"
  ),
  keywords: [
    "Kenya safaris",
    "Tanzania tours",
    "Uganda gorilla trekking",
    "Dubai packages",
    "East Africa travel",
    "Maasai Mara",
    "beach escapes",
    "wildlife tours",
    "cultural experiences",
    "adventure travel",
  ],
  authors: [{ name: "Threescore Tours" }],
  creator: "Threescore Tours",
  publisher: "Threescore Tours",
  category: "Travel & Tourism",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Threescore Tours — Award‑Winning Travels & Safaris",
    description:
      "Experience unforgettable safaris, stunning beach escapes, and cultural adventures across Kenya, Tanzania, Uganda, and Dubai with East Africa's premier tour operator.",
    siteName: "Threescore Tours",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Threescore Tours - Award-winning safaris and travel experiences",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Threescore Tours — Award‑Winning Travels & Safaris",
    description:
      "Experience unforgettable safaris, stunning beach escapes, and cultural adventures across Kenya, Tanzania, Uganda, and Dubai.",
    images: ["/opengraph-image.png"],
    creator: "@threescoreexquisite_cotravel",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: process.env.GOOGLE_SITE_VERIFICATION,
  //   other: {
  //     ...(process.env.BING_SITE_VERIFICATION && {
  //       "msvalidate.01": process.env.BING_SITE_VERIFICATION,
  //     }),
  //     ...(process.env.YANDEX_VERIFICATION && {
  //       "yandex-verification": process.env.YANDEX_VERIFICATION,
  //     }),
  //   },
  // },
  formatDetection: {
    telephone: true,
    date: false,
    email: true,
    url: false,
  },
  classification: "Business",
  referrer: "origin-when-cross-origin",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },

  applicationName: "Threescore Tours",
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`antialiased`}>
        <OrganizationStructuredData />
        <WebSiteStructuredData />
        <ConvexProviderClient>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <CulturalPattern />
            <Header />
            <main className='min-h-[70vh]'>{children}</main>
            <Footer />
            <AppToaster />
            <WhatsAppButton
              phoneNumber='+254706572045'
              message='Welcome to Threescore Tours. How can we assist you today?'
            />
          </ThemeProvider>
        </ConvexProviderClient>
      </body>
    </html>
  );
}
