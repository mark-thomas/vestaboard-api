('use strict');

/**
 * Create an instance of Vesta
 * @param {Object} defaultConfig the default config for the instance
 * @return {Vesta} A new instance of Vesta
 */
import axios, {
  AxiosRequestConfig,
  Method,
  AxiosResponse,
  AxiosError,
} from 'axios';

import { BoardCharArray, emptyBoard, Line, characterCode } from './values';

import {
  isSpecial,
  containsEscapeCharacter,
  containsNonDisplayCharacter,
  convertToCharCodeArray,
  makeBoard,
  characterArrayFromString,
  isValidBoard,
} from './sharedFunctions';

import {
  APIOptions,
  Subscription,
  MessageResponse,
  SubscriptionAPIConfig,
} from './types';

export default class Vesta {
  apiKey: string;
  private apiSecret: string;
  readonly baseUrl: string;

  constructor(config: SubscriptionAPIConfig) {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.baseUrl = 'https://subscriptions.vestaboard.com';
  }

  async request(endpoint = '', options: APIOptions): Promise<AxiosResponse> {
    const url = this.baseUrl + endpoint;
    const headers = {
      'X-Vestaboard-Api-Key': this.apiKey,
      'X-Vestaboard-Api-Secret': this.apiSecret,
      'Content-Type': 'application/json',
    };

    const text = options.data;
    const method = options.method;
    const config: AxiosRequestConfig = { url, method, headers, data: text };

    return axios(config);
  }

  async getSubscriptions(): Promise<Subscription[]> {
    const url = '/subscriptions';
    const options = { method: 'GET' as Method };
    const response = await this.request(url, options);
    const subscriptions = response.data;
    return subscriptions as Subscription[];
  }

  async postMessage(
    subscriptionId: string,
    postMessage: string | BoardCharArray
  ): Promise<MessageResponse> {
    if (typeof postMessage === 'string') {
      if (containsNonDisplayCharacter(postMessage)) {
        throw new Error('Input contains one or more invalid characters.');
      }
    }
    const url = `/subscriptions/${subscriptionId}/message`;
    const data = Array.isArray(postMessage)
      ? { characters: postMessage }
      : { text: postMessage };

    const options = { method: 'POST' as Method, data: JSON.stringify(data) };
    try {
      const response = await this.request(url, options);
      const message = response.data;
      return message as MessageResponse;
    } catch (error) {
      if ((error as AxiosError).response) {
        const response = (error as AxiosError).response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = (response?.data as any)?.message;
        console.log(
          `Error in post message: ${
            (error as AxiosError).response?.status
          }: ${message}`
        );
        throw new Error(
          `Error ${(error as AxiosError).response?.status}: ${message}`
        );
      } else {
        throw new Error(`Unknown error`);
      }
    }
  }
  async clearBoardTo(
    char: string,
    subscriptionId: string
  ): Promise<MessageResponse> {
    if (containsNonDisplayCharacter(char) && !isSpecial(char)) {
      throw new Error(`Input contains one or more invalid character: ${char}`);
    }
    const clearBoard = emptyBoard.map((line: Line) =>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      line.map((_bit) => characterCode[char])
    ) as BoardCharArray;

    return await this.postMessage(subscriptionId, clearBoard);
  }

  // async getViewer(): Promise<ViewerResponse> {
  //   const url = '/viewer';
  //   const options = { method: 'GET' as Method };
  //   const response = await this.request(url, options);
  //   // Viewer response is not nested like subscriptions or message
  //   return response.data as ViewerResponse;
  // }
  // include all the shared functions as part of the Vesta class
  isSpecial = isSpecial;
  containsEscapeCharacter = containsEscapeCharacter;
  containsNonDisplayCharacter = containsNonDisplayCharacter;
  convertToCharCodeArray = convertToCharCodeArray;
  makeBoard = makeBoard;
  characterArrayFromString = characterArrayFromString;
  isValidBoard = isValidBoard;
}
