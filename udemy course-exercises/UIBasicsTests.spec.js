const { test, expect } = require('@playwright/test');


test ('Browser Context First Playwright test', async ({browser})=>
{
    //chrome - plugins/ cookies already there when open a browser
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto ("https://www.artisangenius.com/webflp");


});

test ('Page First Playwright test', async ({page})=>
{
    //chrome - plugins/ cookies already there when open a browser
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto ("https://www.artisangenius.com/webflp");


});
