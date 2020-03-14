const puppeteer = require('puppeteer');
const log = console.log;

module.exports = {
  getCampaigns: async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let campaigns;

    log('Opening login page...');

    await page.goto(process.env.CAMPAIGN_LOGIN_PAGE, {
      waitUntil: 'networkidle2'
    }).catch(() => {
      browser.close();
    });

    log('Filling login form...');

    //email
    await page.waitForSelector("[name='email']");
    await page.type("[name='email']", process.env.EMAIL);

    //password
    await page.keyboard.down("Tab");
    await page.keyboard.type(process.env.PASSWORD);

    await page.keyboard.down("Tab");
    await page.keyboard.down("Enter");

    log('Waiting for dashboard...');

    await page.waitForSelector("#sidebar-dashboard", {
      timeout: 60000
    }).catch(() => {
      browser.close();
    });

    await page.on('response', async (response) => {
      if (response.url() === process.env.CAMPAIGN_LIST_PAGE) {
        console.log('XHR response received');
        campaigns = await response.json();
      }
    });

    await page.goto(process.env.CAMPAIGN_LIST_PAGE, {
      waitUntil: 'networkidle2'
    }).catch(() => {
      browser.close();
    });

    browser.close();

    return campaigns;
  }
};
