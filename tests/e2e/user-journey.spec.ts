import { test, expect } from "@playwright/test";

test.describe("Core User Journey: Understand, Track, Reduce", () => {
  // Use a unique test email for each run to avoid collision if DB isn't reset
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = "Password123!";

  test("User can register, log an activity, and view the dashboard", async ({ page }) => {
    // 1. Registration
    await page.goto("/auth/register");
    await page.fill('input[type="text"]', "Test User");
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    
    // Attempt registration (will redirect to login on success)
    await page.click('button[type="submit"]');
    
    // Wait for redirect to login
    await page.waitForURL("**/auth/login");

    // 2. Login
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL("**/dashboard");
    await expect(page.locator("text=Carbon Dashboard")).toBeVisible();

    // 3. Log a New Activity
    await page.goto("/activities/new");
    await expect(page.locator("text=Select Category")).toBeVisible();

    // Select Transport category (assuming the label is Transport)
    await page.click("text=Transport");
    
    // Select Car subcategory
    await page.click("text=Car");
    
    // Continue
    await page.click("text=Continue");

    // Fill in the details
    await expect(page.locator("text=Activity Details")).toBeVisible();
    await page.fill('input[type="number"]', "50"); // 50 km
    await page.click("text=Log Activity");

    // Should redirect to activities list after success
    await page.waitForURL("**/activities");
    await expect(page.locator("text=50")).toBeVisible(); // The logged amount should be visible

    // 4. Verify Dashboard Aggregation
    await page.goto("/dashboard");
    // Ensure the total CO2 is greater than 0
    const totalCo2Locator = page.locator(".text-4xl.font-bold").first();
    await expect(totalCo2Locator).not.toHaveText("0 kg");
  });
});
