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
var WindowUtil_1 = __importDefault(require("../Utils/WindowUtil"));
var PlatformMg_1 = __importDefault(require("../Platform/PlatformMg"));
var BottomBoxControl = /** @class */ (function (_super) {
    __extends(BottomBoxControl, _super);
    function BottomBoxControl() {
        return _super.call(this) || this;
    }
    BottomBoxControl.prototype.onEnable = function () {
        if (!PlatformMg_1.default.Instance.onWx) {
            this.owner.visible = false;
        }
        if (WindowUtil_1.default.isIphoneX) {
            //this.owner.bottom = 50;
        }
    };
    BottomBoxControl.prototype.onDisable = function () {
    };
    return BottomBoxControl;
}(Laya.Script));
exports.default = BottomBoxControl;
