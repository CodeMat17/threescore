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
import { SITE_URL } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

// next/font self-hosts these at build time — no runtime request to Google.
const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});



// Origin serving Convex-hosted imagery; warmed early so non-LCP slides and
// package photos don't pay for DNS + TLS on first paint.
const convexOrigin = process.env.NEXT_PUBLIC_CONVEX_URL
  ? new URL(process.env.NEXT_PUBLIC_CONVEX_URL).origin
  : undefined;

export const metadata: Metadata = {
  title: {
    default: "Threescore Tours — Award‑Winning Travels & Safaris",
    template: "%s — Threescore Tours",
  },
  description:
    "Threescore Exquisite Ltd Tours crafts unforgettable safaris, beach escapes, and international trips across Kenya, East Africa, and beyond.",
  metadataBase: new URL(SITE_URL),
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
    title: "Threescore Tours — Celebrated Travels & Safaris",
    description:
      "Experience unforgettable safaris, stunning beach escapes, and cultural adventures across Kenya, Tanzania, Uganda, and Dubai with East Africa's premier tour operator.",
    siteName: "Threescore Tours",
    // Images come from the `app/opengraph-image.tsx` file convention.
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Threescore Tours — Celebrated Travels & Safaris",
    description:
      "Experience unforgettable safaris, stunning beach escapes, and cultural adventures across Kenya, Tanzania, Uganda, and Dubai.",
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
  applicationName: "Threescore Tours",
};

// `colorScheme` and `viewport` belong here, not in the `metadata` export —
// Next 15 ignores them there.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Not capped: pinch-zoom must stay available (WCAG 1.4.4).
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfcfa" },
    { media: "(prefers-color-scheme: dark)", color: "#14110f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${nunito.variable}`}>
      <head>
        {convexOrigin && (
          <>
            <link rel='preconnect' href={convexOrigin} crossOrigin='' />
            <link rel='dns-prefetch' href={convexOrigin} />
          </>
        )}
      </head>
      <body className='antialiased'>
        <a
          href='#main'
          className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:shadow-lg focus:ring-2 focus:ring-ring'>
          Skip to content
        </a>
        <OrganizationStructuredData />
        <WebSiteStructuredData />
        <ConvexProviderClient>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <CulturalPattern />
            <Header />
            <main id='main' className='min-h-[70vh]'>
              {children}
            </main>
            <Footer />
            <AppToaster />
            <WhatsAppButton
              phoneNumber='+254706572045'
              message='Hello, Threescore Exquisite Collections, I want to make a booking'
            />
          </ThemeProvider>
        </ConvexProviderClient>
      </body>
    </html>
  );
}
