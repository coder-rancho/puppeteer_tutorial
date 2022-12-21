const puppeteer = require("puppeteer");

const main = async () => {
    console.clear()
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.close();
    await browser.close();
}

main()