# Page Checker

This is a tool for getting notified when a certain webpage changes.

It can be either used as a webserver, allowing people to subscribe to changes, or as a CLI tool, listening for one webpage and notifying one email address.

# CLI

To run from console, use `node ./cli`

To see avaiable options, use `node ./cli -h`

# Server

To run as Express server use `npm start`
This will use a default check interval of 5 minutes, and will start on port 3000.
Update the values in `config.js` as needed.
