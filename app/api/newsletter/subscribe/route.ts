import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resend, NEWSLETTER_AUDIENCE_ID } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, source = "website", updateOnly = false } = body;

    if (!email) {
      return NextResponse.json(
        { error: "E-posta adresi gerekli" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, is_subscribed, resend_contact_id")
      .eq("email", email)
      .single();

    // Update only mode - just update name fields
    if (updateOnly && existing) {
      const updateData: Record<string, string | null> = {};
      if (firstName !== undefined) updateData.first_name = firstName || null;
      if (lastName !== undefined) updateData.last_name = lastName || null;

      await supabase
        .from("newsletter_subscribers")
        .update(updateData)
        .eq("id", existing.id);

      // Also update in Resend
      if (NEWSLETTER_AUDIENCE_ID && existing.resend_contact_id) {
        try {
          await resend.contacts.update({
            id: existing.resend_contact_id,
            audienceId: NEWSLETTER_AUDIENCE_ID,
            firstName: firstName || undefined,
            lastName: lastName || undefined,
          });
        } catch (resendError) {
          console.error("Resend contact update error:", resendError);
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: "Bilgileriniz güncellendi!" 
      });
    }

    if (existing) {
      if (existing.is_subscribed) {
        return NextResponse.json(
          { error: "Bu e-posta adresi zaten kayıtlı" },
          { status: 400 }
        );
      }
      
      // Resubscribe
      await supabase
        .from("newsletter_subscribers")
        .update({ 
          is_subscribed: true, 
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null,
          first_name: firstName || null,
          last_name: lastName || null,
        })
        .eq("id", existing.id);

      return NextResponse.json({ success: true, message: "Tekrar abone oldunuz!" });
    }

    // Add to Resend audience if configured
    let resendContactId = null;
    if (NEWSLETTER_AUDIENCE_ID) {
      try {
        const { data: contact } = await resend.contacts.create({
          email,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          unsubscribed: false,
          audienceId: NEWSLETTER_AUDIENCE_ID,
        });
        resendContactId = contact?.id;
      } catch (resendError) {
        console.error("Resend contact creation error:", resendError);
        // Continue even if Resend fails
      }
    }

    // Save to database
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email,
        first_name: firstName || null,
        last_name: lastName || null,
        resend_contact_id: resendContactId,
        source,
      });

    if (insertError) {
      console.error("Database insert error:", insertError);
      return NextResponse.json(
        { error: "Kayıt sırasında bir hata oluştu" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Bültene başarıyla abone oldunuz!" 
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
