// The contact form's server side: validation, spam checks, storage and
// delivery. Every message is saved to contact_messages first, so nothing is
// lost; when SMTP2GO_API_KEY, CONTACT_TO and CONTACT_FROM are set it's also
// emailed through SMTP2Go's API, with the sender's address as Reply-To.
// Ry's address lives only in CONTACT_TO, never in the page.
import { createHash } from 'node:crypto';
import type { ResultSetHeader } from 'mysql2/promise';
import { z } from 'astro/zod';
import { CONTACT_FROM, CONTACT_TO, DB_PASSWORD, SMTP2GO_API_KEY } from 'astro:env/server';
import { db, rows } from './db';

export const TOPICS = { role: 'Hiring for a role', project: 'A project', other: 'Something else' } as const;

// One line, no line breaks: the name goes into an email header.
const oneLine = /^[^\r\n]*$/;

export const ContactMessage = z.object({
  name: z.string().trim().min(1, 'Add your name so I know who I am writing back to.').max(120).regex(oneLine, 'Keep your name on one line.'),
  email: z.string().trim().pipe(z.email('Enter an email address like name@example.com.').max(254)),
  topic: z.enum(['role', 'project', 'other']).nullable().default(null),
  message: z.string().trim().min(10, 'Add a few words so I know what this is about.').max(2000, 'Keep it under 2,000 characters.'),
  // Spam checks: a field people never see, and how long the form was open.
  website: z.string().optional(),
  elapsed: z.number().optional(),
});
export type ContactMessage = z.output<typeof ContactMessage>;

/** Field name to message, for the form to show next to each field. */
export const fieldErrors = (error: z.ZodError) =>
  Object.fromEntries(error.issues.map((issue) => [String(issue.path[0]), issue.message]));

/** Filled the hidden field, or sent faster than a person can type. */
export const looksLikeSpam = (input: ContactMessage) => Boolean(input.website?.trim()) || (input.elapsed ?? 10_000) < 2500;

// The IP is only kept hashed, salted with a server secret so the hashes
// can't be reversed from a list of addresses.
export const hashIp = (ip: string) => createHash('sha256').update(`${DB_PASSWORD}:${ip}`).digest('hex');

const PER_IP_PER_HOUR = 5;
const ALL_PER_HOUR = 60;

/** True when this sender, or the site as a whole, has sent too many lately. */
export async function rateLimited(ipHash: string | undefined): Promise<boolean> {
  const [all] = await rows<{ n: number }>("SELECT COUNT(*) AS n FROM contact_messages WHERE created_at > NOW() - INTERVAL 1 HOUR AND status <> 'spam'");
  if ((all?.n ?? 0) >= ALL_PER_HOUR) return true;
  if (!ipHash) return false;
  const [mine] = await rows<{ n: number }>('SELECT COUNT(*) AS n FROM contact_messages WHERE ip_hash = ? AND created_at > NOW() - INTERVAL 1 HOUR', [ipHash]);
  return (mine?.n ?? 0) >= PER_IP_PER_HOUR;
}

export async function saveMessage(input: ContactMessage, ipHash: string, status: 'received' | 'spam'): Promise<number> {
  const [result] = await db().query<ResultSetHeader>(
    'INSERT INTO contact_messages (name, email, topic, message, ip_hash, status) VALUES (?, ?, ?, ?, ?, ?)',
    [input.name, input.email, input.topic, input.message, ipHash, status],
  );
  return result.insertId;
}

export const deliveryConfigured = () => Boolean(SMTP2GO_API_KEY && CONTACT_TO && CONTACT_FROM);

/** Emails a saved message through SMTP2Go and records how it went. */
export async function deliver(id: number, input: ContactMessage): Promise<'sent' | 'failed' | 'skipped'> {
  if (!deliveryConfigured()) return 'skipped';
  const topic = input.topic ? TOPICS[input.topic] : 'Not given';
  const body = [`From: ${input.name} <${input.email}>`, `About: ${topic}`, '', input.message, '', `Message #${id}, sent from the contact form on ryanbealey.com.`].join('\n');
  let error: string | null = null;
  try {
    const res = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Smtp2go-Api-Key': SMTP2GO_API_KEY! },
      body: JSON.stringify({
        sender: CONTACT_FROM,
        to: [CONTACT_TO],
        subject: `Site message from ${input.name}${input.topic ? ` · ${topic}` : ''}`,
        text_body: body,
        custom_headers: [{ header: 'Reply-To', value: `"${input.name.replace(/["\\]/g, '')}" <${input.email}>` }],
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const json = (await res.json().catch(() => ({}))) as { data?: { succeeded?: number; error?: string } };
    if (!res.ok || !json.data?.succeeded) error = `SMTP2Go ${res.status}: ${json.data?.error ?? 'not sent'}`;
  } catch (err) {
    error = `SMTP2Go request failed: ${(err as Error).message}`;
  }
  await db().query('UPDATE contact_messages SET status = ?, error = ? WHERE id = ?', [error ? 'failed' : 'sent', error?.slice(0, 500) ?? null, id]);
  if (error) console.error(`contact: message #${id} saved but not emailed. ${error}`);
  return error ? 'failed' : 'sent';
}
