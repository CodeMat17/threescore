"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function BlogPage() {
  const blogPosts = useQuery(api.blog.getBlog);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filteredPosts = useMemo(() => {
    if (!blogPosts) return [];
    const query = searchTerm.trim().toLowerCase();
    if (!query) return blogPosts;
    return blogPosts.filter((post) => post.title.toLowerCase().includes(query));
  }, [blogPosts, searchTerm]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((filteredPosts?.length || 0) / pageSize));
  }, [filteredPosts?.length]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const pagedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage]);

  const goToPage = (page: number) => {
    const clamped = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(clamped);
  };

  const pageItems = useMemo<(number | "ellipsis")[]>(() => {
    if (!totalPages) return [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis", totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [
        1,
        "ellipsis",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages,
    ];
  }, [currentPage, totalPages]);

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <div className='container max-w-6xl mx-auto space-y-8 px-4 py-10'>
      <div className='max-w-2xl'>
        <h1 className='text-3xl font-bold md:text-4xl'>Stories & Tips</h1>
        <p className='mt-2 text-muted-foreground'>
          Adventure stories, destination highlights, and travel tips.
        </p>
      </div>

      <div className='max-w-md'>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='Search posts'
        />
      </div>

      <div className='grid gap-6 lg:gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {blogPosts === undefined ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className='overflow-hidden'>
              <div className='relative h-44 w-full bg-muted animate-pulse' />
              <CardHeader>
                <CardTitle className='text-lg'>
                  <div className='h-5 w-48 rounded bg-muted animate-pulse' />
                </CardTitle>
                <CardDescription>
                  <div className='h-4 w-24 rounded bg-muted animate-pulse' />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-4 w-20 rounded bg-muted animate-pulse' />
              </CardContent>
            </Card>
          ))
        ) : !blogPosts || blogPosts.length < 1 ? (
          <div className='text-sm text-muted-foreground'>
            No blog posts yet. Please check back soon.
          </div>
        ) : filteredPosts.length < 1 ? (
          <div className='text-sm text-muted-foreground'>
            No posts match your search.
          </div>
        ) : (
          pagedPosts.map((p) => (
            <Card key={p.slug} className='overflow-hidden'>
              <div className='relative h-44 w-full'>
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className='object-cover'
                />
              </div>
              <CardHeader>
                <CardTitle className='text-lg'>
                  <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                </CardTitle>
                <CardDescription>
                  {dayjs(p._creationTime).format("DD MMM YYYY")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant={"outline"} className='shadow-md'>
                  <Link href={`/blog/${p.slug}`}>Read More</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {blogPosts !== undefined && filteredPosts.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={isPrevDisabled ? undefined : "#"}
                aria-disabled={isPrevDisabled}
                tabIndex={isPrevDisabled ? -1 : 0}
                className={
                  isPrevDisabled ? "pointer-events-none opacity-50" : undefined
                }
                onClick={(e) => {
                  e.preventDefault();
                  if (!isPrevDisabled) goToPage(currentPage - 1);
                }}
              />
            </PaginationItem>
            {pageItems.map((item, idx) => (
              <PaginationItem key={`${item}-${idx}`}>
                {item === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href='#'
                    isActive={item === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(item as number);
                    }}>
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={isNextDisabled ? undefined : "#"}
                aria-disabled={isNextDisabled}
                tabIndex={isNextDisabled ? -1 : 0}
                className={
                  isNextDisabled ? "pointer-events-none opacity-50" : undefined
                }
                onClick={(e) => {
                  e.preventDefault();
                  if (!isNextDisabled) goToPage(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <div className='text-sm text-muted-foreground'>
        Follow us on{" "}
        <a
          className='underline'
          href='https://instagram.com/threescoreexquisite_cotravel'
          target='_blank'
          rel='noreferrer'>
          Instagram
        </a>{" "}
        and{" "}
        <a
          className='underline'
          href='https://facebook.com/Threescore Luxury Tours'
          target='_blank'
          rel='noreferrer'>
          Facebook
        </a>{" "}
        for live travel updates.
      </div>
    </div>
  );
}
