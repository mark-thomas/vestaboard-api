'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create an instance of Vesta
 * @param {Object} defaultConfig the default config for the instance
 * @return {Vesta} A new instance of Vesta
 */
const axios_1 = __importDefault(require("axios"));
const values_1 = require("./values");
class Vesta {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.apiSecret = config.apiSecret;
        this.baseUrl = 'https://platform.vestaboard.com';
    }
    request(endpoint = '', options) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.baseUrl + endpoint;
            const headers = {
                'X-Vestaboard-Api-Key': this.apiKey,
                'X-Vestaboard-Api-Secret': this.apiSecret,
            };
            const text = options.data;
            const method = options.method;
            const config = { url, method, headers, data: text };
            return axios_1.default(config);
        });
    }
    getSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = '/subscriptions';
            const options = { method: 'GET' };
            const response = yield this.request(url, options);
            const { subscriptions } = response.data;
            return subscriptions;
        });
    }
    postMessage(subscriptionId, postMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/subscriptions/${subscriptionId}/message`;
            const data = Array.isArray(postMessage)
                ? JSON.stringify({ characters: postMessage })
                : JSON.stringify({ text: postMessage });
            const options = { method: 'POST', data };
            const response = yield this.request(url, options);
            const { message } = response.data;
            return message;
        });
    }
    getViewer() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = '/viewer';
            const options = { method: 'GET' };
            const response = yield this.request(url, options);
            // Viewer response is not nested like subscriptions or message
            return response.data;
        });
    }
    characterArrayFromString(string) {
        const charBoard = makeBoard(string);
        return charBoard;
    }
    clearBoardTo(char, subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const clearBoard = values_1.emptyBoard.map((line) => 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            line.map((_bit) => values_1.characterCode[char]));
            return yield this.postMessage(subscriptionId, clearBoard);
        });
    }
}
exports.default = Vesta;
function isSpecial(char) {
    return values_1.specialChar.includes(char);
}
function convertToCharCodeArray(string) {
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
                elements = [values_1.characterCode[word]];
                charCount += 1;
                break;
            case '':
                elements = [0];
                charCount += 1;
                break;
            case 'return':
                const charCount_mod_line = charCount % values_1.LINE_LENGTH;
                const remaining = values_1.LINE_LENGTH - charCount_mod_line;
                if (remaining < values_1.LINE_LENGTH) {
                    elements = new Array(remaining).fill(0);
                    charCount += remaining;
                }
                else {
                    elements = [];
                }
                break;
            default:
                elements = word.split('').map((c) => values_1.characterCode[c]);
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
function makeBoard(string) {
    const convertedVersion = convertToCharCodeArray(string);
    // Using the emptyBoard array as a structure, map through the converted
    // version to make a set of 6 lines with 22 numeric character codes each
    const newBoard = values_1.emptyBoard.map((line, row) => {
        const newLine = line.map((unusedZeroValue, col) => {
            const lineIndex = row * values_1.LINE_LENGTH;
            const useCharCode = convertedVersion[col + lineIndex];
            return useCharCode || 0;
        });
        return newLine;
    });
    return newBoard;
}
