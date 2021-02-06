import { Method } from 'axios';
export interface APIConfig {
    apiKey: string;
    apiSecret: string;
}
export interface APIOptions {
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
export interface Subscription {
    _id: string;
    _created: number;
    title?: string | null;
    icon?: unknown;
    installation: Installation;
    boards: Board[];
}
export interface ViewerResponse {
    _id: string;
    _created: number;
    type: string;
    installation: {
        _id: string;
    };
}
export interface MessageResponse {
    id: string;
    text?: string | null;
    created: number;
}
export {};
