import { BreadcrumbStructuredData } from "@/components/StructuredData";
import ContactClient from "@/components/contact/ContactClient";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-static";
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Get in touch to plan your East Africa adventure — safaris, flights, vehicles and custom itineraries. We usually reply within one business day.",
  path: "/contact",
  keywords: [
    "contact Threescore Tours",
    "safari booking Kenya",
    "travel planning East Africa",
    "tour operator Nairobi",
    "custom travel itinerary",
  ],
});

export default function ContactPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ]}
      />
      <ContactClient />
    </>
  );
}
