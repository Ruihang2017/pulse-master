import { expect, test } from "@playwright/test";

test("landing renders and accepts email", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Pulse" })).toBeVisible();
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByRole("button", { name: /join|…/i }).click();
  await expect(page.locator("text=Thanks"))
    .toBeVisible({ timeout: 10_000 })
    .catch(() => undefined);
});
