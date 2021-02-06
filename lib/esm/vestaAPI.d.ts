/**
 * Create an instance of Vesta
 * @param {Object} defaultConfig the default config for the instance
 * @return {Vesta} A new instance of Vesta
 */
import { AxiosResponse } from 'axios';
import { BoardCharArray } from './values';
import { APIConfig, APIOptions, Subscription, ViewerResponse, MessageResponse } from './types';
export default class Vesta {
    apiKey: string;
    apiSecret: string;
    readonly baseUrl: string;
    constructor(config: APIConfig);
    request(endpoint: string | undefined, options: APIOptions): Promise<AxiosResponse>;
    getSubscriptions(): Promise<Subscription[]>;
    postMessage(subscriptionId: string, postMessage: string | BoardCharArray): Promise<MessageResponse>;
    getViewer(): Promise<ViewerResponse>;
    characterArrayFromString(string: string): BoardCharArray;
    clearBoardTo(char: string, subscriptionId: string): Promise<MessageResponse>;
}
