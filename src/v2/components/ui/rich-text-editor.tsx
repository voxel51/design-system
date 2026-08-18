import type { Editor } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Minus,
} from "lucide-react";
import { useRef } from "react";
import { cn } from "../../lib/utils";
import { TextAction } from "./text-action";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  editable?: boolean;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  editable = true,
  placeholder = "Write guidelines…",
  className,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image.configure({ HTMLAttributes: { class: "rounded-md max-w-full my-2" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    editable,
    editorProps: {
      attributes: {
        class: cn(
          "prose-tiptap focus:outline-none min-h-[200px] text-body leading-relaxed text-foreground",
          editable && "cursor-text",
        ),
      },
    },
    onUpdate: ({ editor }: { editor: Editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  if (!editable) {
    return (
      <div className={cn("prose-tiptap text-body leading-relaxed text-foreground", className)}>
        <EditorContent editor={editor} />
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border border-border/40 bg-card", className)}>
      <Toolbar editor={editor} onPickImage={() => fileInputRef.current?.click()} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            const src = reader.result as string;
            editor.chain().focus().setImage({ src }).run();
          };
          reader.readAsDataURL(file);
          e.target.value = "";
        }}
      />
      <div className="px-4 py-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Toolbar({ editor, onPickImage }: { editor: Editor; onPickImage: () => void }) {
  const btn = (active: boolean) =>
    cn(
      "flex h-7 w-7 items-center justify-center rounded-md text-icon hover:bg-card-2 hover:text-foreground transition-colors",
      active && "bg-card-2 text-foreground",
    );

  const setLink = () => {
    const previous = editor.getAttributes("link").href;
    const url = window.prompt("URL", previous || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex items-center gap-0.5 border-b border-border/30 px-2 py-1.5">
      <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
        <Bold className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
        <Italic className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={btn(editor.isActive("strike"))} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
        <Strikethrough className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={btn(editor.isActive("code"))} onClick={() => editor.chain().focus().toggleCode().run()} title="Inline code">
        <Code className="h-3.5 w-3.5" />
      </button>
      <Divider />
      <button type="button" className={btn(editor.isActive("heading", { level: 1 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading 1">
        <Heading1 className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
        <Heading2 className="h-3.5 w-3.5" />
      </button>
      <Divider />
      <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">
        <List className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">
        <ListOrdered className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote">
        <Quote className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={btn(false)} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
        <Minus className="h-3.5 w-3.5" />
      </button>
      <Divider />
      <button type="button" className={btn(editor.isActive("link"))} onClick={setLink} title="Link">
        <Link2 className="h-3.5 w-3.5" />
      </button>
      <button type="button" className={btn(false)} onClick={onPickImage} title="Image">
        <ImageIcon className="h-3.5 w-3.5" />
      </button>
      <div className="ml-auto flex items-center gap-0.5">
        <TextAction size="sm" onClick={() => editor.chain().focus().undo().run()} title="Undo" aria-label="Undo">
          <Undo2 className="h-3.5 w-3.5" />
        </TextAction>
        <TextAction size="sm" onClick={() => editor.chain().focus().redo().run()} title="Redo" aria-label="Redo">
          <Redo2 className="h-3.5 w-3.5" />
        </TextAction>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="mx-1 h-4 w-px bg-border/40" />;
}
