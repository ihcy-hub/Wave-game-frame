"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PlatformMg_1 = __importDefault(require("../Platform/PlatformMg"));
var UmMg = /** @class */ (function () {
    function UmMg() {
    }
    /**
     * 自定义事件上报
     * @param eventId umeng 自定义事件id
     * @param params  参数 不能为数组
     */
    UmMg.trackEvent = function (eventId, params) {
        if (!PlatformMg_1.default.Instance.onWx) {
            return;
        }
        console.log("UmMg ---> trackEvent : ", eventId);
        if (params) {
            if (params instanceof Array) {
                console.error("友盟上报事件属性不能为数组");
                return;
            }
            PlatformMg_1.default.Instance.platform.uma.trackEvent(eventId, params);
        }
        else {
            PlatformMg_1.default.Instance.platform.uma.trackEvent(eventId);
        }
    };
    return UmMg;
}());
exports.default = UmMg;
