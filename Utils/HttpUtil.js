"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpUtil = /** @class */ (function () {
    //构造函数
    function HttpUtil() {
        //token
        this.TOKEN = '';
        HttpUtil._instance = this;
    }
    Object.defineProperty(HttpUtil, "Instance", {
        get: function () {
            if (!HttpUtil._instance)
                new HttpUtil();
            return HttpUtil._instance;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 发起请求[静态方法]
     * @param param
     */
    HttpUtil.request = function (param) {
        HttpUtil.Instance.request(param);
    };
    /**
     * 发起请求
     * @param param
     */
    HttpUtil.prototype.request = function (param) {
        //整理请求参数
        param = this.param(param);
        var r = new Laya.HttpRequest();
        //添加监听事件 完成
        r.once(Laya.Event.COMPLETE, this, function () { if (param.complete)
            param.complete(r.data); });
        //添加监听事件 异常
        r.once(Laya.Event.ERROR, this, function (err) { if (param.error)
            param.error(err); });
        //发起请求
        r.send(param.url, this.obj2str(param.data), param.method, param.responseType);
    };
    /**
     * 整理请求参数
     * @param param
     */
    HttpUtil.prototype.param = function (param) {
        if (param === void 0) { param = {}; }
        var d = param.data || {};
        // if (param.url !== 'login') d.token = this.TOKEN
        // d.timestamp = Math.floor((new Date()).getTime() / 1000)
        // d.sign = this.createSign(d)
        param.data = d;
        param.method = param.method || 'post';
        param.responseType = param.responseType || 'json';
        console.log(param);
        return param;
    };
    /**
     * 对obj的 属性名进行sort排序
     * 并返回属性名sort排序后的对象
     * @param {object} param 需要进行排序的对象
     * @return {object} newparam 排序完成的新对象
     */
    HttpUtil.prototype.objSort = function (param) {
        var newkeyArray = Object.keys(param).sort();
        var newParam = {}; //创建一个新的对象，用于存放排好序的键值对(Object)
        //遍历newkeyArray数组   
        for (var i = 0; i < newkeyArray.length; i++) {
            newParam[newkeyArray[i]] = param[newkeyArray[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
        }
        return newParam; //返回排好序的新对象
    };
    /**
     * 将请求参数转化字符串
     */
    HttpUtil.prototype.obj2str = function (param) {
        var str = '';
        for (var k in param) {
            str += '&' + k + '=' + param[k];
        }
        return str.substring(1);
    };
    return HttpUtil;
}());
exports.default = HttpUtil;
