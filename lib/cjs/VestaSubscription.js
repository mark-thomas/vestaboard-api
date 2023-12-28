"use strict";
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
('use strict');
/**
 * Create an instance of Vesta
 * @param {Object} defaultConfig the default config for the instance
 * @return {Vesta} A new instance of Vesta
 */
const axios_1 = __importDefault(require("axios"));
const values_1 = require("./values");
const sharedFunctions_1 = require("./sharedFunctions");
class Vesta {
    constructor(config) {
        // async getViewer(): Promise<ViewerResponse> {
        //   const url = '/viewer';
        //   const options = { method: 'GET' as Method };
        //   const response = await this.request(url, options);
        //   // Viewer response is not nested like subscriptions or message
        //   return response.data as ViewerResponse;
        // }
        // include all the shared functions as part of the Vesta class
        this.isSpecial = sharedFunctions_1.isSpecial;
        this.containsEscapeCharacter = sharedFunctions_1.containsEscapeCharacter;
        this.containsNonDisplayCharacter = sharedFunctions_1.containsNonDisplayCharacter;
        this.convertToCharCodeArray = sharedFunctions_1.convertToCharCodeArray;
        this.makeBoard = sharedFunctions_1.makeBoard;
        this.characterArrayFromString = sharedFunctions_1.characterArrayFromString;
        this.apiKey = config.apiKey;
        this.apiSecret = config.apiSecret;
        this.baseUrl = 'https://subscriptions.vestaboard.com';
    }
    request(endpoint = '', options) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.baseUrl + endpoint;
            const headers = {
                'X-Vestaboard-Api-Key': this.apiKey,
                'X-Vestaboard-Api-Secret': this.apiSecret,
                'Content-Type': 'application/json',
            };
            const text = options.data;
            const method = options.method;
            const config = { url, method, headers, data: text };
            return (0, axios_1.default)(config);
        });
    }
    getSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = '/subscriptions';
            const options = { method: 'GET' };
            const response = yield this.request(url, options);
            const subscriptions = response.data;
            return subscriptions;
        });
    }
    postMessage(subscriptionId, postMessage) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof postMessage === 'string') {
                if ((0, sharedFunctions_1.containsNonDisplayCharacter)(postMessage)) {
                    throw new Error('Input contains one or more invalid characters.');
                }
            }
            const url = `/subscriptions/${subscriptionId}/message`;
            const data = Array.isArray(postMessage)
                ? { characters: postMessage }
                : { text: postMessage };
            const options = { method: 'POST', data: JSON.stringify(data) };
            try {
                const response = yield this.request(url, options);
                const message = response.data;
                return message;
            }
            catch (error) {
                if (error.response) {
                    const response = error.response;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const message = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.message;
                    console.log(`Error in post message: ${(_b = error.response) === null || _b === void 0 ? void 0 : _b.status}: ${message}`);
                    throw new Error(`Error ${(_c = error.response) === null || _c === void 0 ? void 0 : _c.status}: ${message}`);
                }
                else {
                    throw new Error(`Unknown error`);
                }
            }
        });
    }
    clearBoardTo(char, subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, sharedFunctions_1.containsNonDisplayCharacter)(char) && !(0, sharedFunctions_1.isSpecial)(char)) {
                throw new Error(`Input contains one or more invalid character: ${char}`);
            }
            const clearBoard = values_1.emptyBoard.map((line) => 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            line.map((_bit) => values_1.characterCode[char]));
            return yield this.postMessage(subscriptionId, clearBoard);
        });
    }
}
exports.default = Vesta;
