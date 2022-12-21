const puppeteer = require("puppeteer");
const prompt = require('prompt-sync')({sigint: true})

const main = async () => {
    console.clear()
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./tmp",
        args:['--start-maximized' ],
    });
    const page = await browser.newPage();
    await page.goto('https://accounts.google.com/signin/v2/identifier', {
        waitUntil: "networkidle2"
    })

    await page.type("#identifierId", "test.namanvyas", {delay: 500})
    await page.click("#identifierNext")
    await page.waitForNavigation({
        waitUntil: "networkidle2"
    })

    await page.type("#password", prompt("Enter password."))
    await page.click("#passwordNext")
    await page.waitForNavigation({
        waitUntil: "networkidle2"
    })

    const cookies = await page.cookies()
    console.log(cookies)

    // browser.close()
}

main()