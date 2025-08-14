import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import BlogPostClient from "./BlogPostClient";

// Helper function to extract plain text from JSON content
function extractTextFromJsonContent(content: string): string {
  try {
    type TiptapNode = {
      type?: string;
      text?: string;
      content?: TiptapNode[];
    };

    const parsed = JSON.parse(content) as {
      type?: string;
      content?: TiptapNode[];
    };

    if (parsed?.type !== "doc" || !Array.isArray(parsed.content)) {
      return content;
    }

    const extractTextFromNodes = (nodes: TiptapNode[]): string => {
      if (!Array.isArray(nodes)) return "";

      return nodes
        .map((node) => {
          if (node?.type === "text" && typeof node.text === "string") {
            return node.text;
          }
          if (Array.isArray(node?.content)) {
            return extractTextFromNodes(node.content);
          }
          return "";
        })
        .join("");
    };

    return extractTextFromNodes(parsed.content);
  } catch {
    // If parsing fails, try to strip HTML tags as fallback
    return content.replace(/<[^>]*>/g, "");
  }
}

// Generate metadata for dynamic blog pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

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
      ? extractTextFromJsonContent(post.content).trim().substring(0, 160) +
        "..."
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}
