"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PlatformMg_1 = __importDefault(require("./PlatformMg"));
var WxAdUtil_1 = __importDefault(require("./WxAdUtil"));
var QqAdUtil_1 = __importDefault(require("./QqAdUtil"));
var OppoAdUtil_1 = __importDefault(require("./OppoAdUtil"));
var VivoAdUtil_1 = __importDefault(require("./VivoAdUtil"));
var BdAdUtil_1 = __importDefault(require("./BdAdUtil"));
var WindowUtil_1 = __importDefault(require("../Utils/WindowUtil"));
var TtAdUtil_1 = __importDefault(require("./TtAdUtil"));
var ttShar_1 = __importDefault(require("./Tt/ttShar"));
var WxBannerAd2_1 = __importDefault(require("./Wx/WxBannerAd2"));
var QqBannerAd_1 = __importDefault(require("./Qq/QqBannerAd"));
var BdBannerAd_1 = __importDefault(require("./Bd/BdBannerAd"));
var BdVideoUtil_1 = __importDefault(require("./Bd/BdVideoUtil"));
/**
 * 广告管理类
 */
var AdMg = /** @class */ (function () {
    function AdMg() {
        //banner广告中间位置坐标
        this.bannerStyle = null;
        this.ADMidleY = 0;
        this.hadInit = false;
        //banner展示的类型
        this.showType = 0;
    }
    Object.defineProperty(AdMg, "Instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new AdMg();
            }
            return this._instance;
        },
        enumerable: false,
        configurable: true
    });
    /**
    * 广告工具类初始化
    */
    AdMg.prototype.init = function () {
        switch (PlatformMg_1.default.Instance.platformName) {
            case PlatformMg_1.default.Instance.Wx:
                PlatformMg_1.default.Instance.onWx && WxAdUtil_1.default.Instance.init();
                break;
            case PlatformMg_1.default.Instance.Qq:
                PlatformMg_1.default.Instance.onQq && QqAdUtil_1.default.Instance.init();
                break;
            case PlatformMg_1.default.Instance.Oppo:
                PlatformMg_1.default.Instance.onOppo && OppoAdUtil_1.default.Instance.init();
                break;
            case PlatformMg_1.default.Instance.Vivo:
                PlatformMg_1.default.Instance.onVivo && VivoAdUtil_1.default.init();
                break;
            case PlatformMg_1.default.Instance.Bd:
                PlatformMg_1.default.Instance.onBd && BdAdUtil_1.default.Instance.init();
                break;
            case PlatformMg_1.default.Instance.Tt:
                PlatformMg_1.default.Instance.onTt && TtAdUtil_1.default.Instance.init();
                break;
            default:
                break;
        }
        this.hadInit = true;
    };
    /**
     * 显示banner广告
     * @param data
     */
    AdMg.prototype.showBanner = function (data) {
        if (data === void 0) { data = {}; }
        if (!this.hadInit) {
            return;
        }
        switch (PlatformMg_1.default.Instance.platformName) {
            case PlatformMg_1.default.Instance.Wx:
                WxBannerAd2_1.default.show();
                //WxAdUtil.Instance.showBanner(data);
                break;
            case PlatformMg_1.default.Instance.Qq:
                //WxBannerAd.hide();
                QqBannerAd_1.default.show();
                break;
            case PlatformMg_1.default.Instance.Tt:
                TtAdUtil_1.default.Instance.showBanner();
                break;
            case PlatformMg_1.default.Instance.Oppo:
                OppoAdUtil_1.default.Instance.showBanner();
                break;
            case PlatformMg_1.default.Instance.Vivo:
                VivoAdUtil_1.default.showBanner();
                break;
            case PlatformMg_1.default.Instance.Bd:
                BdBannerAd_1.default.show();
                break;
            default:
                PlatformMg_1.default.Instance.platform.showBannerAd();
                break;
        }
    };
    /**
     * 隐藏banner广告
     */
    AdMg.prototype.hideBanner = function () {
        if (!this.hadInit) {
            return;
        }
        switch (PlatformMg_1.default.Instance.platformName) {
            case PlatformMg_1.default.Instance.Wx:
                WxBannerAd2_1.default.hide();
                //WxAdUtil.Instance.hideBanner();
                break;
            case PlatformMg_1.default.Instance.Qq:
                QqBannerAd_1.default.hide();
                break;
            case PlatformMg_1.default.Instance.Tt:
                TtAdUtil_1.default.Instance.hideBanner();
                break;
            case PlatformMg_1.default.Instance.Oppo:
                OppoAdUtil_1.default.Instance.hideBanner();
                break;
            case PlatformMg_1.default.Instance.Vivo:
                VivoAdUtil_1.default.hideBanner();
                break;
            case PlatformMg_1.default.Instance.Bd:
                BdBannerAd_1.default.hide();
                break;
            default:
                PlatformMg_1.default.Instance.platform.hideBannerAd();
                break;
        }
    };
    /**
     * 调用视频广告
     * @param options
     * @param {Function} obj.success 成功
     * @param {Function} obj.fail 失败
     */
    AdMg.prototype.showVideo = function (options) {
        if (options === void 0) { options = {}; }
        if (!this.hadInit) {
            options.success && options.success();
            return;
        }
        switch (PlatformMg_1.default.Instance.platformName) {
            case PlatformMg_1.default.Instance.Wx:
                WxAdUtil_1.default.Instance.video(options);
                break;
            case PlatformMg_1.default.Instance.Qq:
                QqAdUtil_1.default.Instance.video(options);
                break;
            case PlatformMg_1.default.Instance.Tt:
                TtAdUtil_1.default.Instance.video(options);
                break;
            case PlatformMg_1.default.Instance.Oppo:
                OppoAdUtil_1.default.Instance.video(options);
                break;
            case PlatformMg_1.default.Instance.Vivo:
                VivoAdUtil_1.default.video(options);
                break;
            case PlatformMg_1.default.Instance.Bd:
                BdVideoUtil_1.default.Instance.showRewardedVideoAd(options);
                break;
            case PlatformMg_1.default.Instance.Web:
                options.success && options.success();
                break;
            default:
                options.fail && options.fail();
                break;
        }
    };
    /**
     * 调用分享
     * @param options
     */
    AdMg.prototype.share = function (options) {
        if (options === void 0) { options = {}; }
        if (!this.hadInit) {
            options.success && options.success();
            return;
        }
        switch (PlatformMg_1.default.Instance.platformName) {
            case PlatformMg_1.default.Instance.Wx:
                WxAdUtil_1.default.Instance.share(options);
                break;
            case PlatformMg_1.default.Instance.Qq:
                QqAdUtil_1.default.Instance.share(options);
                break;
            case PlatformMg_1.default.Instance.Tt:
                ttShar_1.default.share(options);
                //TtAdUtil.Instance.share(options);
                break;
            default:
                options.fail && options.fail();
                break;
        }
    };
    /**
     * 设置banner位置信息
     * @param bannerAd
     */
    AdMg.prototype.setADMidleY = function (bannerInfo) {
        if (bannerInfo) {
            this.bannerStyle = bannerInfo;
            console.log("ADMidleY---> bannerInfo ：", bannerInfo);
            var y = WindowUtil_1.default.gameHeight - bannerInfo.height / 2 * WindowUtil_1.default.clientScale;
            console.log("ADMidleY---> y =", y);
            if (y >= WindowUtil_1.default.gameHeight) {
                y = WindowUtil_1.default.gameHeight - 150;
            }
            this.ADMidleY = y;
            console.log("ADMidleY---> ADMidleY =", this.ADMidleY);
        }
        else {
            this.ADMidleY = WindowUtil_1.default.gameHeight - 150;
        }
    };
    AdMg.prototype.getADMidleY = function () {
        var y = this.ADMidleY == 0 ? this.ADMidleY = WindowUtil_1.default.gameHeight - 150 : this.ADMidleY;
        console.log("ADMidleY---> getADMidleY :", y);
        return y;
    };
    AdMg.prototype.getADBannerInfo = function () {
        return this.bannerStyle;
    };
    return AdMg;
}());
exports.default = AdMg;
