/**
 * Shared TipTap Extension Configuration
 * 
 * Bu dosya hem editor hem de server-side renderer tarafından kullanılır.
 * Extension'ları tek bir yerde tanımlayarak tutarlılık sağlanır.
 */

import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Typography from '@tiptap/extension-typography'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'

/**
 * Editor Extensions - Client-side için (Placeholder dahil değil)
 * Placeholder sadece editor'de kullanılır, renderer'da değil.
 */
export function getEditorExtensions() {
  return [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary underline hover:text-primary/80',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    }),
    Image.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg my-4',
      },
    }),
    Typography,
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: 'border-collapse w-full my-4',
      },
    }),
    TableRow,
    TableCell.configure({
      HTMLAttributes: {
        class: 'border border-border p-2',
      },
    }),
    TableHeader.configure({
      HTMLAttributes: {
        class: 'border border-border p-2 bg-muted font-semibold',
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Superscript,
    Subscript,
    Highlight.configure({
      multicolor: true,
      HTMLAttributes: {
        class: 'bg-yellow-200/50 dark:bg-yellow-900/30 px-1 rounded',
      },
    }),
    TaskList.configure({
      HTMLAttributes: {
        class: 'task-list',
      },
    }),
    TaskItem.configure({
      nested: true,
      HTMLAttributes: {
        class: 'task-item',
      },
    }),
  ]
}

/**
 * Renderer Extensions - Server-side HTML generation için
 * Placeholder olmadan, sadece render için gerekli extension'lar
 */
export function getRendererExtensions() {
  return [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: 'font-semibold text-foreground',
        },
      },
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary underline hover:text-primary/80',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    }),
    Image.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg my-4',
      },
    }),
    Typography,
    Table.configure({
      resizable: false,
      HTMLAttributes: {
        class: 'border-collapse w-full my-4',
      },
    }),
    TableRow,
    TableCell.configure({
      HTMLAttributes: {
        class: 'border border-border p-2',
      },
    }),
    TableHeader.configure({
      HTMLAttributes: {
        class: 'border border-border p-2 bg-muted font-semibold',
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Superscript.configure({
      HTMLAttributes: {
        class: 'text-xs align-super',
      },
    }),
    Subscript.configure({
      HTMLAttributes: {
        class: 'text-xs align-sub',
      },
    }),
    Highlight.configure({
      multicolor: true,
      HTMLAttributes: {
        class: 'bg-yellow-200/50 dark:bg-yellow-900/30 px-1 rounded',
      },
    }),
    TaskList.configure({
      HTMLAttributes: {
        class: 'task-list list-none pl-0',
      },
    }),
    TaskItem.configure({
      nested: true,
      HTMLAttributes: {
        class: 'task-item flex items-start gap-2',
      },
    }),
  ]
}
