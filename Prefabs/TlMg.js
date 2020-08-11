"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PlatformMg_1 = __importDefault(require("../Platform/PlatformMg"));
var EventCenter_1 = __importDefault(require("../EventSystem/EventCenter"));
var ConfigData_1 = require("../Data/ConfigData");
var ProwerMg_1 = __importDefault(require("../Game/GameMg/ProwerMg"));
var LocalStorageUtil_1 = __importDefault(require("../Utils/LocalStorageUtil"));
/**体力图标 */
var TlMg = /** @class */ (function (_super) {
    __extends(TlMg, _super);
    function TlMg() {
        return _super.call(this) || this;
    }
    TlMg.prototype.onEnable = function () {
        this.txt = this.owner.getChildByName('txt');
        this.djsTxt = this.owner.getChildByName('djsTxt');
        this.setTlVal();
        EventCenter_1.default.Instance.on(ConfigData_1.EventKey.TL, this.setTlVal, this);
        if (ProwerMg_1.default.TlVal <= 0) {
            this.djsTxt.visible = true;
            this.onDjs();
        }
        this.setInfo();
        EventCenter_1.default.Instance.on(ConfigData_1.EventKey.JNINFO, this.setInfo, this);
    };
    TlMg.prototype.setInfo = function () {
        //计算获得距离顶部的高度
        this.owner.top = parseInt(PlatformMg_1.default.Instance.JLBtnInfo.top) + (parseInt(PlatformMg_1.default.Instance.JLBtnInfo.height) - 57) / 2;
        EventCenter_1.default.Instance.removeListener(ConfigData_1.EventKey.JNINFO, this);
    };
    /**设置体力值 */
    TlMg.prototype.setTlVal = function () {
        this.txt.text = ProwerMg_1.default.TlVal + '';
    };
    TlMg.prototype.onDjs = function () {
        var _this = this;
        var oldTime = LocalStorageUtil_1.default.getNumber(ConfigData_1.LocalStorageKey.TLTIME, Laya.timer.currTimer);
        Laya.timer.loop(1000, this, function () {
            var S = ProwerMg_1.default.TLCutTime / 1000 - (Laya.timer.currTimer - oldTime) / 1000;
            if (S <= 0) {
                _this.djsTxt.visible = false;
                Laya.timer.clearAll(_this);
                ProwerMg_1.default.SetTl(false, 1);
                _this.setTlVal();
            }
            var F = Math.floor(S / 60);
            _this.djsTxt.text = F + ':' + Math.floor(S - F * 60);
        });
    };
    TlMg.prototype.onUpdate = function () {
        this.txt.text = ProwerMg_1.default.TlVal + '';
    };
    TlMg.prototype.onDisable = function () {
        EventCenter_1.default.Instance.removeListener(ConfigData_1.EventKey.TL, this);
        Laya.timer.clearAll(this);
    };
    return TlMg;
}(Laya.Script));
exports.default = TlMg;
