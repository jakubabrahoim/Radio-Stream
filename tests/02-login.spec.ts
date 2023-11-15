/* eslint-disable */
import { test, expect, Page } from '@playwright/test';
import { getSelectorString } from './getSelectorString';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle('Radio-Stream');
    await page.locator(getSelectorString('navigation-link-login')).click();
});

test('Login - incorrect password', async ({ page }) => {
    const email = 'jakub.abrahoim.3@gmail.com';
    const password = 'KPAISTest123' + 'diff';

    await page.locator(getSelectorString('login-email-input')).click();
    await page.locator(getSelectorString('login-email-input')).fill(email);

    await page.locator(getSelectorString('login-password-input')).click();
    await page.locator(getSelectorString('login-password-input')).fill(password);

    await page.locator(getSelectorString('login-submit-button')).click();

    (await page.locator(getSelectorString('incorrect-username-or-password-message')).innerHTML()).startsWith('* Incorrect username or password');
});

test('Login - incorrect email', async ({ page }) => {
    const email = 'jakub.abrahoim.3diff@gmail.com';
    const password = 'KPAISTest123';

    await page.locator(getSelectorString('login-email-input')).click();
    await page.locator(getSelectorString('login-email-input')).fill(email);

    await page.locator(getSelectorString('login-password-input')).click();
    await page.locator(getSelectorString('login-password-input')).fill(password);

    await page.locator(getSelectorString('login-submit-button')).click();

    (await page.locator(getSelectorString('incorrect-username-or-password-message')).innerHTML()).startsWith('* Incorrect username or password');
});

test('Login - success', async ({ page }) => {
    await successfulLogin(page);
});

test('Logout', async ({ page }) => {
    await successfulLogin(page);

    await page.locator(getSelectorString('navigation-user-avatar')).hover();

    await page.locator(getSelectorString('navigation-logout-button')).click();
});

const successfulLogin = async (page: Page) => {
    const email = 'jakub.abrahoim.3@gmail.com';
    const password = 'KPAISTest123';

    await page.locator(getSelectorString('login-email-input')).click();
    await page.locator(getSelectorString('login-email-input')).fill(email);

    await page.locator(getSelectorString('login-password-input')).click();
    await page.locator(getSelectorString('login-password-input')).fill(password);

    await page.locator(getSelectorString('login-submit-button')).click();

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL('http://localhost:3000/home');
}