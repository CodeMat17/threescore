"use client";

import { ShareButton } from "@/components/ui/share-button";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import dayjs from "dayjs";
import Image from "next/image";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";

export default function BlogPostClient({ slug }: { slug: string }) {
  const post = useQuery(api.blog.getBlogBySlug, slug ? { slug } : "skip");

  if (post === undefined) {
    return (
      <article className='container mx-auto space-y-6 px-4 py-10'>
        <div className='h-8 w-64 rounded bg-muted animate-pulse' />
        <div className='relative h-72 w-full overflow-hidden rounded-md border'>
          <div className='h-full w-full bg-muted animate-pulse' />
        </div>
        <div className='space-y-2'>
          <div className='h-4 w-5/6 rounded bg-muted animate-pulse' />
          <div className='h-4 w-4/6 rounded bg-muted animate-pulse' />
          <div className='h-4 w-3/6 rounded bg-muted animate-pulse' />
        </div>
      </article>
    );
  }

  if (post === null) return notFound();

  type TiptapNode = { type?: string; text?: string; content?: TiptapNode[] };
  const convertJsonContentToHtml = (raw: string): string => {
    try {
      const parsed = JSON.parse(raw) as {
        type?: string;
        content?: TiptapNode[];
      };
      if (parsed?.type !== "doc" || !Array.isArray(parsed.content)) return raw;
      const escapeHtml = (s: string) =>
        s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const textFromNodes = (nodes: TiptapNode[] | undefined): string => {
        if (!Array.isArray(nodes)) return "";
        return nodes
          .map((n) => {
            if (n?.type === "text" && typeof n.text === "string")
              return escapeHtml(n.text);
            if (Array.isArray(n?.content)) return textFromNodes(n.content);
            return "";
          })
          .join("");
      };
      const paragraphs = parsed.content
        .filter((n) => n?.type === "paragraph")
        .map((p) => `<p>${textFromNodes(p.content)}</p>`)
        .join('<p class="my-0.5 leading-none">&nbsp;</p>');
      return paragraphs || raw;
    } catch {
      return raw;
    }
  };

  const rawHtml = (() => {
    const trimmed = String(post.content ?? "").trim();
    return trimmed.startsWith("{")
      ? convertJsonContentToHtml(trimmed)
      : trimmed;
  })();

  const safeHtml = sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "h3",
      "blockquote",
      "p",
      "ul",
      "ol",
      "li",
      "strong",
      "em",
      "a",
      "br",
    ]),
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "data", "mailto"],
  });

  return (
    <article className='container max-w-4xl mx-auto space-y-6 px-4 py-10'>
      <header className='space-y-2'>
        <h1 className='text-3xl font-bold md:text-4xl'>{post.title}</h1>
        <div className='text-sm text-muted-foreground'>
          {dayjs(post._creationTime).format("DD MMM YYYY")}
        </div>
        <div className='flex items-center gap-3 pt-2'>
          <ShareButton
            title={post.title}
            text={`Check this out: ${post.title}`}
          />
        </div>
      </header>
      <div className='relative h-72 w-full overflow-hidden rounded-md border'>
        <Image
          src={post.image}
          alt={post.title}
          fill
          className='object-cover'
        />
      </div>
      <div
        className='prose max-w-none dark:prose-invert'
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </article>
  );
}
