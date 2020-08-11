"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var QqBannerAd = /** @class */ (function () {
    //构造函数
    function QqBannerAd() {
    }
    //初始化Banner广告
    QqBannerAd.init = function (obj) {
        if (obj === void 0) { obj = {}; }
        //初始化单位转化
        var wx = Laya.Browser.window.wx;
        var systemInfo = wx.getSystemInfoSync();
        //设备型号
        QqBannerAd.curModel = systemInfo.model;
        console.log('当前设备型号', QqBannerAd.curModel);
        //可使用窗口高度，单位px
        QqBannerAd.windowHeight = systemInfo.windowHeight;
        QqBannerAd.windowWidth = systemInfo.windowWidth;
        QqBannerAd.stageHeight = Laya.stage.height;
        QqBannerAd.stageWidth = Laya.stage.width;
        //设置adUnitId列表
        if (obj.adUnitId) {
            if (typeof obj.adUnitId === "string")
                obj.adUnitId = obj.adUnitId.split(",");
            console.log("obj.adUnitId", obj.adUnitId);
            QqBannerAd.adUnitIds = obj.adUnitId;
            if (QqBannerAd.adUnitIds.length) {
                for (var _i = 0, _a = QqBannerAd.adUnitIds; _i < _a.length; _i++) {
                    var v = _a[_i];
                    QqBannerAd.adUnitIdFailNum[v] = 0;
                    QqBannerAd.adUnitIdStatus[v] = true;
                }
                QqBannerAd.curAdUnitId = QqBannerAd.ramdonAdUnitId();
            }
        }
        //设置Banner广告加载失败判定为id失效的最大请求失败数
        if (obj.adUnitIdMaxFailNum)
            QqBannerAd.adUnitIdFailNum = obj.adUnitIdMaxFailNum;
        //设置布局样式自定义样式
        if (obj.style) {
            QqBannerAd.styleCustom = obj.style;
            //设置布局样式模式
            if (obj.style.styleMode && QqBannerAd.styleModeList.indexOf(obj.style.styleMode) !== -1)
                QqBannerAd.styleMode = obj.style.styleMode;
        }
        //设置刷新定时器时间间隔
        if (obj.interval) {
            QqBannerAd.interval = obj.interval;
            if (QqBannerAd.interval < QqBannerAd.intervalMin)
                QqBannerAd.interval = QqBannerAd.intervalMin;
        }
        //设置刷新定时器开启状态
        if (obj.timerStatus)
            QqBannerAd.timerStatus = obj.timerStatus;
        //初始化刷新定时
        QqBannerAd.load();
        if (QqBannerAd.timer)
            clearInterval(QqBannerAd.timer);
        QqBannerAd.timer = setInterval(function () {
            if (QqBannerAd.timerStatus && QqBannerAd.showStatus) {
                console.log("[QqBannerAd].timerSecond", QqBannerAd.timerSecond);
                QqBannerAd.timerSecond++;
                if (QqBannerAd.timerSecond > QqBannerAd.interval) {
                    QqBannerAd.timerSecond = 0;
                    QqBannerAd.isTimerLoad = true;
                    QqBannerAd.load();
                }
            }
        }, 1000);
    };
    //加载banner广告
    QqBannerAd.load = function () {
        if (QqBannerAd.cache)
            QqBannerAd.cache.destroy();
        var style;
        if (QqBannerAd.isTimerLoad) {
            style = QqBannerAd.styleCache.style;
            QqBannerAd.styleHasBottom = QqBannerAd.styleCache.hasBottom;
            QqBannerAd.styleBottomNum = QqBannerAd.styleCache.bottomNum;
            QqBannerAd.isTimerLoad = false;
        }
        else {
            style = QqBannerAd.style;
        }
        var wx = Laya.Browser.window.wx;
        QqBannerAd.cache = wx.createBannerAd({ adUnitId: QqBannerAd.ramdonAdUnitId(), style: style });
        QqBannerAd.cache.onLoad(QqBannerAd.onLoad);
        QqBannerAd.cache.onError(QqBannerAd.onError);
        QqBannerAd.cache.onResize(QqBannerAd.onResize);
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
    QqBannerAd.show = function (options, end) {
        if (options === void 0) { options = {}; }
        if (end === void 0) { end = null; }
        if (!QqBannerAd.adUnitIdsCount)
            return;
        //设置布局样式自定义样式
        if (options.style) {
            QqBannerAd.styleCustom = options.style;
            //设置布局样式模式
            if (options.style.styleMode && QqBannerAd.styleModeList.indexOf(options.style.styleMode) !== -1)
                QqBannerAd.styleMode = options.style.styleMode;
        }
        //设置定时刷新的状态
        if (options.timerStatus)
            QqBannerAd.timerStatus = options.timerStatus;
        //是否实时更新
        if (options.realtime) {
            QqBannerAd.load();
            if (end)
                QqBannerAd._onLoad = function () { QqBannerAd.cache.show(); end(QqBannerAd.styleStageCur); };
        }
        else {
            if (options.style && options.style.width && QqBannerAd.stage2windowWidth(options.style.width) !== QqBannerAd.cache.style.width)
                QqBannerAd.onResize(QqBannerAd.onResize);
            //[注意事项](https://my.oschina.net/17cto/blog/3020025)
            var style = QqBannerAd.style;
            QqBannerAd.cache.style.width = style.width;
            QqBannerAd.cache.style.top = style.top;
            QqBannerAd.cache.style.left = style.left;
            if (options.delay) {
                if (options.delayNum === undefined && options.delayNum === 0)
                    options.delayNum = 1000;
                setTimeout(function () {
                    if (QqBannerAd.showStatus) {
                        //显示Banner广告
                        QqBannerAd.cache.show();
                        //执行结束回调
                        if (end)
                            end(QqBannerAd.styleStageCur);
                    }
                }, options.delayNum);
            }
            else {
                //显示Banner广告
                QqBannerAd.cache.show();
                //执行结束回调
                console.log('--------------------------------------------------', QqBannerAd.styleStageCur);
                if (end)
                    end(QqBannerAd.styleStageCur);
            }
        }
        //设置开启状态
        QqBannerAd.showStatus = true;
    };
    //隐藏banner广告
    QqBannerAd.hide = function () {
        //隐藏Banner广告
        if (QqBannerAd.cache)
            QqBannerAd.cache.hide();
        //设置开启状态
        QqBannerAd.showStatus = false;
    };
    //销毁banner广告
    QqBannerAd.destroy = function () { };
    //监听banner广告尺寸变化事件
    QqBannerAd.onResize = function (res) {
        console.log("WxBanner onResize", res, QqBannerAd.styleHasBottom, QqBannerAd.styleBottomNum, QqBannerAd.cache);
        //gameModel.bannerHeight = res.height;
        QqBannerAd.cache.offResize(QqBannerAd.onResize);
        console.log("QqBannerAd.cache.style.top", QqBannerAd.cache.style.top, "|", QqBannerAd.windowHeight, res.height, QqBannerAd.styleBottomNum);
        if (QqBannerAd.curModel.search(/iPhone X/i) != -1 || QqBannerAd.curModel.search(/iPhone 11/i) != -1 || Laya.Browser.clientHeight / Laya.Browser.clientWidth > 2) {
            QqBannerAd.isIpx = true;
        }
        if (QqBannerAd.styleHasBottom)
            QqBannerAd.cache.style.top = QqBannerAd.windowHeight - res.height - QqBannerAd.styleBottomNum - (QqBannerAd.isIpx ? 25 : 0) + 0.1;
        //QqBannerAd.cache.style.top = QqBannerAd.windowHeight - res.height - QqBannerAd.styleBottomNum - (QqBannerAd.modelList.indexOf(QqBannerAd.curModel) !== -1 ? 50 : 5);
        if (QqBannerAd._onResize) {
            QqBannerAd._onResize(res);
            QqBannerAd._onResize = null;
        }
        QqBannerAd.styleWindowCur = {
            realHeight: QqBannerAd.cache.style.realHeight,
            realWidth: QqBannerAd.cache.style.realWidth,
            width: QqBannerAd.cache.style.width,
            height: QqBannerAd.cache.style.height,
            top: QqBannerAd.cache.style.top,
            left: QqBannerAd.cache.style.left,
        };
        console.log("WxBanner onResize", res, QqBannerAd.cache);
    };
    //监听banner广告加载事件
    QqBannerAd.onLoad = function () {
        console.log("WxBanner onLoad bannerCache", QqBannerAd.cache);
        QqBannerAd.loadStatus = true;
        QqBannerAd.cache.offLoad(QqBannerAd.onLoad);
        if (QqBannerAd._onLoad) {
            QqBannerAd._onLoad(QqBannerAd.cache.style);
            QqBannerAd._onLoad = null;
        }
        QqBannerAd.styleWindowCur = {
            realHeight: QqBannerAd.cache.style.realHeight,
            realWidth: QqBannerAd.cache.style.realWidth,
            width: QqBannerAd.cache.style.width,
            height: QqBannerAd.cache.style.height,
            top: QqBannerAd.cache.style.top,
            left: QqBannerAd.cache.style.left,
        };
        //是否自动展示
        if (QqBannerAd.showStatus)
            QqBannerAd.cache.show();
    };
    //监听banner广告错误事件
    QqBannerAd.onError = function (res) {
        QqBannerAd.cache.offError(QqBannerAd.onError);
        switch (res.errCode) {
            case 1002: //广告单元无效
            case 1005: //广告组件审核中
            case 1006: //广告组件被驳回
            case 1007: //广告组件被封禁
            case 1008: //广告单元已关闭
                QqBannerAd.adUnitIdStatus[QqBannerAd.curAdUnitId] = false;
                break;
            case 1000: //后端接口调用失败
            case 1001: //参数错误
            case 1003: //内部错误
            case 1004: //无合适的广告
            default:
                QqBannerAd.adUnitIdFailNum[QqBannerAd.curAdUnitId]++;
                setTimeout(function () {
                    QqBannerAd.load();
                }, 1000);
                break;
        }
        if (QqBannerAd._onError) {
            QqBannerAd._onError(res);
            QqBannerAd._onError = null;
        }
    };
    //随机获取一个adUnitId
    QqBannerAd.ramdonAdUnitId = function () {
        if (QqBannerAd.adUnitIds.length) {
            return QqBannerAd.adUnitIds[Math.floor(Math.random() * QqBannerAd.adUnitIds.length)];
        }
        else {
            return null;
        }
    };
    //移除当前使用的广告id
    QqBannerAd.removeCurAdUnitId = function () {
        if (QqBannerAd.adUnitIds.length && QqBannerAd.adUnitIds.indexOf(QqBannerAd.curAdUnitId) !== -1) {
            if (QqBannerAd.adUnitIdsErr.indexOf(QqBannerAd.curAdUnitId) === -1)
                QqBannerAd.adUnitIdsErr.push(QqBannerAd.curAdUnitId);
            QqBannerAd.adUnitIds.splice(QqBannerAd.adUnitIds.indexOf(QqBannerAd.curAdUnitId), 1);
        }
        QqBannerAd.curAdUnitId = null;
    };
    //切换前当的广告id
    QqBannerAd.switchCurAdUnitId = function (adUnitId) {
        if (adUnitId === void 0) { adUnitId = null; }
        if (adUnitId && QqBannerAd.adUnitIds.indexOf(adUnitId) !== -1) {
            QqBannerAd.curAdUnitId = adUnitId;
        }
        else {
            QqBannerAd.curAdUnitId = QqBannerAd.ramdonAdUnitId();
        }
    };
    Object.defineProperty(QqBannerAd, "adUnitIdsCount", {
        //有效广告id的数量
        get: function () {
            return QqBannerAd.adUnitIds.length;
        },
        enumerable: false,
        configurable: true
    });
    //游戏场景宽度转设备可使用窗口宽度的转化
    QqBannerAd.stage2windowWidth = function (sw) { return sw * QqBannerAd.windowWidth / QqBannerAd.stageWidth; };
    //游戏场景高度转设备可使用窗口高度的转化
    QqBannerAd.stage2windowHeight = function (sh) { return sh * QqBannerAd.windowHeight / QqBannerAd.stageHeight; };
    //设备可使用窗口宽度转游戏场景宽度的转化
    QqBannerAd.window2stageWidth = function (ww) { return ww * QqBannerAd.stageWidth / QqBannerAd.windowWidth; };
    //设备可使用窗口高度转游戏场景高度的转化
    QqBannerAd.window2stageHeight = function (wh) { return wh * QqBannerAd.stageHeight / QqBannerAd.windowHeight; };
    Object.defineProperty(QqBannerAd, "styleStageCur", {
        //当前显示的Banner样式(设置可使用窗口单位)
        get: function () {
            console.log("---------------------------------------------------");
            console.log(QqBannerAd.styleWindowCur);
            return {
                realHeight: QqBannerAd.window2stageHeight(QqBannerAd.styleWindowCur.realHeight),
                realWidth: QqBannerAd.window2stageWidth(QqBannerAd.styleWindowCur.realWidth),
                width: QqBannerAd.window2stageWidth(QqBannerAd.styleWindowCur.realWidth),
                height: QqBannerAd.window2stageHeight(QqBannerAd.styleWindowCur.realHeight),
                top: QqBannerAd.window2stageHeight(QqBannerAd.styleWindowCur.top),
                left: QqBannerAd.window2stageWidth(QqBannerAd.styleWindowCur.left),
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QqBannerAd, "style", {
        //布局样式整理
        get: function () {
            QqBannerAd.styleHasBottom = false;
            QqBannerAd.styleBottomNum = 0;
            var style = {};
            //设置宽度
            style.width = QqBannerAd.styleCustom.width ? QqBannerAd.stage2windowWidth(QqBannerAd.styleCustom.width) : QqBannerAd.windowWidth;
            if (style.width > QqBannerAd.windowWidth)
                style.width = QqBannerAd.windowWidth;
            //设置位置
            switch (QqBannerAd.styleMode) {
                case "none":
                    if (QqBannerAd.styleCustom.bottom !== undefined) {
                        QqBannerAd.styleHasBottom = true;
                        QqBannerAd.styleBottomNum = QqBannerAd.stage2windowHeight(QqBannerAd.styleCustom.bottom);
                        style.top = QqBannerAd.windowHeight - style.width / 3 - QqBannerAd.styleBottomNum;
                    }
                    else if (QqBannerAd.styleCustom.top !== undefined) {
                        style.top = QqBannerAd.stage2windowHeight(QqBannerAd.styleCustom.top);
                    }
                    else {
                        QqBannerAd.styleHasBottom = true;
                        style.top = QqBannerAd.windowHeight - style.width / 3;
                    }
                    if (QqBannerAd.styleCustom.center !== undefined) {
                        style.left = QqBannerAd.windowWidth / 2 + QqBannerAd.stage2windowWidth(QqBannerAd.styleCustom.center) - style.width / 2;
                        if (style.left < 0) {
                            style.left = 0;
                        }
                        else if (style.left > QqBannerAd.windowWidth - style.width) {
                            style.left = QqBannerAd.windowWidth - style.width;
                        }
                    }
                    else if (QqBannerAd.styleCustom.right !== undefined) {
                        style.left = QqBannerAd.windowWidth - QqBannerAd.stage2windowWidth(QqBannerAd.styleCustom.right) - style.width;
                    }
                    else if (QqBannerAd.styleCustom.left !== undefined) {
                        style.left = QqBannerAd.stage2windowWidth(QqBannerAd.styleCustom.left);
                    }
                    else {
                        style.left = (QqBannerAd.windowWidth - style.width) / 2;
                    }
                    break;
                case "left-top":
                    style.top = 0;
                    style.left = 0;
                    break;
                case "right-top":
                    style.top = 0;
                    style.left = QqBannerAd.windowWidth - style.width;
                case "top":
                case "center-top":
                    style.top = 0;
                    style.left = (QqBannerAd.windowWidth - style.width) / 2;
                    break;
                case "left-bottom":
                    QqBannerAd.styleHasBottom = true;
                    style.top = QqBannerAd.windowHeight - style.width / 3;
                    style.left = 0;
                    break;
                case "right-bottom":
                    QqBannerAd.styleHasBottom = true;
                    style.top = QqBannerAd.windowHeight - style.width / 3;
                    style.left = QqBannerAd.windowWidth - style.width;
                    break;
                case "bottom":
                case "center-bottom":
                default:
                    QqBannerAd.styleHasBottom = true;
                    if (QqBannerAd.cache && QqBannerAd.loadStatus) {
                        if (QqBannerAd.curModel.search(/iPhone X/i) != -1 || QqBannerAd.curModel.search(/iPhone 11/i) != -1 || Laya.Browser.clientHeight / Laya.Browser.clientWidth > 2) {
                            QqBannerAd.isIpx = true;
                        }
                        //style.top = QqBannerAd.windowHeight - QqBannerAd.cache.style.realHeight - (QqBannerAd.modelList.indexOf(QqBannerAd.curModel) !== -1 ? 50 : 5);
                        style.top = QqBannerAd.windowHeight - QqBannerAd.cache.style.realHeight - (QqBannerAd.isIpx ? 25 : 0) + 0.1;
                    }
                    else {
                        style.top = QqBannerAd.windowHeight - style.width / 3 + 0.1;
                    }
                    style.left = (QqBannerAd.windowWidth - style.width) / 2;
                    break;
            }
            //缓存本次
            QqBannerAd.styleCache = {
                style: style,
                hasBottom: QqBannerAd.styleHasBottom,
                bottomNum: QqBannerAd.styleBottomNum,
            };
            return style;
        },
        enumerable: false,
        configurable: true
    });
    //当前已实例的Banner广告状态
    QqBannerAd.showStatus = false;
    QqBannerAd.loadStatus = false;
    //当前已实例的Banner广告
    QqBannerAd.cache = null;
    QqBannerAd._onResize = null;
    QqBannerAd._onLoad = null;
    QqBannerAd._onError = null;
    //+----------------------------------------------------------------------------------------------------
    //| Banner广告刷新机制
    //+----------------------------------------------------------------------------------------------------
    //是否开启自动切换广告
    QqBannerAd.timerStatus = false;
    //自动切换的时间间隔(单位：s)
    QqBannerAd.interval = 600;
    QqBannerAd.intervalMin = 20;
    //是否为自动刷新
    QqBannerAd.isTimerLoad = false;
    //更新的秒数
    QqBannerAd.timerSecond = 0;
    //+----------------------------------------------------------------------------------------------------
    //| Banner广告ID处理
    //+----------------------------------------------------------------------------------------------------
    //当前使用的广告id
    QqBannerAd.curAdUnitId = null;
    //有效的广告id列表
    QqBannerAd.adUnitIds = [];
    //已经被检验失效的广告id
    QqBannerAd.adUnitIdsErr = [];
    //每一个广告id最大的失败数
    QqBannerAd.adUnitIdMaxFailNum = 3;
    //不同广告id的使用状态 格式:{广告ID:状态(false表示广告ID不可用、true表示广告ID可用)}
    QqBannerAd.adUnitIdStatus = {};
    //不同广告id的加载失败次数 格式:{广告ID:失败次数}
    QqBannerAd.adUnitIdFailNum = {};
    //+----------------------------------------------------------------------------------------------------
    //| 布局样式处理
    //+----------------------------------------------------------------------------------------------------
    //当前手机型
    QqBannerAd.curModel = "";
    //需要做上移操作的手机型号
    QqBannerAd.modelList = ["iPhone X", "iPhone XR", "iPhone XS", "iPhone 11", "iPhone XS Max", "iPhone11 Pro"];
    //是否iPhoneX 及以上
    QqBannerAd.isIpx = false;
    //当前显示的Banner样式(设置可使用窗口单位)
    QqBannerAd.styleWindowCur = { realHeight: 0, realWidth: 0, width: 0, height: 0, top: 0, left: 0 };
    QqBannerAd.styleModeList = [
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
    QqBannerAd.styleMode = "center-bottom";
    //自定义布局样式 （样式规则：有bottom则top无效，有right则left无效，有ceter则left与right无效）
    QqBannerAd.styleCustom = {};
    //布局样式缓存(上一次show时的样式)
    QqBannerAd.styleCache = {};
    //布局样式是否使用bottom布局
    QqBannerAd.styleHasBottom = false; //如果styleHasBottom=true的情况，当下一次onLoad完成之后将会进行Banner广告Bottom校验
    QqBannerAd.styleBottomNum = 0; //使用的单位类型为“可使用窗口高度”
    return QqBannerAd;
}());
exports.default = QqBannerAd;
