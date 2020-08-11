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
var WindowUtil_1 = __importDefault(require("../Utils/WindowUtil"));
var EventCenter_1 = __importDefault(require("../EventSystem/EventCenter"));
var ConfigData_1 = require("../Data/ConfigData");
var retrunHomeMg = /** @class */ (function (_super) {
    __extends(retrunHomeMg, _super);
    function retrunHomeMg() {
        return _super.call(this) || this;
    }
    retrunHomeMg.prototype.onEnable = function () {
        this.setInfo();
        EventCenter_1.default.Instance.on(ConfigData_1.EventKey.JNINFO, this.setInfo, this);
    };
    retrunHomeMg.prototype.setInfo = function () {
        this.owner.top = parseInt(PlatformMg_1.default.Instance.JLBtnInfo.top) + (parseInt(PlatformMg_1.default.Instance.JLBtnInfo.height) - 57) / 2;
        if (WindowUtil_1.default.isIphoneX && !Laya.Browser.onIOS) {
            this.owner.top += 57;
        }
        EventCenter_1.default.Instance.removeListener(ConfigData_1.EventKey.JNINFO, this);
    };
    return retrunHomeMg;
}(Laya.Script));
exports.default = retrunHomeMg;
