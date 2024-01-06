var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
('use strict');
import axios from 'axios';
import { characterCode, emptyBoard } from './values';
import { isSpecial, containsEscapeCharacter, containsNonDisplayCharacter, convertToCharCodeArray, makeBoard, characterArrayFromString, isValidBoard, convertBoardLayoutToString, } from './sharedFunctions';
class VestaboardRWAPI {
    constructor(config) {
        // include all the shared functions as part of the Vesta class
        this.isSpecial = isSpecial;
        this.containsEscapeCharacter = containsEscapeCharacter;
        this.containsNonDisplayCharacter = containsNonDisplayCharacter;
        this.convertToCharCodeArray = convertToCharCodeArray;
        this.makeBoard = makeBoard;
        this.characterArrayFromString = characterArrayFromString;
        this.isValidBoard = isValidBoard;
        this.convertBoardLayoutToString = convertBoardLayoutToString;
        // Private constructor to enforce singleton pattern
        if (!config.apiReadWriteKey) {
            throw new Error('API read-write key is required');
        }
        this.readWriteKey = config.apiReadWriteKey;
        this.baseUrl = 'https://rw.vestaboard.com';
    }
    // Expose a function to check if readWriteKey is empty or undefined
    isReadWriteKeySet() {
        return !!this.readWriteKey && this.readWriteKey.trim() !== '';
    }
    request(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.baseUrl;
            const headers = {
                'X-Vestaboard-Read-Write-Key': this.readWriteKey,
                'Content-Type': 'application/json',
            };
            const text = options.data;
            const method = options.method;
            const config = { url, method, headers, data: text };
            return axios(config);
        });
    }
    postMessage(postMessage) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof postMessage === 'string') {
                if (containsNonDisplayCharacter(postMessage)) {
                    throw new Error('Input contains one or more invalid characters.');
                }
            }
            const data = Array.isArray(postMessage)
                ? JSON.stringify(postMessage)
                : JSON.stringify({ text: postMessage });
            const options = { method: 'POST', data };
            try {
                const response = yield this.request(options);
                return response.data;
            }
            catch (error) {
                if (error.response) {
                    const response = error.response;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const errorMessage = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.message;
                    if ((response === null || response === void 0 ? void 0 : response.status) === 304 &&
                        (response === null || response === void 0 ? void 0 : response.statusText) === 'Not Modified') {
                        console.log(`Error in post message: Board not modified: ${(_b = error.response) === null || _b === void 0 ? void 0 : _b.statusText}`);
                        throw new Error(`Error ${(_c = error.response) === null || _c === void 0 ? void 0 : _c.statusText}`);
                    }
                    else {
                        console.log(`Error in post message: ${(_d = error.response) === null || _d === void 0 ? void 0 : _d.status}: ${errorMessage}`);
                        throw new Error(`Error ${(_e = error.response) === null || _e === void 0 ? void 0 : _e.status}: ${errorMessage}`);
                    }
                }
                else {
                    throw new Error(`Unknown error`);
                }
            }
        });
    }
    readFromBoard() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = { method: 'GET' };
            const response = yield this.request(options);
            const data = response.data;
            try {
                const parsedLayout = JSON.parse(data.currentMessage.layout);
                return {
                    currentMessage: {
                        layout: parsedLayout,
                        id: data.currentMessage.id,
                    },
                };
            }
            catch (error) {
                throw new Error(`Error parsing response: ${error}`);
            }
        });
    }
    clearBoardTo(char) {
        return __awaiter(this, void 0, void 0, function* () {
            if (containsNonDisplayCharacter(char)) {
                throw new Error(`Input contains one or more invalid character: ${char}`);
            }
            const clearBoard = emptyBoard.map((line) => 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            line.map((_bit) => characterCode[char]));
            return yield this.postMessage(clearBoard);
        });
    }
}
export default VestaboardRWAPI;
