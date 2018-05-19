const { diffWords } = require('diff');
const PageStore = require('./PageStore');
const info = require('debug')('page-checker:info');
const error = require('debug')('page-checker:error');
const { notifyChange } = require('./email');
const { interval } = require('../config');
const { getContents } = require('./content');

function compareWithStored(content, storedContent) {
  const diff = diffWords(content, storedContent);
  const changed = diff.reduce((acc, val) => !!val.added || !!val.removed || acc, false);
  if (!changed) {
    return null;
  }
  const changeDiff = diff.filter(({ added, removed }) => added || removed);
  return changeDiff;
}

async function compareAndStore(email, url, selector) {
  const content = await getContents(url, selector);
  const storedContent = await PageStore.find(url);
  if (!storedContent) {
    await PageStore.add(url, content);
  } else {
    const diff = compareWithStored(content, storedContent);
    if (diff !== null) {
      info(`${url} page changed, notifying ${email}`);
      await PageStore.add(url, content);
      await notifyChange(diff, email);
    }
  }
}

async function pageCheck(email, url, selector) {
  try {
    await compareAndStore(email, url, selector);
  } catch (err) {
    error(err);
  }
}

let subscriptions = [];

function subscribeToUrl(email, url, selector) {
  const task = () => pageCheck(email, url, selector);
  task();
  const intervalHandle = setInterval(task, interval);
  subscriptions.push({
    email,
    url,
    intervalHandle,
  });
}

function unsubscribeFromUrl(email, url) {
  const subscription = subscriptions.find(s => s.email === email && s.url === url);
  if (subscription) {
    clearInterval(subscription.intervalHandle);
    subscriptions = subscriptions.filter(s => s !== subscription);
  }
}

module.exports = { subscribeToUrl, unsubscribeFromUrl };
