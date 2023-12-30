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
const values_1 = require("./values");
const axios_1 = __importDefault(require("axios"));
const sharedFunctions_1 = require("./sharedFunctions");
class VestaboardLocalAPI {
    constructor(config) {
        // include all the shared functions as part of the Vesta class
        this.isSpecial = sharedFunctions_1.isSpecial;
        this.containsEscapeCharacter = sharedFunctions_1.containsEscapeCharacter;
        this.containsNonDisplayCharacter = sharedFunctions_1.containsNonDisplayCharacter;
        this.convertToCharCodeArray = sharedFunctions_1.convertToCharCodeArray;
        this.makeBoard = sharedFunctions_1.makeBoard;
        this.characterArrayFromString = sharedFunctions_1.characterArrayFromString;
        this.isValidBoard = sharedFunctions_1.isValidBoard;
        this.convertBoardLayoutToString = sharedFunctions_1.convertBoardLayoutToString;
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
    initialize(config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (config.localApiKey) {
                    // Config provided local API key, use it
                    this.localAPIKey = config.localApiKey;
                }
                else if (config.localAPIEnablementToken) {
                    // No local API key provided, use enablement key to get one
                    const keyResponse = yield this.enableAndGetLocalKey(config.localAPIEnablementToken);
                    this.localAPIKey = keyResponse;
                }
            }
            catch (error) {
                console.error('Error enabling and getting local key:', error);
                throw new Error('Unable to enable local API');
            }
        });
    }
    isLocalKeyOrEnablementSet() {
        return (this.localAPIEnablementToken !== undefined ||
            this.localAPIKey !== undefined);
    }
    isConfiguredWithIPAndKey() {
        return (this.isLocalKeyOrEnablementSet() && this.localIPAddress !== undefined);
    }
    getLocalIP() {
        return this.localIPAddress || '';
    }
    request(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.baseUrl}/message`;
            const headers = {
                'X-Vestaboard-Local-API-Key': this.localAPIKey,
                'Content-Type': 'text/plain',
            };
            const text = options.data;
            const method = options.method;
            const config = { url, method, headers, data: text };
            return (0, axios_1.default)(config);
        });
    }
    enableAndGetLocalKey(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.baseUrl}/enablement`;
            const headers = {
                'X-Vestaboard-Local-API-Enablement-Token': token,
            };
            const method = 'POST';
            const config = { url, method, headers };
            const response = yield (0, axios_1.default)(config);
            if (response.status === 200) {
                const { apiKey } = response.data;
                return apiKey;
            }
            else {
                throw new Error('Unable to enable local API');
            }
        });
    }
    postMessage(postMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, sharedFunctions_1.isValidBoard)(postMessage)) {
                // console.log(`invalid board: ${postMessage}}`);
                throw new Error('Invalid postMessage: Not valid board');
            }
            const data = JSON.stringify(postMessage);
            const options = { method: 'POST', data };
            const response = yield this.request(options);
            if (response.status === 201) {
                return { ok: true };
            }
            else {
                return { ok: false };
            }
        });
    }
    readFromBoard() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const options = { method: 'GET' };
                const response = yield this.request(options);
                if (response.status !== 200) {
                    throw new Error('Failed to read from board');
                }
                const { message } = response.data;
                // console.log('message:', message);
                return message;
            }
            catch (error) {
                throw new Error('Failed to read from board');
            }
        });
    }
    clearBoardTo(char) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, sharedFunctions_1.containsNonDisplayCharacter)(char)) {
                throw new Error(`Input contains one or more invalid character: ${char}`);
            }
            const clearBoard = values_1.emptyBoard.map((line) => 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            line.map((_bit) => values_1.characterCode[char]));
            return yield this.postMessage(clearBoard);
        });
    }
}
exports.default = VestaboardLocalAPI;
