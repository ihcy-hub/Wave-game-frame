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
var TipsUtil_1 = __importDefault(require("../../Utils/TipsUtil"));
var PlatformMg_1 = __importDefault(require("../../Platform/PlatformMg"));
var WindowUtil_1 = __importDefault(require("../../Utils/WindowUtil"));
var SoundUtil_1 = __importDefault(require("../../Utils/SoundUtil"));
var ActivityUrls_1 = __importDefault(require("../../Data/ActivityUrls"));
var GameMg_1 = __importDefault(require("../../Game/GameMg/GameMg"));
var AdMg_1 = __importDefault(require("../../Platform/AdMg"));
var ConfigData_1 = __importDefault(require("../../Data/ConfigData"));
var UmMg_1 = __importDefault(require("../../Utils/UmMg"));
var VivoAdUtil_1 = __importDefault(require("../../Platform/VivoAdUtil"));
/**通关获得金币 */
var FailDialog = /** @class */ (function (_super) {
    __extends(FailDialog, _super);
    function FailDialog() {
        var _this = _super.call(this) || this;
        _this.speed = 1;
        _this.isShar = true;
        return _this;
    }
    FailDialog.prototype.initData = function () {
        GameData_1.default.Dctj = 2;
        GameData_1.default.RetrunHomeNum = 2;
        if (PlatformMg_1.default.Instance.isVivo) {
            VivoAdUtil_1.default.showNative();
        }
        //this.showBoxOrInter();
    };
    FailDialog.prototype.findView = function () {
        this.boxBtn = this.owner.getChildByName('boxBtn');
        this.btnHome = this.owner.getChildByName('btn_home');
        this.CoinBox = this.owner.getChildByName('CoinBox');
        //this.btnNext = this.owner.getChildByName('btnNext') as Laya.Label;
        this.add = this.owner.getChildByName('add');
        this.add.top = parseInt(PlatformMg_1.default.Instance.JLBtnInfo.top) + (parseInt(PlatformMg_1.default.Instance.JLBtnInfo.height) - 42) / 2;
        this.dcBox = this.owner.getChildByName('DcBox3');
        this.list = this.dcBox.getChildByName('list');
        this.btnCoin = this.boxBtn.getChildByName('btnCoin');
        this.btnVideo = this.boxBtn.getChildByName('btnVideo');
        this.btnClose = this.owner.getChildByName('btnClose');
    };
    FailDialog.prototype.initView = function () {
        var _this = this;
        if (PlatformMg_1.default.Instance.isWx || PlatformMg_1.default.Instance.isQq) {
            this.add.visible = true;
        }
        else {
            this.add.visible = false;
        }
        if (!PlatformMg_1.default.Instance.isBd) {
            Laya.timer.once(1500, this, function () {
                _this.btnClose.visible = true;
            });
        }
        if (PlatformMg_1.default.Instance.isWx) {
            this.dcBox.visible = true;
        }
        else {
            this.dcBox.visible = false;
        }
        //this.btnHome.top =  parseInt(PlatformMg.Instance.JLBtnInfo.top) +(parseInt(PlatformMg.Instance.JLBtnInfo.height)-60)/2
        this.CoinBox.left = this.btnHome.left + this.btnHome.width + 10;
    };
    FailDialog.prototype.screenAdaptation = function () {
        if (WindowUtil_1.default.isIphoneX) {
            this.dcBox.bottom += 150;
            this.boxBtn.bottom += 150;
        }
        this.onCasualClick();
        if (PlatformMg_1.default.Instance.isBd) {
            this.btnClose.visible = false;
        }
    };
    /**banner误点 */
    FailDialog.prototype.onCasualClick = function () {
        var _this = this;
        var that = this;
        if (ConfigData_1.default.IsMisLead) {
            this.btnClose.visible = true;
            this.btnClose.bottom = WindowUtil_1.default.isIphoneX ? 155 : 105;
            Laya.timer.once(ConfigData_1.default.bannerTime, this, function () {
                if (!PlatformMg_1.default.Instance.isVivo)
                    _this.showBottomBanner();
            });
            Laya.timer.once(ConfigData_1.default.bannerTime + 500, this, function () {
                Laya.Tween.to(that.btnClose, { bottom: WindowUtil_1.default.isIphoneX ? 339 : 288 }, 200);
            });
        }
        else {
            this.btnClose.bottom = WindowUtil_1.default.isIphoneX ? 339 : 288;
            if (!PlatformMg_1.default.Instance.isVivo)
                this.showBottomBanner();
        }
    };
    FailDialog.prototype.onUpdate = function () {
        if (this.add.right > 190) {
            this.speed = -1;
        }
        else if (this.add.right < 170) {
            this.speed = 1;
        }
        this.add.right += this.speed;
    };
    FailDialog.prototype.onClick = function (e) {
        var _this = this;
        e.stopPropagation();
        if (e.target.name.substring(0, 3) === 'btn') {
            SoundUtil_1.default.play('click');
        }
        switch (e.target.name) {
            case 'btnVideo':
                //复活
                AdMg_1.default.Instance.showVideo({
                    success: function () {
                        UmMg_1.default.trackEvent('e_21');
                        //AldUtil.stageRunning();
                        _this.owner.close();
                        clearTimeout(_this.setTime);
                        GameData_1.default.IsResu++;
                        //复活
                        GameMg_1.default.Instance.gameRelive();
                    }
                });
                break;
            case 'btnCoin':
                //复活
                if (GameData_1.default.Coin >= 400) {
                    UmMg_1.default.trackEvent('e_20');
                    GameData_1.default.cutCoin(400);
                    this.owner.close();
                    clearTimeout(this.setTime);
                    GameData_1.default.IsResu++;
                    //复活
                    GameMg_1.default.Instance.gameRelive();
                }
                else {
                    TipsUtil_1.default.msg("金币不足！");
                }
                break;
            case 'btnClose':
                clearTimeout(this.setTime);
                UmMg_1.default.trackEvent('e_22');
                this.owner.close();
                if (PlatformMg_1.default.Instance.isWx) {
                    Laya.Dialog.open(ActivityUrls_1.default.EXPROTLIST_DIALOG, true, function () {
                        Laya.Dialog.open(ActivityUrls_1.default.FAIL_DIALOG, true);
                    });
                }
                else {
                    Laya.Dialog.open(ActivityUrls_1.default.FAIL_DIALOG, true);
                }
                break;
            default:
                break;
        }
    };
    return FailDialog;
}(BaseDialogSc_1.default));
exports.default = FailDialog;
