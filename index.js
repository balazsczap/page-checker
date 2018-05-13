// const puppeteer = require('puppeteer');
const { diffWords } = require('diff');
const { promisify } = require('util');
const PageStore = require('./PageStore');
const express = require('express');
const bodyParser = require('body-parser');
const info = require('debug')('page-checker:info');
const fetch = require('node-fetch');

const AWS = require('aws-sdk')
const nodemailer = require('nodemailer');

const credentials = new AWS.SharedIniFileCredentials({profile: 'balazsczap'});
AWS.config.credentials = credentials;
AWS.config.update({ region: 'eu-west-1' });
const SES = new AWS.SES();

const transporter = nodemailer.createTransport({ SES });
transporter.sendMail = promisify(transporter.sendMail);

// async function visitPage(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(url, { waitUntil: 'networkidle2' });
//     return { browser, page };
// }

async function getContents(url) {
    // const content = await page.evaluate(() => document.body.outerHTML);
    // return content;
    const response = await fetch(url);
    return response.text();

}


function compareWithStored(content, storedContent) {
    const diff = diffWords(content, storedContent);
    const changed = diff.reduce((acc, val) => !!val.added || !!val.removed || acc, false);
    console.log(diff);
    console.log(changed);
    if (!changed) {
        return null;
    }
    const changeDiff = diff.filter(({ added, removed }) => added || removed);
    console.log(changeDiff);
    return changeDiff;
}

async function notifyChange(diff, email) {
    console.log("CHANGE");
    console.log(diff);
    console.log("TO");
    console.log(email);
    console.log("CHANGE");
    await transporter.sendMail({
        from: 'noreply@balazsczap.com',
        to: email,
        subject: 'Page changed!',
        html: `<html><body>${JSON.stringify(diff)}</body></html>`,
    })
}
// (async () => { 
//     try {
//         await notifyChange({ asdfasdf: 'w234234' }, 'balazsczap@gmail.com');
//     } catch (err) {
//         console.log(err);
//     }
// })();


async function compareAndStore(email, url) {
    // const {browser, page} = await visitPage(url);
    const content = await getContents(url);
    const storedContent = await PageStore.find(url);
    if (!storedContent) {
        await PageStore.add(url, content);
    } else {
        const diff = compareWithStored(content, storedContent);
        if (diff !== null) {
            await PageStore.add(url, content);
            await notifyChange(diff, email);        
        }
    }
    // await browser.close();
}



async function checkTask(email, url) {
    try {
        await compareAndStore(email, url);
    } catch (err) {
        console.log(err);
    }
}


// {email: {interval, url}}
const subscriptions = [];

function subscribeToUrl(email, url) {
    const task = () => checkTask(email, url);
    // const task = () => console.log(email, url);
    task();
    const intervalHandle = setInterval(task, 60000);
    subscriptions.push({
        email,
        url,
        intervalHandle,
    });

}

function unsubscribeFromUrl(email, url) {
    const subscription = subscriptions.find((s) => s.email === email && s.url === url);
    if (subscription) {
        clearInterval(subscription.intervalHandle);
    }
}

const app = express();

app.use(bodyParser.json());

app.post('/subscribe', async (req, res) => {
    const { email, url } = req.body;
    console.log(email, url);
    subscribeToUrl(email, url);
    info(`Subribed ${email} to ${url}`);
    res.send('subscribed!');
});

app.post('/unsubscribe', async (req, res) => {
    const { email, url } = req.body;
    console.log(email, url);
    unsubscribeFromUrl(email, url);
    info(`Unsubribed ${email} from ${url}`);
    res.send('unsubscribed!');
});


app.listen(3000, () => console.log('App listening on port 3000!'));