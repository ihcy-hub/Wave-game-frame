"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WxAdData = void 0;
var PlatformMg_1 = __importDefault(require("./PlatformMg"));
var WindowUtil_1 = __importDefault(require("../Utils/WindowUtil"));
var TipsUtil_1 = __importDefault(require("../Utils/TipsUtil"));
var AdMg_1 = __importDefault(require("./AdMg"));
var LeadOutMg_1 = __importDefault(require("../Manages/LeadOutMg"));
var WxVideoUtil_1 = __importDefault(require("./Wx/WxVideoUtil"));
var PublicMg_1 = __importDefault(require("../Game/GameMg/PublicMg"));
var WxBannerAd_1 = __importDefault(require("./Wx/WxBannerAd"));
var WxBannerAd2_1 = __importDefault(require("./Wx/WxBannerAd2"));
var WxAdUtil = /** @class */ (function () {
    function WxAdUtil() {
        //是否加载完成
        this.hadLoad = false;
        //单次banner显示刷新时间
        this.showTime = 10000;
        //最大加载次数
        this.MaxLoadTime = 3;
        //微信广告信息
        this.platformData = null;
        //展示的类型
        this.showType = 0;
        //是否正在展示banner
        this.isShow = false;
        //微信广告banner 高度
        this.realHeight = 0;
        this.top = 0;
        //激励视频是否成功标识
        this.initVideoSuccess = false;
        this.startTime = 0;
    }
    Object.defineProperty(WxAdUtil, "Instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new WxAdUtil();
            }
            return this._instance;
        },
        enumerable: false,
        configurable: true
    });
    WxAdUtil.prototype.init = function () {
        //根据平台使用不同数据
        if (PlatformMg_1.default.Instance.onWx) {
            this.platformData = WxAdData;
            console.log('微信广告', this.platformData);
            if (WxAdData.videoIds.length > 0)
                WxVideoUtil_1.default.Instance.initRewardedVideoAd({ adUnitId: WxAdData.videoIds });
            this.initShare();
            //this.initBanner();
            WxBannerAd_1.default.init({ adUnitId: WxAdData.bannerId, interval: 45, timerStatus: true, style: { width: 600, styleMode: "center-bottom" } });
            WxBannerAd2_1.default.init({ adUnitId: WxAdData.bannerId, interval: 45, timerStatus: true });
        }
    };
    WxAdUtil.prototype.showBanner = function (data) {
        if (!PlatformMg_1.default.Instance.onWx || !this.platformData.bannerId) {
            return;
        }
        if (data && data.type && data.dialog) {
            this.showType = data.type;
            this.showBannerDialog = data.dialog;
            this.isShow = true;
            if (this.showType == 1) {
                if (this.hadLoad && this.bannerAD) {
                    this.showBannerWithRefresh(this.bannerAD);
                }
                else {
                    if (this.showBannerDialog && LeadOutMg_1.default.checkBannerGameList) {
                        // this.leadOut5Spr = new BannerDefaultSprite(this.showType);
                        // this.showBannerDialog.addChild(this.leadOut5Spr);
                    }
                }
            }
            else {
                if (this.startBannerAD && this.startBannerAD) {
                    this.showBannerWithRefresh(this.startBannerAD);
                }
                else {
                    if (this.showBannerDialog && LeadOutMg_1.default.checkBannerGameList) {
                        // this.leadOut5Spr = new BannerDefaultSprite(this.showType);
                        // this.showBannerDialog.addChild(this.leadOut5Spr);
                    }
                }
            }
        }
        else {
            console.error("showBanner 参数不正确");
        }
    };
    WxAdUtil.prototype.hideBanner = function () {
        if (!PlatformMg_1.default.Instance.onWx) {
            return;
        }
        this.isShow = false;
        this.showType = 0;
        this.showBannerDialog = null;
        if (this.bannerAD) {
            this.bannerAD.hide();
        }
        if (this.startBannerAD) {
            this.startBannerAD.hide();
        }
        Laya.timer.clearAll(this);
    };
    WxAdUtil.prototype.showBannerWithRefresh = function (banner) {
        var _this = this;
        if (!PlatformMg_1.default.Instance.onWx) {
            return;
        }
        banner.show();
        // if (this.leadOut5Spr) {
        //     this.leadOut5Spr.visible = false;
        //     this.leadOut5Spr.removeSelf();
        // }
        Laya.timer.clearAll(this);
        //刷新时间
        Laya.timer.loop(this.showTime, this, function () {
            _this.initBanner(0);
        });
    };
    /**
     * 初始化
     * @param loadTime
     */
    WxAdUtil.prototype.initBanner = function (loadTime) {
        var _this = this;
        if (loadTime === void 0) { loadTime = 0; }
        if (!PlatformMg_1.default.Instance.onWx || !this.platformData.bannerId) {
            return;
        }
        loadTime++;
        var bannerObj;
        bannerObj = {
            adUnitId: this.platformData.bannerId,
            style: {
                left: 0,
                top: WindowUtil_1.default.gameHeight - 300,
                width: 750
            },
            adIntervals: 300
        };
        if (!bannerObj) {
            console.log("wx initBanner bannerObj=null");
            return;
        }
        var banner = PlatformMg_1.default.Instance.platform.createBannerAd(bannerObj);
        banner.onError(function (err) {
            if (loadTime < _this.MaxLoadTime) {
                _this.initBanner(loadTime);
            }
            else {
                if (_this.isShow) {
                    if (_this.bannerAD) {
                        // ADUtil.showBannerWithRefresh(ADUtil.bannerAD, type);
                    }
                    else {
                        _this.hadLoad = false;
                        // this.leadOut5Spr = new LeadOut5RunTime(this.showType);
                        // this.showBannerDialog.addChild(this.leadOut5Spr);
                    }
                }
                else {
                    _this.hadLoad = false;
                }
            }
        });
        banner.onLoad(function () {
            loadTime = 0;
            _this.hadLoad = true;
            if (_this.bannerAD) {
                _this.bannerAD.hide();
                _this.bannerAD.destroy();
                _this.bannerAD = null;
            }
            _this.bannerAD = banner;
            if (WindowUtil_1.default.isIphoneX) {
                _this.bannerAD.style.top = PlatformMg_1.default.Instance.platform.getSystemInfoSync().screenHeight - _this.bannerAD.style.realHeight - (50 / WindowUtil_1.default.clientScale);
            }
            else {
                _this.bannerAD.style.top = PlatformMg_1.default.Instance.platform.getSystemInfoSync().screenHeight - _this.bannerAD.style.realHeight;
            }
            if (_this.isShow && _this.showType == 1) {
                _this.showBannerWithRefresh(_this.bannerAD);
            }
        });
        banner.onResize(function () {
            AdMg_1.default.Instance.setADMidleY(banner);
        });
    };
    //分享初始化
    WxAdUtil.prototype.initShare = function () {
        var _this = this;
        if (PlatformMg_1.default.Instance.isWx) {
            PlatformMg_1.default.Instance.platform.showShareMenu({
                withShareTicket: true,
            });
        }
        PlatformMg_1.default.Instance.platform.onShareAppMessage(function () {
            if (PlatformMg_1.default.Instance.onWx) {
                var id = Math.floor(Math.random() * _this.platformData.ShareData.length);
                return {
                    title: _this.platformData.ShareData[id].title,
                    imageUrlId: _this.platformData.ShareData[id].id,
                    imageUrl: _this.platformData.ShareData[id].url,
                };
            }
        });
    };
    /**播放视频 */
    WxAdUtil.prototype.video = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        WxVideoUtil_1.default.Instance.showRewardedVideoAd({
            complete: function () {
                options.complete && options.complete();
            },
            success: function () { options.success && options.success(); },
            fail: function () {
                if (options.fail) {
                    options.fail();
                }
                else {
                    TipsUtil_1.default.msg('观看完整视频才能获得奖励哦');
                }
            },
            error: function () {
                _this.share(options);
                // if(options.error){options.error()}else{
                //     TipsUtil.msg('暂时没有可以播放的视频！')
                // }
            },
        });
    };
    WxAdUtil.prototype.share = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (!PlatformMg_1.default.Instance.onWx) {
            options && options.success && options.success();
            return;
        }
        if (WxAdData.ShareData.length > 0) {
            var id = Math.floor(Math.random() * WxAdData.ShareData.length);
            var obj = {};
            obj.title = WxAdData.ShareData[id].title;
            obj.imageUrlId = WxAdData.ShareData[id].id;
            obj.imageUrl = WxAdData.ShareData[id].url;
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
    return WxAdUtil;
}());
exports.default = WxAdUtil;
var WxAdData = /** @class */ (function () {
    function WxAdData() {
    }
    WxAdData.videoIds = ["adunit-3f9360504a5d034e"];
    WxAdData.bannerId = "adunit-9c84c16c26846475";
    WxAdData.ShareTxt = ["愣着干什么，英雄救美啊！", "僵尸也是跟踪狂？ ", "有熊出没怎么办？ "];
    WxAdData.ShareData = [
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
    return WxAdData;
}());
exports.WxAdData = WxAdData;
