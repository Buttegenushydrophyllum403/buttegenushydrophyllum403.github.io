"use client";

import { Rocket } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useActionState, useEffect, useRef, useState } from "react";
import { sendContact, type ContactState } from "@/app/contact/actions";
import { useSound } from "@/components/effects/SoundProvider";
import { SparkleStar } from "@/components/effects/Sparkles";
import { cn } from "@/lib/utils";

const initialState: ContactState = { status: "idle" };

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-primary">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-base outline-none transition-colors placeholder:text-muted/70 focus:border-primary aria-[invalid=true]:border-primary";

export function ContactForm() {
  const [formKey, setFormKey] = useState(0);
  // Remounting resets useActionState back to the empty form.
  return <ContactFormInner key={formKey} onReset={() => setFormKey((k) => k + 1)} />;
}

function ContactFormInner({ onReset }: { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(sendContact, initialState);
  const { play } = useSound();
  const startedAtRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set on the client so the server-rendered HTML stays stable.
    if (startedAtRef.current && !startedAtRef.current.value) startedAtRef.current.value = String(Date.now());
  }, []);

  useEffect(() => {
    if (state.status === "success") play("sparkle");
  }, [state, play]);

  if (state.status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-3xl border border-border bg-surface p-8 text-center shadow-card"
        role="status"
      >
        <SparkleStar color="var(--gold-bright)" size={20} top="10%" left="20%" />
        <SparkleStar color="var(--primary)" size={16} top="20%" left="75%" />
        <motion.span
          className="mx-auto grid size-16 place-items-center rounded-full bg-primary-soft text-primary"
          initial={{ y: 20 }}
          animate={{ y: [20, -8, 0] }}
          transition={{ duration: 0.6 }}
        >
          <Rocket size={30} aria-hidden />
        </motion.span>
        <p className="mt-4 font-display text-2xl font-bold">Message launched</p>
        <p className="mt-2 text-muted">Thanks for reaching out. The real Rifat will get back to you.</p>
        <button type="button" className="mt-5 font-semibold text-primary hover:underline" onClick={onReset}>
          Send another
        </button>
      </motion.div>
    );
  }

  const v = state.values;
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-5 rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-8" noValidate>
      <input ref={startedAtRef} type="hidden" name="startedAt" />
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field id="name" label="Name" error={errors.name}>
        <input
          id="name"
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={80}
          defaultValue={v?.name}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={inputClass}
          placeholder="Ada Lovelace"
        />
      </Field>
      <Field id="email" label="Email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={v?.email}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={inputClass}
          placeholder="you@company.com"
        />
      </Field>
      <Field id="message" label="Message" error={errors.message}>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={2000}
          rows={6}
          defaultValue={v?.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(inputClass, "resize-y")}
          placeholder="Tell me about the role, the project, or the drone you want built."
        />
      </Field>

      <AnimatePresence>
        {state.status === "error" && state.message && (
          <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} role="alert" className="rounded-xl bg-primary-soft px-4 py-3 font-medium">
            {state.message}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={pending}
        onClick={() => play("send")}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-lg font-semibold text-white transition-opacity disabled:opacity-60 sm:w-auto dark:text-bg"
      >
        <Rocket size={19} aria-hidden /> {pending ? "Launching…" : "Send message"}
      </button>
    </form>
  );
}
