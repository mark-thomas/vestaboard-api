export var VestaboardControlMode;
(function (VestaboardControlMode) {
    VestaboardControlMode["Subscription"] = "subscription";
    VestaboardControlMode["RW"] = "rw";
    VestaboardControlMode["Local"] = "local";
})(VestaboardControlMode || (VestaboardControlMode = {}));
export class SubscriptionAPIConfig {
    constructor(apiKey, apiSecret, mode = VestaboardControlMode.Subscription) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.mode = mode;
    }
}
export class RWAPIConfig {
    constructor(apiReadWriteKey, mode = VestaboardControlMode.RW) {
        this.apiReadWriteKey = apiReadWriteKey;
        this.mode = mode;
    }
}
export class LocalAPIConfigWithKey {
    constructor(localIPAddress, localApiKey, mode = VestaboardControlMode.Local, localAPIEnablementToken) {
        this.localIPAddress = localIPAddress;
        this.localApiKey = localApiKey;
        this.mode = mode;
        this.localAPIEnablementToken = localAPIEnablementToken;
    }
}
export class LocalAPIConfigWithToken {
    constructor(localIPAddress, localAPIEnablementToken, mode = VestaboardControlMode.Local, localApiKey) {
        this.localIPAddress = localIPAddress;
        this.localAPIEnablementToken = localAPIEnablementToken;
        this.mode = mode;
        this.localApiKey = localApiKey;
    }
}
