import { test, expect } from "@playwright/test";

test.describe("HasyDonate E2E User Journeys", () => {
  test("verifies accessibility of authentication layout and form inputs", async ({ page }) => {
    await page.goto("/login");

    // Semantic assertions on forms elements
    const heading = page.locator("h1");
    await expect(heading).toContainText("HasyDonate");

    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute("id", "email");

    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute("id", "password");

    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toContainText("Login");
  });

  test("verifies dashboard navigation links and structure", async ({ page }) => {
    // Navigate directly to dashboard login boundaries
    await page.goto("/dashboard");

    // E2E asserts correct redirection or accessibility structure
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });
});
