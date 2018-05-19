const program = require('commander');
const fs = require('fs');

const defaults = {
  interval: 1000 * 60 * 5,
  sourceEmail: 'noreply@balazsczap.com',
  port: 3000,
  cacheDir: './.cached/',
  selector: 'body',
};

program
  .version('0.1.0')
  .option('-i, --interval <interval>', 'Time between checking the page', defaults.interval)
  .option('-s, --source <source>', 'Source email address', defaults.sourceEmail)
  .option('-p, --port <port>', 'Port for express server when using in server mode', defaults.port)
  .option('-c, --cache-dir <cacheDir>', 'Directory path for caching websites', defaults.cacheDir)
  .option('-S, --selector <selector>', 'Target url when using in CLI mode', defaults.selector)
  .option('-P, --param-file <paramFile>', 'JSON file in which run parameters are specified')
  .option('-S, --subscriber <subscriber>', 'Subscriber email address when using CLI mode')
  .option('-u, --url <url>', 'Target url when using in CLI mode')
  .parse(process.argv);

function readParamFile(paramFile) {
  const fileContent = fs.readFileSync(paramFile);
  return JSON.parse(fileContent);
}

const { url, port, subscriber, selector } = (program.paramFile ?
  readParamFile(program.paramFile) : program);

module.exports = {
  interval: program.interval,
  source: program.source,
  cacheDir: program.cacheDir,
  url,
  port,
  subscriber,
  selector,
};
