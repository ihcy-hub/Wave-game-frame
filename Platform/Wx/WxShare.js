"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 微信分享操作管理类
 * 时间：2019-03-09
 *
 * 封装内容：
 * 1.标题与图片素材管理
 * 2.结果判断条件，虚拟回调
 * 3.添加确认弹窗拉起回调
 */
var WxShare = /** @class */ (function () {
    function WxShare() {
    }
    WxShare.init = function (options) {
        if (options === void 0) { options = {}; }
        console.log("[WxShare] init", options);
        //初始化资源
        WxShare.initAssets(options.assets);
        //初始化结果判断条件
        if (options.hasFirstSuccess !== undefined)
            WxShare.hasFirstSuccess = options.hasFirstSuccess;
        if (options.successTimeRange !== undefined)
            WxShare.successTimeRange = options.successTimeRange;
        if (options.successOdds !== undefined)
            WxShare.successOdds = options.successOdds;
        //确认弹窗
        if (options.confirmNum !== undefined)
            WxShare.confirmNum = options.confirmNum;
        //实始化请求参数
        if (options.query !== undefined)
            WxShare.query = options.query;
        //添加右上角分享
        wx.showShareMenu({ withShareTicket: true });
        WxShare.onShareAppMessage(function () {
            //let asset: any = WxShare.sequentialAssets();
            var obj = options.assets;
            var wx = Laya.Browser.window.wx;
            var canvas = wx.createCanvas();
            return {
                title: obj[0].title,
                imageUrlId: obj[0].id,
                imageUrl: obj[0].url
                //title: asset.title,
                //imageUrl: asset.img,
                //query: WxShare.getQueryStr(),
            };
        });
    };
    WxShare.onShareAppMessage = function (callback) { wx['aldOnShareAppMessage'] === undefined ? wx.onShareAppMessage(callback) : wx['aldOnShareAppMessage'](callback); };
    ;
    WxShare.shareAppMessage = function (obj) { wx['aldShareAppMessage'] === undefined ? wx.shareAppMessage(obj) : wx['aldShareAppMessage'](obj); };
    ;
    /**
     * 分享操作
     * @param {any} options 可选
     * @param {any} options.title 分享标题
     *  @param {any} options.imageUrl 分享图片路径
     */
    WxShare.share = function (options) {
        //设置分享操作请求参数
        var obj = {};
        //使用审核通过的转发图片
        //标题title与图片imageUrl资源
        if (options.title !== undefined && options.imageUrl !== undefined) {
            obj.title = options.title;
            obj.imageUrl = options.url;
            obj.imageUrlId = options.id;
        }
        else {
            var asset = WxShare.sequentialAssets();
            /*obj.title = asset.title;
            obj.imageUrl = asset.img;*/
            obj = WxShare.randomData();
        }
        console.log('ShareObj', obj);
        //参数query
        obj.query = WxShare.getQueryStr(options.query || '');
        WxShare.shareAppMessage(obj);
        WxShare.onShow(function () {
            //结果判断
            if (WxShare.shareRes()) {
                options.success && options.success();
            }
            else {
                if (options.hasConfirm) {
                    if (options.confirmNum === undefined)
                        options.confirmNum = 0;
                    //当拉起的重新分享已经达到上限值时，直接接视为分享成功
                    if (options.confirmNum >= WxShare.confirmNum) {
                        options.success && options.success();
                    }
                    else {
                        WxShare.shareConfirm(function () {
                            //重新拉起分享
                            options.confirmNum++;
                            WxShare.share(options);
                        }, function () {
                            options.fail && options.fail();
                        });
                    }
                }
                else {
                    options.fail && options.fail();
                }
            }
        });
    };
    /**
     * 游戏开局道具触发分享：运行假分享机制
     * ＜3秒返回后，弹出提示页面，提示“您已取消操作，请重试”，只留一个确定按钮，点击确定后再次发起分享接口，
     * 若还是＜3秒则提示“操作取消”，
     * 3秒≤？秒＜5秒，60%概率分享成功，40%分享失败，提示“您已取消操作‘’，
     * ≥5秒100%分享成功；
     * @param {any} options
     * @param {string} options.title 标题
     * @param {string} options.imageUrl 图片
     * @param {string} options.query 请求参数
     * @param {number} options.confirmNum 拉起回调次数
     * @param {Function} options.success 成功回调
     * @param {Function} options.fail 失败回调
     */
    WxShare.share2 = function (options) {
        if (options === void 0) { options = {}; }
        console.log('[WxShare] share2', options);
        //设置分享操作请求参数
        var obj = {};
        //标题title与图片imageUrl资源
        if (options.title !== undefined && options.url !== undefined) {
            obj.title = options.title;
            obj.imageUrl = options.url;
            obj.imageUrlId = options.id;
        }
        else {
            /*let asset: any = WxShare.sequentialAssets();
            console.log("asset",asset);
            obj.title = asset.title;
            obj.imageUrl = asset.img;*/
            obj = WxShare.randomData();
        }
        //参数query
        obj.query = WxShare.getQueryStr(options.query || '');
        WxShare.shareAppMessage(obj);
        console.log("WxShare shareAppMessage", obj);
        WxShare.onShow(function () {
            if (options.confirmNum === undefined)
                options.confirmNum = 0;
            if (options.confirmNum === 0) {
                if (WxShare.shareTimeLong < 500) {
                    //＜3s 弹出提示页面，提示“和好友一起玩也可以获得奖励哦~”，只留一个确定按钮，点击确定后再次发起分享接口
                    wx.showModal({
                        title: "提示",
                        content: "和好友一起玩也可以获得奖励哦~",
                        showCancel: false,
                        confirmText: "确认",
                        success: function (res) {
                            options.confirmNum++;
                            WxShare.share2(options);
                        }
                    });
                }
                else {
                    //>=3s 直接返回成功
                    options.success && options.success();
                }
            }
            else {
                var content = WxShare.shareTimeLong > 500 ? WxShare.shareTimeLong > 1000 || Math.random() < 0.6 ? "分享成功" : "您已取消操作" : "操作取消";
                if (content === "分享成功") {
                    options.success && options.success();
                }
                else {
                    options.fail && options.fail();
                    platform.msg(content);
                }
            }
        });
    };
    WxShare.getQueryStr = function (obj) {
        if (obj === void 0) { obj = {}; }
        var str = "";
        for (var i in WxShare.query)
            str += i + '=' + WxShare.query[i] + '&';
        if (typeof obj === 'string') {
            if (obj !== '')
                str += obj;
        }
        else {
            for (var j in obj)
                str += j + '=' + obj[j] + '&';
        }
        if (str.substr((str.length - 1), 1) === '&')
            str = str.substr(0, str.length - 1);
        return str;
    };
    //分享操作onShow
    WxShare.onShow = function (callback) {
        if (WxShare.onShowCallback !== null) {
            wx.offShow(WxShare.onShowCallback);
            WxShare.onShowCallback = null;
        }
        if (callback !== null) {
            WxShare.onShowCallback = function () {
                console.log("分享操作回调 ------");
                WxShare.shareEndTime = (new Date()).getTime();
                WxShare.shareTimeLong = WxShare.shareEndTime - WxShare.shareBeginTime;
                if (WxShare.onShowCallback !== null) {
                    wx.offShow(WxShare.onShowCallback);
                    WxShare.onShowCallback = null;
                }
                if (callback)
                    callback();
            };
            WxShare.shareBeginTime = (new Date()).getTime();
            wx.onShow(WxShare.onShowCallback);
        }
    };
    //分享操作结果
    WxShare.shareRes = function () {
        //首次
        if (WxShare.hasFirstSuccess && WxShare.No === 1)
            return true;
        //时间区间
        for (var _i = 0, _a = WxShare.successTimeRange; _i < _a.length; _i++) {
            var v = _a[_i];
            if ((v[0] !== '+' && v[0] > WxShare.shareTimeLong) || (v[1] !== '+' && v[1] < WxShare.shareTimeLong))
                return false;
        }
        //成功率
        return Math.random() < WxShare.successOdds;
    };
    //分享操作确认弹框
    WxShare.shareConfirm = function (yes, cancel) {
        wx.showModal({
            title: "提示",
            content: WxShare.confirmMsg,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '重新分享',
            confirmColor: '#576B95',
            success: function (res) {
                if (res.confirm) {
                    if (yes)
                        yes();
                }
                else if (res.cancel) {
                    if (cancel)
                        cancel();
                }
            },
        });
    };
    //初始化资源
    WxShare.initAssets = function (obj) {
        if (obj === void 0) { obj = {}; }
        this.shareData = obj;
        console.log("initAssets", obj);
        if (obj.titles) {
            if (typeof obj.titles === 'string')
                obj.titles = obj.titles.split(',');
            WxShare.titles = obj.titles;
        }
        if (obj.imgs) {
            if (typeof obj.igms === 'string')
                obj.imgs = obj.imgs.split(',');
            WxShare.imgs = obj.imgs;
        }
        WxShare.assetsLen = WxShare.imgs.length > WxShare.titles.length ? WxShare.titles.length : WxShare.imgs.length;
    };
    //随机读取一对资源
    WxShare.randomAssets = function () {
        return WxShare.assetsLen ? WxShare.indexAssets(Math.floor(Math.random() * WxShare.assetsLen)) : {};
    };
    //顺序读取一对资源
    WxShare.sequentialAssets = function () {
        return WxShare.assetsLen ? WxShare.indexAssets(WxShare.sequentialIndex++) : {};
    };
    //读取特定下标的资源(如果标题或图片的最大长度，则以取余的形式读取)
    WxShare.indexAssets = function (index) {
        if (index === void 0) { index = 0; }
        index = Math.floor(index % this.assetsLen);
        return { title: WxShare.titles[index], img: WxShare.imgs[index] };
    };
    //随机读取一组数据
    WxShare.randomData = function () {
        var len = this.shareData.length;
        var index = Math.floor(Math.random() * len);
        return { title: WxShare.shareData[index].title, imageUrlId: WxShare.shareData[index].id, imageUrl: WxShare.shareData[index].url };
    };
    //+----------------------------------------------------------------------------------------------------
    //| 请求参数
    //+----------------------------------------------------------------------------------------------------
    WxShare.query = {};
    //+----------------------------------------------------------------------------------------------------
    //| 分享结果判断
    //+----------------------------------------------------------------------------------------------------
    //本次分享的编号
    WxShare.No = 0;
    //是否需要首次成功
    WxShare.hasFirstSuccess = false;
    //分享成功的时间区间
    WxShare.successTimeRange = [[1000, '+']];
    //分享成功率
    WxShare.successOdds = 0.5;
    //分享开始时间
    WxShare.shareBeginTime = 0;
    //分享结束时间
    WxShare.shareEndTime = 0;
    //分享操作时长
    WxShare.shareTimeLong = 0;
    WxShare.onShowCallback = null;
    //+----------------------------------------------------------------------------------------------------
    //| 确认弹窗
    //+----------------------------------------------------------------------------------------------------
    //确认框最大连续拉起数(如果需要设置为不限制的话，请设置一个大数，如：9999) 当达到上限时视为成功
    WxShare.confirmNum = 3;
    //分享失败是否再次发起一次确认
    WxShare.hasConfirm = false;
    //分享失败确认框提示信息
    WxShare.confirmMsg = "请确认分享给群好友";
    //+----------------------------------------------------------------------------------------------------
    //| 标题与图片资源管理
    //| PS:如需要标题与图片资源一一对应的情况请将它们按顺序排放
    //+----------------------------------------------------------------------------------------------------
    //标题资源列表
    WxShare.titles = [];
    //图片资源列表
    WxShare.imgs = [];
    //分享列表
    WxShare.shareData = [];
    //图片资源长度或标题资源长度两者之间的最小值
    WxShare.assetsLen = 1;
    ////顺序读取一对资源下标
    WxShare.sequentialIndex = 0;
    return WxShare;
}());
exports.default = WxShare;
