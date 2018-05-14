process.env.DEBUG = 'page-checker:*';

const { target, url } = require('../config');
const { subscribeToUrl } = require('../service');
const info = require('debug')('page-checker:info');

subscribeToUrl(target, url);
info(`Subscribed ${target} to ${url}`);

