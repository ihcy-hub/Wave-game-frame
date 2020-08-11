"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var WindowUtil_1 = __importDefault(require("../../Utils/WindowUtil"));
var PlatformMg_1 = __importDefault(require("../PlatformMg"));
/**
 * 字节跳动banner管理类
 * [版本号：v1.0.0]
 * 时间：2020-02-12
 *  */
var TtBannerAd = /** @class */ (function () {
    function TtBannerAd() {
    }
    /**
     * 初始化
     * @param obj
     * @param obj.adUnitId 广告位 id
     * @param obj.isRealtime 是否实时更新
     * @param obj.realtime 广告自动刷新的间隔时间
     */
    TtBannerAd.init = function (obj) {
        if (obj === void 0) { obj = {}; }
        TtBannerAd.adUnitId = obj.adUnitId;
        if (obj.isRealtime) {
            TtBannerAd.isRealtime = obj.isRealtime;
        }
        else {
            TtBannerAd.isRealtime = false;
        }
        if (obj.realtime) {
            TtBannerAd.realtime = obj.realtime;
        }
        TtBannerAd.load();
        TtBannerAd.cache.onLoad(function (res) {
            console.log('banner广告创建完成1', res);
        });
        console.log('banner广告创建完成', TtBannerAd.cache);
    };
    //加载banner广告
    TtBannerAd.load = function () {
        var InfoSync = PlatformMg_1.default.Instance.platform.getSystemInfoSync();
        var windowWidth = InfoSync.windowWidth;
        var windowHeight = InfoSync.windowHeight;
        //const { windowWidth, windowHeight } = tt.getSystemInfoSync();
        var targetBannerAdWidth = 208; //banner的宽度最大208
        targetBannerAdWidth = windowWidth * 208 / 750;
        if (TtBannerAd.cache)
            TtBannerAd.cache.destroy();
        TtBannerAd.cache = PlatformMg_1.default.Instance.platform.createBannerAd({
            adUnitId: TtBannerAd.adUnitId,
            adIntervals: TtBannerAd.adIntervals,
            style: {
                width: targetBannerAdWidth,
                top: windowHeight - (targetBannerAdWidth / 16) * 9 - (WindowUtil_1.default.isIphoneX ? 20 : 0),
                left: (windowWidth - targetBannerAdWidth) / 2
            }
        });
        TtBannerAd.cache.onError(function (res) {
            console.log('banner广告错误', res);
        });
        TtBannerAd.cache.onResize(function (size) {
            // good
            console.log(size.width, size.height);
            TtBannerAd.cache.style.top = windowHeight - size.height - (WindowUtil_1.default.isIphoneX ? 20 : 0);
            TtBannerAd.cache.style.left = (windowWidth - size.width) / 2;
            // bad，会触发死循环
            // bannerAd.style.width++;
        });
    };
    //显示广告
    TtBannerAd.show = function (obj) {
        if (obj === void 0) { obj = {}; }
        if (TtBannerAd.isRealtime) {
            TtBannerAd.load();
            TtBannerAd.isLoad = true;
            TtBannerAd.cache.onLoad(function () {
                TtBannerAd.isLoad = false;
                TtBannerAd.cache.show().then(function () {
                }).catch(function () {
                    //失败
                    TtBannerAd.cache.show();
                });
            });
        }
        else {
            TtBannerAd.cache.show().then(function () {
                TtBannerAd.errorNum = 0;
                TtBannerAd._setTime && clearInterval(TtBannerAd._setTime);
                TtBannerAd._setTime = setInterval(function () {
                    //
                    console.log('TtBannerAd._alltime', TtBannerAd._alltime);
                    TtBannerAd._alltime++;
                    if (TtBannerAd._alltime >= TtBannerAd.realtime) {
                        TtBannerAd._alltime = 0;
                        TtBannerAd.load();
                        TtBannerAd.isLoad = true;
                        TtBannerAd.cache.onLoad(function () {
                            TtBannerAd.isLoad = false;
                            TtBannerAd.cache.show();
                        });
                    }
                }, 1000);
            }).catch(function (err) {
                TtBannerAd.errorNum++;
                if (TtBannerAd.errorNum > 3) {
                    return;
                }
                else {
                    TtBannerAd.show();
                    console.log("广告组件出现问题", err);
                }
            });
        }
    };
    //延时关闭banner广告
    TtBannerAd.delteHide = function () {
        var _this = this;
        Laya.timer.once(1000, this, function () {
            if (TtBannerAd.isLoad) {
                _this.delteHide();
            }
            else {
                TtBannerAd.hide();
            }
        });
    };
    TtBannerAd.hide = function () {
        if (this.isLoad) {
            //正在加载广告还没显示
            TtBannerAd.delteHide();
        }
        else {
            TtBannerAd._setTime && clearInterval(TtBannerAd._setTime);
            if (TtBannerAd.cache)
                TtBannerAd.cache.hide();
        }
    };
    //广告实例
    TtBannerAd.cache = null;
    //手动控制刷新时间时间
    TtBannerAd.realtime = 30;
    TtBannerAd._alltime = 0;
    TtBannerAd._setTime = null; //定时器
    //广告自动刷新的间隔时间
    TtBannerAd.adIntervals = 30;
    //是否时时刷新
    TtBannerAd.isRealtime = false;
    //布局样式缓存(上一次show时的样式)
    TtBannerAd.styleCache = {};
    TtBannerAd.errorNum = 0;
    TtBannerAd.isLoad = false; //banner广告正在加载（正在加载调用hide会导致广告没有关闭，因为加载广告会有延迟）
    return TtBannerAd;
}());
exports.default = TtBannerAd;
