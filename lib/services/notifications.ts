import { createClient } from "@/lib/supabase/client";

export interface Notification {
  id: string;
  type: "appointment" | "call_request" | "message" | "comment";
  title: string;
  description: string;
  created_at: string;
  read: boolean;
  archived: boolean;
  url: string;
  source_id: string;
}

export async function getNotifications(
  limit = 50,
  offset = 0,
  includeArchived = false
) {
  const supabase = createClient();
  const notifications: Notification[] = [];

  try {
    // Get appointments
    const { data: appointments } = await supabase
      .from("appointments")
      .select("id, full_name, created_at, is_read", { count: "exact" })
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    appointments?.forEach((apt) => {
      notifications.push({
        id: `apt-${apt.id}`,
        type: "appointment",
        title: "Yeni Randevu Talebi",
        description: `${apt.full_name} randevu talep etti`,
        created_at: apt.created_at,
        read: apt.is_read || false,
        archived: false,
        url: "/ops/dashboard/appointments",
        source_id: apt.id,
      });
    });

    // Get call requests
    const { data: callRequests } = await supabase
      .from("call_requests")
      .select("id, name, phone, created_at, called_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    callRequests?.forEach((call) => {
      notifications.push({
        id: `call-${call.id}`,
        type: "call_request",
        title: "Yeni Çağrı Talebi",
        description: `${call.name} - ${call.phone}`,
        created_at: call.created_at,
        read: !!call.called_at,
        archived: false,
        url: "/ops/dashboard/call-requests",
        source_id: call.id,
      });
    });

    // Get messages
    const { data: messages } = await supabase
      .from("contact_submissions")
      .select("id, name, message, created_at, is_read, status")
      .or("status.eq.new,is_read.eq.false")
      .order("created_at", { ascending: false });

    messages?.forEach((msg) => {
      notifications.push({
        id: `msg-${msg.id}`,
        type: "message",
        title: "Yeni Mesaj",
        description: `${msg.name}: ${msg.message.substring(0, 50)}...`,
        created_at: msg.created_at,
        read: msg.is_read || false,
        archived: msg.status === "archived",
        url: "/ops/dashboard/messages",
        source_id: msg.id,
      });
    });

    // Get pending comments
    const { data: comments } = await supabase
      .from("blog_comments")
      .select("id, author_name, content, created_at, post_id")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    comments?.forEach((comment) => {
      notifications.push({
        id: `comment-${comment.id}`,
        type: "comment",
        title: "Yeni Blog Yorumu",
        description: `${comment.author_name}: ${comment.content.substring(0, 50)}...`,
        created_at: comment.created_at,
        read: false,
        archived: false,
        url: "/ops/dashboard/blog/comments",
        source_id: comment.id,
      });
    });

    // Sort by date
    notifications.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Filter archived if needed
    const filtered = includeArchived
      ? notifications
      : notifications.filter((n) => !n.archived);

    return {
      notifications: filtered.slice(offset, offset + limit),
      total: filtered.length,
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { notifications: [], total: 0 };
  }
}

export async function markNotificationAsRead(
  notificationId: string,
  sourceId: string,
  type: "appointment" | "call_request" | "message" | "comment"
) {
  const supabase = createClient();

  try {
    if (type === "appointment") {
      await supabase
        .from("appointments")
        .update({ is_read: true })
        .eq("id", sourceId);
    } else if (type === "call_request") {
      // call_requests doesn't have is_read, use called_at
      await supabase
        .from("call_requests")
        .update({ called_at: new Date().toISOString() })
        .eq("id", sourceId);
    } else if (type === "comment") {
      // Comments are marked as read by approving/rejecting them
      // No action needed here as they will be handled in comments page
    } else {
      await supabase
        .from("contact_submissions")
        .update({ is_read: true })
        .eq("id", sourceId);
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}

export async function markAllNotificationsAsRead() {
  const supabase = createClient();

  try {
    await Promise.all([
      // Appointments - mark as read
      supabase.from("appointments").update({ is_read: true }).eq("is_read", false),
      // Call requests - set called_at for pending ones (doesn't have is_read)
      supabase.from("call_requests").update({ called_at: new Date().toISOString() }).eq("status", "pending"),
      // Messages - mark as read
      supabase.from("contact_submissions").update({ is_read: true }).eq("is_read", false),
    ]);
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
  }
}

export async function archiveNotification(
  sourceId: string,
  type: "appointment" | "call_request" | "message" | "comment"
) {
  const supabase = createClient();

  try {
    if (type === "message") {
      await supabase
        .from("contact_submissions")
        .update({ status: "archived" })
        .eq("id", sourceId);
    } else if (type === "comment") {
      // Comments are archived by rejecting them
      await supabase
        .from("blog_comments")
        .update({ status: "rejected" })
        .eq("id", sourceId);
    }
    // Appointments and call requests don't have archive, just mark as read
    else {
      await supabase
        .from(type === "appointment" ? "appointments" : "call_requests")
        .update({ is_read: true })
        .eq("id", sourceId);
    }
  } catch (error) {
    console.error("Error archiving notification:", error);
  }
}
