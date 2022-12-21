const puppeteer = require("puppeteer");

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

const main = async () => {
    console.clear()
    const browser = await puppeteer.launch({
        // headless: false,
        defaultViewport: false,
        userDataDir: "./tmp",
        args:['--start-maximized' ],
    });
    const page = await browser.newPage();
    await page.goto(`https://www.amazon.com/s?rh=n%3A16225007011&fs=true&ref=1p_16225007011_sar`);

    const products = await getProducts(page)

    for ({title, price, imgUrl} of products) console.log(`
    \n
    Title: ${title}

    Price: ${price}

    imgUrl: ${imgUrl}
    `)

    browser.close()
}

main()