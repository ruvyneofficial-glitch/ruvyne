import { test, expect } from "@playwright/test";

test("should navigate to home page on first render", async ({ page }) => {
  await page.goto("/");
});

test("should navigate from home page to magazine page using the menu", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("banner").getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Magazine", exact: true })
    .click();
  await expect(page).toHaveURL("/magazine");
});

test("should open a category from the header row", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("banner")
    .getByRole("navigation", { name: "Main" })
    .getByRole("link", { name: "Beauty" })
    .click();
  await expect(page).toHaveURL("/magazine?category=beauty");
});

test("should search from the header", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("banner").getByRole("button", { name: "Open search" }).click();
  await page.getByRole("searchbox", { name: "Search stories" }).fill("colour");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/search?q=colour");
  await expect(page.getByRole("status")).toContainText("for “colour”");
});
