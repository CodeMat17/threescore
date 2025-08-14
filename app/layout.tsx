import { ConvexProviderClient } from "@/components/providers/convex-provider";
import { AppToaster } from "@/components/providers/toaster";
import CulturalPattern from "@/components/site/CulturalPattern";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
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
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Threescore Tours",
    description:
      "Award‑winning travels and tours across Africa and beyond. Safaris, beach escapes, Dubai trips, and more.",
    url: "https://example.com",
    siteName: "Threescore Tours",
    images: [{ url: "/api/og" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Threescore Tours",
    description:
      "Award‑winning travels and tours across Africa and beyond. Safaris, beach escapes, Dubai trips, and more.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`antialiased`}>
        <ConvexProviderClient>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <CulturalPattern />
            <Header />
            <main className='min-h-[70vh]'>{children}</main>
            <Footer />
            <AppToaster />
          </ThemeProvider>
        </ConvexProviderClient>
      </body>
    </html>
  );
}
