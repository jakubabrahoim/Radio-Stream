/* eslint-disable */
import { test, expect, Page } from '@playwright/test';
import { getSelectorString } from './getSelectorString';

test.describe('Favorite stations', () => {
    let page: Page;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();

        await page.goto('https://radio-sh.web.app/');
        await expect(page).toHaveTitle('Radio-Stream');
        await page.locator(getSelectorString('navigation-link-login')).click();
    });

    test('Favorite station - add to favorite, check favorites, remove from favorites', async () => {
        // Login
        const email = 'jakub.abrahoim.3@gmail.com';
        const password = 'KPAISTest123';

        await page.locator(getSelectorString('login-email-input')).click();
        await page.locator(getSelectorString('login-email-input')).fill(email);

        await page.locator(getSelectorString('login-password-input')).click();
        await page.locator(getSelectorString('login-password-input')).fill(password);

        await page.locator(getSelectorString('login-submit-button')).click();

        await expect(page).toHaveURL('https://radio-sh.web.app/home');

        // Search for a station
        await page.locator(getSelectorString('home-search-input')).click();
        await page.locator(getSelectorString('home-search-input')).fill('Fun Radio');

        await page.locator(getSelectorString('home-search-submit-button')).click();

        // Play the station
        await page.locator(getSelectorString('search-station-result-play-button-0')).click();

        // Add to favorites
        await page.locator(getSelectorString('audio-player-like-button')).click();

        // Go to favorites
        await page.locator(getSelectorString('navigation-link-my-stations')).click();
        await expect(page).toHaveURL('https://radio-sh.web.app/my-stations');

        await page.waitForTimeout(2000);

        const childCount = await page.locator(getSelectorString('liked-stations-container')).evaluate((el) => el.children.length);
        expect(childCount).toBe(1);

        await page.locator(getSelectorString('liked-station-wrapper-0')).isVisible();
        await page.locator(getSelectorString('liked-station-name-0')).isVisible();
        await page.locator(getSelectorString('liked-station-logo-0')).isVisible();
        await page.locator(getSelectorString('liked-station-play-button-0')).isVisible();

        // Remove from favorites
        await page.locator(getSelectorString('liked-station-remove-button-0')).click();
    });
});