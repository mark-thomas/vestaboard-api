'use strict';

/**
 * Create an instance of Vesta
 * @param {Object} defaultConfig the default config for the instance
 * @return {Vesta} A new instance of Vesta
 */
import axios, { AxiosRequestConfig, Method, AxiosResponse } from 'axios';

import { characterCode, specialChar, emptyBoard, LINE_LENGTH } from './values';

function isSpecial(char: string): boolean {
  return specialChar.includes(char);
}

// function characterLength(string: string): number {
//   const splitArray = string.split(' ');
//   const length = splitArray.reduce((acc, word) => {
//     acc += isSpecial(word) ? 1 : word.length + 1;
//     return acc;
//   }, 0);
//   return length;
// }

function stringToArray(string: string): Array<number> {
  const splitArray = string.split(' ');
  let charCount = 0;
  const unsplitLines: Array<number> = splitArray
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

function makeBoard(string: string): Array<number> {
  const arrayVersion = stringToArray(string);
  return arrayVersion;
}
interface API_Config {
  api_key: string;
  api_secret: string;
}

interface API_Options {
  data?: string;
  method: Method;
}
interface IBoard_Array {
  [index: number]: Array<number>;
}
export default class Vesta {
  api_key: string;
  api_secret: string;
  readonly base_url: string;

  constructor(config: API_Config) {
    this.api_key = config.api_key;
    this.api_secret = config.api_secret;
    this.base_url = 'https://platform.vestaboard.com';
  }

  async request(endpoint = '', options: API_Options): Promise<any> {
    const url = this.base_url + endpoint;
    const headers = {
      'X-Vestaboard-Api-Key': this.api_key,
      'X-Vestaboard-Api-Secret': this.api_secret,
    };

    const text = options.data;
    const method = options.method;
    // console.log('posting: ', { url, headers, options, text, method });
    const config: AxiosRequestConfig = { url, method, headers, data: text };

    return axios(config).then((r: AxiosResponse<any>) => r.data);
  }

  getSubscriptions(): Promise<Record<string, unknown>> {
    const url = '/subscriptions';
    const options = { method: 'GET' as Method };
    return this.request(url, options);
  }

  postMessage(
    subscriptionId: string,
    message: string | Array<number[]>
  ): Promise<Record<string, unknown>> {
    const url = `/subscriptions/${subscriptionId}/message`;
    const data = Array.isArray(message)
      ? JSON.stringify({ characters: message })
      : JSON.stringify({ text: message });

    const options = { method: 'POST' as Method, data };
    return this.request(url, options);
  }

  getViewer(): Promise<Record<string, unknown>> {
    const url = '/viewer';
    const options = { method: 'GET' as Method };
    return this.request(url, options);
  }

  characterArrayFromString(string: string): IBoard_Array {
    const charBoard = makeBoard(string);
    const newBoard: IBoard_Array = emptyBoard.map((line, row) => {
      const newLine = line.map((character: string, col: number) => {
        const lineIndex = row * 22;
        const useChar = charBoard[col + lineIndex];
        return useChar || 0;
      });
      return newLine;
    });
    return newBoard;
  }

  clearBoardTo(
    char: string,
    subscriptionId: string
  ): Promise<Record<string, unknown>> {
    const clearBoard = emptyBoard.map((line: number[]) =>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      line.map((_bit) => characterCode[char])
    );
    return this.postMessage(subscriptionId, clearBoard);
  }
}
