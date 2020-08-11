"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var LocalStorageUtil_1 = __importDefault(require("../../Utils/LocalStorageUtil"));
var ConfigData_1 = require("../../Data/ConfigData");
/**体力管理类 */
var ProwerMg = /** @class */ (function () {
    function ProwerMg() {
    }
    /**
     * 体力变化
     * @param isCut 是否消耗体力 ting
     * @param num 体力数值
     */
    ProwerMg.SetTl = function (isCut, num) {
        if (isCut) {
            this.TlVal -= num;
            var time = Laya.timer.currTimer;
            LocalStorageUtil_1.default.setNumber(ConfigData_1.LocalStorageKey.TLTIME, time);
        }
        else {
            this.TlVal += num;
            if (this.TlVal > this.TLMax) {
                //this.TlVal = this.TLMax;
                this.IsTLCut = false;
                Laya.timer.clear(this, this.SetTl);
            }
        }
        if (this.TlVal < this.TLMax) {
            if (!this.IsTLCut) {
                this.IsTLCut = true;
                //定时增加体力
                Laya.timer.loop(this.TLCutTime, this, this.SetTl, [false, 1]);
            }
        }
        if (this.TlVal <= 0) {
            this.TlVal = 0;
        }
        LocalStorageUtil_1.default.setNumber(ConfigData_1.LocalStorageKey.TL, this.TlVal);
    };
    /**进入游戏时初始体力 */
    ProwerMg.initTL = function () {
        this.TlVal = LocalStorageUtil_1.default.getNumber(ConfigData_1.LocalStorageKey.TL, this.TLMax);
        var max = this.TLMax - this.TlVal;
        if (this.TlVal < this.TLMax) {
            //当前时间
            var time = Laya.timer.currTimer;
            //储存的的时间
            var localTime = LocalStorageUtil_1.default.getNumber(ConfigData_1.LocalStorageKey.TLTIME, Laya.timer.currTimer);
            var val = (time - localTime) / this.TLCutTime;
            console.log('体力', val);
            val = Math.floor(val);
            if (val > max)
                val = max;
            this.SetTl(false, val);
        }
    };
    ProwerMg.TlVal = 5; //当前体力值
    ProwerMg.TLMax = 5;
    ProwerMg.IsTLCut = false; //是否开始计算时间获得体力
    ProwerMg.TLCutTime = 5000 * 60; //毫秒
    return ProwerMg;
}());
exports.default = ProwerMg;
