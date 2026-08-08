"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

/**
 * Filter controls that write to the URL rather than to component state.
 *
 * This keeps the surrounding pages server-rendered: every filter and page of
 * results is a real, crawlable, shareable URL, and the list itself never has
 * to be shipped to the browser to be filtered.
 */

function useQueryUpdater() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return React.useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      // Any filter change invalidates the current page offset.
      if (!("page" in updates)) params.delete("page");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );
}

export function DestinationFilter({
  options,
  value,
}: {
  options: string[];
  value?: string;
}) {
  const update = useQueryUpdater();

  return (
    <div className='w-full max-w-xs'>
      <label
        htmlFor='destination-filter'
        className='mb-1.5 block text-sm font-medium'>
        Filter by destination
      </label>
      <Select
        value={value ?? "__all__"}
        onValueChange={(v) =>
          update({ destination: v === "__all__" ? undefined : v })
        }>
        <SelectTrigger id='destination-filter' className='w-full'>
          <SelectValue placeholder='All destinations' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='__all__'>All destinations</SelectItem>
          {options.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function SearchField({
  defaultValue,
  label = "Search",
  placeholder = "Search…",
  id = "search-field",
}: {
  defaultValue?: string;
  label?: string;
  placeholder?: string;
  id?: string;
}) {
  const update = useQueryUpdater();
  const [value, setValue] = React.useState(defaultValue ?? "");

  // Debounced so typing doesn't fire a navigation per keystroke.
  React.useEffect(() => {
    const t = setTimeout(() => {
      update({ q: value.trim() || undefined });
    }, 350);
    return () => clearTimeout(t);
    // `update` is stable per URL; re-running on it would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className='w-full max-w-md'>
      <label htmlFor={id} className='mb-1.5 block text-sm font-medium'>
        {label}
      </label>
      <div className='relative'>
        <Search
          className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground'
          aria-hidden
        />
        <Input
          id={id}
          type='search'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className='pl-9'
        />
      </div>
    </div>
  );
}
