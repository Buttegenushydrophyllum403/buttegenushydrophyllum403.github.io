import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Rich } from "@/components/Rich";

const html = (text: string) => renderToStaticMarkup(<Rich text={text} footnote={(n) => <sup>fn{n}</sup>} />);

describe("Rich (content markers)", () => {
  it("renders each marker", () => {
    expect(html("a ==hl== b")).toBe('a <span class="hl">hl</span> b');
    expect(html("~~old~~ new")).toBe('<span class="struck">old</span> new');
    expect(html("**bold** and *italic* and `code`")).toBe('<strong>bold</strong> and <em>italic</em> and <code class="font-mono text-[0.92em]">code</code>');
    expect(html("see[^2]")).toBe("see<sup>fn2</sup>");
  });

  it("makes internal links, external links and file links", () => {
    expect(html("[home](/about)")).toContain('href="/about"');
    expect(html("[gh](https://github.com/x)")).toContain('target="_blank"');
    expect(html("[pdf](/papers/a.pdf)")).toMatch(/href="\/papers\/a.pdf" target="_blank"/);
  });

  it("never renders HTML from content", () => {
    expect(html("<img src=x onerror=alert(1)>")).toBe("&lt;img src=x onerror=alert(1)&gt;");
  });

  it("leaves lone asterisks and maths alone", () => {
    expect(html("2 * 3 = 6")).toBe("2 * 3 = 6");
  });
});
