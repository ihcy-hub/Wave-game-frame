"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QqAdData = void 0;
var WindowUtil_1 = __importDefault(require("../Utils/WindowUtil"));
var PlatformMg_1 = __importDefault(require("./PlatformMg"));
var AdMg_1 = __importDefault(require("./AdMg"));
var qqBox_1 = __importDefault(require("./Qq/qqBox"));
var PublicMg_1 = __importDefault(require("../Game/GameMg/PublicMg"));
var QqVideoUtil_1 = __importDefault(require("./Qq/QqVideoUtil"));
var TipsUtil_1 = __importDefault(require("../Utils/TipsUtil"));
var QqBannerAd_1 = __importDefault(require("./Qq/QqBannerAd"));
var QqAdUtil = /** @class */ (function () {
    function QqAdUtil() {
        //最大加载次数
        this.MaxLoadTime = 3;
        //广告banner 高度
        this.realHeight = 0;
        this.top = 0;
        //激励视频是否成功标识
        this.initVideoSuccess = false;
        this.startTime = 0;
        this.isShowInterstitialSuccess = false;
    }
    Object.defineProperty(QqAdUtil, "Instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new QqAdUtil();
            }
            return this._instance;
        },
        enumerable: false,
        configurable: true
    });
    QqAdUtil.prototype.init = function () {
        this.platformData = new QqAdData();
        QqVideoUtil_1.default.Instance.initRewardedVideoAd({ adUnitId: this.platformData.videoIds });
        //根据平台使用不同数据
        this.initShare();
        console.log("QqAdUtil--->initShare finish");
        //this.initBanner(0);
        QqBannerAd_1.default.init({ adUnitId: this.platformData.bannerId, interval: 30, timerStatus: true, delayNum: 1000 });
        //WxBannerAd.init({ adUnitId: this.platformData.bannerId, interval: 20, timerStatus: true})
        console.log("QqAdUtil--->initBanner finish");
        qqBox_1.default.init({
            realTime: true
        });
        console.log("QqAdUtil--->initQQBox finish");
    };
    QqAdUtil.prototype.initBanner = function (loadTime) {
        var _this = this;
        if (loadTime === void 0) { loadTime = 0; }
        loadTime++;
        var bannerObj;
        bannerObj = {
            adUnitId: this.platformData.bannerId,
            style: {
                left: 0,
                top: (WindowUtil_1.default.gameHeight - 300) / WindowUtil_1.default.clientScale,
                width: 750 / WindowUtil_1.default.clientScale
            },
            adIntervals: 300
        };
        if (!bannerObj) {
            console.log("qq initBanner bannerObj=null");
            return;
        }
        var banner = PlatformMg_1.default.Instance.platform.createBannerAd(bannerObj);
        banner.onError(function (err) {
            if (loadTime < _this.MaxLoadTime) {
                _this.initBanner(loadTime);
            }
            else {
                console.log("banner 加载失败");
            }
        });
        banner.onLoad(function () {
            loadTime = 0;
            _this.bannerAD = banner;
            if (WindowUtil_1.default.isIphoneX) {
                _this.bannerAD.style.top = PlatformMg_1.default.Instance.platform.getSystemInfoSync().screenHeight - _this.bannerAD.style.realHeight - (50 / WindowUtil_1.default.clientScale);
            }
            else {
                _this.bannerAD.style.top = PlatformMg_1.default.Instance.platform.getSystemInfoSync().screenHeight - _this.bannerAD.style.realHeight;
            }
            AdMg_1.default.Instance.setADMidleY(_this.bannerAD.style);
            console.log("banner load success");
        });
        // banner.onResize(() => {
        // })
    };
    //分享初始化
    QqAdUtil.prototype.initShare = function () {
        var _this = this;
        if (PlatformMg_1.default.Instance.onQq) {
            PlatformMg_1.default.Instance.platform.showShareMenu({
                withShareTicket: true,
            });
        }
        if (this.platformData.shareData && this.platformData.shareData.length > 0) {
            PlatformMg_1.default.Instance.platform.onShareAppMessage(function () {
                var id = Math.floor(Math.random() * _this.platformData.shareData.length);
                return {
                    title: _this.platformData.shareData[id].title,
                    imageUrlId: _this.platformData.shareData[id].id,
                    imageUrl: _this.platformData.shareData[id].url,
                };
            });
        }
    };
    QqAdUtil.prototype.showBanner = function (data) {
        if (data === void 0) { data = {}; }
        QqBannerAd_1.default.show();
    };
    QqAdUtil.prototype.hideBanner = function () {
        QqBannerAd_1.default.hide();
    };
    /**播放视频 */
    QqAdUtil.prototype.video = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        QqVideoUtil_1.default.Instance.showRewardedVideoAd({
            success: function () { options.success && options.success(); },
            fail: function () {
                options.fail ? options.fail() : TipsUtil_1.default.msg('观看完整视频才能获得奖励哦');
            },
            error: function () {
                _this.share(options);
            },
        });
    };
    QqAdUtil.prototype.share = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (!PlatformMg_1.default.Instance.isQq) {
            options && options.success && options.success();
            return;
        }
        if (this.platformData.shareData.length > 0) {
            var id = Math.floor(Math.random() * this.platformData.shareData.length);
            var obj = {};
            obj.title = this.platformData.shareData[id].title;
            obj.imageUrlId = this.platformData.shareData[id].id;
            obj.imageUrl = this.platformData.shareData[id].url;
            PlatformMg_1.default.Instance.platform.shareAppMessage(obj);
            this.startTime = new Date().getTime();
            PlatformMg_1.default.Instance.platform.onShow(function () {
                var time = new Date().getTime();
                var offTime = time - _this.startTime;
                if (offTime >= 3000) {
                    options.success && options.success();
                }
                else {
                    options.fail && options.fail();
                }
                PlatformMg_1.default.Instance.platform.offShow();
                PublicMg_1.default.Instance.onShow();
            });
        }
        else {
            var obj = {};
            obj.imageUrl = "images/share.jpg";
            PlatformMg_1.default.Instance.platform.shareAppMessage(obj);
            this.startTime = new Date().getTime();
            PlatformMg_1.default.Instance.platform.onShow(function () {
                var time = new Date().getTime();
                var offTime = time - _this.startTime;
                if (offTime >= 3000) {
                    options.success && options.success();
                }
                else {
                    options.fail && options.fail();
                }
                PlatformMg_1.default.Instance.platform.offShow();
                PublicMg_1.default.Instance.onShow();
            });
        }
    };
    QqAdUtil.prototype.initInterstitialAd = function (isShow) {
        var _this = this;
        if (isShow === void 0) { isShow = false; }
        console.log("initInterstitialAd");
        if (this.interstitialAd) {
            this.interstitialAd.show().then(function () {
                console.log("插屏广告显示成功1");
                _this.isShowInterstitialSuccess = true;
            }).catch(function (res) {
                console.log("插屏广告显示失败1");
                if (!_this.isShowInterstitialSuccess) {
                    _this.adOptions && _this.adOptions.fail && _this.adOptions.fail();
                    _this.adOptions = null;
                }
            });
        }
        else {
            this.interstitialAd = PlatformMg_1.default.Instance.platform.createInterstitialAd({
                adUnitId: this.platformData.interstitialId
            });
            this.interstitialAd.onLoad(function () {
                if (isShow) {
                    _this.interstitialAd.show().then(function () {
                        console.log("插屏广告显示成功2");
                        _this.isShowInterstitialSuccess = true;
                    }).catch(function (res) {
                        console.log("插屏广告显示失败2");
                        if (!_this.isShowInterstitialSuccess) {
                            _this.adOptions && _this.adOptions.fail && _this.adOptions.fail();
                            _this.adOptions = null;
                        }
                    });
                }
            });
            // this.interstitialAd.onError(() => {
            //     console.log("插屏广告显示失败3");
            //     if (!this.isShowInterstitialSuccess) {
            //         this.adOptions && this.adOptions.fail && this.adOptions.fail();
            //         this.adOptions = null;
            //     }
            // });
        }
    };
    QqAdUtil.prototype.showInterstitialAd = function (options) {
        if (!PlatformMg_1.default.Instance.onQq) {
            return;
        }
        this.adOptions = options;
        /**
         * QQ插屏广告必须加这个判断，低版本QQ没有插屏广告，初始化的时候会直接报错
         */
        if (PlatformMg_1.default.Instance.platform && PlatformMg_1.default.Instance.platform.createInterstitialAd) {
            this.isShowInterstitialSuccess = false;
            this.initInterstitialAd(true);
        }
        else {
            console.log("未找到 createInterstitialAd 方法");
            this.adOptions && this.adOptions.fail && this.adOptions.fail();
        }
    };
    QqAdUtil.StartDialogShowAdTime = 2250;
    return QqAdUtil;
}());
exports.default = QqAdUtil;
var QqAdData = /** @class */ (function () {
    function QqAdData() {
        this.appid = "1110320198";
        this.videoIds = ["97ed53f682d660664cdfafd18ea5c3d3"];
        this.bannerId = "6d7cb80f6c54b1704ebb413c06f69ace";
        this.interstitialId = ""; //37d949bc5d2c02824af927711af76b77
        this.shareTxt = ["愣着干什么，英雄救美啊"];
        this.shareData = [
            {
                title: "愣着干什么，英雄救美啊！",
                url: "https://mmocgame.qpic.cn/wechatgame/ibAmOA1G8lHvJPgLseYwHY2DHSTYs0zdCXZTqg4sIudtxo0kBHVibzq0hAxgkPibfFL/0",
                id: "7BlYgYB9TvqhCFoZi5pf0A=="
            },
            {
                title: "僵尸也是跟踪狂？",
                url: "https://mmocgame.qpic.cn/wechatgame/ibAmOA1G8lHs3JpLFIzj47He83icziaM9Gbk2HCo2aibucaic66LXCOlIQs8hBAuVOvN5/0",
                id: "P+8A+eRlQ4imAKCiunPcEg=="
            },
            {
                title: "有熊出没怎么办？",
                url: "https://mmocgame.qpic.cn/wechatgame/ibAmOA1G8lHuISXvvliaXosYvwSosNvfoXpvrMf6SeUaaNrllf4ibiaYzXbsUBhVvAKz/0",
                id: "P+8A+eRlQ4imAKCiunPcEg=="
            }
        ];
    }
    return QqAdData;
}());
exports.QqAdData = QqAdData;
