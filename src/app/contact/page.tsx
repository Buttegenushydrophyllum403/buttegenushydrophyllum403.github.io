import { MessageSquareText } from "lucide-react";
import type { Metadata } from "next";
import { ChatButton } from "@/components/chat/ChatButton";
import { ContactForm } from "@/components/contact/ContactForm";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { CopyEmail } from "@/components/layout/CopyEmail";
import { Rich } from "@/components/Rich";
import { contactCopy as copy, profile, siteCopy } from "@/content";

export const metadata: Metadata = {
  title: "Contact",
  description: copy.metaDescription,
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <div className="container-page grid gap-12 pt-16 md:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="eyebrow mb-2">
          <span className="text-primary">§</span> {copy.eyebrow}
        </p>
        <h1 className="font-display text-6xl sm:text-7xl">
          <Rich text={copy.title} />
        </h1>
        <p className="mt-5 text-lg text-muted">
          <Rich text={copy.intro} />
        </p>
        <dl className="mt-8 space-y-5">
          <div>
            <dt className="eyebrow mb-1">{copy.emailLabel}</dt>
            <dd>
              <CopyEmail email={profile.email} copiedLabel={siteCopy.copied} />
            </dd>
          </div>
          <div>
            <dt className="eyebrow mb-1">{copy.linkedinLabel}</dt>
            <dd>
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-medium hover:text-primary">
                <LinkedInIcon size={16} /> {copy.linkedinText}
              </a>
            </dd>
          </div>
          {profile.links.github && (
            <div>
              <dt className="eyebrow mb-1">{copy.githubLabel}</dt>
              <dd>
                <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-medium hover:text-primary">
                  <GitHubIcon size={16} /> {copy.githubText}
                </a>
              </dd>
            </div>
          )}
        </dl>
        <div className="mt-8 max-w-sm -rotate-1 bg-[#fff2a8] p-5 text-[#2b2a1f] shadow-[3px_6px_14px_-4px_rgb(0_0_0/0.35)]">
          <p className="font-hand text-xl leading-snug">{copy.note}</p>
          <ChatButton className="mt-2 inline-flex items-center gap-2 font-hand text-xl font-bold text-[#b8321c] underline decoration-2 underline-offset-4">
            <MessageSquareText size={18} aria-hidden /> {copy.noteButton}
          </ChatButton>
        </div>
      </div>
      <ContactForm to={profile.email} copy={copy.form} />
    </div>
  );
}
