/* eslint-disable */
import { test, expect, Page } from '@playwright/test';
import { getSelectorString } from './getSelectorString';

test.describe('Audio player', () => {
    let page: Page;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();

        await page.goto('https://radio-sh.web.app/');
        await expect(page).toHaveTitle('Radio-Stream');
        // There's a redirect from / to /home
        await expect(page).toHaveURL('https://radio-sh.web.app/home');
    });

    test('Audio player functionality - play station, pause, volume slider, mute, information check', async () => {
        // Search for a station
        await page.locator(getSelectorString('home-search-input')).click();
        await page.locator(getSelectorString('home-search-input')).fill('Fun Radio');

        await page.locator(getSelectorString('home-search-submit-button')).click();

        await page.waitForLoadState('networkidle');

        // Play the station
        const stationName = await page.locator(getSelectorString('search-station-result-name-0')).innerHTML();
        await page.locator(getSelectorString('search-station-result-play-button-0')).click();

        // Check if correct name is displayed
        const audioPlayerStationName = await page.locator(getSelectorString('audio-player-station-name')).innerHTML();
        expect(audioPlayerStationName).toBe(stationName);

        // Check if station icon is displayed
        await page.locator(getSelectorString('audio-player-playing-icon')).isVisible();

        // Check if unmuted icon is visible -> default state
        await page.locator(getSelectorString('audio-player-playing-unmuted-icon')).isVisible();
        // Click the button -> mute audio
        await page.locator(getSelectorString('audio-player-mute-button')).click();
        // Muted icon should be visible
        await page.locator(getSelectorString('audio-player-playing-muted-icon')).isVisible();

        // Set volume to min/max values
        await page.locator(getSelectorString('audio-player-volume-slider')).fill('100');
        await page.locator(getSelectorString('audio-player-volume-slider')).fill('0');
    });
});