const express = require('express');
const info = require('debug')('page-checker:info');

const router = express.Router();

const { subscribeToUrl, unsubscribeFromUrl } = require('../service');

router.post('/subscribe', async (req, res) => {
  const { email, url, selector } = req.body;
  subscribeToUrl(email, url, selector);
  info(`Subcribed ${email} to ${url}`);
  res.send('Subscribed!');
});

router.post('/unsubscribe', async (req, res) => {
  const { email, url } = req.body;
  unsubscribeFromUrl(email, url);
  info(`Unsubcribed ${email} from ${url}`);
  res.send('Unsubscribed!');
});

module.exports = router;
