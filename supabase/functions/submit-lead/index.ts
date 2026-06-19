// Edge Function: submit-lead
// Stores a new contact lead and sends an internal email notification via STRATO SMTP.
// Public function (verify_jwt = false). Uses service role to insert.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(4000),
  company: z.string().trim().max(200).optional().nullable(),
  phone: z.string().trim().max(60).optional().nullable(),
  product_url: z.string().trim().max(500).optional().nullable(),
  product_type: z.string().max(60).optional().nullable(),
  project_goal: z.string().max(60).optional().nullable(),
  budget: z.string().max(60).optional().nullable(),
  website: z.string().max(500).optional().nullable(), // honeypot
  // attribution (Phase C)
  referrer_domain: z.string().max(255).optional().nullable(),
  utm_source: z.string().max(255).optional().nullable(),
  utm_medium: z.string().max(255).optional().nullable(),
  utm_campaign: z.string().max(255).optional().nullable(),
  utm_content: z.string().max(255).optional().nullable(),
  utm_term: z.string().max(255).optional().nullable(),
  landing_page: z.string().max(1000).optional().nullable(),
  conversion_page: z.string().max(1000).optional().nullable(),
  device_type: z.string().max(40).optional().nullable(),
  interest_package: z.string().max(120).optional().nullable(),
});

function esc(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function plain(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  return String(v);
}

function buildSubject(name: string, company?: string | null) {
  return company && company.trim()
    ? `Neue Anfrage über Soul Cinema – ${company} / ${name}`
    : `Neue Anfrage über Soul Cinema – ${name}`;
}

function buildHtml(lead: any, leadId: string, adminUrl: string) {
  const row = (label: string, val: unknown) => `
    <tr>
      <td style="padding:6px 12px 6px 0;color:#888;font-size:13px;vertical-align:top;white-space:nowrap;">${esc(label)}</td>
      <td style="padding:6px 0;color:#111;font-size:14px;">${esc(val)}</td>
    </tr>`;
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f6f6f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:640px;margin:24px auto;background:#ffffff;border:1px solid #ececec;border-radius:12px;overflow:hidden;">
    <div style="padding:20px 24px;border-bottom:1px solid #ececec;background:#0A0A0A;color:#fff;">
      <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#C9963B;">Soul Cinema</div>
      <h1 style="margin:6px 0 0;font-size:20px;font-weight:700;">Neue Anfrage über Soul Cinema</h1>
    </div>
    <div style="padding:20px 24px;">
      <h2 style="font-size:14px;margin:0 0 8px;color:#0A0A0A;text-transform:uppercase;letter-spacing:1px;">Kontakt</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:18px;">
        ${row("Name", lead.name)}
        ${row("Unternehmen", lead.company)}
        ${row("E-Mail", lead.email)}
        ${row("Telefon", lead.phone)}
      </table>

      <h2 style="font-size:14px;margin:0 0 8px;color:#0A0A0A;text-transform:uppercase;letter-spacing:1px;">Projekt</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:18px;">
        ${row("Website / Produktlink", lead.product_url)}
        ${row("Produkttyp", lead.product_type)}
        ${row("Projektziel", lead.project_goal)}
        ${row("Budget", lead.budget)}
      </table>

      <div style="background:#f6f6f4;border-radius:8px;padding:12px 14px;margin-bottom:18px;">
        <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Nachricht</div>
        <div style="font-size:14px;color:#111;white-space:pre-wrap;">${esc(lead.message)}</div>
      </div>

      <h2 style="font-size:14px;margin:0 0 8px;color:#0A0A0A;text-transform:uppercase;letter-spacing:1px;">Attribution</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:18px;">
        ${row("Paketinteresse", lead.interest_package)}
        ${row("Referrer", lead.referrer_domain)}
        ${row("UTM Source", lead.utm_source)}
        ${row("UTM Medium", lead.utm_medium)}
        ${row("UTM Campaign", lead.utm_campaign)}
        ${row("UTM Content", lead.utm_content)}
        ${row("UTM Term", lead.utm_term)}
        ${row("Landing Page", lead.landing_page)}
        ${row("Conversion Page", lead.conversion_page)}
        ${row("Gerätetyp", lead.device_type)}
      </table>

      <h2 style="font-size:14px;margin:0 0 8px;color:#0A0A0A;text-transform:uppercase;letter-spacing:1px;">Meta</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:18px;">
        ${row("Zeitpunkt", new Date().toLocaleString("de-DE"))}
        ${row("Lead-ID", leadId)}
      </table>

      <div style="text-align:center;margin-top:24px;">
        <a href="${esc(adminUrl)}" style="display:inline-block;background:#C9963B;color:#0A0A0A;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:14px;">Lead im Admin öffnen</a>
      </div>
    </div>
    <div style="padding:14px 24px;background:#fafafa;border-top:1px solid #ececec;color:#888;font-size:11px;text-align:center;">
      Diese Nachricht wurde automatisch durch das Kontaktformular auf soulcinema.de erzeugt.
    </div>
  </div>
</body></html>`;
}

function buildPlain(lead: any, leadId: string, adminUrl: string) {
  const line = (l: string, v: unknown) => `${l}: ${plain(v)}`;
  return [
    "Neue Anfrage über Soul Cinema",
    "",
    "— KONTAKT —",
    line("Name", lead.name),
    line("Unternehmen", lead.company),
    line("E-Mail", lead.email),
    line("Telefon", lead.phone),
    "",
    "— PROJEKT —",
    line("Website / Produktlink", lead.product_url),
    line("Produkttyp", lead.product_type),
    line("Projektziel", lead.project_goal),
    line("Budget", lead.budget),
    "",
    "Nachricht:",
    plain(lead.message),
    "",
    "— ATTRIBUTION —",
    line("Paketinteresse", lead.interest_package),
    line("Referrer", lead.referrer_domain),
    line("UTM Source", lead.utm_source),
    line("UTM Medium", lead.utm_medium),
    line("UTM Campaign", lead.utm_campaign),
    line("UTM Content", lead.utm_content),
    line("UTM Term", lead.utm_term),
    line("Landing Page", lead.landing_page),
    line("Conversion Page", lead.conversion_page),
    line("Gerätetyp", lead.device_type),
    "",
    "— META —",
    line("Zeitpunkt", new Date().toLocaleString("de-DE")),
    line("Lead-ID", leadId),
    line("Admin", adminUrl),
  ].join("\n");
}

async function sendViaSmtp(opts: {
  to: string;
  fromEmail: string;
  fromName: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
}) {
  const host = Deno.env.get("SMTP_HOST") ?? "smtp.strato.de";
  const portRaw = Deno.env.get("SMTP_PORT") ?? "465";
  const port = parseInt(portRaw, 10);
  // SMTP_SECURE: 'true' => implicit TLS (port 465). 'false' => STARTTLS (port 587).
  const secureRaw = (Deno.env.get("SMTP_SECURE") ?? (port === 465 ? "true" : "false")).toLowerCase();
  const secure = secureRaw === "true" || secureRaw === "1";
  const user = Deno.env.get("SMTP_USER");
  const pass = Deno.env.get("SMTP_PASS");

  if (!user || !pass) {
    throw new Error("SMTP configuration missing");
  }

  const client = new SMTPClient({
    connection: {
      hostname: host,
      port,
      tls: secure, // true on 465 (implicit TLS); false on 587 (STARTTLS upgrade)
      auth: { username: user, password: pass },
    },
  });

  try {
    await client.send({
      from: `${opts.fromName} <${opts.fromEmail}>`,
      to: opts.to,
      replyTo: opts.replyTo,
      subject: opts.subject,
      content: opts.text,
      html: opts.html,
    });
  } finally {
    try { await client.close(); } catch { /* ignore */ }
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "validation_failed" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  const data = parsed.data;

  // Honeypot: silently succeed
  if (data.website && data.website.trim().length > 0) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Insert lead
  const insertPayload = {
    name: data.name,
    company: data.company || null,
    email: data.email,
    phone: data.phone || null,
    product_url: data.product_url || null,
    product_type: data.product_type || null,
    project_goal: data.project_goal || null,
    message: data.message,
    budget: data.budget || null,
    status: "new",
    referrer_domain: data.referrer_domain ?? null,
    utm_source: data.utm_source ?? null,
    utm_medium: data.utm_medium ?? null,
    utm_campaign: data.utm_campaign ?? null,
    utm_content: data.utm_content ?? null,
    utm_term: data.utm_term ?? null,
    landing_page: data.landing_page ?? null,
    conversion_page: data.conversion_page ?? null,
    device_type: data.device_type ?? null,
    interest_package: data.interest_package ?? null,
  };

  const { data: inserted, error: insertErr } = await supabase
    .from("contact_leads")
    .insert(insertPayload)
    .select("id")
    .single();

  if (insertErr || !inserted) {
    console.error("[submit-lead] insert failed:", insertErr?.message);
    return new Response(
      JSON.stringify({ error: "insert_failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const leadId = inserted.id as string;

  // Load notification settings from site_settings
  let notificationsEnabled = true;
  let recipient = Deno.env.get("LEAD_NOTIFICATION_EMAIL") || "hallo@soulcinema.de";
  let fromEmail = Deno.env.get("SMTP_FROM_EMAIL") || "hallo@soulcinema.de";
  let fromName = Deno.env.get("SMTP_FROM_NAME") || "Soul Cinema";

  try {
    const { data: settings } = await supabase
      .from("site_settings")
      .select("key,value")
      .in("key", [
        "lead_email_notifications_enabled",
        "lead_notification_email",
        "smtp_from_name",
        "smtp_from_email",
      ]);
    for (const r of settings ?? []) {
      const v = (r as any).value;
      if ((r as any).key === "lead_email_notifications_enabled" && v === false) notificationsEnabled = false;
      if ((r as any).key === "lead_notification_email" && typeof v === "string" && v.trim()) recipient = v.trim();
      if ((r as any).key === "smtp_from_name" && typeof v === "string" && v.trim()) fromName = v.trim();
      if ((r as any).key === "smtp_from_email" && typeof v === "string" && v.trim()) fromEmail = v.trim();
    }
  } catch (e) {
    console.warn("[submit-lead] settings read failed:", (e as Error).message);
  }

  if (!notificationsEnabled) {
    return new Response(JSON.stringify({ ok: true, lead_id: leadId, mail: "disabled" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Build email
  const adminUrl = `https://soulcinema.de/admin/leads`;
  const subject = buildSubject(data.name, data.company);
  const html = buildHtml(insertPayload, leadId, adminUrl);
  const text = buildPlain(insertPayload, leadId, adminUrl);

  let sendStatus: "sent" | "failed" = "sent";
  let sendError: string | null = null;

  try {
    await sendViaSmtp({
      to: recipient,
      fromEmail,
      fromName,
      replyTo: data.email,
      subject,
      html,
      text,
    });
  } catch (e) {
    sendStatus = "failed";
    sendError = (e as Error).message || "unknown_smtp_error";
    console.error("[submit-lead] SMTP send failed:", sendError);
  }

  // Log notification attempt (best-effort)
  try {
    await supabase.from("lead_notification_logs").insert({
      lead_id: leadId,
      type: "new_lead_email",
      recipient_email: recipient,
      status: sendStatus,
      provider: "strato_smtp",
      error_message: sendError,
      sent_at: sendStatus === "sent" ? new Date().toISOString() : null,
    });
  } catch (e) {
    console.warn("[submit-lead] log write failed:", (e as Error).message);
  }

  return new Response(
    JSON.stringify({ ok: true, lead_id: leadId, mail: sendStatus }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
