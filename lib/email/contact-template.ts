export function contactEmailHtml({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
    timeZoneName: "short",
  });
  const firstName = name.split(" ")[0];

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="dark" />
<meta name="supported-color-schemes" content="dark" />
<title>New Contact Form Message</title>
<!--[if mso]>
<style>
  table { border-collapse: collapse; }
  td { font-family: Arial, sans-serif; }
</style>
<![endif]-->
<style>
  :root { color-scheme: dark; supported-color-schemes: dark; }
  body, .body-bg { background-color: #0A0F1C !important; }
  .card-bg { background-color: #0D1321 !important; }
  .details-bg { background-color: #141B2D !important; }
  .details-header-bg { background-color: #1A2235 !important; }
  .accent-bg { background-color: #22D3EE !important; }
</style>
</head>
<body class="body-bg" style="margin:0;padding:0;background-color:#0A0F1C;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:none;">

<!-- Outer wrapper -->
<table role="presentation" class="body-bg" width="100%" cellpadding="0" cellspacing="0" bgcolor="#0A0F1C" style="background-color:#0A0F1C;">
<tr><td align="center" bgcolor="#0A0F1C" style="padding:40px 16px;background-color:#0A0F1C;">

<!-- Email Card -->
<table role="presentation" width="600" cellpadding="0" cellspacing="0" class="card-bg" bgcolor="#0D1321" style="max-width:600px;width:100%;background-color:#0D1321;border-radius:8px;border:1px solid #1E293B;">

  <!-- Accent Bar -->
  <tr><td class="accent-bg" bgcolor="#22D3EE" style="background-color:#22D3EE;height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>

  <!-- Header -->
  <tr><td bgcolor="#0D1321" class="card-bg" style="padding:28px 32px;border-bottom:1px solid #1E293B;background-color:#0D1321;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="font-family:'Courier New',Courier,monospace;font-size:16px;font-weight:700;color:#F1F5F9;">
        ry.bealey
      </td>
      <td align="right" valign="middle">
        <table role="presentation" cellpadding="0" cellspacing="0">
        <tr><td bgcolor="#0B2A2F" style="background-color:#0B2A2F;border:1px solid #164E52;border-radius:12px;padding:4px 10px;">
          <span style="font-family:'Courier New',Courier,monospace;font-size:10px;font-weight:600;color:#22D3EE;">&#9679; New Message</span>
        </td></tr>
        </table>
      </td>
    </tr>
    </table>
  </td></tr>

  <!-- Body -->
  <tr><td bgcolor="#0D1321" class="card-bg" style="padding:40px 32px;background-color:#0D1321;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

      <!-- Greeting -->
      <tr><td style="padding-bottom:32px;">
        <h1 style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;line-height:1.2;color:#F1F5F9;">
          You've got a new message!
        </h1>
        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:400;line-height:1.6;color:#94A3B8;">
          Someone just submitted your contact form. Here are the details:
        </p>
      </td></tr>

      <!-- Details Card -->
      <tr><td style="padding-bottom:32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="details-bg" bgcolor="#141B2D" style="background-color:#141B2D;border-radius:6px;border:1px solid #1E293B;">

          <!-- Details Header -->
          <tr><td class="details-header-bg" bgcolor="#1A2235" style="padding:16px 24px;background-color:#1A2235;border-bottom:1px solid #1E293B;">
            <span style="font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:600;letter-spacing:2px;color:#22D3EE;">
              SUBMISSION DETAILS
            </span>
          </td></tr>

          <!-- Name Row -->
          <tr><td bgcolor="#141B2D" class="details-bg" style="padding:0 24px;background-color:#141B2D;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:16px 0;border-bottom:1px solid #1E293B;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="140" valign="middle" style="font-family:'Courier New',Courier,monospace;font-size:12px;font-weight:500;color:#64748B;">
                  Full Name
                </td>
                <td valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:600;color:#F1F5F9;">
                  ${escapeHtml(name)}
                </td>
              </tr>
              </table>
            </td></tr>
            </table>
          </td></tr>

          <!-- Email Row -->
          <tr><td bgcolor="#141B2D" class="details-bg" style="padding:0 24px;background-color:#141B2D;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:16px 0;border-bottom:1px solid #1E293B;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="140" valign="middle" style="font-family:'Courier New',Courier,monospace;font-size:12px;font-weight:500;color:#64748B;">
                  Email
                </td>
                <td valign="middle">
                  <a href="mailto:${escapeHtml(email)}" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:500;color:#22D3EE;text-decoration:none;">
                    ${escapeHtml(email)}
                  </a>
                </td>
              </tr>
              </table>
            </td></tr>
            </table>
          </td></tr>

          <!-- Message Row -->
          <tr><td bgcolor="#141B2D" class="details-bg" style="padding:0 24px;background-color:#141B2D;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:16px 0 20px 0;">
              <p style="margin:0 0 10px 0;font-family:'Courier New',Courier,monospace;font-size:12px;font-weight:500;color:#64748B;">
                Message
              </p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:400;line-height:1.7;color:#94A3B8;">
                ${escapeHtml(message)}
              </p>
            </td></tr>
            </table>
          </td></tr>

        </table>
      </td></tr>

      <!-- Timestamp -->
      <tr><td style="padding-bottom:32px;">
        <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:400;color:#64748B;">
          Received on ${dateStr} at ${timeStr}
        </p>
      </td></tr>

      <!-- Reply Button -->
      <tr><td>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td align="center" class="accent-bg" bgcolor="#22D3EE" style="background-color:#22D3EE;border-radius:4px;">
          <a href="mailto:${escapeHtml(email)}" style="display:block;padding:14px 24px;font-family:'Courier New',Courier,monospace;font-size:13px;font-weight:600;color:#0A0F1C;text-decoration:none;text-align:center;">
            &#8617; Reply to ${escapeHtml(firstName)}
          </a>
        </td></tr>
        </table>
      </td></tr>

    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td bgcolor="#0D1321" class="card-bg" style="padding:28px 32px;border-top:1px solid #1E293B;text-align:center;background-color:#0D1321;">
    <p style="margin:0 0 16px 0;font-family:'Courier New',Courier,monospace;font-size:14px;font-weight:700;color:#64748B;">
      ry.bealey
    </p>
    <p style="margin:0 0 16px 0;font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:400;color:#64748B;">
      Designing the future, one pixel at a time.
    </p>
    <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:9px;font-weight:400;line-height:1.6;color:#64748B;">
      &copy; ${now.getFullYear()} Ry Bealey. You're receiving this because someone submitted your contact form.
    </p>
  </td></tr>

</table>
<!-- /Email Card -->

</td></tr>
</table>
<!-- /Outer wrapper -->

</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
