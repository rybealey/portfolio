import { NextResponse } from "next/server";

// Runs server-side (Node runtime) so the AhaSend API key never reaches the
// browser. Sends contact-form submissions via AhaSend API v2.
export const runtime = "nodejs";

type ContactPayload = {
  first?: string;
  last?: string;
  email?: string;
  message?: string;
  company?: string; // honeypot — real users leave this empty
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: a bot fills the hidden field. Pretend success, send nothing.
  if (body.company && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const first = (body.first ?? "").trim();
  const last = (body.last ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  }
  if (!message) {
    return NextResponse.json({ error: "Please include a message." }, { status: 422 });
  }

  const { AHASEND_API_KEY, AHASEND_ACCOUNT_ID, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL } = process.env;
  if (!AHASEND_API_KEY || !AHASEND_ACCOUNT_ID || !CONTACT_FROM_EMAIL || !CONTACT_TO_EMAIL) {
    console.error("[contact] AhaSend env vars are not fully configured.");
    return NextResponse.json({ error: "The contact form isn't configured yet." }, { status: 500 });
  }

  const name = [first, last].filter(Boolean).join(" ") || "Anonymous";
  const textContent = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const htmlContent = `<p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(
    email,
  )}</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`;

  let response: Response;
  try {
    response = await fetch(
      `https://api.ahasend.com/v2/accounts/${AHASEND_ACCOUNT_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AHASEND_API_KEY}`,
          "Content-Type": "application/json",
          // Safe to retry without sending duplicates.
          "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({
          from: { email: CONTACT_FROM_EMAIL, name: "Portfolio Contact Form" },
          recipients: [{ email: CONTACT_TO_EMAIL }],
          // So replying in your inbox goes straight back to the sender.
          reply_to: { email, name },
          subject: `New portfolio inquiry from ${name}`,
          text_content: textContent,
          html_content: htmlContent,
        }),
      },
    );
  } catch (err) {
    console.error("[contact] Network error calling AhaSend:", err);
    return NextResponse.json(
      { error: "Couldn't reach the email service. Please try again shortly." },
      { status: 502 },
    );
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error(`[contact] AhaSend returned ${response.status}: ${detail}`);
    return NextResponse.json(
      { error: "Couldn't send your message. Please try again or email me directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
