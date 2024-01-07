import { Method } from 'axios';
import { IKeyRow, IBoard, IKeyCode } from './VB-Original-Types';
// Configuration types
export type BoardCharArray = [Line, Line, Line, Line, Line, Line] | IBoard;
export type Line = IKeyRow;
export type VestaboardChar = IKeyCode;
export type VestaboardLayout = BoardCharArray | IBoard;
export enum VestaboardControlMode {
  Subscription = 'subscription',
  RW = 'rw',
  Local = 'local',
}

export interface SubscriptionAPIConfig {
  apiKey: string;
  apiSecret: string;
  mode: VestaboardControlMode.Subscription;
}
export class SubscriptionAPIConfig {
  apiKey: string;
  apiSecret: string;
  mode: VestaboardControlMode.Subscription;

  constructor(
    apiKey: string,
    apiSecret: string,
    mode: VestaboardControlMode.Subscription = VestaboardControlMode.Subscription
  ) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.mode = mode;
  }
}
export interface RWAPIConfig {
  apiReadWriteKey: string;
  mode: VestaboardControlMode.RW;
}
export class RWAPIConfig {
  apiReadWriteKey: string;
  mode: VestaboardControlMode.RW;

  constructor(
    apiReadWriteKey: string,
    mode: VestaboardControlMode.RW = VestaboardControlMode.RW
  ) {
    this.apiReadWriteKey = apiReadWriteKey;
    this.mode = mode;
  }
}
export interface LocalAPIConfigWithKey {
  localIPAddress: string;
  localApiKey: string;
  mode: VestaboardControlMode.Local;
  localAPIEnablementToken?: string;
}
export class LocalAPIConfigWithKey {
  localIPAddress: string;
  localApiKey: string;
  mode: VestaboardControlMode.Local;
  localAPIEnablementToken?: string;

  constructor(
    localIPAddress: string,
    localApiKey: string,
    mode: VestaboardControlMode.Local = VestaboardControlMode.Local,
    localAPIEnablementToken?: string
  ) {
    this.localIPAddress = localIPAddress;
    this.localApiKey = localApiKey;
    this.mode = mode;
    this.localAPIEnablementToken = localAPIEnablementToken;
  }
}

export interface LocalAPIConfigWithToken {
  localIPAddress: string;
  localAPIEnablementToken: string;
  mode: VestaboardControlMode.Local;
  localApiKey?: string;
}
export class LocalAPIConfigWithToken {
  localIPAddress: string;
  localAPIEnablementToken: string;
  mode: VestaboardControlMode.Local;
  localApiKey?: string;

  constructor(
    localIPAddress: string,
    localAPIEnablementToken: string,
    mode: VestaboardControlMode.Local = VestaboardControlMode.Local,
    localApiKey?: string
  ) {
    this.localIPAddress = localIPAddress;
    this.localAPIEnablementToken = localAPIEnablementToken;
    this.mode = mode;
    this.localApiKey = localApiKey;
  }
}
export type LocalAPIConfig = LocalAPIConfigWithKey | LocalAPIConfigWithToken;
export type APIConfig = SubscriptionAPIConfig | RWAPIConfig | LocalAPIConfig;

export interface APIOptions {
  data?: string;
  method: Method;
}

// Subscription API types
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

// RW api types
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

// Local API types

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
