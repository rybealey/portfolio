"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Minus,
  Undo,
  Redo,
} from "lucide-react";

type Props = {
  content?: string;
  onChange: (html: string) => void;
};

export function RichTextEditor({ content = "", onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-brand underline underline-offset-2" },
      }),
      Placeholder.configure({
        placeholder:
          "Describe the project in detail. Cover the problem, approach, key features, and outcomes...",
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "min-h-[240px] p-4 text-sm leading-relaxed text-text-primary outline-none [&>p]:mb-3 [&>p:last-child]:mb-0 [&>h2]:mt-6 [&>h2]:mb-2 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-text-primary [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:text-base [&>h3]:font-semibold [&>h3]:text-text-primary [&>ul]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>li]:mb-1 [&>blockquote]:border-l-2 [&>blockquote]:border-brand [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-text-muted [&>pre]:mb-3 [&>pre]:overflow-x-auto [&>pre]:rounded-lg [&>pre]:bg-bg-card [&>pre]:p-3 [&>hr]:my-4 [&>hr]:border-border-light [&_.is-editor-empty:first-child::before]:text-text-muted [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.is-editor-empty:first-child::before]:pointer-events-none [&_.is-editor-empty:first-child::before]:h-0",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  function setLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  }

  const btnBase =
    "flex items-center justify-center h-7 w-7 rounded transition-colors";
  const active = "bg-brand/20 text-brand";
  const inactive = "text-text-muted hover:text-text-secondary hover:bg-bg-card";

  return (
    <div className="overflow-hidden rounded-md border border-border-light bg-bg-card-alt focus-within:border-brand/50">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border-light px-2 py-1.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${btnBase} ${editor.isActive("bold") ? active : inactive}`}
          title="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${btnBase} ${editor.isActive("italic") ? active : inactive}`}
          title="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>

        <div className="mx-1 h-4 w-px bg-border-light" />

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`${btnBase} ${editor.isActive("heading", { level: 2 }) ? active : inactive}`}
          title="Heading 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`${btnBase} ${editor.isActive("heading", { level: 3 }) ? active : inactive}`}
          title="Heading 3"
        >
          <Heading3 className="h-3.5 w-3.5" />
        </button>

        <div className="mx-1 h-4 w-px bg-border-light" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${btnBase} ${editor.isActive("bulletList") ? active : inactive}`}
          title="Bullet List"
        >
          <List className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${btnBase} ${editor.isActive("orderedList") ? active : inactive}`}
          title="Ordered List"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </button>

        <div className="mx-1 h-4 w-px bg-border-light" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${btnBase} ${editor.isActive("blockquote") ? active : inactive}`}
          title="Blockquote"
        >
          <Quote className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`${btnBase} ${editor.isActive("codeBlock") ? active : inactive}`}
          title="Code Block"
        >
          <Code className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={setLink}
          className={`${btnBase} ${editor.isActive("link") ? active : inactive}`}
          title="Link"
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={`${btnBase} ${inactive}`}
          title="Horizontal Rule"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>

        <div className="ml-auto flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className={`${btnBase} ${inactive} disabled:opacity-30`}
            title="Undo"
          >
            <Undo className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className={`${btnBase} ${inactive} disabled:opacity-30`}
            title="Redo"
          >
            <Redo className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
