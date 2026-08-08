import { renderRichText } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

type RichContentProps = {
  value?: string | Record<string, unknown>;
  className?: string;
};

/**
 * Read-only renderer for CMS content.
 *
 * This used to mount the full Tiptap editor (`@tiptap/react` + `@tiptap/pm` +
 * starter-kit, ~300kb) in `editable: false` mode purely to display HTML —
 * shipping an entire editing engine to every public visitor. It now sanitizes
 * on the server and renders plain markup styled by the `.rich-content` rules
 * in `globals.css`, so nothing Tiptap-related reaches the browser.
 */
export function RichContent({ value, className }: RichContentProps) {
  const html = renderRichText(value);
  if (!html) return null;

  return (
    <div
      className={cn("rich-content", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
