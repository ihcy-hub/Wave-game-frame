"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**数组攻击类 */
var ArrUtil = /** @class */ (function () {
    function ArrUtil() {
    }
    Object.defineProperty(ArrUtil, "Instance", {
        get: function () {
            if (!this.instance) {
                this.instance = new ArrUtil();
            }
            return this.instance;
        },
        enumerable: false,
        configurable: true
    });
    /**随机从数组中选取选取几个元素 */
    ArrUtil.prototype.getRandomArrayElements = function (arr, count) {
        if (count > (arr.length - 1)) {
            //return arr;
            return this.shuffle(arr);
        }
        else {
            var shuffled = arr.slice(0);
            var i = arr.length;
            var min = i - count;
            var temp = void 0;
            var index = void 0;
            while (i-- > min) {
                index = Math.floor((i + 1) * Math.random());
                temp = shuffled[index];
                shuffled[index] = shuffled[i];
                shuffled[i] = temp; //将随机出来的函数移到最后面
            }
            //return shuffled.slice(min);
            return this.shuffle(shuffled.slice(min));
        }
    };
    /**
     * 数组随机选取几个元素，返回选择的元素和剩下的元素数组
     *  @param arr 要操作的数组
     *  @param count 要选取的个数
     *  */
    ArrUtil.prototype.arrRandom = function (arr, count) {
        var obj = { new: [], over: [] };
        var oldArr = this.shuffle(arr);
        obj.new = arr.splice(0, count);
        obj.over = arr;
        return obj;
    };
    /**数组随机排序 */
    ArrUtil.prototype.shuffle = function (arr) {
        var len = arr.length;
        for (var i = 0; i < len - 1; i++) {
            var index = Math.floor(Math.random() * (len - i));
            var temp = arr[index];
            arr[index] = arr[len - i - 1];
            arr[len - i - 1] = temp;
        }
        return arr;
    };
    /**随机返回一个整数 */
    ArrUtil.prototype.randomNum = function (val) {
        var num = 0;
        num = Math.floor(Math.random() * val);
        return num;
    };
    /**
     * 使用对象池创建动画
     * @param name 对象池名称
     * @param src 动画路径
     */
    ArrUtil.prototype.createAni = function (name, src) {
        var ani = new Laya.Animation();
        ani.loadAnimation(src);
        ani.on(Laya.Event.COMPLETE, null, recover);
        function recover() {
            ani.removeSelf();
            Laya.Pool.recover(name, ani);
        }
        return ani;
    };
    /*
    * 获取某个元素下标
    * @param arr: 传入的数组
    * @param obj: 需要获取下标的元素
    * */
    ArrUtil.prototype.getArrayIndex = function (arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return i;
            }
        }
        return -1;
    };
    return ArrUtil;
}());
exports.default = ArrUtil;
