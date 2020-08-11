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
var ConfigData_1 = require("../../Data/ConfigData");
var LeadOutMg_1 = __importDefault(require("../../Manages/LeadOutMg"));
var PlatformMg_1 = __importDefault(require("../../Platform/PlatformMg"));
var GameData_1 = __importDefault(require("../../Game/GameMg/GameData"));
var SoundUtil_1 = __importDefault(require("../../Utils/SoundUtil"));
var LocalStorageUtil_1 = __importDefault(require("../../Utils/LocalStorageUtil"));
var ExprotBox2Dialog = /** @class */ (function (_super) {
    __extends(ExprotBox2Dialog, _super);
    function ExprotBox2Dialog() {
        var _this = _super.call(this) || this;
        _this.dataList = []; //当前的导出数据
        return _this;
    }
    ExprotBox2Dialog.prototype.initData = function () {
        if (LeadOutMg_1.default.GameList) {
            for (var i = 0; i < LeadOutMg_1.default.GameList.length; i++) {
                this.dataList.push(LeadOutMg_1.default.GameList[i]);
            }
        }
        else {
            this.dataList = [];
        }
        GameData_1.default.IsDcBox = false;
        GameData_1.default.DCHandNum = 0;
        //UmMg.trackEvent('e_53')
    };
    ExprotBox2Dialog.prototype.findView = function () {
        this.btnNext = this.owner.getChildByName('btnNext');
        this.btnSj = this.owner.getChildByName('btnSj');
        this.list = this.owner.getChildByName('list');
        this.btn_retrun = this.owner.getChildByName('retrunHome');
    };
    ExprotBox2Dialog.prototype.initView = function () {
        this.list.top = PlatformMg_1.default.Instance.JLBtnInfo.height + PlatformMg_1.default.Instance.JLBtnInfo.top + 30;
        this.btn_retrun.top = parseInt(PlatformMg_1.default.Instance.JLBtnInfo.top) + (parseInt(PlatformMg_1.default.Instance.JLBtnInfo.height) - this.btn_retrun.height) / 2;
    };
    ExprotBox2Dialog.prototype.screenAdaptation = function () {
        var _this = this;
        if (GameData_1.default.DcSj2) {
            Laya.timer.once(5000, this, function () {
                _this.btnSj.visible = false;
            });
        }
        else {
            this.btnSj.visible = false;
            LocalStorageUtil_1.default.setBoolean(ConfigData_1.LocalStorageKey.DcSj2, true);
        }
    };
    /**点击 */
    ExprotBox2Dialog.prototype.onClick = function (e) {
        e.stopPropagation();
        if (e.target.name.substring(0, 3) === 'btn') {
            SoundUtil_1.default.play('click');
        }
        switch (e.target.name) {
            case 'btnSj':
                //随机导出
                //LeadOutMg.leadOut(this.dataList[Math.floor(Math.random()*this.dataList.length)],'e_47')
                break;
            case 'btnNext':
                //继续
                break;
            case 'retrunHome':
                //返回
                break;
            default:
                break;
        }
    };
    ExprotBox2Dialog.prototype.onDisable = function () {
        _super.prototype.onDisable.call(this);
        GameData_1.default.DcSj2 = true;
    };
    return ExprotBox2Dialog;
}(BaseDialogSc_1.default));
exports.default = ExprotBox2Dialog;
