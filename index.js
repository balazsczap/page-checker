const fs = require('fs');
const puppeteer = require('puppeteer');
const { diffWords } = require('diff');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

async function visitPage(url, callback) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    await callback(page);
    await browser.close();
}

async function getContents(page) {
    const content = await page.evaluate(() => document.body.outerHTML);
    return content;
}

async function storeContent(pageContent, url) {
    const currentTimestamp = +(new Date());
    const siteId = url.match(/[a-zA-Z]/gi).join('');
    const fileName = `${siteId}_${currentTimestamp}.dat`;
    await writeFileAsync(`./cached/${fileName}`, pageContent);
}

async function compareWithStored(page, url) {
    const contents = await getContents(page);
    console.log(contents);
}



(async () => {
    // visitPage('http://www.cs.bme.hu/rendszeropt/', getContents);
    visitPage('http://balazsczap-test.s3-website.eu-central-1.amazonaws.com/', compareWithStored);
})();