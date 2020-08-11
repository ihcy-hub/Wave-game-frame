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
var GameMg_1 = __importDefault(require("../Game/GameMg/GameMg"));
var StopBtn = /** @class */ (function (_super) {
    __extends(StopBtn, _super);
    function StopBtn() {
        return _super.call(this) || this;
    }
    StopBtn.prototype.onEnable = function () {
        //计算获得距离顶部的高度
        this.owner.left = 20;
        this.owner.top = parseInt(PlatformMg_1.default.Instance.JLBtnInfo.top) + (parseInt(PlatformMg_1.default.Instance.JLBtnInfo.height) - 56) / 2;
    };
    StopBtn.prototype.onClick = function () {
        GameMg_1.default.Instance.gamePause();
    };
    return StopBtn;
}(Laya.Script));
exports.default = StopBtn;
