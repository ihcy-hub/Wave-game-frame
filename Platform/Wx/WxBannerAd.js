"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var LeadOut5Spr_1 = __importDefault(require("../LeadOut5Spr"));
/**
 * 微信Banner广告处理类
 * 作者：大树
 * 时间：2019-03-08
 * 开源地址：https://my.oschina.net/17cto/blog/3020025
 *
 * [版本号：v1.0.0]
 * 时间：2018-03-08
 * 封装内容：
 * 1.异常处理
 * 2.添加定时刷新的功能
 * 3.show的结束回调
 * 4.屏幕尺寸与游戏场景尺寸的转化
 *
 * [版本号：v1.0.1]
 * 时间：2018-03-09
 * 1.添加对iphone X底部横条的处理
 * 2.show()操作，添加开启与关闭定时器的功能
 *
 */
var WxBannerAd = /** @class */ (function () {
    //构造函数
    function WxBannerAd() {
    }
    //初始化Banner广告
    WxBannerAd.init = function (obj) {
        if (obj === void 0) { obj = {}; }
        //初始化单位转化
        var wx = Laya.Browser.window.wx;
        var systemInfo = wx.getSystemInfoSync();
        //设备型号
        WxBannerAd.curModel = systemInfo.model;
        console.log('当前设备型号', WxBannerAd.curModel);
        //可使用窗口高度，单位px
        WxBannerAd.windowHeight = systemInfo.windowHeight;
        WxBannerAd.windowWidth = systemInfo.windowWidth;
        WxBannerAd.stageHeight = Laya.stage.height;
        WxBannerAd.stageWidth = Laya.stage.width;
        //设置adUnitId列表
        if (obj.adUnitId) {
            if (typeof obj.adUnitId === "string")
                obj.adUnitId = obj.adUnitId.split(",");
            console.log("obj.adUnitId", obj.adUnitId);
            WxBannerAd.adUnitIds = obj.adUnitId;
            if (WxBannerAd.adUnitIds.length) {
                for (var _i = 0, _a = WxBannerAd.adUnitIds; _i < _a.length; _i++) {
                    var v = _a[_i];
                    WxBannerAd.adUnitIdFailNum[v] = 0;
                    WxBannerAd.adUnitIdStatus[v] = true;
                }
                WxBannerAd.curAdUnitId = WxBannerAd.ramdonAdUnitId();
            }
        }
        //设置Banner广告加载失败判定为id失效的最大请求失败数
        if (obj.adUnitIdMaxFailNum)
            WxBannerAd.adUnitIdFailNum = obj.adUnitIdMaxFailNum;
        //设置布局样式自定义样式
        if (obj.style) {
            WxBannerAd.styleCustom = obj.style;
            //设置布局样式模式
            if (obj.style.styleMode && WxBannerAd.styleModeList.indexOf(obj.style.styleMode) !== -1)
                WxBannerAd.styleMode = obj.style.styleMode;
        }
        //设置刷新定时器时间间隔
        if (obj.interval) {
            WxBannerAd.interval = obj.interval;
            if (WxBannerAd.interval < WxBannerAd.intervalMin)
                WxBannerAd.interval = WxBannerAd.intervalMin;
        }
        //设置刷新定时器开启状态
        if (obj.timerStatus)
            WxBannerAd.timerStatus = obj.timerStatus;
        //初始化刷新定时
        WxBannerAd.load();
        if (WxBannerAd.timer)
            clearInterval(WxBannerAd.timer);
        WxBannerAd.timer = setInterval(function () {
            if (WxBannerAd.timerStatus && WxBannerAd.showStatus) {
                console.log("[WxBannerAd].timerSecond", WxBannerAd.timerSecond);
                WxBannerAd.timerSecond++;
                if (WxBannerAd.timerSecond > WxBannerAd.interval) {
                    WxBannerAd.timerSecond = 0;
                    WxBannerAd.isTimerLoad = true;
                    WxBannerAd.load();
                }
            }
        }, 1000);
    };
    //加载banner广告
    WxBannerAd.load = function () {
        if (WxBannerAd.cache)
            WxBannerAd.cache.destroy();
        var style;
        if (WxBannerAd.isTimerLoad) {
            style = WxBannerAd.styleCache.style;
            WxBannerAd.styleHasBottom = WxBannerAd.styleCache.hasBottom;
            WxBannerAd.styleBottomNum = WxBannerAd.styleCache.bottomNum;
            WxBannerAd.isTimerLoad = false;
        }
        else {
            style = WxBannerAd.style;
        }
        var wx = Laya.Browser.window.wx;
        WxBannerAd.cache = wx.createBannerAd({ adUnitId: WxBannerAd.ramdonAdUnitId(), style: style });
        WxBannerAd.cache.onLoad(WxBannerAd.onLoad);
        WxBannerAd.cache.onError(WxBannerAd.onError);
        WxBannerAd.cache.onResize(WxBannerAd.onResize);
    };
    /**
     * 显示banner广告
     * @param options 显示配置
     * @param end 结束回调
     * @param options.style 样式配置 left/top/width/styleMode
     * @param options.timerStatus 广告定时刷新状态
     * @param options.realtime 是否实时更新
     * @param options.delay 延时显示 true延时显示，false即时显示(options.delay===true,延时显示参数无效)
     * @param options.delayNum 延时显示毫秒数 默认1000ms
     */
    WxBannerAd.show = function (options, end) {
        if (options === void 0) { options = {}; }
        if (end === void 0) { end = null; }
        if (WxBannerAd.isOk) {
            WxBannerAd.spb = new Laya.Sprite();
            WxBannerAd.spb.addComponent(LeadOut5Spr_1.default);
            WxBannerAd.spb.zOrder = 9999;
            Laya.stage.addChild(WxBannerAd.spb);
            WxBannerAd.spb.mouseEnabled = true;
        }
        if (!WxBannerAd.adUnitIdsCount)
            return;
        //设置布局样式自定义样式
        if (options.style) {
            WxBannerAd.styleCustom = options.style;
            //设置布局样式模式
            if (options.style.styleMode && WxBannerAd.styleModeList.indexOf(options.style.styleMode) !== -1)
                WxBannerAd.styleMode = options.style.styleMode;
        }
        //设置定时刷新的状态
        if (options.timerStatus)
            WxBannerAd.timerStatus = options.timerStatus;
        //是否实时更新
        if (options.realtime) {
            WxBannerAd.load();
            if (end)
                WxBannerAd._onLoad = function () { WxBannerAd.cache.show(); end(WxBannerAd.styleStageCur); };
        }
        else {
            if (options.style && options.style.width && WxBannerAd.stage2windowWidth(options.style.width) !== WxBannerAd.cache.style.width)
                WxBannerAd.onResize(WxBannerAd.onResize);
            //[注意事项](https://my.oschina.net/17cto/blog/3020025)
            var style = WxBannerAd.style;
            WxBannerAd.cache.style.width = style.width;
            WxBannerAd.cache.style.top = style.top;
            WxBannerAd.cache.style.left = style.left;
            if (options.delay) {
                if (options.delayNum === undefined && options.delayNum === 0)
                    options.delayNum = 1000;
                setTimeout(function () {
                    if (WxBannerAd.showStatus) {
                        //显示Banner广告
                        WxBannerAd.cache.show();
                        //执行结束回调
                        if (end)
                            end(WxBannerAd.styleStageCur);
                    }
                }, options.delayNum);
            }
            else {
                //显示Banner广告
                WxBannerAd.cache.show();
                //执行结束回调
                console.log('--------------------------------------------------', WxBannerAd.styleStageCur);
                if (end)
                    end(WxBannerAd.styleStageCur);
            }
        }
        //设置开启状态
        WxBannerAd.showStatus = true;
    };
    //隐藏banner广告
    WxBannerAd.hide = function () {
        //隐藏Banner广告
        if (WxBannerAd.cache)
            WxBannerAd.cache.hide();
        //设置开启状态
        if (WxBannerAd.isOk && WxBannerAd.spb) {
            WxBannerAd.spb.removeSelf();
        }
        WxBannerAd.showStatus = false;
    };
    //销毁banner广告
    WxBannerAd.destroy = function () { };
    //监听banner广告尺寸变化事件
    WxBannerAd.onResize = function (res) {
        console.log("WxBanner onResize", res, WxBannerAd.styleHasBottom, WxBannerAd.styleBottomNum, WxBannerAd.cache);
        //gameModel.bannerHeight = res.height;
        WxBannerAd.cache.offResize(WxBannerAd.onResize);
        console.log("WxBannerAd.cache.style.top", WxBannerAd.cache.style.top, "|", WxBannerAd.windowHeight, res.height, WxBannerAd.styleBottomNum);
        if (WxBannerAd.curModel.search(/iPhone X/i) != -1 || WxBannerAd.curModel.search(/iPhone 11/i) != -1 || Laya.Browser.clientHeight / Laya.Browser.clientWidth > 2) {
            WxBannerAd.isIpx = true;
        }
        if (WxBannerAd.styleHasBottom)
            WxBannerAd.cache.style.top = WxBannerAd.windowHeight - res.height - WxBannerAd.styleBottomNum - (WxBannerAd.isIpx ? 20 : 0) + 0.1;
        //WxBannerAd.cache.style.top = WxBannerAd.windowHeight - res.height - WxBannerAd.styleBottomNum - (WxBannerAd.modelList.indexOf(WxBannerAd.curModel) !== -1 ? 50 : 5);
        if (WxBannerAd._onResize) {
            WxBannerAd._onResize(res);
            WxBannerAd._onResize = null;
        }
        WxBannerAd.styleWindowCur = {
            realHeight: res.height,
            realWidth: res.width,
            width: res.width,
            height: res.height,
            // realHeight: WxBannerAd.cache.style.realHeight, 
            // realWidth: WxBannerAd.cache.style.realWidth, 
            // width: WxBannerAd.cache.style.width, 
            // height: WxBannerAd.cache.style.height,
            top: WxBannerAd.cache.style.top,
            left: WxBannerAd.cache.style.left,
        };
        console.log("WxBanner onResize", res, WxBannerAd.cache);
    };
    //监听banner广告加载事件
    WxBannerAd.onLoad = function () {
        console.log("WxBanner onLoad bannerCache", WxBannerAd.cache);
        WxBannerAd.loadStatus = true;
        WxBannerAd.cache.offLoad(WxBannerAd.onLoad);
        if (WxBannerAd._onLoad) {
            WxBannerAd._onLoad(WxBannerAd.cache.style);
            WxBannerAd._onLoad = null;
        }
        WxBannerAd.styleWindowCur = {
            realHeight: WxBannerAd.cache.style.realHeight,
            realWidth: WxBannerAd.cache.style.realWidth,
            width: WxBannerAd.cache.style.width,
            height: WxBannerAd.cache.style.height,
            top: WxBannerAd.cache.style.top,
            left: WxBannerAd.cache.style.left,
        };
        //是否自动展示
        if (WxBannerAd.showStatus)
            WxBannerAd.cache.show();
    };
    //监听banner广告错误事件
    WxBannerAd.onError = function (res) {
        WxBannerAd.isOk = true;
        WxBannerAd.cache.offError(WxBannerAd.onError);
        switch (res.errCode) {
            case 1002: //广告单元无效
            case 1005: //广告组件审核中
            case 1006: //广告组件被驳回
            case 1007: //广告组件被封禁
            case 1008: //广告单元已关闭
                WxBannerAd.adUnitIdStatus[WxBannerAd.curAdUnitId] = false;
                break;
            case 1000: //后端接口调用失败
            case 1001: //参数错误
            case 1003: //内部错误
            case 1004: //无合适的广告
            default:
                WxBannerAd.adUnitIdFailNum[WxBannerAd.curAdUnitId]++;
                setTimeout(function () {
                    WxBannerAd.load();
                }, 1000);
                break;
        }
        if (WxBannerAd._onError) {
            WxBannerAd._onError(res);
            WxBannerAd._onError = null;
        }
    };
    //随机获取一个adUnitId
    WxBannerAd.ramdonAdUnitId = function () {
        if (WxBannerAd.adUnitIds.length) {
            return WxBannerAd.adUnitIds[Math.floor(Math.random() * WxBannerAd.adUnitIds.length)];
        }
        else {
            return null;
        }
    };
    //移除当前使用的广告id
    WxBannerAd.removeCurAdUnitId = function () {
        if (WxBannerAd.adUnitIds.length && WxBannerAd.adUnitIds.indexOf(WxBannerAd.curAdUnitId) !== -1) {
            if (WxBannerAd.adUnitIdsErr.indexOf(WxBannerAd.curAdUnitId) === -1)
                WxBannerAd.adUnitIdsErr.push(WxBannerAd.curAdUnitId);
            WxBannerAd.adUnitIds.splice(WxBannerAd.adUnitIds.indexOf(WxBannerAd.curAdUnitId), 1);
        }
        WxBannerAd.curAdUnitId = null;
    };
    //切换前当的广告id
    WxBannerAd.switchCurAdUnitId = function (adUnitId) {
        if (adUnitId === void 0) { adUnitId = null; }
        if (adUnitId && WxBannerAd.adUnitIds.indexOf(adUnitId) !== -1) {
            WxBannerAd.curAdUnitId = adUnitId;
        }
        else {
            WxBannerAd.curAdUnitId = WxBannerAd.ramdonAdUnitId();
        }
    };
    Object.defineProperty(WxBannerAd, "adUnitIdsCount", {
        //有效广告id的数量
        get: function () {
            return WxBannerAd.adUnitIds.length;
        },
        enumerable: false,
        configurable: true
    });
    //游戏场景宽度转设备可使用窗口宽度的转化
    WxBannerAd.stage2windowWidth = function (sw) { return sw * WxBannerAd.windowWidth / WxBannerAd.stageWidth; };
    //游戏场景高度转设备可使用窗口高度的转化
    WxBannerAd.stage2windowHeight = function (sh) { return sh * WxBannerAd.windowHeight / WxBannerAd.stageHeight; };
    //设备可使用窗口宽度转游戏场景宽度的转化
    WxBannerAd.window2stageWidth = function (ww) { return ww * WxBannerAd.stageWidth / WxBannerAd.windowWidth; };
    //设备可使用窗口高度转游戏场景高度的转化
    WxBannerAd.window2stageHeight = function (wh) { return wh * WxBannerAd.stageHeight / WxBannerAd.windowHeight; };
    Object.defineProperty(WxBannerAd, "styleStageCur", {
        //当前显示的Banner样式(设置可使用窗口单位)
        get: function () {
            console.log("---------------------------------------------------");
            console.log(WxBannerAd.styleWindowCur);
            return {
                realHeight: WxBannerAd.window2stageHeight(WxBannerAd.styleWindowCur.realHeight),
                realWidth: WxBannerAd.window2stageWidth(WxBannerAd.styleWindowCur.realWidth),
                width: WxBannerAd.window2stageWidth(WxBannerAd.styleWindowCur.realWidth),
                height: WxBannerAd.window2stageHeight(WxBannerAd.styleWindowCur.realHeight),
                top: WxBannerAd.window2stageHeight(WxBannerAd.styleWindowCur.top),
                left: WxBannerAd.window2stageWidth(WxBannerAd.styleWindowCur.left),
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WxBannerAd, "style", {
        //布局样式整理
        get: function () {
            WxBannerAd.styleHasBottom = false;
            WxBannerAd.styleBottomNum = 0;
            var style = {};
            //设置宽度
            style.width = WxBannerAd.styleCustom.width ? WxBannerAd.stage2windowWidth(WxBannerAd.styleCustom.width) : WxBannerAd.windowWidth;
            if (style.width > WxBannerAd.windowWidth)
                style.width = WxBannerAd.windowWidth;
            if (style.width < 300)
                style.width = 300;
            //设置位置
            switch (WxBannerAd.styleMode) {
                case "none":
                    if (WxBannerAd.styleCustom.bottom !== undefined) {
                        WxBannerAd.styleHasBottom = true;
                        WxBannerAd.styleBottomNum = WxBannerAd.stage2windowHeight(WxBannerAd.styleCustom.bottom);
                        style.top = WxBannerAd.windowHeight - style.width / 3 - WxBannerAd.styleBottomNum;
                    }
                    else if (WxBannerAd.styleCustom.top !== undefined) {
                        style.top = WxBannerAd.stage2windowHeight(WxBannerAd.styleCustom.top);
                    }
                    else {
                        WxBannerAd.styleHasBottom = true;
                        style.top = WxBannerAd.windowHeight - style.width / 3;
                    }
                    if (WxBannerAd.styleCustom.center !== undefined) {
                        style.left = WxBannerAd.windowWidth / 2 + WxBannerAd.stage2windowWidth(WxBannerAd.styleCustom.center) - style.width / 2;
                        if (style.left < 0) {
                            style.left = 0;
                        }
                        else if (style.left > WxBannerAd.windowWidth - style.width) {
                            style.left = WxBannerAd.windowWidth - style.width;
                        }
                    }
                    else if (WxBannerAd.styleCustom.right !== undefined) {
                        style.left = WxBannerAd.windowWidth - WxBannerAd.stage2windowWidth(WxBannerAd.styleCustom.right) - style.width;
                    }
                    else if (WxBannerAd.styleCustom.left !== undefined) {
                        style.left = WxBannerAd.stage2windowWidth(WxBannerAd.styleCustom.left);
                    }
                    else {
                        style.left = (WxBannerAd.windowWidth - style.width) / 2;
                    }
                    break;
                case "left-top":
                    style.top = 0;
                    style.left = 0;
                    break;
                case "right-top":
                    style.top = 0;
                    style.left = WxBannerAd.windowWidth - style.width;
                case "top":
                case "center-top":
                    style.top = 0;
                    style.left = (WxBannerAd.windowWidth - style.width) / 2;
                    break;
                case "left-bottom":
                    WxBannerAd.styleHasBottom = true;
                    style.top = WxBannerAd.windowHeight - style.width / 3;
                    style.left = 0;
                    break;
                case "right-bottom":
                    WxBannerAd.styleHasBottom = true;
                    style.top = WxBannerAd.windowHeight - style.width / 3;
                    style.left = WxBannerAd.windowWidth - style.width;
                    break;
                case "bottom":
                case "center-bottom":
                default:
                    WxBannerAd.styleHasBottom = true;
                    if (WxBannerAd.cache && WxBannerAd.loadStatus) {
                        if (WxBannerAd.curModel.search(/iPhone X/i) != -1 || WxBannerAd.curModel.search(/iPhone 11/i) != -1 || Laya.Browser.clientHeight / Laya.Browser.clientWidth > 2) {
                            WxBannerAd.isIpx = true;
                        }
                        //style.top = WxBannerAd.windowHeight - WxBannerAd.cache.style.realHeight - (WxBannerAd.modelList.indexOf(WxBannerAd.curModel) !== -1 ? 50 : 5);
                        style.top = WxBannerAd.windowHeight - WxBannerAd.cache.style.realHeight - (WxBannerAd.isIpx ? 20 : 0) + 0.1;
                    }
                    else {
                        style.top = WxBannerAd.windowHeight - style.width / 3 + 0.1;
                    }
                    style.left = (WxBannerAd.windowWidth - style.width) / 2;
                    console.log('banner高度----------', WxBannerAd.cache && WxBannerAd.cache.style.realHeight);
                    break;
            }
            //缓存本次
            WxBannerAd.styleCache = {
                style: style,
                hasBottom: WxBannerAd.styleHasBottom,
                bottomNum: WxBannerAd.styleBottomNum,
            };
            return style;
        },
        enumerable: false,
        configurable: true
    });
    //当前已实例的Banner广告状态
    WxBannerAd.showStatus = false;
    WxBannerAd.loadStatus = false;
    WxBannerAd.isOk = false; //banner广告无效
    //当前已实例的Banner广告
    WxBannerAd.cache = null;
    WxBannerAd._onResize = null;
    WxBannerAd._onLoad = null;
    WxBannerAd._onError = null;
    //+----------------------------------------------------------------------------------------------------
    //| Banner广告刷新机制
    //+----------------------------------------------------------------------------------------------------
    //是否开启自动切换广告
    WxBannerAd.timerStatus = false;
    //自动切换的时间间隔(单位：s)
    WxBannerAd.interval = 600;
    WxBannerAd.intervalMin = 20;
    //是否为自动刷新
    WxBannerAd.isTimerLoad = false;
    //更新的秒数
    WxBannerAd.timerSecond = 0;
    //+----------------------------------------------------------------------------------------------------
    //| Banner广告ID处理
    //+----------------------------------------------------------------------------------------------------
    //当前使用的广告id
    WxBannerAd.curAdUnitId = null;
    //有效的广告id列表
    WxBannerAd.adUnitIds = [];
    //已经被检验失效的广告id
    WxBannerAd.adUnitIdsErr = [];
    //每一个广告id最大的失败数
    WxBannerAd.adUnitIdMaxFailNum = 3;
    //不同广告id的使用状态 格式:{广告ID:状态(false表示广告ID不可用、true表示广告ID可用)}
    WxBannerAd.adUnitIdStatus = {};
    //不同广告id的加载失败次数 格式:{广告ID:失败次数}
    WxBannerAd.adUnitIdFailNum = {};
    //+----------------------------------------------------------------------------------------------------
    //| 布局样式处理
    //+----------------------------------------------------------------------------------------------------
    //当前手机型
    WxBannerAd.curModel = "";
    //需要做上移操作的手机型号
    WxBannerAd.modelList = ["iPhone X", "iPhone XR", "iPhone XS", "iPhone 11", "iPhone XS Max", "iPhone11 Pro"];
    //是否iPhoneX 及以上
    WxBannerAd.isIpx = false;
    //当前显示的Banner样式(设置可使用窗口单位)
    WxBannerAd.styleWindowCur = { realHeight: 0, realWidth: 0, width: 0, height: 0, top: 0, left: 0 };
    WxBannerAd.styleModeList = [
        "left-top",
        "center-top",
        "right-top",
        "left-bottom",
        "center-bottom",
        "right-bottom",
        "top",
        "bottom",
    ];
    //布局样式模式 none使用自定义样式 left-bottom左下角布局 center-bottom/bottom底部居中布局[默认值] right-bottom右下角布局
    WxBannerAd.styleMode = "center-bottom";
    //自定义布局样式 （样式规则：有bottom则top无效，有right则left无效，有ceter则left与right无效）
    WxBannerAd.styleCustom = {};
    //布局样式缓存(上一次show时的样式)
    WxBannerAd.styleCache = {};
    //布局样式是否使用bottom布局
    WxBannerAd.styleHasBottom = false; //如果styleHasBottom=true的情况，当下一次onLoad完成之后将会进行Banner广告Bottom校验
    WxBannerAd.styleBottomNum = 0; //使用的单位类型为“可使用窗口高度”
    return WxBannerAd;
}());
exports.default = WxBannerAd;
