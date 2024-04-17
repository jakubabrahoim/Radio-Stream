/* eslint-disable */
import { test, expect, Page } from '@playwright/test';
import { getSelectorString } from './getSelectorString';

test.describe('Registration', () => {
    let page: Page;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();

        await page.goto('https://radio-sh.web.app/');
        await expect(page).toHaveTitle('Radio-Stream');
        await page.locator(getSelectorString('navigation-link-signup')).click();
    });

    test('TC01 - Registration - wrong password format', async () => {
        const email = getRandomEmail();
        const password = '123456';

        await page.locator(getSelectorString('signup-email-input')).click();
        await page.locator(getSelectorString('signup-email-input')).fill(email);

        await page.locator(getSelectorString('signup-password-input')).click();
        await page.locator(getSelectorString('signup-password-input')).fill(password);

        await page.locator(getSelectorString('signup-confirm-password-input')).click();
        await page.locator(getSelectorString('signup-confirm-password-input')).fill(password);

        await page.locator(getSelectorString('signup-submit-button')).click();

        (await page.locator(getSelectorString('signup-required-password-format-message')).innerHTML()).startsWith('* Password must have:');
    });

    test('TC02 - Registration - already used email', async () => {
        const email = 'jakub.abrahoim@gmail.com';
        const password = 'VeryGoodPassword123@';

        await page.locator(getSelectorString('signup-email-input')).click();
        await page.locator(getSelectorString('signup-email-input')).fill(email);

        await page.locator(getSelectorString('signup-password-input')).click();
        await page.locator(getSelectorString('signup-password-input')).fill(password);

        await page.locator(getSelectorString('signup-confirm-password-input')).click();
        await page.locator(getSelectorString('signup-confirm-password-input')).fill(password);

        await page.locator(getSelectorString('signup-submit-button')).click();

        (await page.locator(getSelectorString('signup-email-already-exists-message')).innerHTML()).startsWith('* Account with this email address already exists');
    });

    test('TC03 - Registration - passwords don\'t match', async () => {
        const email = 'jakub.abrahoim@gmail.com';
        const password = 'VeryGoodPassword123@';

        await page.locator(getSelectorString('signup-email-input')).click();
        await page.locator(getSelectorString('signup-email-input')).fill(email);

        await page.locator(getSelectorString('signup-password-input')).click();
        await page.locator(getSelectorString('signup-password-input')).fill(password);

        await page.locator(getSelectorString('signup-confirm-password-input')).click();
        await page.locator(getSelectorString('signup-confirm-password-input')).fill(password + 'diff');

        await page.locator(getSelectorString('signup-submit-button')).click();

        (await page.locator(getSelectorString('signup-passwords-must-match-message')).innerHTML()).startsWith('* Passwords must match');
    });

    test('TC04 - Registration - successful registration', async () => {
        const email = getRandomEmail();
        const password = 'VeryGoodPassword123@';

        await page.locator(getSelectorString('signup-email-input')).click();
        await page.locator(getSelectorString('signup-email-input')).fill(email);

        await page.locator(getSelectorString('signup-password-input')).click();
        await page.locator(getSelectorString('signup-password-input')).fill(password);

        await page.locator(getSelectorString('signup-confirm-password-input')).click();
        await page.locator(getSelectorString('signup-confirm-password-input')).fill(password);

        await page.locator(getSelectorString('signup-submit-button')).click();

        (await page.locator(getSelectorString('signup-success-message')).innerHTML()).startsWith('* Account created. Please check your email to verify your account');
    });
});

const getRandomEmail = () => {
    return `jakub.abrahoim.${Math.floor(Math.random() * 1000000)}@gmail.com`;
}
