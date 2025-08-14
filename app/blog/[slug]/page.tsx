import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import BlogPostClient from "./BlogPostClient";

// Generate metadata for dynamic blog pages
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;

  try {
    const post = await fetchQuery(api.blog.getBlogBySlug, { slug });

    if (!post) {
      return {
        title: "Post Not Found",
        description: "The requested blog post could not be found.",
      };
    }

    // Extract first 160 characters from content for description
    const contentText = post.content
      ? post.content.replace(/<[^>]*>/g, "").substring(0, 160) + "..."
      : "Read this exciting travel story and tips from Threescore Tours.";

    return {
      title: post.title,
      description: contentText,
      keywords: [
        "travel blog",
        "East Africa travel",
        "safari stories",
        "travel tips",
        "adventure travel",
        "Kenya stories",
        "Tanzania adventures",
        "Uganda experiences",
      ],
      alternates: {
        canonical: `/blog/${slug}`,
      },
      openGraph: {
        title: `${post.title} — Threescore Tours`,
        description: contentText,
        type: "article",
        publishedTime: new Date(post._creationTime).toISOString(),
        images: [
          {
            url: post.image,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${post.title} — Threescore Tours`,
        description: contentText,
        images: [post.image],
      },
    };
  } catch {
    return {
      title: "Blog Post",
      description:
        "Discover amazing travel stories and tips from Threescore Tours.",
    };
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostClient slug={params.slug} />;
}
