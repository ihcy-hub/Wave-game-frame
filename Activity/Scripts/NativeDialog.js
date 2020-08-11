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
var VivoAdUtil_1 = __importDefault(require("../../Platform/VivoAdUtil"));
var ConfigData_1 = __importDefault(require("../../Data/ConfigData"));
var SoundUtil_1 = __importDefault(require("../../Utils/SoundUtil"));
var GameData_1 = __importDefault(require("../../Game/GameMg/GameData"));
/**vivo oppo原生广告 */
var NativeDialog = /** @class */ (function (_super) {
    __extends(NativeDialog, _super);
    function NativeDialog() {
        var _this = _super.call(this) || this;
        _this.btnSrc = [];
        _this.isOpenGG = true; //点击打开广告
        return _this;
    }
    NativeDialog.prototype.initData = function () {
        this.isOpenGG = true;
        VivoAdUtil_1.default.ReportAdShow();
        this.btnSrc = ['native/btn_djck.png', 'native/btn_djdk.png', 'native/btn_ljdk.png'];
    };
    NativeDialog.prototype.findView = function () {
        this.box = this.owner.getChildByName('box');
        this.pic = this.box.getChildByName('pic');
        this.name = this.box.getChildByName('name');
        this.btnClose = this.box.getChildByName('btnClose');
        this.btnCloseTxt = this.btnClose.getChildByName('txt');
        this.ggClose = this.box.getChildByName('ggClose');
    };
    NativeDialog.prototype.initView = function () {
        var _this = this;
        this.name.text = VivoAdUtil_1.default.nativeList[0].title;
        this.pic.skin = VivoAdUtil_1.default.nativeList[0].imgUrlList[0];
        this.btnClose.skin = this.btnSrc[Math.floor(Math.random() * this.btnSrc.length)];
        // if(ConfigData.IsMisLead){
        //     this.btnCloseTxt.text = '点击查看'
        // }else{
        //     this.btnCloseTxt.text = '查看广告'
        // }
        this.btnCloseTxt.text = '';
        if (!ConfigData_1.default.IsMisLead) {
            Laya.timer.once(2000, this, function () {
                _this.ggClose.visible = true;
            });
        }
        else {
            this.ggClose.visible = true;
        }
    };
    NativeDialog.prototype.screenAdaptation = function () {
    };
    NativeDialog.prototype.onClick = function (e) {
        e.stopPropagation();
        if (e.target.name.substring(0, 3) === 'btn') {
            SoundUtil_1.default.play('click');
        }
        switch (e.target.name) {
            case 'ggClose':
                if (GameData_1.default.NowLevel > 4 && Math.random() < 0.5 && this.isOpenGG) {
                    this.isOpenGG = false;
                    VivoAdUtil_1.default.ReportAdClick();
                    this.closeFun && this.closeFun();
                }
                else {
                    this.owner.close();
                    this.closeFun && this.closeFun();
                }
                break;
            case 'pic':
            case 'btnClose':
            case 'name':
                VivoAdUtil_1.default.ReportAdClick();
                this.owner.close();
                this.closeFun && this.closeFun();
                break;
            default:
                break;
        }
    };
    NativeDialog.prototype.onDisable = function () {
        VivoAdUtil_1.default.RestNativeInit();
        Laya.timer.clearAll(this);
    };
    return NativeDialog;
}(BaseDialogSc_1.default));
exports.default = NativeDialog;
