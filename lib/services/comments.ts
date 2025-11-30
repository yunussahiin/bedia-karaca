import { createClient } from "@/lib/supabase/client";

export interface BlogComment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  admin_note?: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by?: string;
  posts?: {
    title: string;
    slug: string;
  };
}

export interface CreateCommentInput {
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
}

export interface UpdateCommentStatusInput {
  id: string;
  status: "approved" | "rejected";
  admin_note?: string;
}

// Public: Onaylanmış yorumları getir
export async function getApprovedComments(
  postId: string
): Promise<BlogComment[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("blog_comments")
    .select("*")
    .eq("post_id", postId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching approved comments:", error);
    return [];
  }

  return data || [];
}

// Public: Yeni yorum ekle
export async function createComment(
  input: CreateCommentInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  // Basit validasyon
  if (!input.author_name.trim()) {
    return { success: false, error: "İsim alanı zorunludur" };
  }

  if (!input.author_email.trim()) {
    return { success: false, error: "E-posta alanı zorunludur" };
  }

  if (input.content.trim().length < 10) {
    return { success: false, error: "Yorum en az 10 karakter olmalıdır" };
  }

  const { error } = await supabase.from("blog_comments").insert({
    post_id: input.post_id,
    author_name: input.author_name.trim(),
    author_email: input.author_email.trim().toLowerCase(),
    content: input.content.trim(),
    status: "pending",
  });

  if (error) {
    console.error("Error creating comment:", error);
    if (error.message.includes("valid_comment_email")) {
      return { success: false, error: "Geçerli bir e-posta adresi giriniz" };
    }
    return { success: false, error: "Yorum gönderilemedi. Lütfen tekrar deneyin." };
  }

  return { success: true };
}

// Admin: Tüm yorumları getir (filtreleme ile)
export async function getAllComments(options?: {
  status?: "pending" | "approved" | "rejected" | "all";
  postId?: string;
  limit?: number;
  offset?: number;
}): Promise<{ comments: BlogComment[]; total: number }> {
  const supabase = createClient();

  let query = supabase
    .from("blog_comments")
    .select(
      `
      *,
      posts:post_id(title, slug)
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (options?.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  if (options?.postId) {
    query = query.eq("post_id", options.postId);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching all comments:", error);
    return { comments: [], total: 0 };
  }

  return { comments: data || [], total: count || 0 };
}

// Admin: Yorum durumunu güncelle
export async function updateCommentStatus(
  input: UpdateCommentStatusInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const updateData: Record<string, unknown> = {
    status: input.status,
    updated_at: new Date().toISOString(),
  };

  if (input.admin_note) {
    updateData.admin_note = input.admin_note;
  }

  if (input.status === "approved") {
    updateData.approved_at = new Date().toISOString();
    // approved_by will be set by the database based on auth.uid()
  }

  const { error } = await supabase
    .from("blog_comments")
    .update(updateData)
    .eq("id", input.id);

  if (error) {
    console.error("Error updating comment status:", error);
    return { success: false, error: "Yorum durumu güncellenemedi" };
  }

  return { success: true };
}

// Admin: Yorum sil
export async function deleteComment(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from("blog_comments").delete().eq("id", id);

  if (error) {
    console.error("Error deleting comment:", error);
    return { success: false, error: "Yorum silinemedi" };
  }

  return { success: true };
}

// Admin: Bekleyen yorum sayısı
export async function getPendingCommentCount(): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("blog_comments")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  if (error) {
    console.error("Error fetching pending comment count:", error);
    return 0;
  }

  return count || 0;
}

// Public: Bir yazının onaylanmış yorum sayısı
export async function getApprovedCommentCount(postId: string): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("blog_comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId)
    .eq("status", "approved");

  if (error) {
    console.error("Error fetching approved comment count:", error);
    return 0;
  }

  return count || 0;
}
