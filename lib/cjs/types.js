"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalAPIConfigWithToken = exports.LocalAPIConfigWithKey = exports.RWAPIConfig = exports.SubscriptionAPIConfig = exports.VestaboardControlMode = void 0;
var VestaboardControlMode;
(function (VestaboardControlMode) {
    VestaboardControlMode["Subscription"] = "subscription";
    VestaboardControlMode["RW"] = "rw";
    VestaboardControlMode["Local"] = "local";
})(VestaboardControlMode = exports.VestaboardControlMode || (exports.VestaboardControlMode = {}));
class SubscriptionAPIConfig {
    constructor(apiKey, apiSecret, mode = VestaboardControlMode.Subscription) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.mode = mode;
    }
}
exports.SubscriptionAPIConfig = SubscriptionAPIConfig;
class RWAPIConfig {
    constructor(apiReadWriteKey, mode = VestaboardControlMode.RW) {
        this.apiReadWriteKey = apiReadWriteKey;
        this.mode = mode;
    }
}
exports.RWAPIConfig = RWAPIConfig;
class LocalAPIConfigWithKey {
    constructor(localIPAddress, localApiKey, mode = VestaboardControlMode.Local, localAPIEnablementToken) {
        this.localIPAddress = localIPAddress;
        this.localApiKey = localApiKey;
        this.mode = mode;
        this.localAPIEnablementToken = localAPIEnablementToken;
    }
}
exports.LocalAPIConfigWithKey = LocalAPIConfigWithKey;
class LocalAPIConfigWithToken {
    constructor(localIPAddress, localAPIEnablementToken, mode = VestaboardControlMode.Local, localApiKey) {
        this.localIPAddress = localIPAddress;
        this.localAPIEnablementToken = localAPIEnablementToken;
        this.mode = mode;
        this.localApiKey = localApiKey;
    }
}
exports.LocalAPIConfigWithToken = LocalAPIConfigWithToken;
