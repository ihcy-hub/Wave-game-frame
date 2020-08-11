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
var BaseDialogSc_1 = __importDefault(require("../BaseDialogSc"));
var GameData_1 = __importDefault(require("../../Game/GameMg/GameData"));
var SoundUtil_1 = __importDefault(require("../../Utils/SoundUtil"));
var ActivityUrls_1 = __importDefault(require("../../Data/ActivityUrls"));
var PlatformMg_1 = __importDefault(require("../../Platform/PlatformMg"));
var AdMg_1 = __importDefault(require("../../Platform/AdMg"));
var EventCenter_1 = __importDefault(require("../../EventSystem/EventCenter"));
var ConfigData_1 = require("../../Data/ConfigData");
var ProwerMg_1 = __importDefault(require("../../Game/GameMg/ProwerMg"));
var UmMg_1 = __importDefault(require("../../Utils/UmMg"));
var LevelDialog = /** @class */ (function (_super) {
    __extends(LevelDialog, _super);
    function LevelDialog() {
        return _super.call(this) || this;
    }
    LevelDialog.prototype.initData = function () {
        UmMg_1.default.trackEvent('e_26');
        GameData_1.default.RetrunHomeNum = 3;
        this.showBottomBanner();
    };
    LevelDialog.prototype.findView = function () {
        this.BottomBox = this.owner.getChildByName('BottomBox');
        this.box = this.owner.getChildByName('box');
        this.btnLjlq = this.owner.getChildByName('btnLjlq');
        this.txt = this.box.getChildByName('txt');
    };
    LevelDialog.prototype.initView = function () {
        this.BottomBox.top = parseInt(PlatformMg_1.default.Instance.JLBtnInfo.top) + 150;
    };
    LevelDialog.prototype.screenAdaptation = function () {
    };
    LevelDialog.prototype.onClick = function (e) {
        var _this = this;
        //e.stopPropagation();
        if (e.target.name.substring(0, 3) === 'btn') {
            SoundUtil_1.default.play('click');
        }
        switch (e.target.name) {
            case 'btnLjlq':
                AdMg_1.default.Instance.showVideo({
                    success: function () {
                        UmMg_1.default.trackEvent('e_27');
                        _this.owner.close();
                        ProwerMg_1.default.SetTl(false, 3);
                        EventCenter_1.default.Instance.emit(ConfigData_1.EventKey.TL);
                        GameData_1.default.IsTcHome = true;
                        Laya.View.open(ActivityUrls_1.default.GAME_SCENE);
                        //this.closeFun&&this.closeFun();
                    }
                });
                break;
            default:
                break;
        }
    };
    return LevelDialog;
}(BaseDialogSc_1.default));
exports.default = LevelDialog;
