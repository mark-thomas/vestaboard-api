import { BoardCharArray, Line, characterCode, emptyBoard } from './values';

import axios, { AxiosRequestConfig, Method, AxiosResponse } from 'axios';

import {
  APIOptions,
  LocalAPIConfig,
  LocalPostResponse,
  LocalReadResponse,
} from './types';

import {
  isSpecial,
  containsEscapeCharacter,
  containsNonDisplayCharacter,
  convertToCharCodeArray,
  makeBoard,
  characterArrayFromString,
  isValidBoard,
} from './sharedFunctions';

class VestaboardLocalAPI {
  private localAPIEnablementToken?: string;
  private baseUrl: string;
  private localAPIKey?: string;
  private localIPAddress?: string;

  constructor(config: LocalAPIConfig) {
    // Private constructor to enforce singleton pattern
    if (!config.localApiKey && !config.localAPIEnablementToken) {
      throw new Error('Local API or enablement key is required');
    }
    if (!config.localIPAddress) {
      throw new Error('API local ip address is required');
    }
    this.localIPAddress = config.localIPAddress;
    this.baseUrl = `http://${config.localIPAddress}:7000/local-api`;

    this.initialize(config).catch((error) => {
      console.error('Error initializing VestaboardLocalAPI:', error);
    });
  }

  private async initialize(config: LocalAPIConfig): Promise<void> {
    try {
      if (config.localApiKey) {
        // Config provided local API key, use it
        this.localAPIKey = config.localApiKey;
      } else if (config.localAPIEnablementToken) {
        // No local API key provided, use enablement key to get one
        const keyResponse = await this.enableAndGetLocalKey(
          config.localAPIEnablementToken
        );
        this.localAPIKey = keyResponse;
      }
    } catch (error) {
      console.error('Error enabling and getting local key:', error);
      throw new Error('Unable to enable local API');
    }
  }

  isLocalKeyOrEnablementSet(): boolean {
    return (
      this.localAPIEnablementToken !== undefined ||
      this.localAPIKey !== undefined
    );
  }
  isConfiguredWithIPAndKey(): boolean {
    return (
      this.isLocalKeyOrEnablementSet() && this.localIPAddress !== undefined
    );
  }
  getLocalIP(): string {
    return this.localIPAddress || '';
  }

  async request(options: APIOptions): Promise<AxiosResponse> {
    const url = `${this.baseUrl}/message`;
    const headers = {
      'X-Vestaboard-Local-API-Key': this.localAPIKey,
      'Content-Type': 'text/plain',
    };

    const text = options.data;
    const method = options.method;
    const config: AxiosRequestConfig = { url, method, headers, data: text };

    return axios(config);
  }

  async enableAndGetLocalKey(token: string): Promise<string> {
    const url = `${this.baseUrl}/enablement`;
    const headers = {
      'X-Vestaboard-Local-API-Enablement-Token': token,
    };
    const method = 'POST' as Method;
    const config: AxiosRequestConfig = { url, method, headers };
    const response = await axios(config);
    if (response.status === 200) {
      const { apiKey } = response.data;
      return apiKey;
    } else {
      throw new Error('Unable to enable local API');
    }
  }

  async postMessage(postMessage: BoardCharArray): Promise<LocalPostResponse> {
    if (!isValidBoard(postMessage)) {
      // console.log(`invalid board: ${postMessage}}`);
      throw new Error('Invalid postMessage: Not valid board');
    }
    const data = JSON.stringify(postMessage);
    const options = { method: 'POST' as Method, data };
    const response = await this.request(options);
    if (response.status === 201) {
      return { ok: true };
    } else {
      return { ok: false };
    }
  }

  async readFromBoard(): Promise<BoardCharArray> {
    try {
      const options = { method: 'GET' as Method };
      const response = await this.request(options);

      if (response.status !== 200) {
        throw new Error('Failed to read from board');
      }

      const { message } = response.data as LocalReadResponse;

      // console.log('message:', message);
      return message;
    } catch (error) {
      throw new Error('Failed to read from board');
    }
  }

  async clearBoardTo(char: string): Promise<LocalPostResponse> {
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
  isValidBoard = isValidBoard;
}

export default VestaboardLocalAPI;
