"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { profile } from "@/content";
import { visitorKey } from "@/lib/ip";
import { contactLimiter } from "@/lib/ratelimit";

const MIN_FILL_MS = 3000;

const contactSchema = z.object({
  name: z.string().trim().min(2, "Your name needs at least 2 characters.").max(80, "That name is a bit long."),
  email: z.email("That email doesn't look right."),
  message: z.string().trim().min(20, "Give me at least 20 characters to work with.").max(2000, "Keep it under 2000 characters."),
});

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
  values?: { name: string; email: string; message: string };
};

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: real people never see or fill this field. Pretend it worked.
  if (String(formData.get("website") ?? "")) return { status: "success" };

  // Bots submit instantly; people take a few seconds. (Missing without JavaScript: allowed.)
  const startedAt = Number(formData.get("startedAt") ?? 0);
  if (startedAt && Date.now() - startedAt < MIN_FILL_MS) {
    return { status: "error", message: "That was suspiciously fast. Give it another try?", values };
  }

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ContactState["fieldErrors"]>;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "A couple of fields need another look.", fieldErrors, values };
  }

  const { success } = await contactLimiter.limit(visitorKey(await headers()));
  if (!success) return { status: "error", message: "Too many messages in a short time. Try again in a few minutes.", values };

  if (process.env.CONTACT_DRY_RUN === "1") return { status: "success" };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return { status: "error", message: `The contact form isn't wired up yet. Email me directly at ${profile.email}.`, values };
  }

  const { name, email, message } = parsed.data;
  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
    to: process.env.CONTACT_TO_EMAIL ?? profile.email,
    replyTo: email,
    subject: `Portfolio message from ${name}`,
    text: `${message}\n\n---\nFrom: ${name} <${email}>\nSent via the portfolio contact form.`,
  });

  if (error) {
    console.error("[contact] resend error", error.name);
    return { status: "error", message: `Something went wrong sending that. Email me directly at ${profile.email}.`, values };
  }
  return { status: "success" };
}
