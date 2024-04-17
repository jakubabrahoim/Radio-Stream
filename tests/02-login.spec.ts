/* eslint-disable */
import { test, expect, Page } from '@playwright/test';
import { getSelectorString } from './getSelectorString';


test.describe('Login and logout', () => {
    let page: Page;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();

        await page.goto('https://radio-sh.web.app/');
        await expect(page).toHaveTitle('Radio-Stream');
        await page.locator(getSelectorString('navigation-link-login')).click();
    });

    test('TC05 - Login - incorrect password', async () => {
        const email = 'jakub.abrahoim.3@gmail.com';
        const password = 'KPAISTest123' + 'diff';

        await page.locator(getSelectorString('login-email-input')).click();
        await page.locator(getSelectorString('login-email-input')).fill(email);

        await page.locator(getSelectorString('login-password-input')).click();
        await page.locator(getSelectorString('login-password-input')).fill(password);

        await page.locator(getSelectorString('login-submit-button')).click();

        (await page.locator(getSelectorString('incorrect-username-or-password-message')).innerHTML()).startsWith('* Incorrect username or password');
    });

    test('TC06 - Login - incorrect email', async () => {
        const email = 'jakub.abrahoim.3diff@gmail.com';
        const password = 'KPAISTest123';

        await page.locator(getSelectorString('login-email-input')).click();
        await page.locator(getSelectorString('login-email-input')).fill(email);

        await page.locator(getSelectorString('login-password-input')).click();
        await page.locator(getSelectorString('login-password-input')).fill(password);

        await page.locator(getSelectorString('login-submit-button')).click();

        (await page.locator(getSelectorString('incorrect-username-or-password-message')).innerHTML()).startsWith('* Incorrect username or password');
    });

    test('TC07 - Login - success', async () => {
        await successfulLogin(page);
    });

    test('TC08 - Logout', async () => {
        await successfulLogin(page);

        // Logout
        await page.locator(getSelectorString('navigation-user-avatar')).hover();
        await page.locator(getSelectorString('navigation-logout-button')).click();
    });
});

export const successfulLogin = async (page: Page) => {
    const email = 'jakub.abrahoim.3@gmail.com';
    const password = 'Test123@';

    await page.locator(getSelectorString('login-email-input')).click();
    await page.locator(getSelectorString('login-email-input')).fill(email);

    await page.locator(getSelectorString('login-password-input')).click();
    await page.locator(getSelectorString('login-password-input')).fill(password);

    await page.locator(getSelectorString('login-submit-button')).click();

    await expect(page).toHaveURL('https://radio-sh.web.app/home');
}


