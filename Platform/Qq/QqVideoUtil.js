"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PlatformMg_1 = __importDefault(require("../PlatformMg"));
/**视频播放管理工具 */
var QqVideoUtil = /** @class */ (function () {
    function QqVideoUtil() {
        // //[扩展功能] BannerAd
        // initBannerAd(obj: any = {}): void { WxBannerAd.init(obj); };
        // showBannerAd(obj: any, end: Function = null): void { WxBannerAd.show(obj, end); };
        // hideBannerAd(): void { WxBannerAd.hide(); };
        //[扩展功能] RewardedVideoAd
        this.rewardedVideoAdId = '';
        this.rewardedVideoAdCache = null;
        this.rewardedVideoAdFailNum = {};
        this.rewardedVideoAdStatus = {};
        this.rewardedVideoAdLoadStatus = false; //加载状态
        this._onCloseRewardedVideoAd = null;
        this._onLoadRewardedVideoAd = null;
        this._onErrorRewardedVideoAd = null;
    }
    Object.defineProperty(QqVideoUtil, "Instance", {
        get: function () { if (!this._Instance)
            this._Instance = new QqVideoUtil(); return this._Instance; },
        enumerable: false,
        configurable: true
    });
    //定时器
    QqVideoUtil.prototype.setTimeout = function (callback, delay) {
        return setTimeout(callback, delay);
    };
    ;
    QqVideoUtil.prototype.createBannerAd = function (obj) { return PlatformMg_1.default.Instance.platform.createBannerAd(obj); };
    ;
    QqVideoUtil.prototype.createRewardedVideoAd = function (obj) { return PlatformMg_1.default.Instance.platform.createRewardedVideoAd(obj); };
    ;
    /**初始化 */
    QqVideoUtil.prototype.initRewardedVideoAd = function (obj) {
        if (obj === void 0) { obj = {}; }
        console.log("initRewardedVideoAd");
        if (obj.adUnitId) {
            console.log("initRewardedVideoAd 创建广告ID");
            //设置当前广告id对应的状态
            if (this.rewardedVideoAdId !== obj.adUnitId)
                this.rewardedVideoAdLoadStatus = false;
            //设置当前广告id(随机读取一个id)
            var num = obj.adUnitId.length;
            num = Math.floor(Math.random() * num);
            this.rewardedVideoAdId = obj.adUnitId[num];
            //设置当前广告id开启状态
            if (this.rewardedVideoAdStatus[this.rewardedVideoAdId] === undefined)
                this.rewardedVideoAdStatus[this.rewardedVideoAdId] = true;
            //设置当前广告id加载失败次数
            if (this.rewardedVideoAdFailNum[this.rewardedVideoAdId] === undefined)
                this.rewardedVideoAdFailNum[this.rewardedVideoAdId] = 0;
        }
        if (
        //广告id开启状态
        this.rewardedVideoAdStatus[this.rewardedVideoAdId] &&
            //广告id加载失败次数
            this.rewardedVideoAdFailNum[this.rewardedVideoAdId] <= 3) {
            console.log("initRewardedVideoAd 创建广告");
            //创建新的广告组件
            this.rewardedVideoAdCache = PlatformMg_1.default.Instance.platform.createRewardedVideoAd({ adUnitId: this.rewardedVideoAdId });
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
    QqVideoUtil.prototype.showRewardedVideoAd = function (obj) {
        console.log("showRewardedVideoAd", QqVideoUtil.Instance.rewardedVideoAdLoadStatus);
        if (obj.before)
            obj.before();
        if (QqVideoUtil.Instance.rewardedVideoAdLoadStatus) {
            QqVideoUtil.Instance._onCloseRewardedVideoAd = function (res) {
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
            QqVideoUtil.Instance.rewardedVideoAdCache.onClose(QqVideoUtil.Instance.onCloseRewardedVideoAd);
            QqVideoUtil.Instance.rewardedVideoAdCache.show();
        }
        else {
            if (obj.error)
                obj.error();
            if (obj.complete)
                obj.complete(false);
        }
    };
    ;
    //广告组件关闭回调
    QqVideoUtil.prototype.onCloseRewardedVideoAd = function (res) {
        QqVideoUtil.Instance.rewardedVideoAdCache.offClose(QqVideoUtil.Instance.onCloseRewardedVideoAd);
        if (QqVideoUtil.Instance._onCloseRewardedVideoAd)
            QqVideoUtil.Instance._onCloseRewardedVideoAd(res);
    };
    //广告组件加载完成回调
    QqVideoUtil.prototype.onLoadRewardedVideoAd = function () {
        console.log("onLoadRewardedVideoAd");
        QqVideoUtil.Instance.rewardedVideoAdLoadStatus = true;
        QqVideoUtil.Instance.rewardedVideoAdCache.offLoad(QqVideoUtil.Instance.onLoadRewardedVideoAd);
        if (QqVideoUtil.Instance._onLoadRewardedVideoAd)
            QqVideoUtil.Instance._onLoadRewardedVideoAd();
    };
    //广告组件异常回调
    QqVideoUtil.prototype.onErrorRewardedVideoAd = function (res) {
        console.log("onErrorRewardedVideoAd res", res);
        QqVideoUtil.Instance.rewardedVideoAdCache.offError(QqVideoUtil.Instance.onErrorRewardedVideoAd);
        if (QqVideoUtil.Instance._onErrorRewardedVideoAd)
            QqVideoUtil.Instance._onErrorRewardedVideoAd();
        switch (res.errCode) {
            case 1002: //广告单元无效
            case 1005: //广告组件审核中
            case 1006: //广告组件被驳回
            case 1007: //广告组件被封禁
            case 1008: //广告单元已关闭
                QqVideoUtil.Instance.rewardedVideoAdStatus[QqVideoUtil.Instance.rewardedVideoAdId] = false;
                break;
            case 1000: //后端接口调用失败
            case 1001: //参数错误
            case 1003: //内部错误
            case 1004: //无合适的广告
            default:
                QqVideoUtil.Instance.rewardedVideoAdFailNum[QqVideoUtil.Instance.rewardedVideoAdId]++;
                QqVideoUtil.Instance.setTimeout(function () {
                    QqVideoUtil.Instance.initRewardedVideoAd();
                }, 10000);
                break;
        }
    };
    return QqVideoUtil;
}());
exports.default = QqVideoUtil;
