'use strict';

/**
 * Create an instance of Vesta
 * @param {Object} defaultConfig the default config for the instance
 * @return {Vesta} A new instance of Vesta
 */
const axios = require('axios');
const characterCode = {
  ' ': 0,
  A: 1,
  a: 1,
  b: 2,
  B: 2,
  C: 3,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8,
  i: 9,
  j: 10,
  k: 11,
  l: 12,
  m: 13,
  n: 14,
  o: 15,
  p: 16,
  q: 17,
  r: 18,
  s: 19,
  t: 20,
  u: 21,
  v: 22,
  w: 23,
  x: 24,
  y: 25,
  z: 26,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  I: 9,
  J: 10,
  K: 11,
  L: 12,
  M: 13,
  N: 14,
  O: 15,
  P: 16,
  Q: 17,
  R: 18,
  S: 19,
  T: 20,
  U: 21,
  V: 22,
  W: 23,
  X: 24,
  Y: 25,
  Z: 26,
  1: 27,
  2: 28,
  3: 29,
  4: 30,
  5: 31,
  6: 32,
  7: 33,
  8: 34,
  9: 35,
  0: 36,
  '!': 37,
  '@': 38,
  '#': 39,
  $: 40,
  '(': 41,
  ')': 42,
  '-': 44,
  '+': 46,
  '&': 47,
  '=': 48,
  ';': 49,
  ':': 50,
  "'": 52,
  '"': 53,
  '%': 54,
  ',': 55,
  '.': 56,
  '/': 59,
  '?': 60,
  degreeSign: 62,
  '°': 62,
  redBlock: 63,
  orangeBlock: 64,
  yellowBlock: 65,
  greenBlock: 66,
  blueBlock: 67,
  violetBlock: 68,
  whiteBlock: 69,
  blackBlock: 0,
};
const LINE_LENGTH = 22;
const emptyLine = new Array(LINE_LENGTH).fill(0);
const emptyBoard = new Array(6).fill(emptyLine);

const specialChar = [
  'degreeSign',
  'redBlock',
  'orangeBlock',
  'yellowBlock',
  'greenBlock',
  'blueBlock',
  'violetBlock',
  'whiteBlock',
  'blackBlock',
  'return',
  '',
];
function isSpecial(char) {
  return specialChar.includes(char);
}
function characterLength(string) {
  const splitArray = string.split(' ');
  const length = splitArray.reduce((acc, word) => {
    acc += isSpecial(word) ? 1 : word.length + 1;
    return acc;
  }, 0);
  return length;
}
function stringToArray(string) {
  const splitArray = string.split(' ');
  let charCount = 0;
  const unsplitLines = splitArray
    .map((word, i) => {
      let elements;
      switch (word) {
        case 'degreeSign':
        case 'redBlock':
        case 'orangeBlock':
        case 'yellowBlock':
        case 'greenBlock':
        case 'blueBlock':
        case 'violetBlock':
        case 'whiteBlock':
        case 'blackBlock':
          elements = [characterCode[word]];
          charCount += 1;
          break;
        case '':
          elements = [0];
          charCount += 1;
          break;
        case 'return':
          const charCount_mod_line = charCount % LINE_LENGTH;
          const remaining = LINE_LENGTH - charCount_mod_line;
          if (remaining < LINE_LENGTH) {
            elements = new Array(remaining).fill(0);
            charCount += remaining;
          } else {
            elements = [];
          }

          break;
        default:
          elements = word.split('').map((c) => characterCode[c]);
          if (!isSpecial(splitArray[i + 1])) {
            elements.push(0);
          }
          charCount += elements.length;
      }
      return [...elements];
    })
    .flat();
  // console.log(unsplitLines);
  return unsplitLines;
}

function makeBoard(string) {
  const arrayVersion = stringToArray(string);
  return arrayVersion;
}

module.exports = class Vesta {
  constructor(config) {
    this.api_key = config.api_key;
    this.api_secret = config.api_secret;
    this.base_url = 'https://platform.vestaboard.com';
  }

  async request(endpoint = '', options = {}) {
    let url = this.base_url + endpoint;
    let headers = {
      'X-Vestaboard-Api-Key': this.api_key,
      'X-Vestaboard-Api-Secret': this.api_secret,
    };

    let text = options.data;
    let method = options.method;
    console.log('posting: ', { url, headers, options, text, method });
    return axios(url, {
      method,
      headers,
      data: text,
    });
  }

  getSubscriptions() {
    const url = '/subscriptions';
    const options = { method: 'GET' };
    return this.request(url, options);
  }

  postMessage(subscriptionId, message) {
    const url = `/subscriptions/${subscriptionId}/message`;
    const data = Array.isArray(message)
      ? JSON.stringify({ characters: message })
      : JSON.stringify({ text: message });

    const options = { method: 'POST', data };
    return this.request(url, options);
  }

  characterArrayFromString(string) {
    const charBoard = makeBoard(string);
    const newBoard = emptyBoard.map((line, row) => {
      const newLine = line.map((character, col) => {
        const lineIndex = row * 22;
        const useChar = charBoard[col + lineIndex];
        return useChar || 0;
      });
      return newLine;
    });
    return newBoard;
  }

  clearBoardTo(char, subscriptionId) {
    const clearBoard = emptyBoard.map((line) =>
      line.map((bit) => characterCode[char])
    );
    return this.postMessage(subscriptionId, clearBoard);
  }
};
