const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

    console.log('Navigating to the Vercel URL...');
    await page.goto('https://techverse-store-2026.vercel.app/', { waitUntil: 'networkidle0' });
    
    console.log('Page loaded. Checking title:', await page.title());
    await browser.close();
  } catch (err) {
    console.error('Error running puppeteer:', err);
  }
})();
