const { chromium, expect } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const titleKey = 'Building announcements';
const emptyKey = 'There are no pending payments.';
const faqKey = 'Who can use the platform?';
const languages = ['gr', 'en', 'fr', 'cn', 'de', 'es', 'he'];
const dictionaries = Object.fromEntries(
  languages.map((lang) => [lang, JSON.parse(fs.readFileSync('src/assets/i18n/' + lang + '.json', 'utf8'))])
);
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const lang of languages) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
      const user = { id: 1, role: 'User', buildingMember: true, currentBuildingId: 7, firstName: 'Test', lastName: 'User' };
      await context.addInitScript(
        ({ lang, user }) => {
          localStorage.setItem('oikio.language', lang);
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', 'test-token');
          localStorage.setItem('buildingId', '7');
        },
        { lang, user }
      );
      await context.route('**/api/**', (route) => {
        const path = new URL(route.request().url()).pathname;
        let body = [];
        if (path.endsWith('/auth/me')) body = user;
        if (path.endsWith('/pricing')) body = { plans: [], currency: 'EUR', annualDiscountBasisPoints: 0 };
        if (path.endsWith('/dashboard/user') || path.endsWith('/statement-mini-chart')) body = null;
        if (path.includes('/calendar/building/'))
          body = [
            {
              id: 1,
              buildingId: 7,
              title: 'Ανακοίνωση χρήστη',
              description: 'Περιεχόμενο που δεν μεταφράζεται',
              startDate: '2026-11-26T10:00:00',
              pinned: true,
              active: true
            }
          ];
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
      });
      const page = await context.newPage(),
        errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => {
        if (m.type() === 'error' && /TypeError|Cannot read|NG0/.test(m.text())) errors.push(m.text());
      });
      await page.goto((process.env.I18N_BASE_URL || 'http://127.0.0.1:4303') + '/dashboard/default');
      await expect(page.locator('app-building-announcements-card h5')).toHaveText(dictionaries[lang][titleKey].trim(), { timeout: 30000 });
      await expect(page.locator('.actions-card')).toContainText(dictionaries[lang][emptyKey].trim());
      await expect(page.locator('.announcement-content h6')).toHaveText('Ανακοίνωση χρήστη');
      await expect(page.locator('.announcement-text')).toHaveText('Περιεχόμενο που δεν μεταφράζεται');
      assert.equal(await page.locator('html').getAttribute('dir'), lang === 'he' ? 'rtl' : 'ltr');
      assert.equal(await page.locator('html').getAttribute('lang'), lang === 'gr' ? 'el' : lang === 'cn' ? 'zh-CN' : lang);
      assert.ok(!/UI\.t[0-9a-f]/.test(await page.locator('app-default').innerText()), 'Raw translation key visible');
      if (['gr', 'de', 'he'].includes(lang)) await page.screenshot({ path: 'tmp/i18n-dashboard-' + lang + '.png', fullPage: true });
      await page.reload();
      await expect(page.locator('app-building-announcements-card h5')).toHaveText(dictionaries[lang][titleKey].trim());
      await page.goto((process.env.I18N_BASE_URL || 'http://127.0.0.1:4303') + '/faq');
      await expect(page.getByText(dictionaries[lang][faqKey].trim(), { exact: true })).toBeVisible();
      await page.goto((process.env.I18N_BASE_URL || 'http://127.0.0.1:4303') + '/calendar');
      await expect(page.locator('app-calendar .cal-month-view')).toBeVisible();
      const weekdays = await page.locator('app-calendar .cal-header').innerText();
      if (lang !== 'gr') assert.ok(!/[Α-Ωα-ω]/.test(weekdays), lang + ': Greek weekday labels remain');
      assert.deepEqual(errors, [], lang + ': runtime errors');
      console.log('PASS ' + lang + ': dashboard, dynamic FAQ, reload persistence, direction, user content unchanged');
      await context.close();
    }
    // Exercise the actual selector, including direction changes after selection.
    const context = await browser.newContext();
    await context.addInitScript(() => {
      if (!localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', JSON.stringify({ id: 1, role: 'User', buildingMember: true }));
        localStorage.setItem('token', 'test-token');
      }
    });
    await context.route('**/api/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: route.request().url().includes('/auth/me') ? '{"id":1,"role":"User","buildingMember":true}' : '[]'
      })
    );
    const page = await context.newPage();
    await page.goto((process.env.I18N_BASE_URL || 'http://127.0.0.1:4303') + '/dashboard/default');
    for (const [lang, native] of [
      ['de', 'Deutsch'],
      ['he', 'עברית'],
      ['es', 'Español']
    ]) {
      await page.locator('app-nav-right a[aria-label]').first().click();
      const menu = page.locator('app-nav-right .dropdown-menu.show').first();
      await expect(menu.locator('button.dropdown-item')).toHaveCount(7);
      await menu.getByRole('button', { name: new RegExp('^' + native) }).click();
      await expect(page.locator('app-building-announcements-card h5')).toHaveText(dictionaries[lang][titleKey].trim(), { timeout: 30000 });
      assert.equal(await page.evaluate(() => localStorage.getItem('oikio.language')), lang);
      assert.equal(await page.locator('html').getAttribute('dir'), lang === 'he' ? 'rtl' : 'ltr');
      console.log('PASS selector -> ' + lang);
    }
    await context.close();
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
