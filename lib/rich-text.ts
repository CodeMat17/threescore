import sanitizeHtml from "sanitize-html";

/**
 * Turn CMS rich text into safe HTML, server-side.
 *
 * The editor (`TiptapEditor`) can persist either an HTML string or a
 * ProseMirror JSON document, so both shapes are handled here. Everything is
 * run through `sanitize-html` before it reaches `dangerouslySetInnerHTML`.
 */

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr", "strong", "b", "em", "i", "u", "s", "code", "pre",
    "blockquote", "ul", "ol", "li", "a", "img", "figure", "figcaption",
    "h1", "h2", "h3", "h4", "h5", "h6", "span", "div",
    "table", "thead", "tbody", "tr", "th", "td",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    "*": ["class"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  // Untrusted outbound links must not get access to `window.opener`.
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        ...(attribs.href?.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {}),
      },
    }),
    // CMS images are large; never let one block first paint.
    img: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, loading: "lazy", decoding: "async" },
    }),
  },
};

type ProseMirrorNode = {
  type?: string;
  text?: string;
  content?: ProseMirrorNode[];
  attrs?: Record<string, unknown>;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
};

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c] as string
  );

const MARK_TAGS: Record<string, string> = {
  bold: "strong",
  italic: "em",
  underline: "u",
  strike: "s",
  code: "code",
};

/** Minimal ProseMirror -> HTML walk covering the StarterKit node set. */
function nodeToHtml(node: ProseMirrorNode): string {
  if (node.type === "text") {
    let out = escapeHtml(node.text ?? "");
    for (const mark of node.marks ?? []) {
      if (mark.type === "link") {
        const href = escapeHtml(String(mark.attrs?.href ?? "#"));
        out = `<a href="${href}">${out}</a>`;
      } else if (MARK_TAGS[mark.type]) {
        out = `<${MARK_TAGS[mark.type]}>${out}</${MARK_TAGS[mark.type]}>`;
      }
    }
    return out;
  }

  const children = (node.content ?? []).map(nodeToHtml).join("");

  switch (node.type) {
    case "doc":
      return children;
    case "paragraph":
      return `<p>${children}</p>`;
    case "heading": {
      const level = Math.min(Math.max(Number(node.attrs?.level ?? 2), 1), 6);
      return `<h${level}>${children}</h${level}>`;
    }
    case "bulletList":
      return `<ul>${children}</ul>`;
    case "orderedList":
      return `<ol>${children}</ol>`;
    case "listItem":
      return `<li>${children}</li>`;
    case "blockquote":
      return `<blockquote>${children}</blockquote>`;
    case "codeBlock":
      return `<pre><code>${children}</code></pre>`;
    case "horizontalRule":
      return "<hr />";
    case "hardBreak":
      return "<br />";
    case "image": {
      const src = escapeHtml(String(node.attrs?.src ?? ""));
      const alt = escapeHtml(String(node.attrs?.alt ?? ""));
      return src ? `<img src="${src}" alt="${alt}" />` : "";
    }
    default:
      return children;
  }
}

export function renderRichText(
  value?: string | Record<string, unknown> | null
): string {
  if (!value) return "";

  let raw: string;

  if (typeof value === "string") {
    // The editor persists either HTML or a stringified ProseMirror document.
    const trimmed = value.trim();
    raw = trimmed.startsWith("{") ? fromJsonString(trimmed) : trimmed;
  } else {
    raw = nodeToHtml(value as unknown as ProseMirrorNode);
  }

  return sanitizeHtml(raw, SANITIZE_OPTIONS).trim();
}

function fromJsonString(input: string): string {
  try {
    const parsed = JSON.parse(input) as ProseMirrorNode;
    if (parsed?.type !== "doc") return input;
    return nodeToHtml(parsed);
  } catch {
    // Not JSON after all — treat it as HTML and let the sanitizer decide.
    return input;
  }
}

/**
 * Plain-text projection of rich content, for meta descriptions and JSON-LD
 * where markup would be noise.
 */
export function richTextToPlain(
  value?: string | Record<string, unknown> | null,
  maxLength = 160
): string {
  const text = sanitizeHtml(renderRichText(value), {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).replace(/\s+\S*$/, "")}…`;
}
