/* eslint-disable */
import { test, expect } from '@playwright/test';
import { getSelectorString } from './getSelectorString';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle('Radio-Stream');
    // There's a redirect from / to /home
    await expect(page).toHaveURL('http://localhost:3000/home');
});

test('Home - check if popular stations visible + count', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    await page.locator(getSelectorString('home-popular-stations-container')).isVisible();
    const childCount = await page.locator(getSelectorString('home-popular-stations-container')).evaluate((el) => el.children.length);
    expect(childCount).toBeLessThanOrEqual(10);
});

test('Home - use arrows to scroll left/right', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    await page.locator(getSelectorString('home-popular-station-scroll-left-button')).isVisible();
    await page.locator(getSelectorString('home-popular-station-scroll-right-button')).isVisible();

    for (let i = 0; i < 5; i++) {
        await page.locator(getSelectorString('home-popular-station-scroll-right-button')).click();
    }

    for (let i = 0; i < 5; i++) {
        await page.locator(getSelectorString('home-popular-station-scroll-left-button')).click();
    }
});

test('Home - check if every station has icon/logo, name and playbutton', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    for (let i = 0; i < 10; i++) {
        await page.locator(getSelectorString(`home-popular-station-name-${i}`)).isVisible();
        await page.locator(getSelectorString(`home-popular-station-logo-${i}`)).isVisible();
        await page.locator(getSelectorString(`home-popular-station-play-button-${i}`)).isVisible();
    }
});

test('Home - play a popular station', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    await page.locator(getSelectorString('home-popular-station-name-0')).isVisible();
    await page.locator(getSelectorString('home-popular-station-logo-0')).isVisible();
    await page.locator(getSelectorString('home-popular-station-play-button-0')).isVisible();

    await page.locator(getSelectorString('home-popular-station-play-button-0')).click();

    await page.waitForTimeout(2000);

    // If this icon is visible it means that audio is playing
    await page.locator(getSelectorString('audio-player-playing-icon')).isVisible();
});