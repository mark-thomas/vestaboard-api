"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RWAPIConfig = exports.SubscriptionAPIConfig = exports.characterCodeArray = exports.characterCode = exports.VestaboardControlMode = exports.VestaLocal = exports.VestaRW = exports.VestaSubscription = exports.createVestaboard = void 0;
const VestaSubscription_1 = __importDefault(require("./VestaSubscription"));
exports.VestaSubscription = VestaSubscription_1.default;
const rwAPI_1 = __importDefault(require("./rwAPI"));
exports.VestaRW = rwAPI_1.default;
const localAPI_1 = __importDefault(require("./localAPI"));
exports.VestaLocal = localAPI_1.default;
const types_1 = require("./types");
Object.defineProperty(exports, "RWAPIConfig", { enumerable: true, get: function () { return types_1.RWAPIConfig; } });
Object.defineProperty(exports, "SubscriptionAPIConfig", { enumerable: true, get: function () { return types_1.SubscriptionAPIConfig; } });
Object.defineProperty(exports, "VestaboardControlMode", { enumerable: true, get: function () { return types_1.VestaboardControlMode; } });
const values_1 = require("./values");
Object.defineProperty(exports, "characterCode", { enumerable: true, get: function () { return values_1.characterCode; } });
Object.defineProperty(exports, "characterCodeArray", { enumerable: true, get: function () { return values_1.characterCodeArray; } });
function createVestaboard(mode, config) {
    switch (mode) {
        case types_1.VestaboardControlMode.Subscription:
            const subConfig = config;
            return new VestaSubscription_1.default(subConfig);
        case types_1.VestaboardControlMode.RW:
            const rwConfig = config;
            return new rwAPI_1.default(rwConfig);
        case types_1.VestaboardControlMode.Local:
            const localConfig = config;
            return new localAPI_1.default(localConfig);
        default:
            throw new Error('Invalid Vestaboard mode');
    }
}
exports.createVestaboard = createVestaboard;
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
