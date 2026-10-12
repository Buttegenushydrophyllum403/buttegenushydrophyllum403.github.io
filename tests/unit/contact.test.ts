import { describe, expect, it } from "vitest";
import { contactCopy } from "@/content";
import { buildMailto, validateContact } from "@/lib/contact";

const form = contactCopy.form;

describe("contact form", () => {
  it("reports one message per invalid field, worded from content/contact.json", () => {
    const result = validateContact({ name: "A", email: "nope", message: "short" }, form.errors);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toEqual({ name: form.errors.nameShort, email: form.errors.email, message: form.errors.messageShort });
  });

  it("builds a mailto link with the message pre-written and safely encoded", () => {
    const result = validateContact({ name: "Grace Hopper", email: "grace@example.com", message: "Found a moth in the relay & logged it?" }, form.errors);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const href = buildMailto("rifat@example.com", result.data, form);
    expect(href.startsWith("mailto:rifat@example.com?subject=")).toBe(true);
    const params = new URLSearchParams(href.split("?")[1]);
    expect(params.get("subject")).toBe(form.emailSubject.replace("{name}", "Grace Hopper"));
    expect(params.get("body")).toContain("Found a moth in the relay & logged it?");
    expect(params.get("body")).toContain("Grace Hopper <grace@example.com>");
  });
});
