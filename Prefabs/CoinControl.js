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
var PublicMg_1 = __importDefault(require("../Game/GameMg/PublicMg"));
var PlatformMg_1 = __importDefault(require("../Platform/PlatformMg"));
var LocalStorageUtil_1 = __importDefault(require("../Utils/LocalStorageUtil"));
var ConfigData_1 = require("../Data/ConfigData");
var EventCenter_1 = __importDefault(require("../EventSystem/EventCenter"));
var CoinControl = /** @class */ (function (_super) {
    __extends(CoinControl, _super);
    function CoinControl() {
        return _super.call(this) || this;
    }
    CoinControl.prototype.onEnable = function () {
        this.txt = this.owner.getChildByName('txt');
        this.nowCoin = GameData_1.default.Coin;
        if (isNaN(GameData_1.default.Coin)) {
            GameData_1.default.Coin = 980;
            LocalStorageUtil_1.default.setNumber(ConfigData_1.LocalStorageKey.COIN, 980);
        }
        this.txt.text = PublicMg_1.default.Instance.setGoldCoin(GameData_1.default.Coin);
        this.setInfo();
        EventCenter_1.default.Instance.on(ConfigData_1.EventKey.JNINFO, this.setInfo, this);
    };
    CoinControl.prototype.setInfo = function () {
        //计算获得距离顶部的高度
        this.owner.top = parseInt(PlatformMg_1.default.Instance.JLBtnInfo.top) + (parseInt(PlatformMg_1.default.Instance.JLBtnInfo.height) - 57) / 2;
        EventCenter_1.default.Instance.removeListener(ConfigData_1.EventKey.JNINFO, this);
    };
    CoinControl.prototype.onUpdate = function () {
        if (GameData_1.default.Coin != this.nowCoin) {
            this.txt.text = PublicMg_1.default.Instance.setGoldCoin(GameData_1.default.Coin);
            this.nowCoin = GameData_1.default.Coin;
        }
    };
    CoinControl.prototype.onDisable = function () {
    };
    return CoinControl;
}(Laya.Script));
exports.default = CoinControl;
