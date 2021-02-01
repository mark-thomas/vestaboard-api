/**
 * Create an instance of Vesta
 * @param {Object} defaultConfig the default config for the instance
 * @return {Vesta} A new instance of Vesta
 */
import { Method } from 'axios';
interface API_Config {
    api_key: string;
    api_secret: string;
}
interface API_Options {
    data?: string;
    method: Method;
}
interface IBoard_Array {
    [index: number]: Array<number>;
}
export default class Vesta {
    api_key: string;
    api_secret: string;
    readonly base_url: string;
    constructor(config: API_Config);
    request(endpoint: string | undefined, options: API_Options): Promise<any>;
    getSubscriptions(): Promise<Record<string, unknown>>;
    postMessage(subscriptionId: string, message: string | Array<number[]>): Promise<Record<string, unknown>>;
    getViewer(): Promise<Record<string, unknown>>;
    characterArrayFromString(string: string): IBoard_Array;
    clearBoardTo(char: string, subscriptionId: string): Promise<Record<string, unknown>>;
}
export {};
