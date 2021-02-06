/**
 * Create an instance of Vesta
 * @param {Object} defaultConfig the default config for the instance
 * @return {Vesta} A new instance of Vesta
 */
import { Method, AxiosResponse } from 'axios';
import { BoardCharArray } from './values';
interface APIConfig {
    apiKey: string;
    apiSecret: string;
}
interface APIOptions {
    data?: string;
    method: Method;
}
interface Installation {
    _id: string;
    installable: {
        _id: string;
    };
}
interface Board {
    _id: string;
}
interface Subscription {
    _id: string;
    _created: number;
    title?: string | null;
    icon?: unknown;
    installation: Installation;
    boards: Board[];
}
interface SubscriptionsResponse {
    subscriptions: Subscription[];
}
interface ViewerResponse {
    _id: string;
    _created: number;
    type: string;
    installation: {
        _id: string;
    };
}
interface PostResponse {
    message: {
        id: string;
        text?: string | null;
        created: number;
    };
}
export default class Vesta {
    apiKey: string;
    apiSecret: string;
    readonly baseUrl: string;
    constructor(config: APIConfig);
    request(endpoint: string | undefined, options: APIOptions): Promise<AxiosResponse>;
    getSubscriptions(): Promise<SubscriptionsResponse>;
    postMessage(subscriptionId: string, message: string | Array<number[]>): Promise<PostResponse>;
    getViewer(): Promise<ViewerResponse>;
    characterArrayFromString(string: string): BoardCharArray;
    clearBoardTo(char: string, subscriptionId: string): Promise<PostResponse>;
}
export {};
