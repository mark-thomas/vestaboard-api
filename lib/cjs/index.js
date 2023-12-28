"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VestaLocal = exports.VestaRW = exports.VestaSubscription = exports.createVestaboard = void 0;
const VestaSubscription_1 = __importDefault(require("./VestaSubscription"));
exports.VestaSubscription = VestaSubscription_1.default;
const rwAPI_1 = __importDefault(require("./rwAPI"));
exports.VestaRW = rwAPI_1.default;
const localAPI_1 = __importDefault(require("./localAPI"));
exports.VestaLocal = localAPI_1.default;
const types_1 = require("./types");
function createVestaboard(config) {
    switch (config.mode) {
        case types_1.VestaboardControlMode.Subscription:
            return new VestaSubscription_1.default(config);
        case types_1.VestaboardControlMode.RW:
            return new rwAPI_1.default(config);
        case types_1.VestaboardControlMode.Local:
            return new localAPI_1.default(config);
        default:
            throw new Error('Invalid Vestaboard mode');
    }
}
exports.createVestaboard = createVestaboard;
