import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Supabase admin client for webhook (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Resend webhook signing secret
const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET || "";

interface ResendWebhookPayload {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    broadcast_id?: string;
    template_id?: string;
    bounce?: {
      type: string;
      subType: string;
      message: string;
    };
    click?: {
      link: string;
      timestamp: string;
      ipAddress: string;
      userAgent: string;
    };
    failed?: {
      reason: string;
    };
    tags?: Record<string, string>;
  };
}

// Verify webhook signature
function verifySignature(payload: string, signature: string, secret: string): boolean {
  if (!secret) return true; // Skip verification if no secret configured
  
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("resend-signature") || "";

    // Verify webhook signature
    if (WEBHOOK_SECRET && !verifySignature(rawBody, signature, WEBHOOK_SECRET)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload: ResendWebhookPayload = JSON.parse(rawBody);
    const { type, data } = payload;

    console.log(`Received Resend webhook: ${type}`, data.email_id);

    // Save event to database
    const eventData = {
      email_id: data.email_id,
      event_type: type,
      recipient: data.to?.[0] || null,
      subject: data.subject || null,
      broadcast_id: data.broadcast_id || null,
      template_id: data.template_id || null,
      bounce_type: data.bounce?.type || null,
      bounce_message: data.bounce?.message || null,
      click_link: data.click?.link || null,
      failed_reason: data.failed?.reason || null,
      raw_payload: payload,
    };

    const { error: insertError } = await supabaseAdmin
      .from("email_events")
      .insert(eventData);

    if (insertError) {
      console.error("Failed to save email event:", insertError);
      // Don't return error - we still want to acknowledge the webhook
    }

    // Handle specific events
    switch (type) {
      case "email.bounced":
        // Update subscriber status on bounce
        if (data.to?.[0]) {
          await supabaseAdmin
            .from("newsletter_subscribers")
            .update({ 
              is_subscribed: false,
              unsubscribed_at: new Date().toISOString()
            })
            .eq("email", data.to[0]);
        }
        break;

      case "contact.unsubscribed":
        // Sync unsubscribe from Resend
        if (data.to?.[0]) {
          await supabaseAdmin
            .from("newsletter_subscribers")
            .update({ 
              is_subscribed: false,
              unsubscribed_at: new Date().toISOString()
            })
            .eq("email", data.to[0]);
        }
        break;

      case "email.complained":
        // Mark as unsubscribed on spam complaint
        if (data.to?.[0]) {
          await supabaseAdmin
            .from("newsletter_subscribers")
            .update({ 
              is_subscribed: false,
              unsubscribed_at: new Date().toISOString()
            })
            .eq("email", data.to[0]);
        }
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Resend sends GET to verify endpoint
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
