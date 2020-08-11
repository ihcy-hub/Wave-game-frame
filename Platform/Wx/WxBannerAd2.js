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
var WxBannerAd2 = /** @class */ (function () {
    //构造函数
    function WxBannerAd2() {
    }
    //初始化Banner广告
    WxBannerAd2.init = function (obj) {
        if (obj === void 0) { obj = {}; }
        //初始化单位转化
        var wx = Laya.Browser.window.wx;
        var systemInfo = wx.getSystemInfoSync();
        //设备型号
        WxBannerAd2.curModel = systemInfo.model;
        console.log('当前设备型号', WxBannerAd2.curModel);
        //可使用窗口高度，单位px
        WxBannerAd2.windowHeight = systemInfo.windowHeight;
        WxBannerAd2.windowWidth = systemInfo.windowWidth;
        WxBannerAd2.stageHeight = Laya.stage.height;
        WxBannerAd2.stageWidth = Laya.stage.width;
        //设置adUnitId列表
        if (obj.adUnitId) {
            if (typeof obj.adUnitId === "string")
                obj.adUnitId = obj.adUnitId.split(",");
            console.log("obj.adUnitId", obj.adUnitId);
            WxBannerAd2.adUnitIds = obj.adUnitId;
            if (WxBannerAd2.adUnitIds.length) {
                for (var _i = 0, _a = WxBannerAd2.adUnitIds; _i < _a.length; _i++) {
                    var v = _a[_i];
                    WxBannerAd2.adUnitIdFailNum[v] = 0;
                    WxBannerAd2.adUnitIdStatus[v] = true;
                }
                WxBannerAd2.curAdUnitId = WxBannerAd2.ramdonAdUnitId();
            }
        }
        //设置Banner广告加载失败判定为id失效的最大请求失败数
        if (obj.adUnitIdMaxFailNum)
            WxBannerAd2.adUnitIdFailNum = obj.adUnitIdMaxFailNum;
        //设置布局样式自定义样式
        if (obj.style) {
            WxBannerAd2.styleCustom = obj.style;
            //设置布局样式模式
            if (obj.style.styleMode && WxBannerAd2.styleModeList.indexOf(obj.style.styleMode) !== -1)
                WxBannerAd2.styleMode = obj.style.styleMode;
        }
        //设置刷新定时器时间间隔
        if (obj.interval) {
            WxBannerAd2.interval = obj.interval;
            if (WxBannerAd2.interval < WxBannerAd2.intervalMin)
                WxBannerAd2.interval = WxBannerAd2.intervalMin;
        }
        //设置刷新定时器开启状态
        if (obj.timerStatus)
            WxBannerAd2.timerStatus = obj.timerStatus;
        //初始化刷新定时
        WxBannerAd2.load();
        if (WxBannerAd2.timer)
            clearInterval(WxBannerAd2.timer);
        WxBannerAd2.timer = setInterval(function () {
            if (WxBannerAd2.timerStatus && WxBannerAd2.showStatus) {
                console.log("[WxBannerAd2].timerSecond", WxBannerAd2.timerSecond);
                WxBannerAd2.timerSecond++;
                if (WxBannerAd2.timerSecond > WxBannerAd2.interval) {
                    WxBannerAd2.timerSecond = 0;
                    WxBannerAd2.isTimerLoad = true;
                    WxBannerAd2.load();
                }
            }
        }, 1000);
    };
    //加载banner广告
    WxBannerAd2.load = function () {
        if (WxBannerAd2.cache)
            WxBannerAd2.cache.destroy();
        var style;
        if (WxBannerAd2.isTimerLoad) {
            style = WxBannerAd2.styleCache.style;
            WxBannerAd2.styleHasBottom = WxBannerAd2.styleCache.hasBottom;
            WxBannerAd2.styleBottomNum = WxBannerAd2.styleCache.bottomNum;
            WxBannerAd2.isTimerLoad = false;
        }
        else {
            style = WxBannerAd2.style;
        }
        var wx = Laya.Browser.window.wx;
        WxBannerAd2.cache = wx.createBannerAd({ adUnitId: WxBannerAd2.ramdonAdUnitId(), style: style });
        WxBannerAd2.cache.onLoad(WxBannerAd2.onLoad);
        WxBannerAd2.cache.onError(WxBannerAd2.onError);
        WxBannerAd2.cache.onResize(WxBannerAd2.onResize);
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
    WxBannerAd2.show = function (options, end) {
        if (options === void 0) { options = {}; }
        if (end === void 0) { end = null; }
        if (WxBannerAd2.isOk) {
            WxBannerAd2.spb = new Laya.Sprite();
            WxBannerAd2.spb.addComponent(LeadOut5Spr_1.default);
            WxBannerAd2.spb.zOrder = 9999;
            Laya.stage.addChild(WxBannerAd2.spb);
            WxBannerAd2.spb.mouseEnabled = true;
        }
        if (!WxBannerAd2.adUnitIdsCount)
            return;
        //设置布局样式自定义样式
        if (options.style) {
            WxBannerAd2.styleCustom = options.style;
            //设置布局样式模式
            if (options.style.styleMode && WxBannerAd2.styleModeList.indexOf(options.style.styleMode) !== -1)
                WxBannerAd2.styleMode = options.style.styleMode;
        }
        //设置定时刷新的状态
        if (options.timerStatus)
            WxBannerAd2.timerStatus = options.timerStatus;
        //是否实时更新
        if (options.realtime) {
            WxBannerAd2.load();
            if (end)
                WxBannerAd2._onLoad = function () { WxBannerAd2.cache.show(); end(WxBannerAd2.styleStageCur); };
        }
        else {
            if (options.style && options.style.width && WxBannerAd2.stage2windowWidth(options.style.width) !== WxBannerAd2.cache.style.width)
                WxBannerAd2.onResize(WxBannerAd2.onResize);
            //[注意事项](https://my.oschina.net/17cto/blog/3020025)
            var style = WxBannerAd2.style;
            WxBannerAd2.cache.style.width = style.width;
            WxBannerAd2.cache.style.top = style.top;
            WxBannerAd2.cache.style.left = style.left;
            if (options.delay) {
                if (options.delayNum === undefined && options.delayNum === 0)
                    options.delayNum = 1000;
                setTimeout(function () {
                    if (WxBannerAd2.showStatus) {
                        //显示Banner广告
                        WxBannerAd2.cache.show();
                        //执行结束回调
                        if (end)
                            end(WxBannerAd2.styleStageCur);
                    }
                }, options.delayNum);
            }
            else {
                //显示Banner广告
                WxBannerAd2.cache.show();
                //执行结束回调
                console.log('--------------------------------------------------', WxBannerAd2.styleStageCur);
                if (end)
                    end(WxBannerAd2.styleStageCur);
            }
        }
        //设置开启状态
        WxBannerAd2.showStatus = true;
    };
    //隐藏banner广告
    WxBannerAd2.hide = function () {
        //隐藏Banner广告
        if (WxBannerAd2.cache)
            WxBannerAd2.cache.hide();
        //设置开启状态
        if (WxBannerAd2.isOk && WxBannerAd2.spb) {
            WxBannerAd2.spb.removeSelf();
        }
        WxBannerAd2.showStatus = false;
    };
    //销毁banner广告
    WxBannerAd2.destroy = function () { };
    //监听banner广告尺寸变化事件
    WxBannerAd2.onResize = function (res) {
        console.log("WxBanner onResize", res, WxBannerAd2.styleHasBottom, WxBannerAd2.styleBottomNum, WxBannerAd2.cache);
        //gameModel.bannerHeight = res.height;
        WxBannerAd2.cache.offResize(WxBannerAd2.onResize);
        console.log("WxBannerAd2.cache.style.top", WxBannerAd2.cache.style.top, "|", WxBannerAd2.windowHeight, res.height, WxBannerAd2.styleBottomNum);
        if (WxBannerAd2.curModel.search(/iPhone X/i) != -1 || WxBannerAd2.curModel.search(/iPhone 11/i) != -1 || Laya.Browser.clientHeight / Laya.Browser.clientWidth > 2) {
            WxBannerAd2.isIpx = true;
        }
        if (WxBannerAd2.styleHasBottom)
            WxBannerAd2.cache.style.top = WxBannerAd2.windowHeight - res.height - WxBannerAd2.styleBottomNum - (WxBannerAd2.isIpx ? 20 : 0) + 0.1;
        //WxBannerAd2.cache.style.top = WxBannerAd2.windowHeight - res.height - WxBannerAd2.styleBottomNum - (WxBannerAd2.modelList.indexOf(WxBannerAd2.curModel) !== -1 ? 50 : 5);
        if (WxBannerAd2._onResize) {
            WxBannerAd2._onResize(res);
            WxBannerAd2._onResize = null;
        }
        WxBannerAd2.styleWindowCur = {
            realHeight: res.height,
            realWidth: res.width,
            width: res.width,
            height: res.height,
            // realHeight: WxBannerAd2.cache.style.realHeight, 
            // realWidth: WxBannerAd2.cache.style.realWidth, 
            // width: WxBannerAd2.cache.style.width, 
            // height: WxBannerAd2.cache.style.height,
            top: WxBannerAd2.cache.style.top,
            left: WxBannerAd2.cache.style.left,
        };
        console.log("WxBanner onResize", res, WxBannerAd2.cache);
    };
    //监听banner广告加载事件
    WxBannerAd2.onLoad = function () {
        console.log("WxBanner onLoad bannerCache", WxBannerAd2.cache);
        WxBannerAd2.loadStatus = true;
        WxBannerAd2.cache.offLoad(WxBannerAd2.onLoad);
        if (WxBannerAd2._onLoad) {
            WxBannerAd2._onLoad(WxBannerAd2.cache.style);
            WxBannerAd2._onLoad = null;
        }
        WxBannerAd2.styleWindowCur = {
            realHeight: WxBannerAd2.cache.style.realHeight,
            realWidth: WxBannerAd2.cache.style.realWidth,
            width: WxBannerAd2.cache.style.width,
            height: WxBannerAd2.cache.style.height,
            top: WxBannerAd2.cache.style.top,
            left: WxBannerAd2.cache.style.left,
        };
        //是否自动展示
        if (WxBannerAd2.showStatus)
            WxBannerAd2.cache.show();
    };
    //监听banner广告错误事件
    WxBannerAd2.onError = function (res) {
        WxBannerAd2.isOk = true;
        WxBannerAd2.cache.offError(WxBannerAd2.onError);
        switch (res.errCode) {
            case 1002: //广告单元无效
            case 1005: //广告组件审核中
            case 1006: //广告组件被驳回
            case 1007: //广告组件被封禁
            case 1008: //广告单元已关闭
                WxBannerAd2.adUnitIdStatus[WxBannerAd2.curAdUnitId] = false;
                break;
            case 1000: //后端接口调用失败
            case 1001: //参数错误
            case 1003: //内部错误
            case 1004: //无合适的广告
            default:
                WxBannerAd2.adUnitIdFailNum[WxBannerAd2.curAdUnitId]++;
                setTimeout(function () {
                    WxBannerAd2.load();
                }, 1000);
                break;
        }
        if (WxBannerAd2._onError) {
            WxBannerAd2._onError(res);
            WxBannerAd2._onError = null;
        }
    };
    //随机获取一个adUnitId
    WxBannerAd2.ramdonAdUnitId = function () {
        if (WxBannerAd2.adUnitIds.length) {
            return WxBannerAd2.adUnitIds[Math.floor(Math.random() * WxBannerAd2.adUnitIds.length)];
        }
        else {
            return null;
        }
    };
    //移除当前使用的广告id
    WxBannerAd2.removeCurAdUnitId = function () {
        if (WxBannerAd2.adUnitIds.length && WxBannerAd2.adUnitIds.indexOf(WxBannerAd2.curAdUnitId) !== -1) {
            if (WxBannerAd2.adUnitIdsErr.indexOf(WxBannerAd2.curAdUnitId) === -1)
                WxBannerAd2.adUnitIdsErr.push(WxBannerAd2.curAdUnitId);
            WxBannerAd2.adUnitIds.splice(WxBannerAd2.adUnitIds.indexOf(WxBannerAd2.curAdUnitId), 1);
        }
        WxBannerAd2.curAdUnitId = null;
    };
    //切换前当的广告id
    WxBannerAd2.switchCurAdUnitId = function (adUnitId) {
        if (adUnitId === void 0) { adUnitId = null; }
        if (adUnitId && WxBannerAd2.adUnitIds.indexOf(adUnitId) !== -1) {
            WxBannerAd2.curAdUnitId = adUnitId;
        }
        else {
            WxBannerAd2.curAdUnitId = WxBannerAd2.ramdonAdUnitId();
        }
    };
    Object.defineProperty(WxBannerAd2, "adUnitIdsCount", {
        //有效广告id的数量
        get: function () {
            return WxBannerAd2.adUnitIds.length;
        },
        enumerable: false,
        configurable: true
    });
    //游戏场景宽度转设备可使用窗口宽度的转化
    WxBannerAd2.stage2windowWidth = function (sw) { return sw * WxBannerAd2.windowWidth / WxBannerAd2.stageWidth; };
    //游戏场景高度转设备可使用窗口高度的转化
    WxBannerAd2.stage2windowHeight = function (sh) { return sh * WxBannerAd2.windowHeight / WxBannerAd2.stageHeight; };
    //设备可使用窗口宽度转游戏场景宽度的转化
    WxBannerAd2.window2stageWidth = function (ww) { return ww * WxBannerAd2.stageWidth / WxBannerAd2.windowWidth; };
    //设备可使用窗口高度转游戏场景高度的转化
    WxBannerAd2.window2stageHeight = function (wh) { return wh * WxBannerAd2.stageHeight / WxBannerAd2.windowHeight; };
    Object.defineProperty(WxBannerAd2, "styleStageCur", {
        //当前显示的Banner样式(设置可使用窗口单位)
        get: function () {
            console.log("---------------------------------------------------");
            console.log(WxBannerAd2.styleWindowCur);
            return {
                realHeight: WxBannerAd2.window2stageHeight(WxBannerAd2.styleWindowCur.realHeight),
                realWidth: WxBannerAd2.window2stageWidth(WxBannerAd2.styleWindowCur.realWidth),
                width: WxBannerAd2.window2stageWidth(WxBannerAd2.styleWindowCur.realWidth),
                height: WxBannerAd2.window2stageHeight(WxBannerAd2.styleWindowCur.realHeight),
                top: WxBannerAd2.window2stageHeight(WxBannerAd2.styleWindowCur.top),
                left: WxBannerAd2.window2stageWidth(WxBannerAd2.styleWindowCur.left),
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WxBannerAd2, "style", {
        //布局样式整理
        get: function () {
            WxBannerAd2.styleHasBottom = false;
            WxBannerAd2.styleBottomNum = 0;
            var style = {};
            //设置宽度
            style.width = WxBannerAd2.styleCustom.width ? WxBannerAd2.stage2windowWidth(WxBannerAd2.styleCustom.width) : WxBannerAd2.windowWidth;
            if (style.width > WxBannerAd2.windowWidth)
                style.width = WxBannerAd2.windowWidth;
            if (style.width < 300)
                style.width = 300;
            //设置位置
            switch (WxBannerAd2.styleMode) {
                case "none":
                    if (WxBannerAd2.styleCustom.bottom !== undefined) {
                        WxBannerAd2.styleHasBottom = true;
                        WxBannerAd2.styleBottomNum = WxBannerAd2.stage2windowHeight(WxBannerAd2.styleCustom.bottom);
                        style.top = WxBannerAd2.windowHeight - style.width / 3 - WxBannerAd2.styleBottomNum;
                    }
                    else if (WxBannerAd2.styleCustom.top !== undefined) {
                        style.top = WxBannerAd2.stage2windowHeight(WxBannerAd2.styleCustom.top);
                    }
                    else {
                        WxBannerAd2.styleHasBottom = true;
                        style.top = WxBannerAd2.windowHeight - style.width / 3;
                    }
                    if (WxBannerAd2.styleCustom.center !== undefined) {
                        style.left = WxBannerAd2.windowWidth / 2 + WxBannerAd2.stage2windowWidth(WxBannerAd2.styleCustom.center) - style.width / 2;
                        if (style.left < 0) {
                            style.left = 0;
                        }
                        else if (style.left > WxBannerAd2.windowWidth - style.width) {
                            style.left = WxBannerAd2.windowWidth - style.width;
                        }
                    }
                    else if (WxBannerAd2.styleCustom.right !== undefined) {
                        style.left = WxBannerAd2.windowWidth - WxBannerAd2.stage2windowWidth(WxBannerAd2.styleCustom.right) - style.width;
                    }
                    else if (WxBannerAd2.styleCustom.left !== undefined) {
                        style.left = WxBannerAd2.stage2windowWidth(WxBannerAd2.styleCustom.left);
                    }
                    else {
                        style.left = (WxBannerAd2.windowWidth - style.width) / 2;
                    }
                    break;
                case "left-top":
                    style.top = 0;
                    style.left = 0;
                    break;
                case "right-top":
                    style.top = 0;
                    style.left = WxBannerAd2.windowWidth - style.width;
                case "top":
                case "center-top":
                    style.top = 0;
                    style.left = (WxBannerAd2.windowWidth - style.width) / 2;
                    break;
                case "left-bottom":
                    WxBannerAd2.styleHasBottom = true;
                    style.top = WxBannerAd2.windowHeight - style.width / 3;
                    style.left = 0;
                    break;
                case "right-bottom":
                    WxBannerAd2.styleHasBottom = true;
                    style.top = WxBannerAd2.windowHeight - style.width / 3;
                    style.left = WxBannerAd2.windowWidth - style.width;
                    break;
                case "bottom":
                case "center-bottom":
                default:
                    WxBannerAd2.styleHasBottom = true;
                    if (WxBannerAd2.cache && WxBannerAd2.loadStatus) {
                        if (WxBannerAd2.curModel.search(/iPhone X/i) != -1 || WxBannerAd2.curModel.search(/iPhone 11/i) != -1 || Laya.Browser.clientHeight / Laya.Browser.clientWidth > 2) {
                            WxBannerAd2.isIpx = true;
                        }
                        //style.top = WxBannerAd2.windowHeight - WxBannerAd2.cache.style.realHeight - (WxBannerAd2.modelList.indexOf(WxBannerAd2.curModel) !== -1 ? 50 : 5);
                        // let num = 20
                        // if(WxBannerAd2.curModel.search(/iPhone XR/i) != -1){
                        //     num = 5
                        // }
                        style.top = WxBannerAd2.windowHeight - WxBannerAd2.cache.style.realHeight - (WxBannerAd2.isIpx ? 25 : 0) + 0.1;
                    }
                    else {
                        style.top = WxBannerAd2.windowHeight - style.width / 3 + 0.1;
                    }
                    style.left = (WxBannerAd2.windowWidth - style.width) / 2;
                    console.log('banner高度----------', WxBannerAd2.cache && WxBannerAd2.cache.style.realHeight);
                    break;
            }
            //缓存本次
            WxBannerAd2.styleCache = {
                style: style,
                hasBottom: WxBannerAd2.styleHasBottom,
                bottomNum: WxBannerAd2.styleBottomNum,
            };
            return style;
        },
        enumerable: false,
        configurable: true
    });
    //当前已实例的Banner广告状态
    WxBannerAd2.showStatus = false;
    WxBannerAd2.loadStatus = false;
    WxBannerAd2.isOk = false; //banner广告无效
    //当前已实例的Banner广告
    WxBannerAd2.cache = null;
    WxBannerAd2._onResize = null;
    WxBannerAd2._onLoad = null;
    WxBannerAd2._onError = null;
    //+----------------------------------------------------------------------------------------------------
    //| Banner广告刷新机制
    //+----------------------------------------------------------------------------------------------------
    //是否开启自动切换广告
    WxBannerAd2.timerStatus = false;
    //自动切换的时间间隔(单位：s)
    WxBannerAd2.interval = 600;
    WxBannerAd2.intervalMin = 20;
    //是否为自动刷新
    WxBannerAd2.isTimerLoad = false;
    //更新的秒数
    WxBannerAd2.timerSecond = 0;
    //+----------------------------------------------------------------------------------------------------
    //| Banner广告ID处理
    //+----------------------------------------------------------------------------------------------------
    //当前使用的广告id
    WxBannerAd2.curAdUnitId = null;
    //有效的广告id列表
    WxBannerAd2.adUnitIds = [];
    //已经被检验失效的广告id
    WxBannerAd2.adUnitIdsErr = [];
    //每一个广告id最大的失败数
    WxBannerAd2.adUnitIdMaxFailNum = 3;
    //不同广告id的使用状态 格式:{广告ID:状态(false表示广告ID不可用、true表示广告ID可用)}
    WxBannerAd2.adUnitIdStatus = {};
    //不同广告id的加载失败次数 格式:{广告ID:失败次数}
    WxBannerAd2.adUnitIdFailNum = {};
    //+----------------------------------------------------------------------------------------------------
    //| 布局样式处理
    //+----------------------------------------------------------------------------------------------------
    //当前手机型
    WxBannerAd2.curModel = "";
    //需要做上移操作的手机型号
    WxBannerAd2.modelList = ["iPhone X", "iPhone XR", "iPhone XS", "iPhone 11", "iPhone XS Max", "iPhone11 Pro"];
    //是否iPhoneX 及以上
    WxBannerAd2.isIpx = false;
    //当前显示的Banner样式(设置可使用窗口单位)
    WxBannerAd2.styleWindowCur = { realHeight: 0, realWidth: 0, width: 0, height: 0, top: 0, left: 0 };
    WxBannerAd2.styleModeList = [
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
    WxBannerAd2.styleMode = "center-bottom";
    //自定义布局样式 （样式规则：有bottom则top无效，有right则left无效，有ceter则left与right无效）
    WxBannerAd2.styleCustom = {};
    //布局样式缓存(上一次show时的样式)
    WxBannerAd2.styleCache = {};
    //布局样式是否使用bottom布局
    WxBannerAd2.styleHasBottom = false; //如果styleHasBottom=true的情况，当下一次onLoad完成之后将会进行Banner广告Bottom校验
    WxBannerAd2.styleBottomNum = 0; //使用的单位类型为“可使用窗口高度”
    return WxBannerAd2;
}());
exports.default = WxBannerAd2;
