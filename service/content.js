const puppeteer = require('puppeteer');

async function querySelectorOnPage(url, selector = 'body') {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const htmlElement = await page.$(selector);
  const content = await page.evaluate(element => element.innerHTML, htmlElement);

  await browser.close();
  return content;
}

async function getContents(url, selector) {
  const response = await querySelectorOnPage(url, selector);
  return response;
}

module.exports = { getContents };
