/* eslint-disable */
import { test, expect } from '@playwright/test';
import { getSelectorString } from './getSelectorString';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle('Radio-Stream');
    await page.locator(getSelectorString('navigation-link-signup')).click();
});

test('Registration - wrong password format', async ({ page }) => {
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

test('Registration - already used email', async ({ page }) => {
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

test('Registration - passwords don\'t match', async ({ page }) => {
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

test('Registration - successful registration', async ({ page }) => {
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

const getRandomEmail = () => {
    return `jakub.abrahoim.${Math.floor(Math.random() * 1000000)}@gmail.com`;
}
