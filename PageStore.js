const fs = require('fs');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const readdirAsync = promisify(fs.readdir);

const folder = `./.cached/`;

function createId(url) {
  const siteId = url.match(/[a-zA-Z]/gi).join("");
  return `${siteId}`;
}

function getFileName(id, timestamp) {
    return `${folder}${id}_${timestamp}.dat`;
}

function parseFileName(fileName) {
    const [id, dateString] = fileName.split('.')[0].split('_');
    return {
        id,
        date: parseInt(dateString, 10),
    }
}


const getLatestFileById = (files, fileName) => {
    const { id, date } = parseFileName(fileName);
    if (!files[id]) {
        files[id] = date;
    }
    const isCurrentGreater = files[id] < date;
    if (isCurrentGreater) {
        files[id] = date;
    }
    return files;
}


class PageStore {
    constructor() {
        this.store = {};
    }

    async init() {
        const fileNames = await readdirAsync(folder);
        const mostRecentFiles = fileNames.reduce(getLatestFileById, {})
        this.store = mostRecentFiles;
    }

    async add(url, content) {
        const id = createId(url);
        const timestamp =+(new Date()); 
        this.store[id] = timestamp;
        const fileName = getFileName(id, timestamp);
        await writeFileAsync(fileName, content);
    }

    async find(url) {
        const id = createId(url);
        const mostRecentTimestamp = this.store[id];
        if (mostRecentTimestamp) {
            const fileName = getFileName(id, mostRecentTimestamp);
            const buffer = await readFileAsync(fileName);
            return buffer.toString();
        }
        return null;
    }
}
const pageStore = new PageStore(); 
pageStore.init();
module.exports = pageStore
