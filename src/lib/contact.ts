import { z } from "zod";
import type { ContactFormCopy } from "@/content";
import { fill } from "@/lib/utils";

/**
 * The contact form has no backend: it validates here, then hands a pre-written email to the
 * visitor's own mail app via a mailto: link. No email service, no API key, nothing stored.
 * All wording (errors, subject, signature) comes from content/contact.json.
 */
export type ContactField = "name" | "email" | "message";
export type ContactValues = Record<ContactField, string>;

function schema(errors: ContactFormCopy["errors"]) {
  return z.object({
    name: z.string().trim().min(2, errors.nameShort).max(80, errors.nameLong),
    email: z.email(errors.email),
    message: z.string().trim().min(20, errors.messageShort).max(2000, errors.messageLong),
  });
}

export function validateContact(values: ContactValues, errors: ContactFormCopy["errors"]) {
  const parsed = schema(errors).safeParse(values);
  if (parsed.success) return { ok: true as const, data: parsed.data };
  const fieldErrors: Partial<Record<ContactField, string>> = {};
  for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as ContactField] ??= issue.message;
  return { ok: false as const, errors: fieldErrors };
}

export function buildMailto(to: string, { name, email, message }: ContactValues, copy: Pick<ContactFormCopy, "emailSubject" | "emailSignature">) {
  const subject = fill(copy.emailSubject, { name });
  const body = `${message}\n\n---\n${name} <${email}>\n${copy.emailSignature}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
