"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PlatformMg_1 = __importDefault(require("../PlatformMg"));
var TipsUtil_1 = __importDefault(require("../../Utils/TipsUtil"));
/**视频播放管理工具 */
var BdVideoUtil = /** @class */ (function () {
    function BdVideoUtil() {
        //[扩展功能] RewardedVideoAd
        this.rewardedVideoAdId = ''; //广告id
        this.rewardedVideoAppSid = ''; //广告所属id
        this.rewardedVideoAdCache = null;
        this.rewardedVideoAdFailNum = 0; //广告失败加载次数
        this.rewardedVideoAdMaxNum = 3; //广告最大加载失败次数
        this.rewardedVideoAdStatus = false; //广告状态
        this._onCloseRewardedVideoAd = null;
        this._onLoadRewardedVideoAd = null;
        this._onErrorRewardedVideoAd = null;
    }
    Object.defineProperty(BdVideoUtil, "Instance", {
        get: function () { if (!this._Instance)
            this._Instance = new BdVideoUtil(); return this._Instance; },
        enumerable: false,
        configurable: true
    });
    //定时器
    BdVideoUtil.prototype.setTimeout = function (callback, delay) {
        return setTimeout(callback, delay);
    };
    ;
    /**初始化
     * @param obj.adUnitId 视频id
     */
    BdVideoUtil.prototype.initRewardedVideoAd = function (obj) {
        if (obj === void 0) { obj = {}; }
        console.log("initRewardedVideoAd");
        if (obj.adUnitId) {
            console.log("initRewardedVideoAd 创建广告ID");
            this.rewardedVideoAdId = obj.adUnitId;
            this.rewardedVideoAppSid = obj.appSid;
        }
        if (this.rewardedVideoAdFailNum < this.rewardedVideoAdMaxNum) {
            console.log("initRewardedVideoAd 创建广告");
            //创建新的广告组件
            this.rewardedVideoAdCache = PlatformMg_1.default.Instance.platform.createRewardedVideoAd({
                adUnitId: this.rewardedVideoAdId,
                appSid: this.rewardedVideoAppSid
            });
            this.rewardedVideoAdCache.load();
            this.rewardedVideoAdCache.onLoad(this.onLoadRewardedVideoAd);
            this.rewardedVideoAdCache.onError(this.onErrorRewardedVideoAd);
        }
    };
    ;
    /**
     * 显示视频广告
     * @param {any} obj
     * @param {Function} obj.before
     * @param {Function} obj.complete
     * @param {Function} obj.success
     * @param {Function} obj.fail
     * @param {Function} obj.error
     */
    BdVideoUtil.prototype.showRewardedVideoAd = function (obj) {
        console.log("showRewardedVideoAd", BdVideoUtil.Instance.rewardedVideoAdStatus);
        if (obj.before)
            obj.before();
        if (BdVideoUtil.Instance.rewardedVideoAdStatus) {
            BdVideoUtil.Instance._onCloseRewardedVideoAd = function (res) {
                if (obj.complete)
                    obj.complete(res.isEnded);
                if (res.isEnded) {
                    if (obj.success)
                        obj.success();
                }
                else {
                    if (obj.fail)
                        obj.fail();
                }
            };
            BdVideoUtil.Instance.rewardedVideoAdCache.onClose(BdVideoUtil.Instance.onCloseRewardedVideoAd);
            BdVideoUtil.Instance.rewardedVideoAdCache.show();
        }
        else {
            if (obj.error) {
                obj.error();
            }
            else {
                TipsUtil_1.default.msg('暂时没有可以播放的视频!');
            }
            if (obj.complete)
                obj.complete(false);
        }
    };
    ;
    //广告组件关闭回调
    BdVideoUtil.prototype.onCloseRewardedVideoAd = function (res) {
        BdVideoUtil.Instance.rewardedVideoAdCache.offClose(BdVideoUtil.Instance.onCloseRewardedVideoAd);
        if (BdVideoUtil.Instance._onCloseRewardedVideoAd)
            BdVideoUtil.Instance._onCloseRewardedVideoAd(res);
    };
    //广告组件加载完成回调
    BdVideoUtil.prototype.onLoadRewardedVideoAd = function () {
        console.log("百度视频加载完成");
        BdVideoUtil.Instance.rewardedVideoAdStatus = true;
        BdVideoUtil.Instance.rewardedVideoAdCache.offLoad(BdVideoUtil.Instance.onLoadRewardedVideoAd);
        if (BdVideoUtil.Instance._onLoadRewardedVideoAd)
            BdVideoUtil.Instance._onLoadRewardedVideoAd();
    };
    //广告组件异常回调
    BdVideoUtil.prototype.onErrorRewardedVideoAd = function (res) {
        console.log("onErrorRewardedVideoAd res", res);
        BdVideoUtil.Instance.rewardedVideoAdCache.offError(BdVideoUtil.Instance.onErrorRewardedVideoAd);
        if (BdVideoUtil.Instance._onErrorRewardedVideoAd)
            BdVideoUtil.Instance._onErrorRewardedVideoAd();
        switch (res.errCode) {
            case 1002: //广告单元无效
            case 1005: //广告组件审核中
            case 1006: //广告组件被驳回
            case 1007: //广告组件被封禁
            case 1008: //广告单元已关闭
                BdVideoUtil.Instance.rewardedVideoAdStatus = false;
                break;
            case 1000: //后端接口调用失败
            case 1001: //参数错误
            case 1003: //内部错误
            case 1004: //无合适的广告
            default:
                BdVideoUtil.Instance.rewardedVideoAdFailNum++;
                BdVideoUtil.Instance.setTimeout(function () {
                    BdVideoUtil.Instance.initRewardedVideoAd();
                    console.log('视频重新加载', BdVideoUtil.Instance.rewardedVideoAdFailNum);
                }, 5000);
                break;
        }
    };
    return BdVideoUtil;
}());
exports.default = BdVideoUtil;
