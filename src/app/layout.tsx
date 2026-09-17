import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import { ChatRoot } from "@/components/chat/ChatRoot";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/providers";
import { profile, siteUrl } from "@/content";
import { personJsonLd } from "@/lib/seo";
import "./globals.css";

const heading = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-heading", display: "swap" });
const body = Figtree({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const code = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code", display: "swap" });

const description = `${profile.name}: ${profile.title} working across AI & Robotics. Apps with 10K+ downloads, a Mars rover that placed 6th globally, and drones built from scratch.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${profile.name} · ${profile.title} | ${profile.specialties}`, template: `%s · ${profile.name}` },
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: siteUrl }],
  keywords: ["Rifat Sarwar", "Full Stack Developer", "Flutter", "Next.js", "AI", "LLM", "RAG", "Robotics", "Drones", "Bangladesh", "IUT"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: `${profile.name} · ${profile.title} | ${profile.specialties}`,
    description,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: `${profile.name} · ${profile.title}`, description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1f" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${heading.variable} ${body.variable} ${code.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }} />
        <Providers>
          <a
            href="#main"
            className="sr-only z-50 rounded-full bg-primary px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="flex-1 overflow-x-clip">
            {children}
          </main>
          <Footer />
          <ChatRoot />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
