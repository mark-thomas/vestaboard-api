'use strict';

/**
 * Create an instance of Vesta
 * @param {Object} defaultConfig the default config for the instance
 * @return {Vesta} A new instance of Vesta
 */
import axios, { AxiosRequestConfig, Method, AxiosResponse } from 'axios';

import {
  characterCode,
  specialChar,
  emptyBoard,
  LINE_LENGTH,
  BoardCharArray,
  Line,
} from './values';
interface APIConfig {
  apiKey: string;
  apiSecret: string;
}

interface APIOptions {
  data?: string;
  method: Method;
}
interface Installation {
  _id: string;
  installable: {
    _id: string;
  };
}
interface Board {
  _id: string;
}
interface Subscription {
  _id: string;
  _created: number;
  title?: string | null;
  icon?: unknown;
  installation: Installation;
  boards: Board[];
}
interface SubscriptionsResponse {
  subscriptions: Subscription[];
}
interface ViewerResponse {
  _id: string;
  _created: number;
  type: string;
  installation: {
    _id: string;
  };
}

interface PostResponse {
  message: {
    id: string;
    text?: string | null;
    created: number;
  };
}
export default class Vesta {
  apiKey: string;
  apiSecret: string;
  readonly baseUrl: string;

  constructor(config: APIConfig) {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.baseUrl = 'https://platform.vestaboard.com';
  }

  async request(endpoint = '', options: APIOptions): Promise<AxiosResponse> {
    const url = this.baseUrl + endpoint;
    const headers = {
      'X-Vestaboard-Api-Key': this.apiKey,
      'X-Vestaboard-Api-Secret': this.apiSecret,
    };

    const text = options.data;
    const method = options.method;
    // console.log('posting: ', { url, headers, options, text, method });
    const config: AxiosRequestConfig = { url, method, headers, data: text };

    return axios(config);
  }

  async getSubscriptions(): Promise<SubscriptionsResponse> {
    const url = '/subscriptions';
    const options = { method: 'GET' as Method };
    const response = await this.request(url, options);
    const subscriptions = response.data;
    return subscriptions as SubscriptionsResponse;
  }

  async postMessage(
    subscriptionId: string,
    message: string | Array<number[]>
  ): Promise<PostResponse> {
    const url = `/subscriptions/${subscriptionId}/message`;
    const data = Array.isArray(message)
      ? JSON.stringify({ characters: message })
      : JSON.stringify({ text: message });

    const options = { method: 'POST' as Method, data };
    const response = await this.request(url, options);
    return response.data as PostResponse;
  }

  async getViewer(): Promise<ViewerResponse> {
    const url = '/viewer';
    const options = { method: 'GET' as Method };
    const response = await this.request(url, options);
    return response.data as ViewerResponse;
  }

  characterArrayFromString(string: string): BoardCharArray {
    const charBoard = makeBoard(string);
    return charBoard;
  }

  async clearBoardTo(
    char: string,
    subscriptionId: string
  ): Promise<PostResponse> {
    const clearBoard = emptyBoard.map((line: number[]) =>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      line.map((_bit) => characterCode[char])
    );
    return await this.postMessage(subscriptionId, clearBoard);
  }
}

function isSpecial(char: string): boolean {
  return specialChar.includes(char);
}

function convertToCharCodeArray(string: string): number[] {
  const wordList = string.split(' ');
  let charCount = 0;
  const mergedLines = wordList
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
          if (!isSpecial(wordList[i + 1])) {
            elements.push(0);
          }
          charCount += elements.length;
      }
      return [...elements];
    })
    .flat();
  return mergedLines;
}

function makeBoard(string: string): BoardCharArray {
  const convertedVersion = convertToCharCodeArray(string);
  // Using the emptyBoard array as a structure, map through the converted
  // version to make a set of 6 lines with 22 numeric character codes each
  const newBoard = emptyBoard.map((line, row) => {
    const newLine = line.map((unusedZeroValue, col) => {
      const lineIndex = row * LINE_LENGTH;
      const useCharCode = convertedVersion[col + lineIndex];
      return useCharCode || 0;
    }) as Line;
    return newLine;
  }) as BoardCharArray;
  return newBoard;
}
