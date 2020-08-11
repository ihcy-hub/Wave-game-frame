"use strict";
//import MoreProxy from "../../proxy/MoreProxy";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var TipsUtil_1 = __importDefault(require("../Utils/TipsUtil"));
var DebugPlatform = /** @class */ (function () {
    function DebugPlatform() {
        //[扩展功能] BannerAd
        this.bannerAdCache = null;
        //[扩展功能] RewardedVideoAd
        this.rewardedVideoAdCache = null;
        this.RewardedVideoError = null;
        this.RewardedVideoFail = null;
        this.RewardedVideoSuccess = null;
        //+----------------------------------------------------------------------------------------------------
        //| 开放数据域
        //+----------------------------------------------------------------------------------------------------
        this.openDataContext = new DebugOpenDataContext();
    }
    //+----------------------------------------------------------------------------------------------------
    //| 系统
    //+----------------------------------------------------------------------------------------------------
    //生命周期
    DebugPlatform.prototype.exitMiniProgram = function (obj) { };
    ;
    DebugPlatform.prototype.getLaunchOptionsSync = function () { return { query: {}, scene: 1103 }; };
    ;
    DebugPlatform.prototype.onShow = function (callback) { };
    ;
    DebugPlatform.prototype.onHide = function (callback) { };
    ;
    DebugPlatform.prototype.offShow = function (callback) { };
    ;
    DebugPlatform.prototype.offHide = function (callback) { };
    ;
    //系统信息
    DebugPlatform.prototype.getSystemInfo = function (obj) { };
    ;
    DebugPlatform.prototype.getSystemInfoSync = function () { };
    ;
    //触摸事件
    DebugPlatform.prototype.onTouchStart = function (callback) { };
    ;
    DebugPlatform.prototype.onTouchMove = function (callback) { };
    ;
    DebugPlatform.prototype.onTouchEnd = function (callback) { };
    ;
    DebugPlatform.prototype.onTouchCancel = function (callback) { };
    ;
    DebugPlatform.prototype.offTouchStart = function (callback) { };
    ;
    DebugPlatform.prototype.offTouchMove = function (callback) { };
    ;
    DebugPlatform.prototype.offTouchEnd = function (callback) { };
    ;
    DebugPlatform.prototype.offTouchCancel = function (callback) { };
    ;
    //定时器
    DebugPlatform.prototype.setTimeout = function (callback, delay) { return 1; };
    ;
    DebugPlatform.prototype.clearTimeout = function (handler) { };
    ;
    DebugPlatform.prototype.setInterval = function (callback, delay) { return 2; };
    ;
    DebugPlatform.prototype.clearInterval = function (handler) { };
    ;
    //系统事件
    DebugPlatform.prototype.onAudioInterruptionBegin = function (callback) { };
    ;
    DebugPlatform.prototype.offAudioInterruptionBegin = function (callback) { };
    ;
    DebugPlatform.prototype.onAudioInterruptionEnd = function (callback) { };
    ;
    DebugPlatform.prototype.offAudioInterruptionEnd = function (callback) { };
    ;
    DebugPlatform.prototype.onError = function (callback) { };
    ;
    DebugPlatform.prototype.offError = function (callback) { };
    ;
    //+----------------------------------------------------------------------------------------------------
    //| 界面
    //+----------------------------------------------------------------------------------------------------
    //交互
    DebugPlatform.prototype.showToast = function (obj) { };
    ;
    DebugPlatform.prototype.showModal = function (obj) { };
    ;
    DebugPlatform.prototype.showActionSheet = function (obj) { };
    ;
    DebugPlatform.prototype.hideToast = function (obj) { };
    ;
    DebugPlatform.prototype.showLoading = function (obj) { TipsUtil_1.default.showLoading(); };
    ;
    DebugPlatform.prototype.hideLoading = function (obj) { TipsUtil_1.default.hideLoading(); };
    ;
    //[扩展功能] 提示框 msg
    DebugPlatform.prototype.msg = function (content, options, end) { TipsUtil_1.default.msg(content, options, end); };
    ;
    //[扩展功能] 询问框 confirm
    DebugPlatform.prototype.confirm = function (content, options, yes, cancel) { TipsUtil_1.default.confirm(content, options, yes, cancel); };
    ;
    //键盘
    DebugPlatform.prototype.updateKeyboard = function (obj) { };
    ;
    DebugPlatform.prototype.showKeyboard = function (obj) { };
    ;
    DebugPlatform.prototype.hideKeyboard = function (obj) { };
    ;
    DebugPlatform.prototype.onKeyboardInput = function (callback) { };
    ;
    DebugPlatform.prototype.onKeyboardConfirm = function (callback) { };
    ;
    DebugPlatform.prototype.onKeyboardComplete = function (callback) { };
    ;
    DebugPlatform.prototype.offKeyboardInput = function (callback) { };
    ;
    DebugPlatform.prototype.offKeyboardConfirm = function (callback) { };
    ;
    DebugPlatform.prototype.offKeyboardComplete = function (callback) { };
    ;
    //菜单
    DebugPlatform.prototype.setMenuStyle = function (obj) { };
    ;
    DebugPlatform.prototype.getMenuButtonBoundingClientRect = function () { return; };
    ;
    //状态栏
    DebugPlatform.prototype.setStatusBarStyle = function (obj) { };
    ;
    //窗口
    DebugPlatform.prototype.onWindowResize = function (callback) { };
    ;
    DebugPlatform.prototype.offWindowResize = function (callback) { };
    ;
    //+----------------------------------------------------------------------------------------------------
    //| 数据缓存
    //+----------------------------------------------------------------------------------------------------
    //数据缓存
    DebugPlatform.prototype.clearStorage = function (obj) { };
    ;
    DebugPlatform.prototype.clearStorageSync = function () { };
    ;
    DebugPlatform.prototype.getStorageInfo = function (obj) { };
    ;
    DebugPlatform.prototype.getStorageInfoSync = function () { };
    ;
    DebugPlatform.prototype.removeStorage = function (obj) { };
    ;
    DebugPlatform.prototype.removeStorageSync = function (key) { };
    ;
    DebugPlatform.prototype.getStorage = function (obj) { if (obj.key && obj.success)
        obj.success(Laya.LocalStorage.getItem(obj.key)); };
    ;
    DebugPlatform.prototype.getStorageSync = function (key) { return Laya.LocalStorage.getItem(key); };
    ;
    DebugPlatform.prototype.setStorage = function (obj) { Laya.LocalStorage.setItem(obj.key, obj.value); };
    ;
    DebugPlatform.prototype.setStorageSync = function (key, data) { Laya.LocalStorage.setItem(key, data); };
    ;
    //+----------------------------------------------------------------------------------------------------
    //| 转发
    //+----------------------------------------------------------------------------------------------------
    //转发
    DebugPlatform.prototype.updateShareMenu = function (obj) { };
    ;
    DebugPlatform.prototype.showShareMenu = function (obj) { };
    ;
    DebugPlatform.prototype.hideShareMenu = function (obj) { };
    ;
    DebugPlatform.prototype.offShareAppMessage = function (callback) { };
    ;
    DebugPlatform.prototype.onShareAppMessage = function (callback) { };
    ;
    DebugPlatform.prototype.shareAppMessage = function (obj) { };
    ;
    DebugPlatform.prototype.shareVideo = function (obj) { };
    ;
    DebugPlatform.prototype.getShareInfo = function (obj) { };
    ;
    //[扩展功能] share
    DebugPlatform.prototype.initShare = function (obj) { };
    ;
    DebugPlatform.prototype.share = function (obj) { };
    ;
    //+----------------------------------------------------------------------------------------------------
    //| 设备
    //+----------------------------------------------------------------------------------------------------
    //加速度计
    //剪贴板
    //罗盘
    //网络
    DebugPlatform.prototype.getNetworkType = function (obj) { };
    ;
    DebugPlatform.prototype.onNetworkStatusChange = function (callback) { };
    ;
    //屏幕亮度
    //振动
    DebugPlatform.prototype.vibrateLong = function () { };
    ;
    DebugPlatform.prototype.vibrateShort = function () { };
    ;
    //+----------------------------------------------------------------------------------------------------
    //| 数据分析
    //+----------------------------------------------------------------------------------------------------
    //数据上报
    DebugPlatform.prototype.reportAnalytics = function (eventName, data) {
        console.log("[DebugPlatform][数据上报] eventName:", eventName, ", data:", data);
        switch (eventName) {
            case 'navigateToMiniProgram':
                //MoreProxy.click(data);
                break;
            default:
                break;
        }
    };
    ;
    //+----------------------------------------------------------------------------------------------------
    //| 广告
    //+----------------------------------------------------------------------------------------------------
    DebugPlatform.prototype.createBannerAd = function (obj) { return {}; };
    ;
    DebugPlatform.prototype.createRewardedVideoAd = function (obj) { return {}; };
    ;
    DebugPlatform.prototype.initBannerAd = function (obj) {
        if (obj === void 0) { obj = {}; }
        var that = this;
        var box = Laya.stage.addChild(new Laya.Box());
        var txt = box.addChild(new Laya.Label());
        this.rewardedVideoAdCache = box;
        box.zOrder = 1003;
        box.width = obj.width || Laya.stage.width;
        box.height = obj.width ? obj.width / 3 : Laya.stage.width / 3;
        box.top = obj.top || Laya.stage.height - box.height;
        box.left = obj.left || 0;
        txt.text = "Banner广告";
        txt.font = "SimHei";
        txt.align = "center";
        txt.valign = "middle";
        txt.fontSize = 50;
        txt.color = "#ffffff";
        txt.bgColor = "#999999";
        txt.bold = true;
        txt.left = txt.right = txt.top = txt.bottom = 0;
        box.visible = false;
        this.bannerAdCache = box;
    };
    ;
    DebugPlatform.prototype.showBannerAd = function (obj, end) {
        if (obj === void 0) { obj = {}; }
        if (end === void 0) { end = null; }
        var that = this;
        if (this.bannerAdCache === null)
            this.initBannerAd();
        if (obj.delayNum === undefined)
            obj.delayNum = 1000;
        if (obj.delay && obj.delayNum > 0) {
            setTimeout(function () {
                that.bannerAdCache.visible = true;
                if (obj.width)
                    that.bannerAdCache.width = obj.width, that.bannerAdCache.height = obj.width / 3;
                if (obj.left)
                    that.bannerAdCache.left = obj.left;
                if (obj.top)
                    that.bannerAdCache.top = obj.top;
                if (end)
                    end({
                        realWidth: that.bannerAdCache.width,
                        realHeight: that.bannerAdCache.height,
                        width: that.bannerAdCache.width,
                        height: that.bannerAdCache.height,
                        left: that.bannerAdCache.left,
                        top: that.bannerAdCache.top
                    });
            }, obj.delayNum);
        }
        else {
            that.bannerAdCache.visible = true;
            if (obj.width)
                that.bannerAdCache.width = obj.width, that.bannerAdCache.height = obj.width / 3;
            if (obj.left)
                that.bannerAdCache.left = obj.left;
            if (obj.top)
                that.bannerAdCache.top = obj.top;
            if (end)
                end({
                    realWidth: that.bannerAdCache.width,
                    realHeight: that.bannerAdCache.height,
                    width: that.bannerAdCache.width,
                    height: that.bannerAdCache.height,
                    left: that.bannerAdCache.left,
                    top: that.bannerAdCache.top
                });
        }
    };
    ;
    DebugPlatform.prototype.hideBannerAd = function () {
        this.bannerAdCache && (this.bannerAdCache.visible = false);
    };
    ;
    DebugPlatform.prototype.initRewardedVideoAd = function (obj) {
        var _this = this;
        if (obj === void 0) { obj = {}; }
        var that = this;
        var box = Laya.stage.addChild(new Laya.Box());
        var btn1 = box.addChild(new Laya.Button());
        var btn2 = box.addChild(new Laya.Button());
        var btn3 = box.addChild(new Laya.Button());
        this.rewardedVideoAdCache = box;
        box.zOrder = 1002;
        box.width = Laya.stage.width;
        box.height = Laya.stage.height;
        box.graphics.drawRect(0, 0, box.width, box.height, "#aaaaaa");
        btn1.label = "Error";
        btn2.label = "Fail";
        btn3.label = "Success";
        btn1.centerX = btn2.centerX = btn3.centerX = 0;
        btn1.width = btn2.width = btn3.width = 300;
        btn1.height = btn2.height = btn3.height = 100;
        btn1.labelSize = btn2.labelSize = btn3.labelSize = 50;
        btn1.top = 300;
        btn2.top = 450;
        btn3.top = 600;
        btn1.on(Laya.Event.CLICK, this, function () { console.log("[RewardedVideo] Error"); _this.rewardedVideoAdCache.visible = false; if (that.RewardedVideoError)
            that.RewardedVideoError(); });
        btn2.on(Laya.Event.CLICK, this, function () { console.log("[RewardedVideo] Fail"); _this.rewardedVideoAdCache.visible = false; if (that.RewardedVideoFail)
            that.RewardedVideoFail(); });
        btn3.on(Laya.Event.CLICK, this, function () { console.log("[RewardedVideo] Success"); _this.rewardedVideoAdCache.visible = false; if (that.RewardedVideoSuccess)
            that.RewardedVideoSuccess(); });
        box.visible = false;
    };
    ;
    DebugPlatform.prototype.showRewardedVideoAd = function (obj) {
        if (this.rewardedVideoAdCache === null)
            this.initRewardedVideoAd();
        this.RewardedVideoError = obj.error || null;
        this.RewardedVideoFail = obj.fail || null;
        this.RewardedVideoSuccess = obj.success || null;
        this.rewardedVideoAdCache.visible = true;
    };
    ;
    //+----------------------------------------------------------------------------------------------------
    //| 开放接口
    //+----------------------------------------------------------------------------------------------------
    //授权
    DebugPlatform.prototype.authorize = function (obj) { };
    ;
    //防沉迷
    DebugPlatform.prototype.checkIsUserAdvisedToRest = function (obj) { };
    ;
    //客服消息
    DebugPlatform.prototype.openCustomerServiceConversation = function (obj) { };
    ;
    //登录
    DebugPlatform.prototype.login = function (obj) { if (obj.success)
        obj.success({ code: "debug_code" }); };
    ;
    DebugPlatform.prototype.request = function (obj) { };
    ;
    DebugPlatform.prototype.checkSession = function (obj) { };
    ;
    //小游戏跳转
    DebugPlatform.prototype.navigateToMiniProgram = function (obj) {
        TipsUtil_1.default.confirm("即将打开“小程序名称”小程序", { cancelText: "取消", yesText: "允许", }, function () {
            if (obj.success)
                obj.success();
            if (obj.complete)
                obj.complete();
            platform.reportAnalytics("navigateToMiniProgram", { appid: obj.appId, type: 2 });
        }, function () {
            if (obj.fail)
                obj.fail();
            if (obj.complete)
                obj.complete();
            platform.reportAnalytics("navigateToMiniProgram", { appid: obj.appId, type: 3 });
        });
    };
    ;
    //设置
    DebugPlatform.prototype.getSetting = function (obj) { };
    ;
    DebugPlatform.prototype.openSetting = function (obj) { };
    ;
    //用户信息
    DebugPlatform.prototype.getUserInfo = function (obj) { };
    ;
    DebugPlatform.prototype.createUserInfoButton = function (obj) { };
    ;
    return DebugPlatform;
}());
exports.default = DebugPlatform;
var DebugOpenDataContext = /** @class */ (function () {
    function DebugOpenDataContext() {
    }
    DebugOpenDataContext.prototype.createDisplayObject = function (type, width, height) { return new Laya.Sprite(); };
    ;
    DebugOpenDataContext.prototype.postMessage = function (obj) { };
    ;
    return DebugOpenDataContext;
}());
