import { describe, expect, it } from "vitest";
import { buildKnowledge } from "@/lib/chat/knowledge";
import { SYSTEM_PROMPT } from "@/lib/chat/system-prompt";

describe("AI twin knowledge base", () => {
  it("is byte-identical across builds so prompt caching keeps hitting", () => {
    expect(buildKnowledge()).toBe(buildKnowledge());
  });

  it("contains the key facts exactly as stated in the CV", () => {
    const kb = buildKnowledge();
    expect(kb).toContain("6th globally");
    expect(kb).toContain("1st in Bangladesh");
    expect(kb).toContain("1st in the Science Task");
    expect(kb).toContain("16th globally");
    expect(kb).toContain("University Rover Challenge (URC): Competed");
    expect(kb).toContain("10K+ user base");
    expect(kb).toContain("pass@1 = 0.92");
    expect(kb).toContain("+0.090 mIoU");
    expect(kb).toContain("Dr. Md. Hasanul Kabir");
    expect(kb).toContain("CGPA 3.78 / 4.00");
    expect(kb).toContain("Sylhet Metropolitan Police");
  });

  it("lists every paper's authors as printed on the PDF", () => {
    const kb = buildKnowledge();
    expect(kb).toContain("Authors: Fairuz Khan, Rifat Sarwar, Wasif Uddin.");
    expect(kb).toContain("Authors: Khandakar Shakib Al Hasan, Md. Rifat Sarwar, Meftahul Jannati Anonna, Wasif Uddin.");
    expect(kb).toContain("Nowshin Mahjabin, Nufsat Farooque");
  });

  it("leaves the changelog jokes out of the facts", () => {
    expect(buildKnowledge()).not.toContain("low-traffic windows");
  });

  it("never includes the phone number", () => {
    expect(SYSTEM_PROMPT).not.toMatch(/1886|990005|\+880/);
  });

  it("is comfortably above the prompt-caching minimum and below a sane size", () => {
    // Rough chars-per-token estimate: well over 512 tokens, well under ~20K.
    expect(SYSTEM_PROMPT.length).toBeGreaterThan(4000);
    expect(SYSTEM_PROMPT.length).toBeLessThan(80000);
  });
});
