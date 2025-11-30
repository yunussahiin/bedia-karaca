import { createClient } from "@/lib/supabase/client"

export type SessionType = "bireysel" | "ebeveynlik" | "checkin"
export type TherapyChannel = "zoom" | "yuz_yuze"
export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed"

export interface Appointment {
  id: string
  full_name: string
  email: string
  phone: string | null
  session_type: SessionType
  therapy_channel: TherapyChannel
  preferred_date: string | null
  note: string | null
  admin_notes: string | null
  status: AppointmentStatus
  confirmed_date: string | null
  zoom_link: string | null
  is_read: boolean
  appointment_date: string | null
  appointment_time: string | null
  slot_id: string | null
  created_at: string
  updated_at: string
}

export interface CreateAppointmentData {
  full_name: string
  email?: string
  phone: string
  session_type: SessionType
  therapy_channel: TherapyChannel
  preferred_date?: string
  appointment_date?: string
  appointment_time?: string
  note?: string
}

export interface UpdateAppointmentData {
  status?: AppointmentStatus
  admin_notes?: string
  confirmed_date?: string
  zoom_link?: string
  is_read?: boolean
}

// Session type labels
export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  bireysel: "Bireysel Terapi",
  ebeveynlik: "Ebeveynlik Danışmanlığı",
  checkin: "Hızlı Check-in",
}

// Session type details
export const SESSION_TYPES = [
  {
    value: "bireysel" as SessionType,
    title: "Bireysel Terapi",
    duration: "50 dk",
    desc: "DEHB, kaygı, duygu düzenleme odaklı bireysel seans.",
  },
  {
    value: "ebeveynlik" as SessionType,
    title: "Ebeveynlik Danışmanlığı",
    duration: "60 dk",
    desc: "Çocukla çatışma, sınır koyma, ortak dil protokolleri.",
  },
  {
    value: "checkin" as SessionType,
    title: "Hızlı Check-in",
    duration: "25 dk",
    desc: "Seans arası mini destek / ödev revizyonu.",
  },
]

// Therapy channel labels
export const THERAPY_CHANNEL_LABELS: Record<TherapyChannel, string> = {
  zoom: "Zoom (Online)",
  yuz_yuze: "Yüz Yüze",
}

// Status labels
export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Beklemede",
  confirmed: "Onaylandı",
  cancelled: "İptal Edildi",
  completed: "Tamamlandı",
}

// Status colors for badges
export const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
}

// Create appointment (public)
export async function createAppointment(data: CreateAppointmentData): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase.from("appointments").insert({
    full_name: data.full_name,
    email: data.email,
    phone: data.phone || null,
    session_type: data.session_type,
    therapy_channel: data.therapy_channel,
    preferred_date: data.preferred_date || null,
    appointment_date: data.appointment_date || null,
    appointment_time: data.appointment_time || null,
    note: data.note || null,
  })

  if (error) {
    console.error("Appointment creation error:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Get all appointments (admin only)
export async function getAppointments(): Promise<{ data: Appointment[] | null; error?: string }> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Appointments fetch error:", error)
    return { data: null, error: error.message }
  }

  return { data }
}

// Get single appointment (admin only)
export async function getAppointment(id: string): Promise<{ data: Appointment | null; error?: string }> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Appointment fetch error:", error)
    return { data: null, error: error.message }
  }

  return { data }
}

// Update appointment (admin only)
export async function updateAppointment(
  id: string,
  data: UpdateAppointmentData
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase
    .from("appointments")
    .update(data)
    .eq("id", id)

  if (error) {
    console.error("Appointment update error:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Delete appointment (admin only)
export async function deleteAppointment(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Appointment delete error:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Mark as read (admin only)
export async function markAppointmentAsRead(id: string, isRead: boolean): Promise<{ success: boolean; error?: string }> {
  return updateAppointment(id, { is_read: !isRead })
}
