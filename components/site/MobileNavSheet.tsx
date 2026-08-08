"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export type NavItem = { href: string; label: string };

type MobileNavSheetProps = {
  navItems: NavItem[];
  pathname: string;
};

export function MobileNavSheet({ navItems, pathname }: MobileNavSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          aria-label='Open menu'
          className='md:hidden'>
          <Menu className='size-4' />
        </Button>
      </SheetTrigger>
      {/* `bg-background` rather than `bg-white dark:bg-slate-950`, so the
          drawer follows the theme tokens like everything else. */}
      <SheetContent
        side='right'
        className='flex h-full w-[85vw] max-w-xs flex-col border-l bg-background text-foreground'>
        <SheetHeader className='flex items-center justify-between space-y-0'>
          <SheetTitle>Menu</SheetTitle>
          <SheetClose
            aria-label='Close menu'
            className='inline-flex size-9 items-center justify-center rounded-md border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'>
            <X className='size-4' />
          </SheetClose>
        </SheetHeader>
        <nav aria-label='Mobile' className='flex flex-1 flex-col gap-1 p-2'>
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <SheetClose key={item.href} asChild>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}>
                  {item.label}
                </Link>
              </SheetClose>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
