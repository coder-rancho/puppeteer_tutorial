const puppeteer = require("puppeteer");
const fs = require('fs');
const path = require('path');

const csvPath = path.resolve(__dirname, 'products.csv')
let productCount = 0;

const getProductDetails = async (producthandler) => {
    let title = null;
    let price = null;
    let imgUrl = null;

    try {
        title = await producthandler.evaluate(el => el.querySelector('h2 > a > span').textContent)
    } catch (error) {}

    try {
        price = await producthandler.evaluate(el => el.querySelector(".a-price > .a-offscreen").textContent)
    } catch (error) {}

    try {
        imgUrl = await producthandler.evaluate(el => el.querySelector(".s-image").getAttribute('src'))
    } catch (error) {
        
    }

    return {title, price, imgUrl}
}

const getProducts = async (page) => {
    let products = []
    const productHandles = await page.$$(".s-card-container.s-overflow-hidden.aok-relative.puis-expand-height.puis-include-content-margin.puis.s-latency-cf-section.s-card-border")

    for (const producthandler of productHandles) {
        products.push(await getProductDetails(producthandler))
    }

    return products
}

const addToCsv = (products) => {
    for (let product of products)
    fs.appendFileSync(csvPath, `${++productCount},${(product.title).replace(/,/g, '.')},${product.price},${product.imgUrl}\n`)
}

const main = async () => {
    console.clear()
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./tmp",
        args:['--start-maximized' ],
    });
    const page = await browser.newPage();
    await page.goto(`https://www.amazon.com/s?i=computers-intl-ship&bbn=16225007011&rh=n%3A16225007011%2Cp_72%3A1248879011%2Cp_89%3AApple%7CSAMSUNG%7CSanDisk%2Cp_36%3A20000-25000&dc&fs=true&qid=1670955296&rnid=2528832011&ref=sr_nr_p_89_3&ds=v1%3A1yM%2BEv09Lg%2FvZHRw6fAQ0PMo0GcbBSM1aSWdOYFYe38`);
    // await page.goto(`https://www.amazon.com/s?i=computers-intl-ship&bbn=16225007011&rh=n%3A16225007011%2Cp_72%3A1248879011%2Cp_89%3AApple%7CSAMSUNG%7CSanDisk%2Cp_36%3A20000-25000&dc&fs=true&page=4&qid=1670957395&rnid=2528832011&ref=sr_pg_4`);


    while (true) {
        let products = await getProducts(page)
        addToCsv(products)
        await page.click('a.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator')
        await page.waitForSelector('.s-pagination-strip')
        if (await page.$('span.s-pagination-item.s-pagination-next.s-pagination-disabled') !== null) break;
    }

    browser.close()
}

main()