// ('use strict');

// /**
//  * Create an instance of Vesta
//  * @param {Object} defaultConfig the default config for the instance
//  * @return {Vesta} A new instance of Vesta
//  */
// import axios, { AxiosRequestConfig, Method, AxiosResponse } from 'axios';

// import {
//   characterCode,
//   specialChar,
//   emptyBoard,
//   LINE_LENGTH,
//   BoardCharArray,
//   Line,
// } from './values';

// import {
//   APIOptions,
//   Subscription,
//   ViewerResponse,
//   MessageResponse,
//   APIConfig,
//   VestaboardControlMode,
// } from './types';

// export default class Vesta {
//   apiKey: string | null;
//   apiSecret: string | null;
//   apiReadWriteKey: string | null;
//   localApiKey: string | null;

//   baseUrl: string;
//   vestaboardControlMode: VestaboardControlMode;

//   constructor(config: APIConfig) {
//     this.apiKey = config.apiKey ?? null;
//     this.apiSecret = config.apiSecret ?? null;
//     this.apiReadWriteKey = config.apiReadWriteKey ?? null;
//     this.localApiKey = config.localApiKey ?? null;
//     this.vestaboardControlMode = config.mode ?? 'standard';
//     // Set the base URL and headers based on the mode
//     switch (config.mode) {
//       case 'readWrite':
//         // Set headers for readWrite mode
//         if (!this.apiReadWriteKey) {
//           throw new Error('apiReadWriteKey is required for readWrite mode');
//         }
//         this.baseUrl = 'https://rw.vestaboard.com/';
//         break;
//       case 'local':
//         if (!this.localApiKey || !config.localIPAddress) {
//           throw new Error(
//             'localApiKey and localIPAddress are required for local mode'
//           );
//         }
//         this.baseUrl = `http://${config.localIPAddress}:7000/local-api/message`; // Set headers for local mode
//         break;
//       default: // 'standard' mode
//         if (!this.apiKey || !this.apiSecret) {
//           throw new Error(
//             'apiKey and apiSecret are required for standard mode'
//           );
//         }
//         this.baseUrl = 'https://platform.vestaboard.com';
//       // Set headers for standard mode
//     }
//   }

//   async request(endpoint = '', options: APIOptions): Promise<AxiosResponse> {
//     const url = this.baseUrl + endpoint;
//     const headers: Record<string, string> = {};

//     switch (this.vestaboardControlMode) {
//       case 'readWrite':
//         if (this.apiReadWriteKey) {
//           headers['X-Vestaboard-Read-Write-Key'] = this.apiReadWriteKey;
//         } else {
//           throw new Error('apiReadWriteKey is required for readWrite mode');
//         }
//         headers['Content-Type'] = 'application/json';
//         break;
//       case 'local':
//         if (this.localApiKey) {
//           headers['X-Vestaboard-Local-Api-Key'] = this.localApiKey;
//         } else {
//           throw new Error('localApiKey is required for local mode');
//         }
//         break;
//       default: // 'standard' mode
//         if (this.apiKey && this.apiSecret) {
//           headers['X-Vestaboard-Api-Key'] = this.apiKey;
//           headers['X-Vestaboard-Api-Secret'] = this.apiSecret;
//         } else {
//           throw new Error(
//             'apiKey and apiSecret are required for standard mode'
//           );
//         }
//         break;
//     }

//     const text = options.data;
//     const method = options.method;
//     const config: AxiosRequestConfig = { url, method, headers, data: text };

//     return axios(config);
//   }

//   // standard mode functions
//   async getSubscriptions(): Promise<Subscription[]> {
//     if (
//       this.vestaboardControlMode !== 'standard' ||
//       !this.apiKey ||
//       !this.apiSecret
//     ) {
//       throw new Error(
//         'getSubscriptions is only available in standard mode with non-null apiKey and apiSecret'
//       );
//     }
//     const url = '/subscriptions';
//     const options = { method: 'GET' as Method };
//     const response = await this.request(url, options);
//     const { subscriptions } = response.data;
//     return subscriptions as Subscription[];
//   }

//   async getViewer(): Promise<ViewerResponse> {
//     if (
//       this.vestaboardControlMode !== 'standard' ||
//       !this.apiKey ||
//       !this.apiSecret
//     ) {
//       throw new Error(
//         'getViewer is only available in standard mode with non-null apiKey and apiSecret'
//       );
//     }
//     const url = '/viewer';
//     const options = { method: 'GET' as Method };
//     const response = await this.request(url, options);
//     // Viewer response is not nested like subscriptions or message
//     return response.data as ViewerResponse;
//   }

//   async postMessage(
//     subscriptionId: string,
//     postMessage: string | BoardCharArray
//   ): Promise<MessageResponse> {
//     if (typeof postMessage === 'string') {
//       if (containsNonDisplayCharacter(postMessage)) {
//         throw new Error('Input contains one or more invalid characters.');
//       }
//     }
//     const url = `/subscriptions/${subscriptionId}/message`;
//     const data = Array.isArray(postMessage)
//       ? JSON.stringify({ characters: postMessage })
//       : JSON.stringify({ text: postMessage });

//     const options = { method: 'POST' as Method, data };
//     const response = await this.request(url, options);
//     const { message } = response.data;
//     return message as MessageResponse;
//   }

//   // General board functions
//   characterArrayFromString(string: string): BoardCharArray {
//     const charBoard = makeBoard(string);
//     return charBoard;
//   }

//   async clearBoardTo(
//     char: string,
//     subscriptionId: string
//   ): Promise<MessageResponse> {
//     if (containsNonDisplayCharacter(char)) {
//       throw new Error(`Input contains one or more invalid character: ${char}`);
//     }
//     const clearBoard = emptyBoard.map((line: Line) =>
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       line.map((_bit) => characterCode[char])
//     ) as BoardCharArray;
//     return await this.postMessage(subscriptionId, clearBoard);
//   }
// }

// function isSpecial(char: string): boolean {
//   return specialChar.includes(char);
// }
// // function isEscapeCharacter(char: string): boolean {
// //   return char === EscapeCharacter;
// // }
// // function startsWithEscapeCharacter(word: string): boolean {
// //   return word.startsWith(EscapeCharacter);
// // }
// function containsEscapeCharacter(input: string): boolean {
//   const test = /[*]/g;
//   return input.search(test) >= 0; // Index of first match
// }
// // function containsInvalidCharactersEsc(input: string): boolean {
// //   const test = /^(?:[A-Za-z0-9!@#$\(\)\-*+&=;:'\"%,./?°\s]+)$/g;
// //   return input.search(test) < 0; // -1 for no match
// // }
// function containsNonDisplayCharacter(input: string): boolean {
//   const test = /^(?:[A-Za-z0-9!@#$\(\)\-+&=;:'\"%,./?°\s]+)$/g;
//   return input.search(test) < 0; // -1 for no match
// }

// function convertToCharCodeArray(string: string): number[] {
//   // Does this string use an the escape character?
//   const usesEscape = containsEscapeCharacter(string);
//   // Does this string contain any invalid characters?
//   const containsInvalidCharacter = containsNonDisplayCharacter(string);
//   // If we remove the escape character, is the string now valid?
//   const cleanedString = string.replace(/[*]/g, '');

//   const validWithoutEscape = containsNonDisplayCharacter(cleanedString);
//   if (containsInvalidCharacter) {
//     // This string is invalid
//     throw new Error('Input contains one or more invalid characters.');
//   }
//   if (!validWithoutEscape) {
//     // This string is invalid, even without the escape character;
//     throw new Error(
//       'Input contains one or more invalid characters that are not the escape character.'
//     );
//   }
//   // Build our word list
//   const wordList = string.split(' ');
//   let charCount = 0;
//   // And for each word, see if it matches one of our special handling strings,
//   // or add the character code to the list
//   const mergedLines = wordList
//     .map((word, i) => {
//       let elements;
//       switch (word) {
//         case 'degreeSign':
//         case 'redBlock':
//         case 'orangeBlock':
//         case 'yellowBlock':
//         case 'greenBlock':
//         case 'blueBlock':
//         case 'violetBlock':
//         case 'whiteBlock':
//         case 'blackBlock':
//         case '*degreeSign':
//         case '*redBlock':
//         case '*orangeBlock':
//         case '*yellowBlock':
//         case '*greenBlock':
//         case '*blueBlock':
//         case '*violetBlock':
//         case '*whiteBlock':
//         case '*blackBlock':
//           elements = [characterCode[word]];
//           charCount += 1;
//           break;
//         case 'return':
//         case '*return':
//           const charCount_mod_line = charCount % LINE_LENGTH;
//           const remaining = LINE_LENGTH - charCount_mod_line;
//           if (remaining < LINE_LENGTH) {
//             elements = new Array(remaining).fill(0);
//             charCount += remaining;
//           } else {
//             elements = [];
//           }
//           break;
//         case '':
//           elements = [0];
//           charCount += 1;
//           break;
//         default:
//           // Since we theorteically could have the escape character in the
//           // middle of a word, or not used by one of the special characters, we
//           // need to be prepared to strip out the '*' if it is used in the default.
//           let cleanedWord = word;
//           if (usesEscape) {
//             cleanedWord = cleanedWord.replace(/[*]/g, '');
//           }
//           // This might mean that this word is now '' (empty string)
//           // ''.split('') will return [] which will be skipped.
//           elements = cleanedWord.split('').map((c) => characterCode[c]);
//           if (!isSpecial(wordList[i + 1])) {
//             elements.push(0);
//           }
//           charCount += elements.length;
//       }
//       return [...elements];
//     })
//     .flat();
//   return mergedLines;
// }

// function makeBoard(string: string): BoardCharArray {
//   const convertedVersion = convertToCharCodeArray(string);
//   // Using the emptyBoard array as a structure, map through the converted
//   // version to make a set of 6 lines with 22 numeric character codes each
//   const newBoard = emptyBoard.map((line, row) => {
//     const newLine = line.map((unusedZeroValue, col) => {
//       const lineIndex = row * LINE_LENGTH;
//       const useCharCode = convertedVersion[col + lineIndex];
//       return useCharCode || 0;
//     }) as Line;
//     return newLine;
//   }) as BoardCharArray;
//   return newBoard;
// }
