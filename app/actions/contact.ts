"use server";

import { Resend } from "resend";
import { contactEmailHtml } from "@/lib/email/contact-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactState = {
  success: boolean;
  error?: string;
} | null;

export async function sendContactEmail(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = formData.get("name") as string | null;
  const email = formData.get("email") as string | null;
  const message = formData.get("message") as string | null;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return { success: false, error: "All fields are required." };
  }

  if (message.length > 500) {
    return { success: false, error: "Message must be 500 characters or less." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    const { error } = await resend.emails.send({
      from: "Portfolio Contact <contact@mailer.ryanbealey.com>",
      to: "hello@ryanbealey.com",
      replyTo: email,
      subject: `New message from ${name}`,
      html: contactEmailHtml({ name, email, message }),
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (error) {
      return { success: false, error: "Failed to send message. Please try again." };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
