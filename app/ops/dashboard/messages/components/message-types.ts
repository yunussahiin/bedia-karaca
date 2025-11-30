export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  source: string | null;
  source_url: string | null;
  source_title: string | null;
  is_read: boolean;
  status: MessageStatus;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export type MessageStatus = 
  | "new"           // Yeni
  | "read"          // Okundu
  | "contacted"     // İletişime geçildi
  | "in_progress"   // İşlemde
  | "resolved"      // Çözüldü
  | "archived";     // Arşivlendi

export const MESSAGE_STATUS_CONFIG: Record<MessageStatus, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  new: {
    label: "Yeni",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  read: {
    label: "Okundu",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
  contacted: {
    label: "İletişime Geçildi",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
  },
  in_progress: {
    label: "İşlemde",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
  },
  resolved: {
    label: "Çözüldü",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  archived: {
    label: "Arşivlendi",
    color: "text-slate-500",
    bgColor: "bg-slate-100",
  },
};

export type MessageFilter = "all" | MessageStatus;

export const MESSAGE_FILTERS: { value: MessageFilter; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "new", label: "Yeni" },
  { value: "read", label: "Okundu" },
  { value: "contacted", label: "İletişime Geçildi" },
  { value: "in_progress", label: "İşlemde" },
  { value: "resolved", label: "Çözüldü" },
  { value: "archived", label: "Arşivlendi" },
];
