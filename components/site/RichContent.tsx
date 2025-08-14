"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

type RichContentProps = {
  value?: string | Record<string, unknown>;
};

export function RichContent({ value }: RichContentProps) {
  const initialContent =
    typeof value === "string"
      ? value
      : value && typeof value === "object"
        ? (value as Record<string, unknown>)
        : undefined;

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent ?? "",
    immediatelyRender: false,
    editable: false,
    editorProps: {
      attributes: {
        class: "prose max-w-none dark:prose-invert",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (typeof value === "string") editor.commands.setContent(value);
    else if (value && typeof value === "object")
      editor.commands.setContent(value as Record<string, unknown>);
  }, [editor, value]);

  return <EditorContent editor={editor} />;
}
