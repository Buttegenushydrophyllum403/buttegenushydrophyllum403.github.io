import { expect, test } from "@playwright/test";
import chat from "../../content/chat.json";
import contact from "../../content/contact.json";

// Stand-in for the Cloudflare Worker (playwright.config.ts points NEXT_PUBLIC_CHAT_URL here).
test.beforeEach(async ({ page }) => {
  await page.route("**/__mock-chat", async (route) => {
    const { messages } = route.request().postDataJSON() as { messages: { content: string }[] };
    const question = messages.at(-1)?.content.slice(0, 80) ?? "";
    await route.fulfill({
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: `Mock twin here. You asked: "${question}". In real life I'd tell you about GenieA or the rover. See /projects.`,
    });
  });
});

test("AI twin streams a (mock) reply and links allow-listed paths", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Chat with Rifat's AI twin" }).click();
  const dialog = page.getByRole("dialog", { name: chat.title });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: chat.suggestions[0] }).click();
  // .first(): the reply also appears in the screen-reader announcement region.
  await expect(dialog.getByText("Mock twin here").first()).toBeVisible();
  await expect(dialog.getByRole("link", { name: "/projects" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("chat renders HTML from the model as plain text", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Chat with Rifat's AI twin" }).click();
  const dialog = page.getByRole("dialog", { name: chat.title });
  await dialog.getByLabel("Message the AI twin").fill("<img src=x onerror=alert(1)>");
  await dialog.getByRole("button", { name: "Send message" }).click();
  await expect(dialog.getByText("<img src=x onerror=alert(1)>").first()).toBeVisible();
  await expect(dialog.locator("img")).toHaveCount(0);
});

test("contact form validates, then succeeds", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel(contact.form.nameLabel, { exact: true }).fill("A");
  await page.getByLabel(contact.form.emailLabel, { exact: true }).fill("not-an-email");
  await page.getByLabel(contact.form.messageLabel, { exact: true }).fill("too short");
  await page.getByRole("button", { name: contact.form.submit }).click();
  await expect(page.getByText(contact.form.errors.nameShort)).toBeVisible();
  await expect(page.getByText(contact.form.errors.email)).toBeVisible();

  await page.getByLabel(contact.form.nameLabel, { exact: true }).fill("Test Recruiter");
  await page.getByLabel(contact.form.emailLabel, { exact: true }).fill("recruiter@example.com");
  await page.getByLabel(contact.form.messageLabel, { exact: true }).fill("We would love to talk to you about a robotics role on our team.");
  await page.getByRole("button", { name: contact.form.submit }).click();
  await expect(page.getByText(contact.form.success.title)).toBeVisible();
  await expect(page.getByRole("link", { name: contact.form.success.retry })).toHaveAttribute("href", /^mailto:rifatsarwar17442@gmail\.com\?subject=/);
});
