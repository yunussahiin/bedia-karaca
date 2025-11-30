import { createClient } from "@/lib/supabase/client"
import type { SessionType } from "./appointments"

export interface AvailabilitySlot {
  id: string
  day_of_week: number // 0=Pazartesi, 6=Pazar
  start_time: string
  duration_minutes: number
  session_type: SessionType
  is_active: boolean
}

export interface SpecialAvailability {
  id: string
  date: string
  start_time: string | null
  duration_minutes: number | null
  session_type: SessionType | null
  is_available: boolean
  reason: string | null
}

export interface TimeSlot {
  time: string
  duration: number
  isAvailable: boolean
  slotId?: string
}

export interface DayAvailability {
  date: string
  dayOfWeek: number
  slots: TimeSlot[]
  isBlocked: boolean
  blockReason?: string
}

// Day names in Turkish
export const DAY_NAMES = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
]

export const DAY_NAMES_SHORT = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]

// Get all recurring slots
export async function getAvailabilitySlots(): Promise<{ data: AvailabilitySlot[] | null; error?: string }> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("is_active", true)
    .order("day_of_week")
    .order("start_time")

  if (error) {
    console.error("Availability slots fetch error:", error)
    return { data: null, error: error.message }
  }

  return { data }
}

// Get special availability for a date range
export async function getSpecialAvailability(
  startDate: string,
  endDate: string
): Promise<{ data: SpecialAvailability[] | null; error?: string }> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("special_availability")
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate)

  if (error) {
    console.error("Special availability fetch error:", error)
    return { data: null, error: error.message }
  }

  return { data }
}

// Get booked appointments for a date range
export async function getBookedSlots(
  startDate: string,
  endDate: string
): Promise<{ data: { appointment_date: string; appointment_time: string }[] | null; error?: string }> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("appointments")
    .select("appointment_date, appointment_time")
    .gte("appointment_date", startDate)
    .lte("appointment_date", endDate)
    .in("status", ["pending", "confirmed"])

  if (error) {
    console.error("Booked slots fetch error:", error)
    return { data: null, error: error.message }
  }

  return { data }
}

// Calculate available slots for a specific date
export async function getAvailableSlotsForDate(date: string): Promise<{ data: TimeSlot[] | null; error?: string }> {
  // Parse date as local time to avoid timezone issues
  const [year, month, day] = date.split("-").map(Number)
  const dateObj = new Date(year, month - 1, day)
  const dayOfWeek = (dateObj.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0

  // Get recurring slots for this day
  const { data: recurringSlots, error: slotsError } = await getAvailabilitySlots()
  if (slotsError) return { data: null, error: slotsError }

  const daySlots = recurringSlots?.filter((s) => s.day_of_week === dayOfWeek) || []

  // Get special availability for this date
  const { data: specialDays, error: specialError } = await getSpecialAvailability(date, date)
  if (specialError) return { data: null, error: specialError }

  // Check if entire day is blocked
  const dayBlock = specialDays?.find((s) => s.start_time === null && !s.is_available)
  if (dayBlock) {
    return { data: [] }
  }

  // Get booked appointments for this date
  const { data: bookedSlots, error: bookedError } = await getBookedSlots(date, date)
  if (bookedError) return { data: null, error: bookedError }

  const bookedTimes = new Set(bookedSlots?.map((b) => b.appointment_time) || [])

  // Build available slots
  const slots: TimeSlot[] = []

  // Add recurring slots
  for (const slot of daySlots) {
    const isBooked = bookedTimes.has(slot.start_time)
    const isBlocked = specialDays?.some(
      (s) => s.start_time === slot.start_time && !s.is_available
    )

    slots.push({
      time: slot.start_time,
      duration: slot.duration_minutes,
      isAvailable: !isBooked && !isBlocked,
      slotId: slot.id,
    })
  }

  // Add special available slots
  const extraSlots = specialDays?.filter((s) => s.is_available && s.start_time) || []
  for (const extra of extraSlots) {
    if (!slots.some((s) => s.time === extra.start_time)) {
      const isBooked = bookedTimes.has(extra.start_time!)
      slots.push({
        time: extra.start_time!,
        duration: extra.duration_minutes || 50,
        isAvailable: !isBooked,
      })
    }
  }

  // Sort by time
  slots.sort((a, b) => a.time.localeCompare(b.time))

  return { data: slots }
}

// Helper to format date as YYYY-MM-DD without timezone issues
function formatDateStr(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// Get availability for a month
export async function getMonthAvailability(
  year: number,
  month: number
): Promise<{ data: DayAvailability[] | null; error?: string }> {
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0)

  const startStr = formatDateStr(startDate)
  const endStr = formatDateStr(endDate)

  // Get all data in parallel
  const [slotsResult, specialResult, bookedResult] = await Promise.all([
    getAvailabilitySlots(),
    getSpecialAvailability(startStr, endStr),
    getBookedSlots(startStr, endStr),
  ])

  if (slotsResult.error) return { data: null, error: slotsResult.error }
  if (specialResult.error) return { data: null, error: specialResult.error }
  if (bookedResult.error) return { data: null, error: bookedResult.error }

  const slots = slotsResult.data || []
  const specialDays = specialResult.data || []
  const bookedSlots = bookedResult.data || []

  // Create a map of booked times by date
  const bookedByDate = new Map<string, Set<string>>()
  for (const booked of bookedSlots) {
    if (!bookedByDate.has(booked.appointment_date)) {
      bookedByDate.set(booked.appointment_date, new Set())
    }
    bookedByDate.get(booked.appointment_date)!.add(booked.appointment_time)
  }

  // Build availability for each day
  const days: DayAvailability[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dateStr = formatDateStr(currentDate)
    const dayOfWeek = (currentDate.getDay() + 6) % 7

    // Check if day is blocked
    const dayBlock = specialDays.find(
      (s) => s.date === dateStr && s.start_time === null && !s.is_available
    )

    if (dayBlock) {
      days.push({
        date: dateStr,
        dayOfWeek,
        slots: [],
        isBlocked: true,
        blockReason: dayBlock.reason || undefined,
      })
    } else {
      // Get slots for this day
      const daySlots = slots.filter((s) => s.day_of_week === dayOfWeek)
      const bookedTimes = bookedByDate.get(dateStr) || new Set()

      const timeSlots: TimeSlot[] = []

      for (const slot of daySlots) {
        const isBooked = bookedTimes.has(slot.start_time)
        const isBlocked = specialDays.some(
          (s) => s.date === dateStr && s.start_time === slot.start_time && !s.is_available
        )

        timeSlots.push({
          time: slot.start_time,
          duration: slot.duration_minutes,
          isAvailable: !isBooked && !isBlocked,
          slotId: slot.id,
        })
      }

      // Add extra slots
      const extraSlots = specialDays.filter(
        (s) => s.date === dateStr && s.is_available && s.start_time
      )
      for (const extra of extraSlots) {
        if (!timeSlots.some((s) => s.time === extra.start_time)) {
          const isBooked = bookedTimes.has(extra.start_time!)
          timeSlots.push({
            time: extra.start_time!,
            duration: extra.duration_minutes || 50,
            isAvailable: !isBooked,
          })
        }
      }

      timeSlots.sort((a, b) => a.time.localeCompare(b.time))

      days.push({
        date: dateStr,
        dayOfWeek,
        slots: timeSlots,
        isBlocked: false,
      })
    }

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return { data: days }
}

// Admin: Create/update availability slot
export async function upsertAvailabilitySlot(
  slot: Omit<AvailabilitySlot, "id">
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase.from("availability_slots").upsert(
    {
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      duration_minutes: slot.duration_minutes,
      session_type: slot.session_type,
      is_active: slot.is_active,
    },
    { onConflict: "day_of_week,start_time" }
  )

  if (error) {
    console.error("Slot upsert error:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Admin: Delete availability slot
export async function deleteAvailabilitySlot(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase.from("availability_slots").delete().eq("id", id)

  if (error) {
    console.error("Slot delete error:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Admin: Block a date or time
export async function blockDate(
  date: string,
  startTime?: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase.from("special_availability").insert({
    date,
    start_time: startTime || null,
    is_available: false,
    reason,
  })

  if (error) {
    console.error("Block date error:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Admin: Add extra slot for a specific date
export async function addExtraSlot(
  date: string,
  startTime: string,
  durationMinutes: number = 50,
  sessionType: SessionType = "bireysel"
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase.from("special_availability").insert({
    date,
    start_time: startTime,
    duration_minutes: durationMinutes,
    session_type: sessionType,
    is_available: true,
  })

  if (error) {
    console.error("Add extra slot error:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Admin: Remove special availability
export async function removeSpecialAvailability(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase.from("special_availability").delete().eq("id", id)

  if (error) {
    console.error("Remove special availability error:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Format time for display
export function formatTime(time: string): string {
  return time.slice(0, 5) // "11:00:00" -> "11:00"
}

// Format date for display
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

// Format date short
export function formatDateShort(date: string): string {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  })
}
