"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BdBannerAd_1 = __importDefault(require("./Bd/BdBannerAd"));
var BdVideoUtil_1 = __importDefault(require("./Bd/BdVideoUtil"));
/**
 * 百度广告管理类
 */
var BdAdUtil = /** @class */ (function () {
    function BdAdUtil() {
        //视频 id 
        this.videoId = "7185501";
        //banner id
        this.bannerId = "7168299";
        //所属游戏 id
        this.appSid = "aaf8544f";
    }
    Object.defineProperty(BdAdUtil, "Instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new BdAdUtil();
            }
            return this._instance;
        },
        enumerable: false,
        configurable: true
    });
    BdAdUtil.prototype.init = function () {
        BdBannerAd_1.default.init({ adUnitId: this.bannerId, appSid: this.appSid, isRealtime: false, realtime: 30, style: { width: 600 } });
        BdVideoUtil_1.default.Instance.initRewardedVideoAd({
            adUnitId: this.videoId,
            appSid: this.appSid
        });
    };
    return BdAdUtil;
}());
exports.default = BdAdUtil;
