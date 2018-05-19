process.env.DEBUG = 'page-checker:*';

const { subscriber, url, selector } = require('../config');
const { subscribeToUrl } = require('../service');
const info = require('debug')('page-checker:info');

subscribeToUrl(subscriber, url, selector);
info(`Subscribed ${subscriber} to ${url}`);

