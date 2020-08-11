"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PlatformMg_1 = __importDefault(require("./PlatformMg"));
var TtBannerAd_1 = __importDefault(require("./Tt/TtBannerAd"));
var TtVideoUtil_1 = __importDefault(require("./Tt/TtVideoUtil"));
var TipsUtil_1 = __importDefault(require("../Utils/TipsUtil"));
var ttShar_1 = __importDefault(require("./Tt/ttShar"));
var recorderMgr_1 = __importDefault(require("./Tt/recorderMgr"));
var TtAdUtil = /** @class */ (function () {
    function TtAdUtil() {
        this.MAX_TIME = 2;
        this.shareId = "cbhrendgpm532970gb";
        this.bannerId = "5em45rin4cr14a2f63";
        this.videoIds = ["h1eb70285c2b80o719"];
        this.game_key = "tt8224f4991d1eb3c3";
        this.videoPath = "";
    }
    Object.defineProperty(TtAdUtil, "Instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new TtAdUtil();
            }
            return this._instance;
        },
        enumerable: false,
        configurable: true
    });
    TtAdUtil.prototype.init = function () {
        //根据平台使用不同数据
        if (PlatformMg_1.default.Instance.isTt) {
            recorderMgr_1.default.init();
            TtBannerAd_1.default.init({ adUnitId: this.bannerId, isRealtime: false, realtime: 60 });
            ttShar_1.default.init();
            PlatformMg_1.default.Instance.platform.createRewardedVideoAd && TtVideoUtil_1.default.Instance.initRewardedVideoAd({ adUnitId: this.videoIds });
        }
    };
    /**显示banner */
    TtAdUtil.prototype.showBanner = function (data) {
        if (data === void 0) { data = {}; }
        TtBannerAd_1.default.show();
    };
    /**隐藏banner */
    TtAdUtil.prototype.hideBanner = function () {
        TtBannerAd_1.default.hide();
    };
    /**播放视频 */
    TtAdUtil.prototype.video = function (options) {
        if (options === void 0) { options = {}; }
        TtVideoUtil_1.default.Instance.showRewardedVideoAd({
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
                if (options.error) {
                    options.error();
                }
                else {
                    TipsUtil_1.default.msg('暂时没有可以播放的视频！');
                }
            },
        });
    };
    return TtAdUtil;
}());
exports.default = TtAdUtil;
