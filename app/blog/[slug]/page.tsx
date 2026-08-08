import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/StructuredData";
import { RichContent } from "@/components/site/RichContent";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import { api } from "@/convex/_generated/api";
import { richTextToPlain } from "@/lib/rich-text";
import { SITE_NAME } from "@/lib/site";
import { fetchQuery } from "convex/nextjs";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 300;

/** Pre-render every post at build time; new ones are picked up by ISR. */
export async function generateStaticParams() {
  try {
    const posts = await fetchQuery(api.blog.getBlog);
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

async function getPost(slug: string) {
  return fetchQuery(api.blog.getBlogBySlug, { slug }).catch(() => null);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post not found",
      description: "The requested blog post could not be found.",
      robots: { index: false, follow: true },
    };
  }

  const description =
    richTextToPlain(post.content, 158) ||
    `Read this travel story from ${SITE_NAME}.`;

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `/blog/${slug}`,
      publishedTime: new Date(post._creationTime).toISOString(),
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  // The article used to be fetched client-side, so a crawler saw only a
  // skeleton. It is now fully present in the server HTML.
  if (!post) notFound();

  const published = new Date(post._creationTime);

  return (
    <>
      <ArticleStructuredData
        title={post.title}
        description={richTextToPlain(post.content, 200)}
        image={post.image}
        url={`/blog/${slug}`}
        publishedAt={post._creationTime}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${slug}` },
        ]}
      />

      <Section as='article' size='loose' className='max-w-3xl'>
        <Link
          href='/blog'
          className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground'>
          <ArrowLeft className='size-4' aria-hidden />
          All stories
        </Link>

        <header className='mt-6'>
          <h1 className='text-4xl font-semibold leading-tight md:text-5xl'>
            {post.title}
          </h1>
          <div className='mt-5 flex flex-wrap items-center gap-4'>
            <time
              dateTime={published.toISOString()}
              className='text-sm text-muted-foreground'>
              {format(published, "d MMMM yyyy")}
            </time>
            <ShareButton
              title={post.title}
              text={`Check this out: ${post.title}`}
            />
          </div>
        </header>

        <div className='relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl'>
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            fetchPriority='high'
            sizes='(min-width: 768px) 768px, 100vw'
            className='object-cover'
          />
        </div>

        <RichContent value={post.content} className='mt-10 max-w-3xl mx-auto' />

        <aside className='mt-16 rounded-3xl bg-accent px-6 py-10 text-center sm:px-12'>
          <h2 className='text-2xl font-semibold'>Inspired to go?</h2>
          <p className='mx-auto mt-3 max-w-md text-muted-foreground'>
            We&apos;ll turn this into a real itinerary, with real dates and a
            real price.
          </p>
          <Button asChild size='xl' variant='brand' className='mt-7'>
            <Link href='/packages'>Browse packages</Link>
          </Button>
        </aside>
      </Section>
    </>
  );
}
