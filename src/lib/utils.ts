export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
