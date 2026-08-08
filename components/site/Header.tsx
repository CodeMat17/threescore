"use client";

import { MobileNavSheet } from "@/components/site/MobileNavSheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import Logo from "../Logo";

const navItems: Array<{ href: string; label: string }> = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/packages", label: "Packages" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [scrolled, setScrolled] = React.useState(false);

  // Solid background once the page has scrolled, so the nav stays legible over
  // the hero photograph without needing a permanent opaque bar.
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-shadow duration-300",
        scrolled
          ? "border-b bg-background/85 shadow-sm backdrop-blur-md"
          : "bg-background/70 backdrop-blur-sm"
      )}>
      <div className='site-container flex h-20 items-center justify-between gap-4'>
        <Link
          href='/'
          className='flex items-center gap-3 rounded-md'
          aria-label='Threescore Exquisite Collections — home'>
          <Logo className='size-12' />
          {/* Shortened rather than hidden at md: the previous
              `hidden sm:flex md:hidden lg:flex` made the brand vanish
              entirely on tablets. */}
          <span className='hidden font-display text-base font-semibold leading-tight sm:block lg:text-lg'>
            Threescore
            <span className='hidden text-muted-foreground lg:inline'>
              {" "}
              Exquisite Collections
            </span>
          </span>
        </Link>

        <nav aria-label='Main' className='hidden md:block'>
          <ul className='flex items-center gap-1'>
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}>
                    {item.label}
                    {active && (
                      <span
                        aria-hidden
                        className='absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary'
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className='flex items-center gap-2'>
          <Button asChild variant='brand' className='hidden sm:inline-flex'>
            <Link href='/contact'>Plan my trip</Link>
          </Button>
          <Button
            size='icon'
            variant='outline'
            aria-label={
              resolvedTheme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }>
            {/* Rendered via CSS `dark:` rather than from state, so the correct
                icon is present before hydration resolves the theme. */}
            <MoonStar className='hidden size-4 dark:inline' />
            <Sun className='inline size-4 dark:hidden' />
          </Button>

          <MobileNavSheet navItems={navItems} pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
