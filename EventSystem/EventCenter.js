"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Observer_1 = __importDefault(require("./Observer"));
var EventCenter = /** @class */ (function () {
    function EventCenter() {
        /** 监听数组 */
        this.listeners = {};
    }
    Object.defineProperty(EventCenter, "Instance", {
        get: function () {
            if (!this.instance || this.instance == null) {
                this.instance = new EventCenter();
            }
            return this.instance;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 注册事件
     * @param name 事件名称
     * @param callback 回调函数
     * @param context 上下文
     */
    EventCenter.prototype.on = function (name, callback, context) {
        var observers = this.listeners[name];
        if (!observers) {
            this.listeners[name] = [];
        }
        this.listeners[name].push(new Observer_1.default(callback, context));
    };
    /**
     * 移除事件
     * @param name 事件名称
     * @param callback 回调函数
     * @param context 上下文
     */
    EventCenter.prototype.removeListener = function (name, context) {
        var observers = this.listeners[name];
        if (!observers)
            return;
        var length = observers.length;
        for (var i = 0; i < length; i++) {
            var observer = observers[i];
            if (observer.compar(context)) {
                observers.splice(i, 1);
                break;
            }
        }
        if (observers.length == 0) {
            delete this.listeners[name];
        }
    };
    /**
     * 发送事件
     * @param name 事件名称
     */
    EventCenter.prototype.emit = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var observers = this.listeners[name];
        if (!observers)
            return;
        var length = observers.length;
        for (var i = 0; i < length; i++) {
            var observer = observers[i];
            observer && observer.notify.apply(observer, args);
        }
    };
    EventCenter.instance = null;
    return EventCenter;
}());
exports.default = EventCenter;
