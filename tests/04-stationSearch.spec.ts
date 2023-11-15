/* eslint-disable */
import { test, expect } from '@playwright/test';
import { getSelectorString } from './getSelectorString';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle('Radio-Stream');
    // There's a redirect from / to /home
    await expect(page).toHaveURL('http://localhost:3000/home');
});

// Search a string, check if paginator is present, click on pages

test('Station search - search, check station info, play station', async ({ page }) => {
    await page.locator(getSelectorString('home-search-input')).click();
    await page.locator(getSelectorString('home-search-input')).fill('Fun Radio');

    await page.locator(getSelectorString('home-search-submit-button')).click();

    await page.waitForLoadState('networkidle');

    await page.locator(getSelectorString('search-station-result-wrapper-0')).isVisible();
    await page.locator(getSelectorString('search-station-result-name-0')).isVisible();
    await page.locator(getSelectorString('search-station-result-flag-0')).isVisible();
    await page.locator(getSelectorString('search-station-result-logo-0')).isVisible();
    await page.locator(getSelectorString('search-station-result-play-button-0')).isVisible();

    await page.locator(getSelectorString('search-station-result-play-button-0')).click();

    await page.waitForTimeout(2000);

    const stationName = await page.locator(getSelectorString('search-station-result-name-0')).innerHTML();

    // If this icon is visible it means that audio is playing
    await page.locator(getSelectorString('audio-player-playing-icon')).isVisible();

    const audioPlayerStationName = await page.locator(getSelectorString('audio-player-station-name')).innerHTML();

    expect(audioPlayerStationName).toBe(stationName);
});

test('Station search - search, set filter/sorting and number of stations', async ({ page }) => {
    await page.locator(getSelectorString('home-search-input')).click();
    await page.locator(getSelectorString('home-search-input')).fill('Fun Radio');

    await page.locator(getSelectorString('home-search-submit-button')).click();

    await page.waitForLoadState('networkidle');

    await page.locator(getSelectorString('search-station-filters-container')).isVisible();

    const numberOfStations = (await page.locator(getSelectorString('search-station-number-of-stations')).innerHTML()).split(' ')[0];
    expect(parseInt(numberOfStations)).toBeGreaterThanOrEqual(0);

    await page.locator(getSelectorString('search-station-alphabetical-sort-button')).click();
    await page.locator(getSelectorString('search-station-popularity-sort-button')).click();

    await page.locator(getSelectorString('search-station-sort-order-select')).selectOption({ index: 0 });
    await page.locator(getSelectorString('search-station-sort-order-select')).selectOption({ index: 1 });
});

test('Station search - check if pagination is present', async ({ page }) => {
    await page.locator(getSelectorString('home-search-input')).click();
    await page.locator(getSelectorString('home-search-input')).fill('Fun Radio');

    await page.locator(getSelectorString('home-search-submit-button')).click();

    await page.waitForLoadState('networkidle');

    await page.locator(getSelectorString('search-station-pagination')).isVisible();
});