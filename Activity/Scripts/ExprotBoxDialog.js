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
var ConfigData_1 = __importDefault(require("../../Data/ConfigData"));
var LeadOutMg_1 = __importDefault(require("../../Manages/LeadOutMg"));
var PlatformMg_1 = __importDefault(require("../../Platform/PlatformMg"));
var AdMg_1 = __importDefault(require("../../Platform/AdMg"));
var GameData_1 = __importDefault(require("../../Game/GameMg/GameData"));
var SoundUtil_1 = __importDefault(require("../../Utils/SoundUtil"));
var UmMg_1 = __importDefault(require("../../Utils/UmMg"));
/**导出盒子页脚本 */
var ExprotBoxDialog = /** @class */ (function (_super) {
    __extends(ExprotBoxDialog, _super);
    function ExprotBoxDialog() {
        return _super.call(this) || this;
    }
    ExprotBoxDialog.prototype.initData = function () {
        UmMg_1.default.trackEvent('e_24');
        this.dataList = LeadOutMg_1.default.GameList;
        var _bannerTime = 1000;
        if (ConfigData_1.default.IsMisLead) {
            Laya.timer.once(_bannerTime, this, function () {
                AdMg_1.default.Instance.showBanner();
            });
            Laya.timer.once(4000, this, function () {
                AdMg_1.default.Instance.hideBanner();
            });
        }
    };
    ExprotBoxDialog.prototype.findView = function () {
        this.btnNext = this.owner.getChildByName('btnNext');
        this.top = this.owner.getChildByName('top');
        this.title = this.top.getChildByName('txt');
        this.list = this.owner.getChildByName('list');
        this.btn_retrun = this.top.getChildByName('btn_retrun');
    };
    ExprotBoxDialog.prototype.initView = function () {
        this.btnNext.visible = true;
        this._top = PlatformMg_1.default.Instance.JLBtnInfo.height + PlatformMg_1.default.Instance.JLBtnInfo.top + 20;
        this.top.height = this._top;
        this.list.top = this._top + 30;
        this.btn_retrun.top = parseInt(PlatformMg_1.default.Instance.JLBtnInfo.top) + (parseInt(PlatformMg_1.default.Instance.JLBtnInfo.height) - this.btn_retrun.height) / 2;
        this.title.top = parseInt(PlatformMg_1.default.Instance.JLBtnInfo.top) + (parseInt(PlatformMg_1.default.Instance.JLBtnInfo.height) - this.title.height) / 2;
        if (GameData_1.default.DcBoxzt === 1 || GameData_1.default.DcBoxzt === 2 || GameData_1.default.DcBoxzt === 3 || GameData_1.default.DcBoxzt === 4) {
            this.btn_retrun.visible = false;
        }
        else {
            this.btn_retrun.visible = true;
        }
    };
    ExprotBoxDialog.prototype.screenAdaptation = function () {
    };
    ExprotBoxDialog.prototype.onClick = function (e) {
        e.stopPropagation();
        if (e.target.name.substring(0, 3) === 'btn') {
            SoundUtil_1.default.play('click');
        }
        switch (e.target.name) {
            case 'btnNext':
                //继续下一步
                this.closeFun();
                UmMg_1.default.trackEvent('e_25');
                break;
            case 'btn_retrun':
                //返回
                this.closeFun();
                UmMg_1.default.trackEvent('e_25');
                break;
            default:
                break;
        }
    };
    return ExprotBoxDialog;
}(BaseDialogSc_1.default));
exports.default = ExprotBoxDialog;
