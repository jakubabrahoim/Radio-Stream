/* eslint-disable */
import { test, expect, Page } from '@playwright/test';
import { getSelectorString } from './getSelectorString';

test.describe('Popular stations on homepage', () => {
    let page: Page;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();

        await page.goto('https://radio-sh.web.app/');
        await expect(page).toHaveTitle('Radio-Stream');
        // There's a redirect from / to /home
        await expect(page).toHaveURL('https://radio-sh.web.app/home');
    });

    test('TC09 - Home - check if popular stations visible + count', async () => {
        await page.waitForLoadState('networkidle');

        if (!await isGeolocationDisabled(page)) return;

        await page.locator(getSelectorString('home-popular-stations-container')).isVisible();
        const childCount = await page.locator(getSelectorString('home-popular-stations-container')).evaluate((el) => el.children.length);
        expect(childCount).toBeLessThanOrEqual(10);
    });

    test('TC10 - Home - use arrows to scroll left/right', async () => {
        await page.waitForLoadState('networkidle');

        if (!await isGeolocationDisabled(page)) return;

        await page.locator(getSelectorString('home-popular-station-scroll-left-button')).isVisible();
        await page.locator(getSelectorString('home-popular-station-scroll-right-button')).isVisible();

        for (let i = 0; i < 5; i++) {
            await page.locator(getSelectorString('home-popular-station-scroll-right-button')).click();
        }

        for (let i = 0; i < 5; i++) {
            await page.locator(getSelectorString('home-popular-station-scroll-left-button')).click();
        }
    });

    test('TC11 - Home - check if every station has icon/logo, name and playbutton', async () => {
        await page.waitForLoadState('networkidle');

        if (!await isGeolocationDisabled(page)) return;

        for (let i = 0; i < 10; i++) {
            await page.locator(getSelectorString(`home-popular-station-name-${i}`)).isVisible();
            await page.locator(getSelectorString(`home-popular-station-logo-${i}`)).isVisible();
            await page.locator(getSelectorString(`home-popular-station-play-button-${i}`)).isVisible();
        }
    });

    test('TC12 - Home - play a popular station', async () => {
        await page.waitForLoadState('networkidle');

        if (!await isGeolocationDisabled(page)) return;

        await page.locator(getSelectorString('home-popular-station-name-0')).isVisible();
        await page.locator(getSelectorString('home-popular-station-logo-0')).isVisible();
        await page.locator(getSelectorString('home-popular-station-play-button-0')).isVisible();

        await page.locator(getSelectorString('home-popular-station-play-button-0')).click();

        await page.waitForTimeout(2000);

        // If this icon is visible it means that audio is playing
        await page.locator(getSelectorString('audio-player-playing-icon')).isVisible();
    });
});

const isGeolocationDisabled = async (page: Page) => {
    const isGeolocationDisabled = await page.locator(getSelectorString('home-geolocation-disabled-message')).isVisible();

    return isGeolocationDisabled;
}