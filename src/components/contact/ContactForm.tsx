"use client";

import { Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useSound } from "@/components/effects/SoundProvider";
import type { ContactFormCopy } from "@/content";
import { buildMailto, type ContactField, validateContact } from "@/lib/contact";
import { btnPrimary, cn } from "@/lib/utils";

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-mono text-sm font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 font-hand text-lg text-primary">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full border-0 border-b-2 border-border bg-transparent px-1 py-2 font-hand text-xl outline-none transition-colors placeholder:font-sans placeholder:text-base placeholder:text-muted/70 focus:border-text focus-visible:outline-none aria-[invalid=true]:border-primary";

const EMPTY: Record<ContactField, string> = { name: "", email: "", message: "" };

/** Validates, then opens the visitor's mail app with the message already written. */
export function ContactForm({ to, copy }: { to: string; copy: ContactFormCopy }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [sent, setSent] = useState<{ href: string } | null>(null);
  const { play } = useSound();

  const bind = (field: ContactField) => ({
    id: field,
    name: field,
    value: values[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues((v) => ({ ...v, [field]: e.target.value })),
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
    className: inputClass,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateContact(values, copy.errors);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    const href = buildMailto(to, result.data, copy);
    setSent({ href });
    play("stamp");
    window.location.href = href;
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative border border-border bg-surface p-8 text-center shadow-card" role="status">
        <motion.span
          className="stamp text-lg text-primary"
          initial={{ scale: 2.2, rotate: -30, opacity: 0 }}
          animate={{ scale: 1, rotate: -8, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
        >
          {copy.success.stamp}
        </motion.span>
        <p className="mt-6 font-display text-3xl">{copy.success.title}</p>
        <p className="mt-2 text-muted">
          {copy.success.text} {copy.success.retryPrefix}{" "}
          <a href={sent.href} className="font-semibold text-primary underline underline-offset-4">
            {copy.success.retry}
          </a>
          , {copy.success.copyPrefix} <span className="font-mono text-text">{to}</span>.
        </p>
        <button
          type="button"
          className="mt-5 font-mono text-sm underline decoration-primary decoration-2 underline-offset-4 hover:text-primary"
          onClick={() => {
            setSent(null);
            setValues(EMPTY);
          }}
        >
          {copy.success.another}
        </button>
      </motion.div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={submit} className="relative space-y-6 border border-border bg-surface p-6 shadow-card sm:p-8" noValidate>
      <span className="tape -top-3 right-10 rotate-6" aria-hidden />

      <Field id="name" label={copy.nameLabel} error={errors.name}>
        <input {...bind("name")} autoComplete="name" required maxLength={80} placeholder={copy.namePlaceholder} />
      </Field>
      <Field id="email" label={copy.emailLabel} error={errors.email}>
        <input {...bind("email")} type="email" autoComplete="email" required placeholder={copy.emailPlaceholder} />
      </Field>
      <Field id="message" label={copy.messageLabel} error={errors.message}>
        <textarea
          {...bind("message")}
          required
          maxLength={2000}
          rows={6}
          className={cn(inputClass, "resize-y leading-[2.25rem] [background:repeating-linear-gradient(to_bottom,transparent_0_calc(2.25rem-1px),var(--ruled)_calc(2.25rem-1px)_2.25rem)]")}
          placeholder={copy.messagePlaceholder}
        />
      </Field>

      <AnimatePresence>
        {hasErrors && (
          <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} role="alert" className="border-l-4 border-primary bg-primary-soft px-4 py-3 font-medium">
            {copy.errorSummary}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button type="submit" className={cn(btnPrimary, "w-full justify-center sm:w-auto")}>
          <Send size={18} aria-hidden /> {copy.submit}
        </button>
        <p className="text-sm text-muted">{copy.submitHint}</p>
      </div>
    </form>
  );
}
