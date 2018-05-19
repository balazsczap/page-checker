process.env.DEBUG = 'page-checker:*';

const { target, url, selector } = require('../config');
const { subscribeToUrl } = require('../service');
const info = require('debug')('page-checker:info');

subscribeToUrl(target, url, selector);
info(`Subscribed ${target} to ${url}`);

