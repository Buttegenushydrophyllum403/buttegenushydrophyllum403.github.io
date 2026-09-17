import { expect, test } from "@playwright/test";

const SLUGS = ["genie-a", "health-star", "star-watch", "project-altair", "project-aero", "megamind-llm"];

test("home page renders the key sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Rifat");
  await expect(page.getByRole("heading", { name: "From rovers to rotors" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Scoreboard" })).toBeVisible();
  await expect(page.locator("#journey ol > li")).toHaveCount(7);
});

test("every case study page renders", async ({ page }) => {
  for (const slug of SLUGS) {
    const res = await page.goto(`/projects/${slug}`);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Mission brief/ })).toBeVisible();
  }
});

test("main navigation works", async ({ page, isMobile }) => {
  await page.goto("/");
  for (const [label, path] of [
    ["Projects", "/projects"],
    ["About", "/about"],
    ["Contact", "/contact"],
  ] as const) {
    if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
    const nav = page.getByRole("navigation", { name: isMobile ? "Mobile" : "Main" });
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
  }
});

test("theme toggle persists across reloads and is applied before paint", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("reduced motion swaps the journey animation for a plain list", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#journey ol")).toHaveClass(/list-decimal/);
  await expect(page.getByRole("button", { name: /Sounds are off because reduced motion/ })).toBeDisabled();
});

test("unknown routes show the lost-rover 404", async ({ page }) => {
  const res = await page.goto("/this-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /rover wandered off the map/ })).toBeVisible();
});

test("/cv redirects to the PDF", async ({ request }) => {
  const res = await request.get("/cv", { maxRedirects: 0 });
  expect([307, 308]).toContain(res.status());
  expect(res.headers()["location"]).toContain("/cv/rifat-sarwar-cv.pdf");
});

test("sitemap and robots are generated", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const slug of SLUGS) expect(sitemap).toContain(`/projects/${slug}`);
  expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /api/");
});
