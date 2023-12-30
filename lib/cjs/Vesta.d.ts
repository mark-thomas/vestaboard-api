import { AxiosResponse } from 'axios';
import { APIOptions, Subscription, ViewerResponse, MessageResponse, SubscriptionAPIConfig, BoardCharArray } from './types';
export default class Vesta {
    private apiKey;
    private apiSecret;
    readonly baseUrl: string;
    constructor(config: SubscriptionAPIConfig);
    request(endpoint: string | undefined, options: APIOptions): Promise<AxiosResponse>;
    getSubscriptions(): Promise<Subscription[]>;
    postMessage(subscriptionId: string, postMessage: string | BoardCharArray): Promise<MessageResponse>;
    getViewer(): Promise<ViewerResponse>;
    characterArrayFromString(string: string): BoardCharArray;
    clearBoardTo(char: string, subscriptionId: string): Promise<MessageResponse>;
}
