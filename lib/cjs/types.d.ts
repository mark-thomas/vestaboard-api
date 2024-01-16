import { Method } from 'axios';
import { IKeyRow, IBoard, IKeyCode } from './VB-Original-Types';
export type BoardCharArray = [Line, Line, Line, Line, Line, Line] | IBoard;
export type Line = IKeyRow;
export type VestaboardChar = IKeyCode;
export type VestaboardLayout = BoardCharArray | IBoard;
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
export declare class SubscriptionAPIConfig {
    apiKey: string;
    apiSecret: string;
    mode: VestaboardControlMode.Subscription;
    constructor(apiKey: string, apiSecret: string, mode?: VestaboardControlMode.Subscription);
}
export interface RWAPIConfig {
    apiReadWriteKey: string;
    mode: VestaboardControlMode.RW;
}
export declare class RWAPIConfig {
    apiReadWriteKey: string;
    mode: VestaboardControlMode.RW;
    constructor(apiReadWriteKey: string, mode?: VestaboardControlMode.RW);
}
export interface LocalAPIConfigWithKey {
    localIPAddress: string;
    localApiKey: string;
    mode: VestaboardControlMode.Local;
    localAPIEnablementToken?: string;
}
export declare class LocalAPIConfigWithKey {
    localIPAddress: string;
    localApiKey: string;
    mode: VestaboardControlMode.Local;
    localAPIEnablementToken?: string;
    constructor(localIPAddress: string, localApiKey: string, mode?: VestaboardControlMode.Local, localAPIEnablementToken?: string);
}
export interface LocalAPIConfigWithToken {
    localIPAddress: string;
    localAPIEnablementToken: string;
    mode: VestaboardControlMode.Local;
    localApiKey?: string;
}
export declare class LocalAPIConfigWithToken {
    localIPAddress: string;
    localAPIEnablementToken: string;
    mode: VestaboardControlMode.Local;
    localApiKey?: string;
    constructor(localIPAddress: string, localAPIEnablementToken: string, mode?: VestaboardControlMode.Local, localApiKey?: string);
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
