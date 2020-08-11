"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OppoNativeAdBean = void 0;
var TipsUtil_1 = __importDefault(require("../Utils/TipsUtil"));
var SoundUtil_1 = __importDefault(require("../Utils/SoundUtil"));
var PlatformMg_1 = __importDefault(require("./PlatformMg"));
var ActivityUrls_1 = __importDefault(require("../Data/ActivityUrls"));
var VivoADUtil = /** @class */ (function () {
    function VivoADUtil() {
    }
    VivoADUtil.init = function () {
        VivoADUtil.initVideo();
        VivoADUtil.initBanner();
        //VivoADUtil.initInterstitial();
        VivoADUtil.InitNative();
    };
    VivoADUtil.initVideo = function () {
        var _this = this;
        VivoADUtil.videoAd = qg.createRewardedVideoAd({
            posId: VivoADUtil.VIVO_VIDEO_ID2[VivoADUtil.videoAdNum],
        });
        VivoADUtil.videoAd.onLoad(function () {
            VivoADUtil.hadLoaded = true;
        });
        VivoADUtil.videoAd.onError(function (err) {
            TipsUtil_1.default.msg("视频冷却中,请稍后再试...");
            VivoADUtil.hadLoaded = false;
            //SoundUtil.playBgm();
            SoundUtil_1.default.RestAll();
            if (VivoADUtil.adOptions != null && VivoADUtil.adOptions != undefined && VivoADUtil.adOptions.fail) {
                VivoADUtil.adOptions.fail();
            }
            if (Laya.timer.currTimer - VivoADUtil.videoTime > 60 * 1000) {
                //视频其他原因加载错误，换一个AD重新加载
                VivoADUtil.videoTime = Laya.timer.currTimer;
                VivoADUtil.videoAdNum++;
                if (VivoADUtil.videoAdNum >= VivoADUtil.VIVO_VIDEO_ID2.length) {
                    VivoADUtil.videoAdNum = 0;
                }
                VivoADUtil.videoAd = qg.createRewardedVideoAd({
                    posId: VivoADUtil.VIVO_VIDEO_ID2[VivoADUtil.videoAdNum],
                });
            }
            else {
                Laya.timer.once(60 * 1000, _this, function () {
                    VivoADUtil.videoAd.load();
                });
            }
        });
        VivoADUtil.videoAd.onClose(function (res) {
            VivoADUtil.videoTime = Laya.timer.currTimer;
            VivoADUtil.hadLoaded = false;
            //SoundUtil.playBgm();
            SoundUtil_1.default.RestAll();
            if (res.isEnded) {
                if (VivoADUtil.adOptions != null && VivoADUtil.adOptions != undefined && VivoADUtil.adOptions.success)
                    VivoADUtil.adOptions.success();
            }
            else {
                if (VivoADUtil.adOptions != null && VivoADUtil.adOptions != undefined && VivoADUtil.adOptions.fail)
                    VivoADUtil.adOptions.fail();
            }
            Laya.timer.once(60 * 1000, _this, function () {
                VivoADUtil.videoAd.load();
            });
        });
    };
    VivoADUtil.video = function (options) {
        if (options === void 0) { options = {}; }
        VivoADUtil.adOptions = options;
        if (VivoADUtil.hadLoaded) {
            VivoADUtil.videoAd.show();
            //SoundUtil.stopMusic();
            SoundUtil_1.default.StopAll();
        }
        else {
            TipsUtil_1.default.msg("视频冷却中,请稍后再试...");
            if (VivoADUtil.adOptions != null && VivoADUtil.adOptions != undefined && VivoADUtil.adOptions.fail) {
                VivoADUtil.adOptions.fail();
            }
        }
    };
    VivoADUtil.initBanner = function () {
        var _this = this;
        // style: {}  不设置任何属性，则是底部居中  不设置style：顶部居中
        VivoADUtil.bannerNum++;
        if (VivoADUtil.bannerNum >= VivoADUtil.VIVO_BANNER_ID2.length) {
            VivoADUtil.bannerNum = 0;
        }
        VivoADUtil.bannerAd = qg.createBannerAd({
            posId: VivoADUtil.VIVO_BANNER_ID2[VivoADUtil.bannerNum],
            style: {}
        });
        VivoADUtil.bannerAd.onLoad(function () {
            if (VivoADUtil.bannerAd != null) {
                //VivoADUtil.bannerAd.show();
            }
        });
        VivoADUtil.bannerAd.onClose(function (res) {
            Laya.timer.once(20000, _this, function () {
                VivoADUtil.initBanner();
            });
        });
        VivoADUtil.bannerAd.onError(function (err) {
            // TipsUtil.msg('banner初始失败'+err.errCode,{time:1500},()=>{
            //     TipsUtil.msg(JSON.stringify(err),{time:10000})
            // })
            console.log('banner加载失败', err);
            Laya.timer.once(20000, _this, function () {
                VivoADUtil.initBanner();
            });
        });
    };
    VivoADUtil.showBanner = function () {
        if (VivoADUtil.bannerAd) {
            VivoADUtil.bannerAd.show();
        }
        else {
            this.initBanner();
            VivoADUtil.bannerAd.onLoad(function () {
                if (VivoADUtil.bannerAd != null) {
                    VivoADUtil.bannerAd.show();
                }
            });
        }
    };
    VivoADUtil.hideBanner = function () {
        if (VivoADUtil.bannerAd)
            VivoADUtil.bannerAd.hide();
    };
    /**插屏广告 */
    VivoADUtil.initInterstitial = function () {
        var _this = this;
        VivoADUtil.InterstitialAd = PlatformMg_1.default.Instance.platform.createInterstitialAd({
            posId: VivoADUtil.VIVO_Interstitial_ID
        });
        //加载完成
        VivoADUtil.InterstitialAd.onLoad(function () {
            //platform.msg('插屏广告加载完成')
            VivoADUtil.InterstitialLoaded = true;
        });
        //加载错误
        VivoADUtil.InterstitialAd.onError(function (data) {
            VivoADUtil.InterstitialLoaded = false;
            Laya.timer.once(10000, _this, function () {
                VivoADUtil.initInterstitial();
            });
        });
        //关闭
        VivoADUtil.InterstitialAd.onClose(function () {
            VivoADUtil.InterstitialLoaded = false;
            Laya.timer.once(10000, _this, function () {
                VivoADUtil.initInterstitial();
            });
        });
    };
    /**显示插屏 */
    VivoADUtil.showInterstitial = function () {
        var _this = this;
        if (VivoADUtil.InterstitialLoaded && VivoADUtil.InterstitialAd != null) {
            var adshow = VivoADUtil.InterstitialAd.show();
            adshow && adshow.then(function () {
                //TipsUtil.msg("插屏广告展示成功");
            }).catch(function (err) {
                Laya.timer.once(10000, _this, function () {
                    VivoADUtil.initInterstitial();
                });
                //TipsUtil.msg(err.code)
            });
        }
    };
    /**初始化原生广告 */
    VivoADUtil.InitNative = function () {
        var _this = this;
        var qg = Laya.Browser.window.qg;
        if (VivoADUtil.Native_ID.length <= 0)
            return;
        VivoADUtil.NativeNum++;
        if (VivoADUtil.NativeNum >= VivoADUtil.Native_ID.length) {
            VivoADUtil.NativeNum = 0;
        }
        //移除监听
        if (VivoADUtil.NativeAd) {
            VivoADUtil.NativeAd.offLoad();
            VivoADUtil.NativeAd.offError();
        }
        VivoADUtil.NativeAd = qg.createNativeAd({
            adUnitId: VivoADUtil.Native_ID[VivoADUtil.NativeNum]
        });
        //加载
        Laya.timer.once(200, this, function () {
            VivoADUtil.NativeAd.load();
        });
        //加载成功
        VivoADUtil.NativeAd.onLoad(function (res) {
            VivoADUtil.NativeLoad = true;
            var list = res.adList;
            _this.nativeList = [];
            //TipsUtil.msg('原生广告长度:'+list.length)
            for (var i = 0; i < list.length; i++) {
                var bean = list[i];
                var nativeBean = new OppoNativeAdBean();
                nativeBean.adId = bean.adId;
                nativeBean.clickBtnTxt = bean.clickBtnTxt;
                nativeBean.creativeType = bean.creativeType;
                nativeBean.desc = bean.desc;
                nativeBean.icon = bean.icon;
                nativeBean.imgUrlList = bean.imgUrlList;
                nativeBean.interactionType = bean.interactionType;
                nativeBean.logoUrl = bean.logoUrl;
                nativeBean.title = bean.title;
                _this.nativeList.push(nativeBean);
            }
            // for(let p in this.nativeList[0]){//遍历json对象的每个key/value对,p为key
            //     console.log('原生广告'+ p + " " + this.nativeList[0][p]);
            //  }
        });
        //加载失败
        VivoADUtil.NativeAd.onError(function (err) {
            TipsUtil_1.default.msg('原生广告加载失败', err);
            VivoADUtil.NativeLoad = false;
            _this.InitNative();
        });
    };
    /**显示原生广告弹窗 */
    VivoADUtil.showNative = function () {
        //return
        if (PlatformMg_1.default.Instance.isVivo && VivoADUtil.NativeLoad) {
            Laya.Dialog.open(ActivityUrls_1.default.NativeDIALOG, false, function () { });
        }
    };
    /**上报原生广告显示 */
    VivoADUtil.ReportAdShow = function () {
        if (PlatformMg_1.default.Instance.isVivo) {
            VivoADUtil.NativeAd.reportAdShow({
                adId: VivoADUtil.nativeList[0].adId.toString()
            });
        }
    };
    /**从新加载原生广告 */
    VivoADUtil.RestNativeInit = function () {
        if (PlatformMg_1.default.Instance.isVivo) {
            //VivoADUtil.NativeAd.load();
            VivoADUtil.InitNative();
        }
    };
    /**上报点击 */
    VivoADUtil.ReportAdClick = function () {
        if (PlatformMg_1.default.Instance.isVivo) {
            VivoADUtil.NativeAd.reportAdClick({
                adId: VivoADUtil.nativeList[0].adId.toString()
            });
        }
    };
    VivoADUtil.VIVO_VIDEO_ID = "e1ef22a3e3cb4ab587bb2b3fe5bde351";
    VivoADUtil.VIVO_VIDEO_ID2 = ["e1ef22a3e3cb4ab587bb2b3fe5bde351", "e1ef22a3e3cb4ab587bb2b3fe5bde351"];
    VivoADUtil.VIVO_BANNER_ID = "4dc4bc6604af4c2b9cd41520ac516639";
    VivoADUtil.VIVO_BANNER_ID2 = ["4dc4bc6604af4c2b9cd41520ac516639", "4dc4bc6604af4c2b9cd41520ac516639"];
    VivoADUtil.VIVO_Interstitial_ID = "";
    /**原生 */
    VivoADUtil.Native_ID = ['e8a8eebd8c5147ac9782dd7ac92526de', 'e8a8eebd8c5147ac9782dd7ac92526de'];
    VivoADUtil.videoAdNum = 0; //视频ad引用序号多个视频ad时用
    VivoADUtil.videoTime = 0; //最后一次播放完视频的时间
    VivoADUtil.bannerNum = 0; //banner ad引用序号多个视频ad时用
    VivoADUtil.NativeNum = 0; //原生加载AppId序号
    VivoADUtil.hadLoaded = false;
    VivoADUtil.isFrist = true;
    //插屏广告加载是否成功
    VivoADUtil.InterstitialLoaded = false;
    VivoADUtil.NativeLoad = false; //原生广告是否加载完成
    VivoADUtil.nativeList = [];
    return VivoADUtil;
}());
exports.default = VivoADUtil;
var OppoNativeAdBean = /** @class */ (function () {
    function OppoNativeAdBean() {
    }
    OppoNativeAdBean.prototype.toString = function () {
        return "adId=" + this.adId +
            "\ntitle=" + this.title +
            "\ndesc=" + this.desc +
            "\nicon=" + this.icon +
            "\nlogoUrl=" + this.logoUrl +
            "\nclickBtnTxt=" + this.clickBtnTxt +
            "\ncreativeType=" + this.creativeType +
            "\ninteractionType=" + this.interactionType +
            "\nimgUrlList=" + this.imgUrlList;
    };
    return OppoNativeAdBean;
}());
exports.OppoNativeAdBean = OppoNativeAdBean;
