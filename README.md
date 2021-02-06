# vestaboard-api

![Node.js CI](https://github.com/mark-thomas/vestaboard-api/workflows/Node.js%20CI/badge.svg?branch=main)

Basic Node API wrapper for the Vestaboard api

This is definitely hobby code at the moment, so no guarantees of anything, contributions welcome.

## Includes

Published Vestaboard API methods [docs](https://docs.vestaboard.com/methods)

- getViewer
- getSubscriptions
- postMessage (text and character array version)

Typescript Types for most of the things
Two little utility helpers that I put together:

- `clearBoardTo(char)` - fills a board with a single character in each bit
- `characterArrayFromString(string)` - converts a string into a postable character array (see below)

## Use

This is set up (but not yet actually done) to be a node module installable in the normal way,
but until that's done you will need to clone the repository and install it locally.  
`npm install ../vestaboard-api`

Included are esm and common js built versions

```js
import { Vesta } from 'vestaboard-api';
// OR
var Vesta = require('../vestaboard-api').Vesta;

const vesta = new Vesta({ apiKey: 'YourAPIKEY', apiSecret: 'YourAPISecret' });
// Get viewers
const viewers = await vesta.getViewer();

// Get your subscriptions, and convert to an array of Id
const subscriptions = await vesta.getSubscriptions();
const subscriptionIdArray = subscriptions.map((sub) => sub._id);
// Clear subscribed boards
const cleared = await Promise.all(
  subscriptionIdArray.map((subId) => vesta.clearBoardTo('orangeBlock', subId))
);

const vestaboardFormattedMessage = 'This will format automatically';
const manuallyFormattedMessage = vesta.characterArrayFromString(
  'redBlock orangeBlock I start in the upper left orangeBlock redBlock return new line start here'
);

// post a message to one subscription
const singlePostResponse = await vesta.postMessage(
  subscriptions[0]._id,
  vestaboardFormattedMessage
);

// Post a message to all my subscriptions
const messagePostResponse = await Promise.all(
  subscriptionIdArray.map((subId) =>
    vesta.postMessage(subId, manuallyFormattedMessage)
  )
);
```

### Array from string helper

I wanted to be able to convert strings into the character array so that I could place them more or less where I wanted, and was mainly dealing with lines and words. So here is a quick and dirty helper to take a string and split it into an array of 6, 22 element arrays of vestaboard [numeric character codes](https://docs.vestaboard.com/characters). A few "special characters" are represented as words (probably should have done an escape character but...)

```
  degreeSign: 62,
  redBlock: 63,
  orangeBlock: 64,
  yellowBlock: 65,
  greenBlock: 66,
  blueBlock: 67,
  violetBlock: 68,
  whiteBlock: 69,
  return: inserts 0 to the end of the line
```

Example:

```js
const string = 'redBlock orangeBlock WARNING orangeBlock redBlock return 12345';
const arrayVersion = vesta.characterArrayFromString(string);
console.log(arrayVersion);
// => Array(6) [
//              Array(22) [63, 64, 23, 1, 18, 14, 9, 14, 7, 64, 63, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//              Array(22) [27, 28, 29, 30, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//              Array(22) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//              Array(22) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//              Array(22) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
//              Array(22) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//             ]
```

### Build

Nothing special `npm run tsc` should build /src into the the commonjs and ES Modules in /lib

## TODO

- Build package and publish
