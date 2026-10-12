import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SafeText } from "@/components/chat/SafeText";

const html = (text: string) => renderToStaticMarkup(<SafeText text={text} />);

describe("SafeText", () => {
  it("drops markdown emphasis but keeps the words", () => {
    expect(html("I built **GenieA** and *HealthStar*.")).toBe("I built GenieA and HealthStar.");
  });

  it("leaves lone asterisks and maths alone", () => {
    expect(html("2 * 3 = 6")).toBe("2 * 3 = 6");
  });

  it("links paper PDFs in a new tab", () => {
    const out = html("Read it at /papers/rotation-robust-bdsl-glove.pdf.");
    expect(out).toContain('href="/papers/rotation-robust-bdsl-glove.pdf"');
    expect(out).toContain('target="_blank"');
    expect(out.endsWith("</a>.")).toBe(true);
  });

  it("never links paths outside the allow-list", () => {
    expect(html("See /admin or /papers/../secret.pdf")).not.toContain("<a");
  });
});
