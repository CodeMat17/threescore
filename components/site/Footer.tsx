import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/ui/icons";
import { api } from "@/convex/_generated/api";
import { company } from "@/lib/data";
import { LEGAL_NAME } from "@/lib/site";
import { fetchQuery } from "convex/nextjs";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Logo from "../Logo";

const QUICK_LINKS = [
  { href: "/about", label: "About us" },
  { href: "/packages", label: "Packages" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

/**
 * Site footer. Converted from a client component with two `useQuery`
 * subscriptions to a server render, so contact details and social links are in
 * the HTML on every page — they carry real local-SEO weight (NAP consistency).
 */
export async function Footer() {
  const [info, socials] = await Promise.all([
    fetchQuery(api.companyInfo.getCompanyInfo).catch(() => null),
    fetchQuery(api.socials.getSocials).catch(() => null),
  ]);

  const address = info?.address ?? company.address;
  const phones = (info?.phones as string[] | undefined) ?? company.phones;
  const email = info?.email ?? company.email;

  const socialLinks = [
    {
      href: socials?.instagram || company.instagram,
      label: "Instagram",
      Icon: InstagramIcon,
    },
    {
      href: socials?.facebook || company.facebook,
      label: "Facebook",
      Icon: FacebookIcon,
    },
    { href: company.tiktok, label: "TikTok", Icon: TikTokIcon },
  ];

  return (
    <footer className='mt-24 border-t bg-muted/30'>
      <div className='site-container grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='sm:col-span-2 lg:col-span-1'>
          <Logo className='size-16' />
          <p className='mt-4 font-display text-lg font-semibold'>
            {LEGAL_NAME}
          </p>
          <p className='mt-2 max-w-xs text-sm text-muted-foreground'>
            Award-winning travels and tours across Africa and beyond.
          </p>
        </div>

        <nav aria-labelledby='footer-links'>
          <h2 id='footer-links' className='font-display text-sm font-semibold'>
            Quick links
          </h2>
          <ul className='mt-4 space-y-2.5 text-sm'>
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className='text-muted-foreground transition-colors hover:text-foreground'>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className='font-display text-sm font-semibold'>Contact</h2>
          <address className='mt-4 space-y-2.5 text-sm not-italic'>
            <a
              href={`https://www.google.com/maps?q=${encodeURIComponent(address)}`}
              target='_blank'
              rel='noreferrer'
              className='flex items-start gap-2 text-muted-foreground transition-colors hover:text-foreground'>
              <MapPin className='mt-0.5 size-4 shrink-0' aria-hidden />
              <span>{address}</span>
            </a>
            {phones.map((p) => (
              <a
                key={p}
                href={`tel:${p}`}
                className='flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground'>
                <Phone className='size-4 shrink-0' aria-hidden />
                <span>{p}</span>
              </a>
            ))}
            <a
              href={`mailto:${email}`}
              className='flex items-center gap-2 break-all text-muted-foreground transition-colors hover:text-foreground'>
              <Mail className='size-4 shrink-0' aria-hidden />
              <span>{email}</span>
            </a>
          </address>
        </div>

        <div>
          <h2 className='font-display text-sm font-semibold'>Follow along</h2>
          <ul className='mt-4 space-y-2.5 text-sm'>
            {socialLinks.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target='_blank'
                  rel='noreferrer'
                  className='flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground'>
                  <Icon className='size-4' />
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className='border-t py-6'>
        <p className='site-container text-center text-xs text-muted-foreground'>
          © {new Date().getFullYear()} {LEGAL_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
