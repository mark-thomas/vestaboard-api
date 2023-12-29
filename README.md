# vestaboard-api

![Node.js CI](https://github.com/mark-thomas/vestaboard-api/workflows/Node.js%20CI/badge.svg?branch=main)

Basic Node API wrapper for the Vestaboard api

This is definitely hobby code at the moment, so no guarantees of anything,
contributions welcome.

# Major Version Change -> 2.0

This version has breaking changes largely driven by enhancements to the
Vestaboard API offerings since 1.0 was created.

When 1.0 was built the Vestaboard only had a single available interface through
a now deprecated set of APIs. Now there are three ways to communicate with a
vestaboard:

- The `Subscription API` is the closest in concept to the original API, it's
  designed for writing to one or more boards based on a `subscriptionID`. It's
  probably what you want if you are making an installable or other extension
  that writes to multiple boards.
- The `Read-write API` is similarly cloud based, and has similar functionality
  to the subscriptionAPI, but only communicates with a single board. You need to
  enable access via the Vestaboard web app, and then get the read write key. You
  can now _read_ the current message from the board, in exchange you lose the
  ability to access multiple boards.
- The `Local API` is similar to the read-write API, with a couple of exceptions.
  It must be enabled via Vestaboard and they will provide you with a token, then
  you call the enablement API with the provided token to get a local key. That
  local key allows you to _read_ and _write_ directly to the local board, which
  doesn't use the vestaboard services.

## Feature set

Maps closely to the published Vestaboard API methods as described in the
[docs](https://docs.vestaboard.com/docs/read-write-api/introduction)

Given the three distinct models, and their idiosyncrasies, I built the three
interfaces on their own.

Each one requires different configuration settings (see types.ts). You can also
use the tiny helper creation function like:

```
const subscriptionConfig: SubscriptionAPIConfig = {
  mode: VestaboardControlMode.Subscription,
  apiKey: process.env.SUBSCRIPTION_API_KEY as string,
  apiSecret: process.env.SUBSCRIPTION_API_SECRET as string,
};
let vesta = createVestaboard(subscriptionConfig) as VestaSubscription;
```

or just go directly

```
import { VestaRW } from 'vestaboard-api'
const vesta = new VestaRW({ apiReadWriteKey: 'Your_RW_API_KEY' });

```

Everything now throws errors of various levels of descriptiveness. Mostly the
post requests, so use appropriately.

New utility function isValidBoard is also exposed, it just checks that the
character array is valid. Local board api calls _only_ accepts character arrays,
not the auto-layout text versions. There is a new(ish) package from Vestaboard
that can help build these if you like:
[VBML](https://docs.vestaboard.com/docs/vbml/)

## Migration

The migration from v1 api to -> subscription api is minor.
You could go from something like:

```
const { Vesta } = require('vestaboard-api');
const vesta = new Vesta({ apiKey, apiSecret });

```

to something like:

```
const Vestaboard = require('vestaboard-api');

const vesta = Vestaboard.createVestaboard(
  Vestaboard.VestaboardControlMode.Subscription,
  { apiKey, apiSecret }
);
```

The only other change I needed was to note that the subscription response on the
v1 API had a property of `_id` vs. the new structure of `id` so that needed to
change. Otherwise I didn't see anything that would really mess you up.

The R/W api and the local api are all new so no migration.

Oh, and I changed the character codes to match the latest Vestaboard system with
support for `filled` etc. for white/black colorways.

Also killed the unescaped `return` character, and added a replacement for `\n`
that has the same behavior as `*return`.

### A note on rate limiting

I believe the boards ignore subsequent messages within 15 seconds, and the APIs
definitely kick a 503 at about 15 seconds for rate limiting. It's a hardware
device after all.

# Previous 1.0 version

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

```js
npm i -save vestaboard-api
```

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

I wanted to be able to convert strings into the character array so that I could
place them more or less where I wanted, and was mainly dealing with lines and
words. So here is a quick and dirty helper to take a string and split it into an
array of 6, 22 element arrays of vestaboard [numeric character
codes](https://docs.vestaboard.com/characters). A few "special characters" are
represented as words.

As part of adding an escape character as the main path forward, but without
breaking previous stuff, I've added (thanks @chrisdrackett) `*` as an escape
character for the various special characters. In this build previously existing
ones work, but those will be removed in a future release.

```js
  degreeSign: 62,
  redBlock: 63,
  orangeBlock: 64,
  yellowBlock: 65,
  greenBlock: 66,
  blueBlock: 67,
  violetBlock: 68,
  whiteBlock: 69,
  return: inserts 0 to the end of the line
  *degreeSign: 62,
  *redBlock: 63,
  *orangeBlock: 64,
  *yellowBlock: 65,
  *greenBlock: 66,
  *blueBlock: 67,
  *violetBlock: 68,
  *whiteBlock: 60,
  *blackBlock: 0,
  *return: inserts 0 to the end of the line
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

- Tests!
