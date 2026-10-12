export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Ink-filled button with a hard red-pen shadow. */
export const btnPrimary =
  "inline-flex items-center gap-2 border-2 border-text bg-text px-5 py-2.5 font-semibold text-bg shadow-[4px_4px_0_var(--primary)] transition-[transform,box-shadow] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--primary)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--primary)]";

/** Outlined sibling of btnPrimary. */
export const btnSecondary =
  "inline-flex items-center gap-2 border-2 border-text bg-surface px-5 py-2.5 font-semibold transition-[transform,box-shadow] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--text)]";

export const accentText = {
  primary: "text-primary",
  gold: "text-gold",
  sky: "text-sky",
  mint: "text-mint",
} as const;

export const accentBg = {
  primary: "bg-primary",
  gold: "bg-gold-bright",
  sky: "bg-sky-bright",
  mint: "bg-mint",
} as const;

export const accentVar = {
  primary: "var(--primary)",
  gold: "var(--gold-bright)",
  sky: "var(--sky-bright)",
  mint: "var(--mint)",
} as const;

/** Accent colours safe for text on both themes (darker variants in light mode). */
export const accentTextVar = {
  primary: "var(--primary)",
  gold: "var(--gold)",
  sky: "var(--sky)",
  mint: "var(--mint)",
} as const;

export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/** Fills {placeholders} in a content string, e.g. fill("Ask about {title}", { title: "GenieA" }). */
export function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}
