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
var CheckInDialog_1 = __importDefault(require("../Activity/Scripts/CheckInDialog"));
var CheckInBoxControl = /** @class */ (function (_super) {
    __extends(CheckInBoxControl, _super);
    function CheckInBoxControl() {
        return _super.call(this) || this;
    }
    CheckInBoxControl.prototype.onEnable = function () {
        this.txt = this.owner.getChildByName('txt');
        this.prompt = this.owner.getChildByName('prompt');
        this.yqd = this.owner.getChildByName('yqd');
        this.title = this.owner.getChildByName('title');
        this.coin = this.owner.getChildByName('coin');
        this.title.text = '第' + this.dateNum + '天';
        if (GameData_1.default.CheckDate[this.dateNum - 1].type == 'power') {
            this.coin.graphics.clear();
            var texture = Laya.loader.getRes('game/tl_ico.png');
            this.coin.loadImage('game/tl_ico.png');
        }
        this.txt.text = '+' + GameData_1.default.CheckDate[this.dateNum - 1].val;
        console.log('签到', CheckInDialog_1.default.instance);
        var dayNum = CheckInDialog_1.default.instance.dayNum;
        if (this.dateNum < dayNum || this.dateNum == dayNum) {
            this.prompt.visible = true;
            this.yqd.visible = true;
        }
    };
    CheckInBoxControl.prototype.onDisable = function () {
    };
    return CheckInBoxControl;
}(Laya.Script));
exports.default = CheckInBoxControl;
