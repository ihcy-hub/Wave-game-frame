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
var PlatformMg_1 = __importDefault(require("../../Platform/PlatformMg"));
var SoundUtil_1 = __importDefault(require("../../Utils/SoundUtil"));
var ActivityUrls_1 = __importDefault(require("../../Data/ActivityUrls"));
var BaseDialogSc_1 = __importDefault(require("../BaseDialogSc"));
var MentDialog = /** @class */ (function (_super) {
    __extends(MentDialog, _super);
    function MentDialog() {
        return _super.call(this) || this;
    }
    MentDialog.prototype.initData = function () {
    };
    MentDialog.prototype.findView = function () {
        this.box = this.owner.getChildByName('box');
        this.btnSound = this.box.getChildByName('btn_sound');
        this.btnYxq = this.box.getChildByName('btn_yxq');
        this.btn_kf = this.box.getChildByName('btn_kf');
        this.btn_rm = this.box.getChildByName('btn_rm');
    };
    MentDialog.prototype.initView = function () {
        if (Laya.LocalStorage.getItem('sound_key')) {
            this.btnSound.selected = true;
        }
        else {
            this.btnSound.selected = false;
        }
        if (PlatformMg_1.default.Instance.isWx) {
            var wx = Laya.Browser.window.wx;
            var sysInfo = wx.getSystemInfoSync();
            //获取微信界面大小
            var wxWidth = sysInfo.screenWidth;
            var wxHeight = sysInfo.screenHeight;
            var xPercent = this.btnYxq.x / Laya.stage.width;
            var yPercent = this.btnYxq.y / Laya.stage.height;
            var wPercent = this.btnYxq.width / Laya.stage.width;
            var hPercent = this.btnYxq.height / Laya.stage.height;
            this.button = wx.createGameClubButton({
                type: "image",
                image: 'public/btn_ment_yxq.png',
                icon: "white",
                style: {
                    left: wxWidth * xPercent,
                    top: wxHeight * yPercent,
                    width: wxWidth * wPercent,
                    height: wxHeight * hPercent,
                }
            });
        }
        else {
            this.btnYxq.visible = false;
            this.btn_kf.visible = false;
            this.btn_rm.visible = false;
        }
        ;
    };
    MentDialog.prototype.screenAdaptation = function () {
    };
    MentDialog.prototype.onClick = function (e) {
        e.stopPropagation();
        switch (e.target.name) {
            case 'btn_close':
                this.owner.close();
                Laya.Dialog.open('dialog/homeDialog.scene');
                // Laya.Tween.to(this.box,{x:-260},500,()=>{
                // });
                break;
            case 'btn_sound': //声音
                if (this.btnSound.selected) {
                    SoundUtil_1.default.StopAll();
                }
                else {
                    SoundUtil_1.default.RestAll();
                    // SoundUtil.status = true;
                    // SoundUtil.play('bg');
                }
                break;
            case 'btn_kf': //客服
                if (Laya.Browser.onWeiXin) {
                    PlatformMg_1.default.Instance.platform.openCustomerServiceConversation({});
                }
                break;
            case 'btn_rm': //导出弹窗
                this.owner.close();
                Laya.Dialog.open(ActivityUrls_1.default.EXPROT_DIALOG);
                //Laya.Dialog.open('dialog/homeDialog.scene');
                break;
            default:
                this.owner.close();
                Laya.Dialog.open(ActivityUrls_1.default.Home_DIALOG);
                break;
        }
    };
    MentDialog.prototype.onDisable = function () {
        _super.prototype.onDisable.call(this);
        if (this.button != null) {
            this.button.destroy();
        }
    };
    return MentDialog;
}(BaseDialogSc_1.default));
exports.default = MentDialog;
