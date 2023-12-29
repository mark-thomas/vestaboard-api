/**
 * Create an instance of Vesta
 * @param {Object} defaultConfig the default config for the instance
 * @return {Vesta} A new instance of Vesta
 */
import { AxiosResponse } from 'axios';
import { BoardCharArray } from './values';
import { isSpecial, containsEscapeCharacter, containsNonDisplayCharacter, convertToCharCodeArray, makeBoard, characterArrayFromString } from './sharedFunctions';
import { APIOptions, Subscription, MessageResponse, SubscriptionAPIConfig } from './types';
export default class Vesta {
    apiKey: string;
    private apiSecret;
    readonly baseUrl: string;
    constructor(config: SubscriptionAPIConfig);
    request(endpoint: string | undefined, options: APIOptions): Promise<AxiosResponse>;
    getSubscriptions(): Promise<Subscription[]>;
    postMessage(subscriptionId: string, postMessage: string | BoardCharArray): Promise<MessageResponse>;
    clearBoardTo(char: string, subscriptionId: string): Promise<MessageResponse>;
    isSpecial: typeof isSpecial;
    containsEscapeCharacter: typeof containsEscapeCharacter;
    containsNonDisplayCharacter: typeof containsNonDisplayCharacter;
    convertToCharCodeArray: typeof convertToCharCodeArray;
    makeBoard: typeof makeBoard;
    characterArrayFromString: typeof characterArrayFromString;
}
