"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var WindowUtil_1 = __importDefault(require("../../Utils/WindowUtil"));
var PlatformMg_1 = __importDefault(require("../PlatformMg"));
/**
 * 百度banner管理类
 * [版本号：v1.0.0]
 * 时间：2020-08-06
 *  */
var BdBannerAd = /** @class */ (function () {
    function BdBannerAd() {
    }
    /**
     * 初始化
     * @param obj
     * @param obj.adUnitId 广告位 id
     * @param obj.appSid 所属游戏 id
     * @param obj.isRealtime 是否实时更新
     * @param obj.realtime 广告自动刷新的间隔时间
     * @param {*object} obj.style style.width banner宽度
     */
    BdBannerAd.init = function (obj) {
        if (obj === void 0) { obj = {}; }
        BdBannerAd.adUnitId = obj.adUnitId;
        BdBannerAd.appId = obj.appSid;
        if (obj.isRealtime) {
            BdBannerAd.isRealtime = obj.isRealtime;
        }
        else {
            BdBannerAd.isRealtime = false;
        }
        if (obj.realtime) {
            BdBannerAd.realtime = obj.realtime;
        }
        if (obj.style && obj.style.width) {
            this.bannerWidth = obj.style.width < 300 * Laya.Browser.pixelRatio ? 300 * Laya.Browser.pixelRatio : obj.style.width;
        }
        else {
            this.bannerWidth = Laya.Browser.width;
        }
        BdBannerAd.load();
        BdBannerAd.isLoad = false;
        BdBannerAd.cache.onLoad(function (res) {
            BdBannerAd.isLoad = true;
            console.log('banner广告创建完成1', res);
        });
    };
    //加载banner广告
    BdBannerAd.load = function () {
        var InfoSync = PlatformMg_1.default.Instance.platform.getSystemInfoSync();
        var windowWidth = InfoSync.windowWidth; //可使用窗口宽度
        var windowHeight = InfoSync.windowHeight;
        //const { windowWidth, windowHeight } = tt.getSystemInfoSync();
        var targetBannerAdWidth = this.bannerWidth / Laya.Browser.pixelRatio;
        //targetBannerAdWidth = windowWidth*208/750
        if (BdBannerAd.cache)
            BdBannerAd.cache.destroy();
        BdBannerAd.cache = PlatformMg_1.default.Instance.platform.createBannerAd({
            adUnitId: BdBannerAd.adUnitId,
            appSid: BdBannerAd.appId,
            style: {
                width: targetBannerAdWidth,
                top: windowHeight - (targetBannerAdWidth / 13) * 5 - (WindowUtil_1.default.isIphoneX ? 20 : 0),
                left: (windowWidth - targetBannerAdWidth) / 2
            }
        });
        BdBannerAd.cache.onError(function (res) {
            console.log('banner广告错误', res);
        });
        BdBannerAd.cache.onResize(function (size) {
            // good
            console.log('banner尺寸变化', size.width, size.height);
            BdBannerAd.cache.style.top = windowHeight - size.height - (WindowUtil_1.default.isIphoneX ? 15 : 0);
            BdBannerAd.cache.style.left = (windowWidth - size.width) / 2;
        });
    };
    //显示广告
    BdBannerAd.show = function (obj) {
        if (obj === void 0) { obj = {}; }
        if (BdBannerAd.isRealtime) {
            BdBannerAd.load();
            BdBannerAd.isLoad = true;
            BdBannerAd.cache.onLoad(function () {
                BdBannerAd.isLoad = false;
                BdBannerAd.cache.show().then(function () {
                }).catch(function () {
                    //失败
                    BdBannerAd.cache.show();
                });
            });
        }
        else {
            BdBannerAd.cache.show().then(function () {
                BdBannerAd.errorNum = 0;
                BdBannerAd._setTime && clearInterval(BdBannerAd._setTime);
                BdBannerAd._setTime = setInterval(function () {
                    //
                    console.log('BdBannerAd._alltime', BdBannerAd._alltime);
                    BdBannerAd._alltime++;
                    if (BdBannerAd._alltime >= BdBannerAd.realtime) {
                        BdBannerAd._alltime = 0;
                        BdBannerAd.load();
                        BdBannerAd.isLoad = true;
                        BdBannerAd.cache.onLoad(function () {
                            BdBannerAd.isLoad = false;
                            BdBannerAd.cache.show();
                        });
                    }
                }, 1000);
            }).catch(function (err) {
                BdBannerAd.errorNum++;
                if (BdBannerAd.errorNum > 3) {
                    return;
                }
                else {
                    BdBannerAd.show();
                    console.log("广告组件出现问题", err);
                }
            });
        }
    };
    //延时关闭banner广告
    BdBannerAd.delteHide = function () {
        var _this = this;
        Laya.timer.once(1000, this, function () {
            if (BdBannerAd.isLoad) {
                _this.delteHide();
            }
            else {
                BdBannerAd.hide();
            }
        });
    };
    BdBannerAd.hide = function () {
        if (this.isLoad) {
            //正在加载广告还没显示
            BdBannerAd.delteHide();
        }
        else {
            BdBannerAd._setTime && clearInterval(BdBannerAd._setTime);
            if (BdBannerAd.cache)
                BdBannerAd.cache.hide();
        }
    };
    //广告实例
    BdBannerAd.cache = null;
    //手动控制刷新时间时间
    BdBannerAd.realtime = 30;
    BdBannerAd._alltime = 0;
    BdBannerAd._setTime = null; //定时器
    //广告自动刷新的间隔时间
    BdBannerAd.adIntervals = 30;
    //是否时时刷新
    BdBannerAd.isRealtime = false;
    //布局样式缓存(上一次show时的样式)
    BdBannerAd.styleCache = {};
    BdBannerAd.errorNum = 0;
    BdBannerAd.isLoad = false; //banner广告正在加载（正在加载调用hide会导致广告没有关闭，因为加载广告会有延迟）
    BdBannerAd.minWidth = 300; //banner最小宽度 单位rpx
    BdBannerAd.bannerWidth = 750; //banner宽度
    return BdBannerAd;
}());
exports.default = BdBannerAd;
