import { test, expect } from "@playwright/test";

test.describe("Restaurant Search Flow", () => {
  test("should allow a user to search for a location and see the results page", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Order food and more" })
    ).toBeVisible();

    const searchInput = page.getByPlaceholder("Enter your area or postcode");
    const searchButton = page.getByRole("button", { name: "Search" });

    await expect(searchButton).toBeDisabled();

    await searchInput.fill("Bristol - BS14DJ");

    await expect(searchButton).toBeEnabled();

    await searchButton.click();

    await expect(
      page.getByRole("heading", { name: /Restaurants near Bristol/i })
    ).toBeVisible();

    await expect(page.getByText(/Showing \d+ of \d+ results/)).toBeVisible();
  });
});
