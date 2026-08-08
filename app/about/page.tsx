import AboutUsContent from "@/components/AboutUsContent";
import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-static";
export const revalidate = 300;

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Threescore Exquisite Collections Ltd is a Nairobi-based tour operator crafting safaris, beach escapes and international journeys across East Africa and beyond.",
  path: "/about",
  keywords: [
    "about Threescore Tours",
    "East Africa tour operator",
    "safari company Kenya",
    "Nairobi travel agency",
    "sustainable tourism Kenya",
  ],
});

export default function AboutPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ]}
      />
      <AboutUsContent />
    </>
  );
}
