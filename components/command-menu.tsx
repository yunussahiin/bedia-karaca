"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  IconArticle,
  IconBook,
  IconCalendar,
  IconDashboard,
  IconHeadphones,
  IconMail,
  IconPlus,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";

interface CommandMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Keyboard shortcuts:
// Ctrl+K - Open command menu (works on Mac and Windows)
// Ctrl+N - New blog post
// Ctrl+D - Dashboard
// Ctrl+B - Blog
// Ctrl+R - Appointments
// Ctrl+P - Podcasts
// Ctrl+M - Messages
// Ctrl+S - Settings

interface ShortcutDisplay {
  keys: string[];
}

const pages: {
  title: string;
  url: string;
  icon: typeof IconDashboard;
  shortcut?: ShortcutDisplay;
}[] = [
  {
    title: "Dashboard",
    url: "/ops/dashboard",
    icon: IconDashboard,
    shortcut: { keys: ["Ctrl", "D"] },
  },
  {
    title: "Blog Yazıları",
    url: "/ops/dashboard/blog",
    icon: IconArticle,
    shortcut: { keys: ["Ctrl", "B"] },
  },
  {
    title: "Yeni Blog Yazısı",
    url: "/ops/dashboard/blog/new",
    icon: IconPlus,
    shortcut: { keys: ["Ctrl", "N"] },
  },
  {
    title: "Podcast",
    url: "/ops/dashboard/podcasts",
    icon: IconHeadphones,
    shortcut: { keys: ["Ctrl", "P"] },
  },
  {
    title: "Yayınlar",
    url: "/ops/dashboard/publications",
    icon: IconBook,
    shortcut: { keys: ["Ctrl", "Y"] },
  },
  {
    title: "Randevu Talepleri",
    url: "/ops/dashboard/appointments?tab=appointments",
    icon: IconCalendar,
    shortcut: { keys: ["Ctrl", "R"] },
  },
  {
    title: "Randevu Takvimi",
    url: "/ops/dashboard/appointments?tab=calendar",
    icon: IconCalendar,
  },
  {
    title: "Randevu İstatistikleri",
    url: "/ops/dashboard/appointments?tab=stats",
    icon: IconCalendar,
  },
  {
    title: "Müsaitlik Ayarları",
    url: "/ops/dashboard/appointments?tab=availability",
    icon: IconCalendar,
  },
  {
    title: "Mesajlar",
    url: "/ops/dashboard/messages",
    icon: IconMail,
    shortcut: { keys: ["Ctrl", "M"] },
  },
  {
    title: "Hesap",
    url: "/ops/dashboard/account",
    icon: IconUser,
    shortcut: { keys: ["Ctrl", "A"] },
  },
  {
    title: "Ayarlar",
    url: "/ops/dashboard/settings",
    icon: IconSettings,
    shortcut: { keys: ["Ctrl", "S"] },
  },
];

const quickActions: {
  title: string;
  url: string;
  icon: typeof IconDashboard;
  shortcut: ShortcutDisplay;
}[] = [
  {
    title: "Yeni Blog Yazısı Oluştur",
    url: "/ops/dashboard/blog/new",
    icon: IconPlus,
    shortcut: { keys: ["Ctrl", "N"] },
  },
  {
    title: "Randevuları Görüntüle",
    url: "/ops/dashboard/appointments",
    icon: IconCalendar,
    shortcut: { keys: ["Ctrl", "R"] },
  },
];

function ShortcutKeys({ keys }: { keys: string[] }) {
  return (
    <span className="ml-auto flex items-center gap-0.5">
      {keys.map((key, i) => (
        <Kbd key={i} className="text-[10px] px-1 min-w-4">
          {key}
        </Kbd>
      ))}
    </span>
  );
}

export function CommandMenu({
  open: controlledOpen,
  onOpenChange,
}: CommandMenuProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const router = useRouter();

  const isOpen = controlledOpen ?? internalOpen;
  const setIsOpen = React.useCallback(
    (newOpen: boolean) => {
      if (onOpenChange) {
        onOpenChange(newOpen);
      } else {
        setInternalOpen(newOpen);
      }
    },
    [onOpenChange]
  );

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Only handle Ctrl key shortcuts (not Cmd on Mac for now)
      if (!e.ctrlKey) return;

      // Ignore modifier keys alone (Control, Shift, etc.)
      if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) return;

      const key = e.key.toLowerCase();

      // Ctrl+K to open/close command menu
      if (key === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
        return;
      }

      // All other shortcuts work even when menu is open
      const routes: Record<string, string> = {
        n: "/ops/dashboard/blog/new",
        d: "/ops/dashboard",
        b: "/ops/dashboard/blog",
        r: "/ops/dashboard/appointments",
        p: "/ops/dashboard/podcasts",
        y: "/ops/dashboard/publications",
        m: "/ops/dashboard/messages",
        a: "/ops/dashboard/account",
        s: "/ops/dashboard/settings",
      };

      if (routes[key]) {
        e.preventDefault();
        setIsOpen(false); // Close menu before navigating
        router.push(routes[key]);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setIsOpen, router]);

  const runCommand = React.useCallback(
    (command: () => void) => {
      setIsOpen(false);
      command();
    },
    [setIsOpen]
  );

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandList>
        <CommandEmpty>Komut bulunamadı.</CommandEmpty>

        <CommandGroup heading="Hızlı İşlemler">
          {quickActions.map((action) => (
            <CommandItem
              key={action.url}
              value={action.title}
              onSelect={() => runCommand(() => router.push(action.url))}
            >
              <action.icon className="mr-2 h-4 w-4" />
              <span>{action.title}</span>
              {action.shortcut && <ShortcutKeys keys={action.shortcut.keys} />}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Sayfalar">
          {pages.map((page) => (
            <CommandItem
              key={page.url}
              value={page.title}
              onSelect={() => runCommand(() => router.push(page.url))}
            >
              <page.icon className="mr-2 h-4 w-4" />
              <span>{page.title}</span>
              {page.shortcut && <ShortcutKeys keys={page.shortcut.keys} />}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

// Hook to use command menu
export function useCommandMenu() {
  const [open, setOpen] = React.useState(false);

  const toggle = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return { open, setOpen, toggle };
}
