('use strict');

import axios, {
  AxiosRequestConfig,
  Method,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { BoardCharArray, Line, characterCode, emptyBoard } from './values';

import {
  APIOptions,
  RWAPIConfig,
  RWBoardParsed,
  RWBoardReadResponse,
  RWMesageResponse,
} from './types';

import {
  isSpecial,
  containsEscapeCharacter,
  containsNonDisplayCharacter,
  convertToCharCodeArray,
  makeBoard,
  characterArrayFromString,
} from './sharedFunctions';

class VestaboardRWAPI {
  private readWriteKey: string;
  baseUrl: string;

  constructor(config: RWAPIConfig) {
    // Private constructor to enforce singleton pattern
    if (!config.apiReadWriteKey) {
      throw new Error('API read-write key is required');
    }
    this.readWriteKey = config.apiReadWriteKey;
    this.baseUrl = 'https://rw.vestaboard.com';
  }
  // Expose a function to check if readWriteKey is empty or undefined
  isReadWriteKeySet(): boolean {
    return !!this.readWriteKey && this.readWriteKey.trim() !== '';
  }
  async request(options: APIOptions): Promise<AxiosResponse> {
    const url = this.baseUrl;
    const headers = {
      'X-Vestaboard-Read-Write-Key': this.readWriteKey,
      'Content-Type': 'application/json',
    };

    const text = options.data;
    const method = options.method;
    const config: AxiosRequestConfig = { url, method, headers, data: text };

    return axios(config);
  }

  async postMessage(
    postMessage: string | BoardCharArray
  ): Promise<RWMesageResponse> {
    if (typeof postMessage === 'string') {
      if (containsNonDisplayCharacter(postMessage)) {
        throw new Error('Input contains one or more invalid characters.');
      }
    }
    const data = Array.isArray(postMessage)
      ? JSON.stringify(postMessage)
      : JSON.stringify({ text: postMessage });

    const options = { method: 'POST' as Method, data };
    try {
      const response = await this.request(options);
      return response.data as RWMesageResponse;
    } catch (error) {
      if ((error as AxiosError).response) {
        const response = (error as AxiosError).response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (response?.data as any)?.message;
        console.log(
          `Error in post message: ${
            (error as AxiosError).response?.status
          }: ${errorMessage}`
        );
        throw new Error(
          `Error ${(error as AxiosError).response?.status}: ${errorMessage}`
        );
      } else {
        throw new Error(`Unknown error`);
      }
    }
  }

  async readFromBoard(): Promise<RWBoardParsed> {
    const options = { method: 'GET' as Method };
    const response = await this.request(options);
    const data = response.data as RWBoardReadResponse;
    try {
      const parsedLayout: BoardCharArray = JSON.parse(
        data.currentMessage.layout
      );
      return {
        currentMessage: {
          layout: parsedLayout,
          id: data.currentMessage.id,
        },
      };
    } catch (error: unknown) {
      throw new Error(`Error parsing response: ${error}`);
    }
  }

  async clearBoardTo(char: string): Promise<RWMesageResponse> {
    if (containsNonDisplayCharacter(char)) {
      throw new Error(`Input contains one or more invalid character: ${char}`);
    }
    const clearBoard = emptyBoard.map((line: Line) =>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      line.map((_bit) => characterCode[char])
    ) as BoardCharArray;
    return await this.postMessage(clearBoard);
  }

  // include all the shared functions as part of the Vesta class
  isSpecial = isSpecial;
  containsEscapeCharacter = containsEscapeCharacter;
  containsNonDisplayCharacter = containsNonDisplayCharacter;
  convertToCharCodeArray = convertToCharCodeArray;
  makeBoard = makeBoard;
  characterArrayFromString = characterArrayFromString;
}

export default VestaboardRWAPI;
