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
var GameData_1 = __importDefault(require("../Game/GameMg/GameData"));
var DcHandMg = /** @class */ (function (_super) {
    __extends(DcHandMg, _super);
    function DcHandMg() {
        var _this = _super.call(this) || this;
        _this.arr = [];
        return _this;
    }
    DcHandMg.prototype.onEnable = function () {
        this.arr = [{ x: 95, y: 110 }, { x: 327, y: 110 }, { x: 540, y: 110 }, { x: 95, y: 374 }, { x: 327, y: 374 }, { x: 540, y: 374 }];
        this.showHand();
    };
    DcHandMg.prototype.showHand = function () {
        var _this = this;
        if (this.owner.name == 'hand') {
            var num = Math.floor(this.arr.length * Math.random());
            this.owner.pos(this.arr[num].x, this.arr[num].y);
        }
        else {
            if (GameData_1.default.DCHandNum < GameData_1.default.DCHandNumMax && Math.random() < 0.2) {
                this.owner.visible = true;
                GameData_1.default.DCHandNum++;
                console.log('导出手指个数', GameData_1.default.DCHandNum);
            }
            else {
                this.owner.visible = false;
                return;
            }
        }
        Laya.timer.loop(600, this, function () {
            _this.owner.visible = !_this.owner.visible;
        });
    };
    DcHandMg.prototype.onDisable = function () {
        Laya.timer.clearAll(this);
    };
    return DcHandMg;
}(Laya.Script));
exports.default = DcHandMg;
