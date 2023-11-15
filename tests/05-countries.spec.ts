/* eslint-disable */
import { test, expect, Page } from '@playwright/test';
import { getSelectorString } from './getSelectorString';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle('Radio-Stream');
    // There's a redirect from / to /home
    await expect(page).toHaveURL('http://localhost:3000/home');

    await page.locator(getSelectorString('navigation-link-countries')).click();
    await expect(page).toHaveURL('http://localhost:3000/countries');
});

// world map view - click on country

test('Countries (list view) - check if all countries present, open a country', async ({ page }) => {
    await waitForFetchAndRender(page);

    await page.locator(getSelectorString('countries-list-container')).isVisible();

    const childCount = await page.locator(getSelectorString('countries-list-container')).evaluate((el) => el.children.length);
    expect(childCount).toBe(225);

    await page.locator(getSelectorString('countries-list-item-0')).click();

    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/http:\/\/localhost:3000\/countries\/\w+/);
});

test('Countries - search for a country, open it', async ({ page }) => {
    await waitForFetchAndRender(page);

    await page.locator(getSelectorString('countries-search-input')).click();
    await page.locator(getSelectorString('countries-search-input')).fill('Slovakia');

    await page.locator(getSelectorString('countries-search-submit')).click();

    await page.locator(getSelectorString('countries-list-container')).isVisible();

    const childCount = await page.locator(getSelectorString('countries-list-container')).evaluate((el) => el.children.length);
    expect(childCount).toBe(1);

    const countryName = await page.locator(getSelectorString('countries-list-item-name-0')).innerHTML();
    expect(countryName).toBe('Slovakia');

    await page.locator(getSelectorString('countries-list-item-flag-0')).isVisible();
    await page.locator(getSelectorString('countries-list-item-number-of-stations-0')).isVisible();
});

test('Countries - switch between views', async ({ page }) => {
    await waitForFetchAndRender(page);

    await page.locator(getSelectorString('countries-view-type-list')).click();
    await page.locator(getSelectorString('countries-view-type-combined')).click();
    await page.locator(getSelectorString('countries-view-type-map')).click();
});

const waitForFetchAndRender = async (page: Page) => {
    // Wait to fetch countries
    await page.waitForLoadState('networkidle');
    // Wait for them to be rendered since there are a lot of them
    await page.waitForTimeout(2000);
}