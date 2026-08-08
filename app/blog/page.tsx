import { BreadcrumbStructuredData } from "@/components/StructuredData";
import { SearchField } from "@/components/site/Filters";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/Reveal";
import { Section } from "@/components/site/Section";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { pageMetadata } from "@/lib/metadata";
import { richTextToPlain } from "@/lib/rich-text";
import { company } from "@/lib/data";
import { fetchQuery } from "convex/nextjs";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Stories & Tips",
  description:
    "Travel stories, destination guides, and expert tips for your East Africa adventure — from wildlife photography to cultural experiences.",
  path: "/blog",
  keywords: [
    "travel blog East Africa",
    "safari tips",
    "Kenya travel guide",
    "Tanzania stories",
    "Uganda adventures",
    "destination guides",
  ],
});

const PAGE_SIZE = 9;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page: pageParam } = await searchParams;
  const posts = await fetchQuery(api.blog.getBlog).catch(() => []);

  const query = q.trim().toLowerCase();

  // Search and paginate during the server render. Previously the browser
  // downloaded every post on every visit and sliced them client-side.
  const matching = query
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.content.toLowerCase().includes(query)
      )
    : posts;

  const sorted = [...matching].sort(
    (a, b) => b._creationTime - a._creationTime
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const visible = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hrefFor = (target: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ]}
      />

      <Section size='loose'>
        <Reveal className='max-w-2xl'>
          <p className='mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary'>
            From the field
          </p>
          <h1 className='text-4xl font-semibold md:text-5xl'>Stories & tips</h1>
          <p className='mt-4 text-lg text-muted-foreground'>
            Destination guides, packing advice, and notes from the road.
          </p>
        </Reveal>

        <div className='mt-10 border-b pb-6'>
          <SearchField
            id='blog-search'
            defaultValue={q}
            label='Search articles'
            placeholder='Try “Maasai Mara” or “packing”'
          />
        </div>

        {visible.length === 0 ? (
          <p className='mt-12 text-muted-foreground'>
            {query
              ? `No posts match “${q}”.`
              : "No posts yet — check back soon."}
          </p>
        ) : (
          <RevealGroup className='mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {visible.map((post, i) => (
              <RevealItem key={post.slug} className='h-full'>
                <Card className='group relative flex h-full flex-col gap-0 overflow-hidden py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
                  <div className='relative aspect-[16/10] w-full overflow-hidden'>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      priority={i < 3}
                      loading={i < 3 ? undefined : "lazy"}
                      sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 92vw'
                      className='object-cover transition-transform duration-700 group-hover:scale-[1.06]'
                    />
                  </div>
                  <CardHeader className='flex-1 py-3'>
                    <CardDescription className='text-xs'>
                      <time dateTime={new Date(post._creationTime).toISOString()}>
                        {format(new Date(post._creationTime), "d MMM yyyy")}
                      </time>
                    </CardDescription>
                    <CardTitle className='text-lg leading-snug'>
                      <Link
                        href={`/blog/${post.slug}`}
                        className='after:absolute after:inset-0 group-hover:text-primary'>
                        {post.title}
                      </Link>
                    </CardTitle>
                    <p className='line-clamp-3 text-sm text-muted-foreground'>
                      {richTextToPlain(post.content, 140)}
                    </p>
                    <span className='mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary'>
                      Read more
                      <ArrowRight
                        className='size-4 transition-transform group-hover:translate-x-0.5'
                        aria-hidden
                      />
                    </span>
                  </CardHeader>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
        )}

        {totalPages > 1 && (
          // Real <a> links, so each page is crawlable and shareable.
          <nav
            aria-label='Blog pagination'
            className='mt-12 flex items-center justify-center gap-2'>
            <PageLink
              href={hrefFor(page - 1)}
              disabled={page === 1}
              label='Previous page'>
              Previous
            </PageLink>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={hrefFor(n)}
                aria-label={`Page ${n}`}
                aria-current={n === page ? "page" : undefined}
                className={
                  n === page
                    ? "inline-flex size-9 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground"
                    : "inline-flex size-9 items-center justify-center rounded-md text-sm hover:bg-accent"
                }>
                {n}
              </Link>
            ))}
            <PageLink
              href={hrefFor(page + 1)}
              disabled={page === totalPages}
              label='Next page'>
              Next
            </PageLink>
          </nav>
        )}

        <p className='mt-14 text-sm text-muted-foreground'>
          Follow us on{" "}
          <a
            className='text-primary underline underline-offset-4'
            href={company.instagram}
            target='_blank'
            rel='noreferrer'>
            Instagram
          </a>{" "}
          and{" "}
          <a
            className='text-primary underline underline-offset-4'
            href={company.facebook}
            target='_blank'
            rel='noreferrer'>
            Facebook
          </a>{" "}
          for live travel updates.
        </p>
      </Section>
    </>
  );
}

function PageLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-disabled='true'
        className='inline-flex h-9 items-center rounded-md px-3 text-sm text-muted-foreground opacity-50'>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className='inline-flex h-9 items-center rounded-md px-3 text-sm hover:bg-accent'>
      {children}
    </Link>
  );
}
