/**
 * Create an instance of Vesta
 * @param {Object} defaultConfig the default config for the instance
 * @return {Vesta} A new instance of Vesta
 */
import { Method, AxiosResponse } from 'axios';
interface API_Config {
    api_key: string;
    api_secret: string;
}
interface API_Options {
    data?: string;
    method: Method;
}
export default class Vesta {
    api_key: string;
    api_secret: string;
    readonly base_url: string;
    constructor(config: API_Config);
    request(endpoint: string | undefined, options: API_Options): Promise<AxiosResponse<any>>;
    getSubscriptions(): Promise<AxiosResponse<any>>;
    postMessage(subscriptionId: string, message: string | Array<number[]>): Promise<AxiosResponse<any>>;
    characterArrayFromString(string: string): Array<number[]>;
    clearBoardTo(char: string, subscriptionId: string): Promise<AxiosResponse<any>>;
}
export {};
