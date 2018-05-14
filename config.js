const program = require('commander');

const defaults = {
  interval: 1000 * 60 * 5,
  sourceEmail: 'noreply@balazsczap.com',
  port: 3000,
  cacheDir: './.cached/',
};

program
  .version('0.1.0')
  .option('-i, --interval <interval>', 'Time between checking the page', defaults.interval)
  .option('-s, --source <source>', 'Source email address', defaults.sourceEmail)
  .option('-p, --port <port>', 'Port for express server when using in server mode', defaults.port)
  .option('-c, --cache-dir <cacheDir>', 'Directory path for caching websites', defaults.cacheDir)
  .option('-t, --target <target>', 'Target email address when using CLI mode')
  .option('-u, --url <url>', 'Target url when using in CLI mode')
  .parse(process.argv);


module.exports = {
  interval: program.interval,
  source: program.source,
  cacheDir: program.cacheDir,
  target: program.target,
  url: program.url,
  port: program.port,
};
