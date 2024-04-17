/* eslint-disable */
import { test, expect, Page } from '@playwright/test';
import { getSelectorString } from './getSelectorString';

test.describe('Search for radio stations', () => {
    let page: Page;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();

        await page.goto('https://radio-sh.web.app/');
        await expect(page).toHaveTitle('Radio-Stream');
        // There's a redirect from / to /home
        await expect(page).toHaveURL('https://radio-sh.web.app/home');
    });

    test('TC13 - Station search - search, check station info, play station', async () => {
        await page.locator(getSelectorString('home-search-input')).click();
        await page.locator(getSelectorString('home-search-input')).fill('Fun Radio');

        await page.locator(getSelectorString('home-search-submit-button')).click();

        await page.waitForLoadState('load');
        //await page.waitForTimeout(5000);

        await expect(page).toHaveURL('https://radio-sh.web.app/search-result?query=Fun%20Radio');

        await page.locator(getSelectorString('search-station-result-wrapper-0')).isVisible();
        await page.locator(getSelectorString('search-station-result-name-0')).isVisible();
        await page.locator(getSelectorString('search-station-result-flag-0')).isVisible();
        await page.locator(getSelectorString('search-station-result-logo-0')).isVisible();
        await page.locator(getSelectorString('search-station-result-play-button-0')).isVisible();

        await page.locator(getSelectorString('search-station-result-play-button-0')).click();

        await page.waitForTimeout(5000);

        const stationName = await page.locator(getSelectorString('search-station-result-name-0')).innerHTML();

        // If this icon is visible it means that audio is playing
        await page.locator(getSelectorString('audio-player-playing-icon')).isVisible();

        const audioPlayerStationName = await page.locator(getSelectorString('audio-player-station-name')).innerHTML();

        expect(audioPlayerStationName).toBe(stationName);
    });

    test('TC14 - Station search - search, set filter/sorting and number of stations', async () => {
        await page.locator(getSelectorString('home-search-input')).click();
        await page.locator(getSelectorString('home-search-input')).fill('Fun Radio');

        await page.locator(getSelectorString('home-search-submit-button')).click();

        await page.waitForTimeout(5000);

        await page.locator(getSelectorString('search-station-filters-container')).isVisible();

        const numberOfStations = (await page.locator(getSelectorString('search-station-number-of-stations')).innerHTML()).split(' ')[0];
        expect(parseInt(numberOfStations)).toBeGreaterThanOrEqual(0);

        await page.locator(getSelectorString('search-station-alphabetical-sort-button')).click();
        await page.locator(getSelectorString('search-station-popularity-sort-button')).click();

        await page.locator(getSelectorString('search-station-sort-order-select')).selectOption({ index: 0 });
        await page.locator(getSelectorString('search-station-sort-order-select')).selectOption({ index: 1 });
    });

    test('TC15 - Station search - check if pagination is present', async () => {
        await page.locator(getSelectorString('home-search-input')).click();
        await page.locator(getSelectorString('home-search-input')).fill('Fun Radio');

        await page.locator(getSelectorString('home-search-submit-button')).click();

        await page.waitForLoadState('networkidle');

        await page.locator(getSelectorString('search-station-pagination')).isVisible();
    });
});