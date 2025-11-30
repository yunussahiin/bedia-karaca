"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconList,
  IconListNumbers,
  IconLink,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconH1,
  IconH2,
  IconH3,
  IconCode,
  IconQuote,
  IconUser,
  IconMail,
  IconUnlink,
  IconVariable,
} from "@tabler/icons-react";
import { useState, useCallback } from "react";

interface NewsletterEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const personalizationVariables = [
  {
    label: "Ad",
    variable: "{{{FIRST_NAME|there}}}",
    description: "Abonenin adı (yoksa 'there')",
  },
  {
    label: "Soyad",
    variable: "{{{LAST_NAME}}}",
    description: "Abonenin soyadı",
  },
  {
    label: "E-posta",
    variable: "{{{EMAIL}}}",
    description: "Abonenin e-posta adresi",
  },
  {
    label: "Abonelikten Çık",
    variable: "{{{RESEND_UNSUBSCRIBE_URL}}}",
    description: "Abonelikten çıkma linki",
  },
];

export function NewsletterEditor({ content, onChange }: NewsletterEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-emerald-600 underline",
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Bülten içeriğinizi buraya yazın...",
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[300px] p-4 focus:outline-none",
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setLinkUrl("");
    setLinkOpen(false);
  }, [editor, linkUrl]);

  const insertVariable = useCallback(
    (variable: string) => {
      if (!editor) return;
      editor.chain().focus().insertContent(variable).run();
    },
    [editor]
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex gap-0.5">
          <Button
            type="button"
            variant={editor.isActive("bold") ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <IconBold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("italic") ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <IconItalic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("underline") ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <IconUnderline className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("strike") ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <IconStrikethrough className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Headings */}
        <div className="flex gap-0.5">
          <Button
            type="button"
            variant={
              editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"
            }
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <IconH1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={
              editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"
            }
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <IconH2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={
              editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"
            }
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <IconH3 className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Lists */}
        <div className="flex gap-0.5">
          <Button
            type="button"
            variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <IconList className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <IconListNumbers className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Alignment */}
        <div className="flex gap-0.5">
          <Button
            type="button"
            variant={
              editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"
            }
            size="icon"
            className="h-8 w-8"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <IconAlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={
              editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"
            }
            size="icon"
            className="h-8 w-8"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <IconAlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={
              editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"
            }
            size="icon"
            className="h-8 w-8"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <IconAlignRight className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Block Elements */}
        <div className="flex gap-0.5">
          <Button
            type="button"
            variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <IconQuote className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("codeBlock") ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <IconCode className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Link */}
        <Popover open={linkOpen} onOpenChange={setLinkOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant={editor.isActive("link") ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
            >
              <IconLink className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-3">
              <Label>Link URL</Label>
              <Input
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={setLink}>
                  Ekle
                </Button>
                {editor.isActive("link") && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      editor.chain().focus().unsetLink().run();
                      setLinkOpen(false);
                    }}
                  >
                    <IconUnlink className="h-4 w-4 mr-1" />
                    Kaldır
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex-1" />

        {/* Personalization Variables */}
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="gap-1">
              <IconVariable className="h-4 w-4" />
              Kişiselleştir
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72" align="end">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Değişken Ekle</Label>
              <p className="text-xs text-muted-foreground">
                Tıklayarak editöre ekleyin
              </p>
              <div className="space-y-1 mt-3">
                {personalizationVariables.map((item) => (
                  <button
                    key={item.variable}
                    type="button"
                    onClick={() => insertVariable(item.variable)}
                    className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {item.label === "Ad" || item.label === "Soyad" ? (
                        <IconUser className="h-4 w-4 text-muted-foreground" />
                      ) : item.label === "E-posta" ? (
                        <IconMail className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <IconUnlink className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded mt-1 block">
                      {item.variable}
                    </code>
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Footer with tips */}
      <div className="border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
        <span className="font-medium">İpucu:</span> Kişiselleştirme değişkenleri
        e-posta gönderilirken otomatik olarak abone bilgileriyle değiştirilir.
      </div>
    </div>
  );
}
