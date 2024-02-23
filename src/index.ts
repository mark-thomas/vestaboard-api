import VestaSubscription from './VestaSubscription';
import VestaRW from './rwAPI';
import VestaLocal from './localAPI';
import {
  APIConfig,
  LocalAPIConfig,
  RWAPIConfig,
  SubscriptionAPIConfig,
  VestaboardControlMode,
  BoardCharArray,
  Line,
  VestaboardLayout,
  VestaboardChar,
} from './types';
import {
  createTransitionBoards,
  characterArrayFromString,
  convertBoardLayoutToString,
} from './sharedFunctions';
import { characterCode, characterCodeArray } from './values';

export function createVestaboard(
  mode: VestaboardControlMode,
  config: APIConfig
): VestaSubscription | VestaRW | VestaLocal {
  switch (mode) {
    case VestaboardControlMode.Subscription:
      const subConfig = config as SubscriptionAPIConfig;
      return new VestaSubscription(subConfig);
    case VestaboardControlMode.RW:
      const rwConfig = config as RWAPIConfig;
      return new VestaRW(rwConfig);
    case VestaboardControlMode.Local:
      const localConfig = config as LocalAPIConfig;
      return new VestaLocal(localConfig);
    default:
      throw new Error('Invalid Vestaboard mode');
  }
}

export {
  VestaSubscription,
  VestaRW,
  VestaLocal,
  VestaboardControlMode,
  characterCode,
  characterCodeArray,
  BoardCharArray,
  Line,
  APIConfig,
  SubscriptionAPIConfig,
  RWAPIConfig,
  LocalAPIConfig,
  VestaboardLayout,
  VestaboardChar,
  createTransitionBoards,
  characterArrayFromString,
  convertBoardLayoutToString,
};

//
// export enum VestaboardControlMode {
//   Subscription = 'subscription',
//   RW = 'rw',
//   Local = 'local',
// }
// export interface SubscriptionAPIConfig {
//   apiKey: string;
//   apiSecret: string;
//   mode: VestaboardControlMode.Subscription;
// }
// export interface RWAPIConfig {
//   apiReadWriteKey: string;
//   mode: VestaboardControlMode.RW;
// }
// export interface LocalAPIConfigWithKey {
//   localIPAddress: string;
//   localApiKey: string;
//   mode: VestaboardControlMode.Local;
//   localAPIEnablementToken?: string;
// }

// export interface LocalAPIConfigWithToken {
//   localIPAddress: string;
//   localAPIEnablementToken: string;
//   mode: VestaboardControlMode.Local;
//   localApiKey?: string;
// }
// export type LocalAPIConfig = LocalAPIConfigWithKey | LocalAPIConfigWithToken;
// export type APIConfig = SubscriptionAPIConfig | RWAPIConfig | LocalAPIConfig;
