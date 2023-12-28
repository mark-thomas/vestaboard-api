import { Method } from 'axios';
import { BoardCharArray } from './values';
export declare enum VestaboardControlMode {
    Subscription = "subscription",
    RW = "rw",
    Local = "local"
}
export interface SubscriptionAPIConfig {
    apiKey: string;
    apiSecret: string;
    mode: VestaboardControlMode.Subscription;
}
export interface RWAPIConfig {
    apiReadWriteKey: string;
    mode: VestaboardControlMode.RW;
}
export interface LocalAPIConfigWithKey {
    localIPAddress: string;
    localApiKey: string;
    mode: VestaboardControlMode.Local;
    localAPIEnablementToken?: string;
}
export interface LocalAPIConfigWithToken {
    localIPAddress: string;
    localAPIEnablementToken: string;
    mode: VestaboardControlMode.Local;
    localApiKey?: string;
}
export type LocalAPIConfig = LocalAPIConfigWithKey | LocalAPIConfigWithToken;
export type APIConfig = SubscriptionAPIConfig | RWAPIConfig | LocalAPIConfig;
export interface APIOptions {
    data?: string;
    method: Method;
}
export interface Subscription {
    id: string;
    boardId: string;
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
    muted: boolean;
}
export interface RWBoardReadResponse {
    currentMessage: {
        layout: string;
        id: string;
    };
}
export interface RWBoardParsed {
    currentMessage: {
        layout: BoardCharArray;
        id: string;
    };
}
export interface RWMesageResponse {
    status: string;
    id: string;
    created: number;
}
export interface LocalEnablementResponse {
    message: string;
    apiKey: string;
}
export interface LocalGetCurrentMessageResponse {
    message: BoardCharArray;
}
export interface LocalPostResponse {
    ok: boolean;
}
export interface LocalReadResponse {
    message: BoardCharArray;
}
