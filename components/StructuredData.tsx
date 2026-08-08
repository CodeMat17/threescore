import { company } from "@/lib/data";
import { LEGAL_NAME, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

/**
 * JSON-LD blocks.
 *
 * Two prior defects are fixed here: the base URL fell back to
 * `https://example.com` whenever `NEXT_PUBLIC_SITE_URL` was unset at build
 * time (shipping placeholder URLs to crawlers), and the logo pointed at
 * `/logo.webp`, which does not exist — only `public/logo.jpg` does.
 *
 * These render as plain `<script>` rather than `next/script`, so the payload
 * is present in the server HTML on first parse instead of being injected by
 * the client runtime.
 */
function JsonLd({ id, data }: { id: string; data: Record<string, unknown> }) {
  return (
    <script
      id={id}
      type='application/ld+json'
      // Content is built from trusted constants, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function OrganizationStructuredData() {
  return (
    <JsonLd
      id='organization-structured-data'
      data={{
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "@id": ORGANIZATION_ID,
        name: LEGAL_NAME,
        alternateName: [SITE_NAME, "Threescore Exquisite Ltd Tours"],
        description:
          "Award-winning travel and safari operator specializing in East Africa adventures including Kenya, Tanzania, Uganda safaris and Dubai packages.",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/logo.jpg"),
        },
        image: absoluteUrl("/logo.jpg"),
        telephone: company.phones,
        email: company.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Riara Road",
          addressLocality: "Nairobi",
          addressRegion: "Nairobi County",
          addressCountry: "KE",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -1.2921,
          longitude: 36.8219,
        },
        areaServed: ["Kenya", "Tanzania", "Uganda", "United Arab Emirates"].map(
          (name) => ({ "@type": "Country", name })
        ),
        serviceType: [
          "Safari Tours",
          "Travel Planning",
          "Hotel Reservations",
          "Air Ticketing",
          "Car Rental",
          "Team Building",
        ],
        priceRange: "$$",
        paymentAccepted: ["Cash", "Credit Card", "Bank Transfer"],
        currenciesAccepted: ["USD", "KES"],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
            ],
            opens: "08:00",
            closes: "18:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: "09:00",
            closes: "16:00",
          },
        ],
        sameAs: [company.instagram, company.facebook, company.tiktok],
        foundingDate: "2020",
        knowsAbout: [
          "Safari Tours",
          "Wildlife Photography",
          "East Africa Travel",
          "Cultural Experiences",
          "Adventure Tourism",
          "Corporate Travel",
        ],
        slogan: "Award-Winning Travels & Safaris",
      }}
    />
  );
}

export function WebSiteStructuredData() {
  return (
    <JsonLd
      id='website-structured-data'
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: LEGAL_NAME,
        url: SITE_URL,
        inLanguage: "en",
        description:
          "Award-winning travel and safari operator specializing in East Africa adventures.",
        publisher: { "@id": ORGANIZATION_ID },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: absoluteUrl(
              "/packages?search={search_term_string}"
            ),
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function BreadcrumbStructuredData({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  return (
    <JsonLd
      id='breadcrumb-structured-data'
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: absoluteUrl(item.url),
        })),
      }}
    />
  );
}

/** A bookable tour package. Enables price/offer rich results. */
export function TripStructuredData({
  title,
  description,
  image,
  price,
  days,
  destination,
  url,
}: {
  title: string;
  description?: string;
  image?: string;
  price: number;
  days: number;
  destination: string;
  url: string;
}) {
  return (
    <JsonLd
      id={`trip-${title.replace(/\W+/g, "-").toLowerCase()}`}
      data={{
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        name: title,
        description:
          description ??
          `${days}-day ${destination} tour package by ${LEGAL_NAME}.`,
        ...(image ? { image } : {}),
        url: absoluteUrl(url),
        provider: { "@id": ORGANIZATION_ID },
        itinerary: {
          "@type": "Place",
          name: destination,
        },
        offers: {
          "@type": "Offer",
          price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: absoluteUrl(url),
        },
      }}
    />
  );
}

/** A blog post. Enables article rich results. */
export function ArticleStructuredData({
  title,
  description,
  image,
  url,
  publishedAt,
}: {
  title: string;
  description?: string;
  image?: string;
  url: string;
  publishedAt?: number;
}) {
  return (
    <JsonLd
      id='article-structured-data'
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        ...(description ? { description } : {}),
        ...(image ? { image } : {}),
        mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(url) },
        author: { "@id": ORGANIZATION_ID },
        publisher: { "@id": ORGANIZATION_ID },
        ...(publishedAt
          ? {
              datePublished: new Date(publishedAt).toISOString(),
              dateModified: new Date(publishedAt).toISOString(),
            }
          : {}),
      }}
    />
  );
}

/** A single offered service. */
export function ServiceStructuredData({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  return (
    <JsonLd
      id='service-structured-data'
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: title,
        description,
        url: absoluteUrl(url),
        provider: { "@id": ORGANIZATION_ID },
        areaServed: { "@type": "Country", name: "Kenya" },
      }}
    />
  );
}
