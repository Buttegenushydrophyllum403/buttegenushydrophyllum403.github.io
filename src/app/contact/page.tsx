import { Bot } from "lucide-react";
import type { Metadata } from "next";
import { ChatButton } from "@/components/chat/ChatButton";
import { ContactForm } from "@/components/contact/ContactForm";
import { LinkedInIcon } from "@/components/icons";
import { CopyEmail } from "@/components/layout/CopyEmail";
import { profile } from "@/content";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${profile.name}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="container-page grid gap-12 pt-16 md:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="eyebrow mb-3">Mission control</p>
        <h1 className="font-display text-5xl font-extrabold sm:text-6xl">Let&apos;s talk.</h1>
        <p className="mt-5 text-lg text-muted">
          Hiring, collaborating, or just want to argue about Flutter vs. React Native? This form goes straight to my inbox. A human (me) reads every message.
        </p>
        <div className="mt-8 space-y-4">
          <div>
            <p className="eyebrow mb-1">Email</p>
            <CopyEmail email={profile.email} />
          </div>
          <div>
            <p className="eyebrow mb-1">LinkedIn</p>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-medium hover:text-primary">
              <LinkedInIcon size={16} /> linkedin.com/in/rifatsarwar
            </a>
          </div>
          <div className="rounded-2xl border border-dashed border-border p-4">
            <p className="text-muted">Just have a quick question? The AI twin answers instantly (and sarcastically).</p>
            <ChatButton className="mt-3 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
              <Bot size={18} aria-hidden /> Ask the AI twin
            </ChatButton>
          </div>
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
