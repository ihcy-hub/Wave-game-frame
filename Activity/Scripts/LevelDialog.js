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
var GameMg_1 = __importDefault(require("../../Game/GameMg/GameMg"));
var PlatformMg_1 = __importDefault(require("../../Platform/PlatformMg"));
var ProwerMg_1 = __importDefault(require("../../Game/GameMg/ProwerMg"));
//关卡管理
var LevelDialog = /** @class */ (function (_super) {
    __extends(LevelDialog, _super);
    function LevelDialog() {
        var _this = _super.call(this) || this;
        _this.dataList = [];
        return _this;
    }
    LevelDialog.prototype.initData = function () {
        this.showBottomBanner();
    };
    LevelDialog.prototype.findView = function () {
        this.title = this.owner.getChildByName('title');
        this.list = this.owner.getChildByName('list');
        // for(let i=0;i<GameData.MaxLevel;i++){
        //     this.dataList.push(i+1)
        // }
        for (var i = 0; i < 100; i++) {
            this.dataList.push(i + 1);
        }
        // this.dataList = this.dataList.concat(this.dataList)
        console.log('关卡', this.dataList, GameData_1.default.UserLevel);
    };
    LevelDialog.prototype.initView = function () {
        this.title.top = parseInt(PlatformMg_1.default.Instance.JLBtnInfo.top) + 130;
        this.list.top = this.title.top + 87;
        this.onSetList();
    };
    LevelDialog.prototype.screenAdaptation = function () {
    };
    LevelDialog.prototype.onSetList = function () {
        this.list.vScrollBarSkin = '';
        this.list.selectEnable = true;
        this.list.array = this.dataList;
        this.list.refresh();
        this.list.renderHandler = new Laya.Handler(this, this.updateItem);
        this.list.mouseHandler = new Laya.Handler(this, this.onSelect);
    };
    //设置列表里面images图片路径
    LevelDialog.prototype.updateItem = function (cell, index) {
        if ((index + 1) <= GameData_1.default.UserLevel && (index + 1) <= GameData_1.default.MaxLevel) {
            cell.getChildByName('lock').visible = false;
        }
        else {
            cell.getChildByName('lock').visible = true;
        }
        cell.getChildByName('fontClip').value = index + 1;
    };
    //选中当前
    LevelDialog.prototype.onSelect = function (e, index) {
        if (e.type == 'click') {
            //点击
            SoundUtil_1.default.play('click');
            if (index < GameData_1.default.UserLevel && index <= GameData_1.default.MaxLevel) {
                //判断能量是否足够
                if (ProwerMg_1.default.TlVal < 1) {
                    Laya.Dialog.open(ActivityUrls_1.default.TL_DIALOG, true);
                }
                else {
                    this.owner.close();
                    GameData_1.default.NowLevel = index + 1;
                    GameData_1.default.IsTcHome = false;
                    Laya.View.open(ActivityUrls_1.default.GAME_SCENE, true, GameMg_1.default.Instance.gameStart);
                }
            }
        }
    };
    LevelDialog.prototype.onClick = function (e) {
        //e.stopPropagation();
        if (e.target.name.substring(0, 3) === 'btn') {
            SoundUtil_1.default.play('click');
        }
        switch (e.target.name) {
            case 'btn_home':
                // this.owner.close();
                // GameData.IsTcHome = true;
                // Laya.Dialog.open(ActivityUrls.Home_DIALOG);
                break;
            default:
                break;
        }
    };
    return LevelDialog;
}(BaseDialogSc_1.default));
exports.default = LevelDialog;
