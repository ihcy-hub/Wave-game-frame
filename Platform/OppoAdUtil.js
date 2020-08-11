"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PlatformMg_1 = __importDefault(require("./PlatformMg"));
/**
 * oppo 广告
 */
var OppoAdUtil = /** @class */ (function () {
    function OppoAdUtil() {
        this.VIDEO_ID = "";
        this.BANNER_ID = "";
        this.APP_ID = "";
        //banner 是否显示
        this.isShowBanner = false;
        //加载次数
        this.loadTime = 0;
    }
    Object.defineProperty(OppoAdUtil, "Instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new OppoAdUtil();
            }
            return this._instance;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 初始化工具类
     */
    OppoAdUtil.prototype.init = function () {
        if (PlatformMg_1.default.Instance.onOppo) {
            //广告初始化
            this.initAD();
            //激励视频初始化
            this.initVideo();
        }
    };
    OppoAdUtil.prototype.initAD = function () {
        PlatformMg_1.default.Instance.platform.initAdService({
            appId: this.APP_ID,
            isDebug: false,
            success: function (res) {
                console.log("oppo initAD success");
            },
            fail: function (res) {
                console.log("oppo initAD fail:" + res.code + res.msg);
            },
            complete: function (res) {
                console.log("oppo initAD complete");
            }
        });
    };
    OppoAdUtil.prototype.initVideo = function () {
        var _this = this;
        if (!PlatformMg_1.default.Instance.onOppo) {
            return;
        }
        this.videoAd = PlatformMg_1.default.Instance.platform.createRewardedVideoAd({
            posId: this.VIDEO_ID,
        });
        this.videoAd.onLoad(function () {
            _this.loadTime = 0;
            _this.videoAd.show();
        });
        this.videoAd.onVideoStart(function () {
        });
        this.videoAd.onError(function (err) {
            console.log("oppo video onError:", err);
            _this.loadTime++;
            if (_this.loadTime >= 3) {
                _this.loadTime = 0;
                if (_this.adOptions != null && _this.adOptions != undefined && _this.adOptions.error) {
                    _this.adOptions.error();
                }
            }
            else {
                _this.videoAd.load();
            }
        });
        this.videoAd.onClose(function (res) {
            console.log("oppo video onClose:", res.isEnded);
            if (res.isEnded) {
                if (_this.adOptions != null && _this.adOptions != undefined && _this.adOptions.success)
                    _this.adOptions.success();
            }
            else {
                if (_this.adOptions != null && _this.adOptions != undefined && _this.adOptions.fail)
                    _this.adOptions.fail();
            }
        });
    };
    OppoAdUtil.prototype.initBanner = function () {
        var _this = this;
        if (!PlatformMg_1.default.Instance.onOppo) {
            return;
        }
        if (this.isShowBanner) {
            return;
        }
        else {
            this.isShowBanner = true;
            Laya.timer.once(500, this, function () {
                _this.bannerAd = PlatformMg_1.default.Instance.platform.createBannerAd({
                    posId: _this.BANNER_ID
                });
                _this.bannerAd.show();
            });
        }
    };
    /**
     * 播放激励视频
     * @param options 回调方法
     */
    OppoAdUtil.prototype.video = function (options) {
        if (options === void 0) { options = {}; }
        if (!PlatformMg_1.default.Instance.onOppo) {
            return;
        }
        this.adOptions = options;
        this.videoAd.load();
    };
    /**
     * 显示banner广告
     * @param data
     */
    OppoAdUtil.prototype.showBanner = function (data) {
        if (data === void 0) { data = {}; }
        if (!this.isShowBanner) {
            this.initBanner();
        }
    };
    /**
    * 隐藏banner广告
    */
    OppoAdUtil.prototype.hideBanner = function () {
        Laya.timer.clearAll(this);
        if (this.bannerAd != null && this.isShowBanner) {
            this.isShowBanner = false;
            this.bannerAd.destroy();
        }
    };
    return OppoAdUtil;
}());
exports.default = OppoAdUtil;
