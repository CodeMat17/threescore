import Script from "next/script";

export function OrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Threescore Exquisite Ltd Tours",
    alternateName: "Threescore Tours",
    description:
      "Award-winning travel and safari operator specializing in East Africa adventures including Kenya, Tanzania, Uganda safaris and Dubai packages.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/logo.webp`,
    image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/opengraph-image.png`,
    telephone: ["+254706572045", "+254781068874"],
    email: "threescoreexquisitetour@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Riara Road",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -1.2921,
      longitude: 36.8219,
    },
    areaServed: [
      {
        "@type": "Country",
        name: "Kenya",
      },
      {
        "@type": "Country",
        name: "Tanzania",
      },
      {
        "@type": "Country",
        name: "Uganda",
      },
      {
        "@type": "Country",
        name: "United Arab Emirates",
      },
    ],
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
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
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
    sameAs: [
      "https://instagram.com/threescoreexquisite_cotravel",
      "https://facebook.com/Threescore%20Luxury%20Tours",
    ],
    foundingDate: "2020",
    founder: {
      "@type": "Organization",
      name: "Threescore Exquisite Ltd",
    },
    knowsAbout: [
      "Safari Tours",
      "Wildlife Photography",
      "East Africa Travel",
      "Cultural Experiences",
      "Adventure Tourism",
      "Luxury Travel",
      "Budget Travel",
      "Group Travel",
      "Corporate Travel",
    ],
    slogan: "Award-Winning Travels & Safaris",
  };

  return (
    <Script
      id='organization-structured-data'
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function WebSiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Threescore Tours",
    alternateName: "Threescore Exquisite Ltd Tours",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
    description:
      "Award-winning travel and safari operator specializing in East Africa adventures.",
    publisher: {
      "@type": "TravelAgency",
      name: "Threescore Exquisite Ltd Tours",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/packages?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    mainEntity: {
      "@type": "TravelAgency",
      name: "Threescore Tours",
    },
  };

  return (
    <Script
      id='website-structured-data'
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function BreadcrumbStructuredData({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}${item.url}`,
    })),
  };

  return (
    <Script
      id='breadcrumb-structured-data'
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
