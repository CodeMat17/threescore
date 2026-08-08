import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/ui/icons";
import { api } from "@/convex/_generated/api";
import { company } from "@/lib/data";
import { fetchQuery } from "convex/nextjs";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

/**
 * Contact page.
 *
 * The page shell and all contact details are server-rendered — they are the
 * most SEO-relevant content on the site for local search (name, address,
 * phone). There is no contact form — enquiries go straight to the company
 * mailbox via mailto, phone or WhatsApp.
 */
export default async function ContactClient() {
  const socials = await fetchQuery(api.socials.getSocials).catch(() => null);

  const address = company.address;
  const instagram = socials?.instagram ?? company.instagram;
  const facebook = socials?.facebook ?? company.facebook;

  const socialLinks = [
    { href: instagram, label: "Instagram", Icon: InstagramIcon },
    { href: facebook, label: "Facebook", Icon: FacebookIcon },
    { href: company.tiktok, label: "TikTok", Icon: TikTokIcon },
  ];

  return (
    <Section size='loose'>
      <div className='max-w-2xl'>
        <p className='mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary'>
          Get in touch
        </p>
        <h1 className='text-4xl font-semibold md:text-5xl'>
          Let&apos;s plan your trip
        </h1>
        <p className='mt-4 text-lg text-muted-foreground'>
          Email or call us with roughly what you have in mind. We usually reply
          within one business day.
        </p>
      </div>

      <div className='mt-12 grid gap-8 lg:grid-cols-2'>
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Contact details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-5 text-sm'>
              <div className='flex items-start gap-3'>
                <MapPin
                  className='mt-0.5 size-4 shrink-0 text-primary'
                  aria-hidden
                />
                <div>
                  <p className='font-medium'>Address</p>
                  <a
                    href={`https://www.google.com/maps?q=${encodeURIComponent(address)}`}
                    target='_blank'
                    rel='noreferrer'
                    className='text-muted-foreground underline underline-offset-4 hover:text-foreground'>
                    {address}
                  </a>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <Phone
                  className='mt-0.5 size-4 shrink-0 text-primary'
                  aria-hidden
                />
                <div>
                  <p className='font-medium'>Phone / WhatsApp</p>
                  <ul className='text-muted-foreground'>
                    {company.phones.map((p) => (
                      <li key={p}>
                        <a
                          href={`tel:${p}`}
                          className='underline underline-offset-4 hover:text-foreground'>
                          {p}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <Mail
                  className='mt-0.5 size-4 shrink-0 text-primary'
                  aria-hidden
                />
                <div className='min-w-0'>
                  <p className='font-medium'>Email</p>
                  <a
                    href={`mailto:${company.email}`}
                    className='break-all text-muted-foreground underline underline-offset-4 hover:text-foreground'>
                    {company.email}
                  </a>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <Clock
                  className='mt-0.5 size-4 shrink-0 text-primary'
                  aria-hidden
                />
                <div>
                  <p className='font-medium'>Business hours</p>
                  <ul className='text-muted-foreground'>
                    {company.businessHours.map((h) => (
                      <li key={h.label}>
                        {h.label}: {h.hours}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className='flex flex-wrap items-center gap-4 border-t pt-4'>
                {socialLinks.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target='_blank'
                    rel='noreferrer'
                    className='inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground'>
                    <Icon className='size-4' />
                    {label}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 text-sm text-muted-foreground'>
              <p>
                Email us with your dates, group size and the experience you have
                in mind, and we&apos;ll come back with a tailored itinerary.
              </p>
              <Button asChild>
                <a href={`mailto:${company.email}`}>
                  <Mail className='size-4' aria-hidden />
                  Email {company.email}
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className='overflow-hidden py-0'>
            <div className='aspect-video w-full'>
              <iframe
                title='Threescore Tours location on Google Maps'
                className='size-full border-0'
                src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
              />
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}
