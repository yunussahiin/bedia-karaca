import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resend, FROM_EMAIL, NEWSLETTER_AUDIENCE_ID } from "@/lib/resend";

// KVKK uyumlu e-posta footer'ı
const KVKK_FOOTER = `
<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; line-height: 1.6;">
  <p style="margin: 0 0 10px 0;">Bu e-posta, bültenimize abone olduğunuz için gönderilmiştir.</p>
  <p style="margin: 0 0 10px 0;">
    6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında e-posta adresiniz yalnızca bülten gönderimi amacıyla işlenmektedir. 
    Kişisel verilerinizin işlenmesine ilişkin detaylı bilgi için 
    <a href="https://bediakaraca.com/kvkk" style="color: #059669; text-decoration: underline;">KVKK Aydınlatma Metni</a>'ni inceleyebilirsiniz.
  </p>
  <p style="margin: 0 0 10px 0;">
    <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color: #059669; text-decoration: underline;">Abonelikten çıkmak için tıklayın</a>
  </p>
  <p style="margin: 20px 0 0 0; color: #9ca3af;">© ${new Date().getFullYear()} Bedia Karaca. Tüm hakları saklıdır.</p>
</div>
`;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { subject, html, text, scheduledAt } = body;
    
    // KVKK footer'ı ekle
    const htmlWithFooter = html ? `${html}${KVKK_FOOTER}` : undefined;

    if (!subject || (!html && !text)) {
      return NextResponse.json(
        { error: "Konu ve içerik gerekli" },
        { status: 400 }
      );
    }

    // If Resend audience is configured, use broadcast
    if (NEWSLETTER_AUDIENCE_ID) {
      const { data: broadcast, error: broadcastError } = await resend.broadcasts.create({
        audienceId: NEWSLETTER_AUDIENCE_ID,
        from: FROM_EMAIL,
        subject,
        html: htmlWithFooter || undefined,
        text: text || undefined,
      });

      if (broadcastError) {
        console.error("Broadcast creation error:", broadcastError);
        return NextResponse.json(
          { error: "Bülten oluşturulurken hata oluştu" },
          { status: 500 }
        );
      }

      // Send the broadcast
      if (broadcast?.id) {
        const { error: sendError } = await resend.broadcasts.send(broadcast.id, {
          scheduledAt: scheduledAt || undefined,
        });

        if (sendError) {
          console.error("Broadcast send error:", sendError);
          return NextResponse.json(
            { error: "Bülten gönderilirken hata oluştu" },
            { status: 500 }
          );
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: scheduledAt ? "Bülten planlandı!" : "Bülten gönderildi!",
        broadcastId: broadcast?.id 
      });
    }

    // Fallback: Send individually to subscribers
    const { data: subscribers } = await supabase
      .from("newsletter_subscribers")
      .select("email, first_name")
      .eq("is_subscribed", true);

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: "Abone bulunamadı" },
        { status: 400 }
      );
    }

    // Send emails in batches
    const batchSize = 50;
    let sentCount = 0;

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const emails = batch.map((sub) => ({
        from: FROM_EMAIL,
        to: sub.email,
        subject,
        html: htmlWithFooter?.replace("{{{FIRST_NAME|there}}}", sub.first_name || "there") || undefined,
        text: text?.replace("{{{FIRST_NAME|there}}}", sub.first_name || "there") || undefined,
      }));

      try {
        await resend.batch.send(emails);
        sentCount += batch.length;
      } catch (batchError) {
        console.error("Batch send error:", batchError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `${sentCount} aboneye bülten gönderildi!` 
    });
  } catch (error) {
    console.error("Newsletter send error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
