"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { getEditorExtensions } from "@/lib/tiptap/extensions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  UnderlineIcon,
  Link2,
  Image as ImageIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Highlighter,
  CheckSquare2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ImageUploader } from "@/components/image-uploader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BlogEditorProps {
  content: string;
  onChange: (content: string) => void;
}

// Helper component for toolbar buttons with tooltips
const ToolbarButton = ({
  onClick,
  isActive,
  disabled,
  tooltip,
  icon: Icon,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  tooltip: string;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClick}
        disabled={disabled}
        className={isActive ? "bg-accent" : ""}
      >
        <Icon className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

export function BlogEditor({ content, onChange }: BlogEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUploaderOpen, setImageUploaderOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      ...getEditorExtensions(),
      CharacterCount,
      Placeholder.configure({
        placeholder: "Yazının içeriğini buraya yazın...",
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // TipTap JSON formatında kaydet (HTML değil!)
      const json = editor.getJSON();
      onChange(JSON.stringify(json));
    },
    editorProps: {
      attributes: {
        class:
          "tiptap focus:outline-none min-h-[400px] w-full p-4 border rounded-md",
      },
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content) {
      try {
        const currentJson = JSON.stringify(editor.getJSON());
        if (content !== currentJson) {
          const parsed = JSON.parse(content);
          editor.commands.setContent(parsed);
        }
      } catch {
        // Eğer parse edilemezse HTML olarak set et
        if (content !== editor.getHTML()) {
          editor.commands.setContent(content);
        }
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="space-y-2">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-gray-50 dark:bg-slate-900 dark:border-slate-700">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            tooltip="Kalın (Ctrl+B)"
            icon={Bold}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            tooltip="İtalik (Ctrl+I)"
            icon={Italic}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            tooltip="Altı Çizili (Ctrl+U)"
            icon={UnderlineIcon}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            tooltip="Üstü Çizili"
            icon={Strikethrough}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            tooltip="Kod"
            icon={Code}
          />

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            tooltip="Başlık 1"
            icon={Heading1}
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            tooltip="Başlık 2"
            icon={Heading2}
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            tooltip="Başlık 3"
            icon={Heading3}
          />

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            tooltip="Madde İşaretli Liste"
            icon={List}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            tooltip="Numaralı Liste"
            icon={ListOrdered}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            tooltip="Alıntı"
            icon={Quote}
          />

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          <ToolbarButton
            onClick={() => setLinkDialogOpen(true)}
            isActive={editor.isActive("link")}
            tooltip="Link Ekle"
            icon={Link2}
          />
          <ToolbarButton
            onClick={() => setImageUploaderOpen(true)}
            tooltip="Görsel Ekle"
            icon={ImageIcon}
          />
          <ToolbarButton
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            tooltip="Tablo Ekle"
            icon={TableIcon}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            tooltip="Yatay Çizgi"
            icon={Minus}
          />

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            tooltip="Sola Hizala"
            icon={AlignLeft}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            tooltip="Ortala"
            icon={AlignCenter}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            tooltip="Sağa Hizala"
            icon={AlignRight}
          />

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            tooltip="Geri Al (Ctrl+Z)"
            icon={Undo}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            tooltip="Yinele (Ctrl+Y)"
            icon={Redo}
          />

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            isActive={editor.isActive("superscript")}
            tooltip="Üst İndis"
            icon={SuperscriptIcon}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            isActive={editor.isActive("subscript")}
            tooltip="Alt İndis"
            icon={SubscriptIcon}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive("highlight")}
            tooltip="Vurgula"
            icon={Highlighter}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive("taskList")}
            tooltip="Yapılacak Listesi"
            icon={CheckSquare2}
          />
        </div>

        {/* Editor */}
        <div className="prose prose-neutral dark:prose-invert max-w-none [&_sup]:text-sm [&_sup]:align-super [&_sub]:text-sm [&_sub]:align-sub [&_mark]:bg-yellow-200/50 [&_mark]:dark:bg-yellow-900/30 [&_mark]:px-1 [&_mark]:rounded [&_.ProseMirror_ul_li]:list-disc [&_.ProseMirror_ol_li]:list-decimal [&_input[type='checkbox']]:w-5 [&_input[type='checkbox']]:h-5 [&_input[type='checkbox']]:accent-blue-600 [&_input[type='checkbox']]:dark:accent-blue-400">
          <EditorContent editor={editor} />
        </div>

        {/* Character Count */}
        <div className="flex justify-between text-xs text-gray-500 px-2">
          <span>
            {editor.storage.characterCount.characters()} karakter,{" "}
            {editor.storage.characterCount.words()} kelime
          </span>
        </div>

        {/* Image Uploader */}
        <ImageUploader
          open={imageUploaderOpen}
          onOpenChange={setImageUploaderOpen}
          onImageInsert={(url: string) => {
            editor.chain().focus().setImage({ src: url }).run();
          }}
        />

        {/* Link Dialog */}
        <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Link Ekle</DialogTitle>
              <DialogDescription>
                Eklemek istediğiniz linkin URL&apos;sini girin
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setLinkDialogOpen(false);
                  setLinkUrl("");
                }}
              >
                İptal
              </Button>
              <Button
                onClick={() => {
                  if (linkUrl) {
                    editor.chain().focus().setLink({ href: linkUrl }).run();
                  }
                  setLinkDialogOpen(false);
                  setLinkUrl("");
                }}
              >
                Ekle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
