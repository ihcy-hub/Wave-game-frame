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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDialogSc_1 = __importDefault(require("../BaseDialogSc"));
var PlatformMg_1 = __importDefault(require("../../Platform/PlatformMg"));
var SoundUtil_1 = __importDefault(require("../../Utils/SoundUtil"));
var AdMg_1 = __importDefault(require("../../Platform/AdMg"));
var ActivityUrls_1 = __importDefault(require("../../Data/ActivityUrls"));
var GameData_1 = __importDefault(require("../../Game/GameMg/GameData"));
var TipsUtil_1 = __importDefault(require("../../Utils/TipsUtil"));
var ConfigData_1 = __importStar(require("../../Data/ConfigData"));
var WxBannerAd_1 = __importDefault(require("../../Platform/Wx/WxBannerAd"));
var WindowUtil_1 = __importDefault(require("../../Utils/WindowUtil"));
var LocalStorageUtil_1 = __importDefault(require("../../Utils/LocalStorageUtil"));
var UmMg_1 = __importDefault(require("../../Utils/UmMg"));
var QqBannerAd_1 = __importDefault(require("../../Platform/Qq/QqBannerAd"));
var CheckInDialog = /** @class */ (function (_super) {
    __extends(CheckInDialog, _super);
    function CheckInDialog() {
        var _this = _super.call(this) || this;
        _this.lqNum = 2;
        CheckInDialog.instance = _this;
        return _this;
    }
    CheckInDialog.prototype.initData = function () {
        if (PlatformMg_1.default.Instance.isWx) {
            WxBannerAd_1.default.show();
        }
        else if (PlatformMg_1.default.Instance.isQq) {
            QqBannerAd_1.default.show();
        }
        var _date = new Date();
        this.dateTime = _date.getDate(); //获得当前日期 
    };
    CheckInDialog.prototype.findView = function () {
        this.qdBox = this.owner.getChildByName('qd_box');
        this.btn_lq = this.qdBox.getChildByName('btn_lq');
        this.check = this.owner.getChildByName('check');
        this.day7 = this.qdBox.getChildByName('day7');
        this.day7_prompt = this.day7.getChildByName('prompt');
        this.btn_zjlq = this.qdBox.getChildByName('btn_zjlq');
        this.btn_close = this.qdBox.getChildByName('btn_close');
    };
    CheckInDialog.prototype.initView = function () {
        var _this = this;
        if (PlatformMg_1.default.Instance.isTt || PlatformMg_1.default.Instance.isBd) {
            this.check.selected = false;
            this.check.visible = false;
        }
        var checkDate = LocalStorageUtil_1.default.getNumber(ConfigData_1.LocalStorageKey.CHECKINDATE, 0); //Laya.LocalStorage.getItem('checkDate')?Number(Laya.LocalStorage.getItem('checkDate')):0;
        this.dayNum = LocalStorageUtil_1.default.getNumber(ConfigData_1.LocalStorageKey.CHECKIN, 0); //Laya.LocalStorage.getItem('checkIn')?Number(Laya.LocalStorage.getItem('checkIn')):0;
        if (this.dayNum == 7 && this.dayNum > 7) {
            this.day7_prompt.visible = true;
        }
        if (this.dateTime != checkDate) {
            //今天未签到
            this.btn_lq.selected = false;
            this.btn_zjlq.selected = false;
        }
        else {
            //已经签到
            this.btn_lq.selected = true;
            this.btn_lq.disabled = true;
            this.btn_zjlq.selected = true;
            this.btn_zjlq.disabled = true;
        }
        if (ConfigData_1.default.IsMisLead) {
            this.check.selected = true;
        }
        else {
            this.check.selected = false;
        }
        if (PlatformMg_1.default.Instance.isBd) {
            this.check.selected = true;
            this.check.visible = false;
            this.btn_close.visible = false;
            this.btn_zjlq.visible = true;
            this.btn_lq.visible = false;
            this.lqNum = 1;
            Laya.timer.once(2000, this, function () {
                _this.btn_close.visible = true;
            });
        }
    };
    CheckInDialog.prototype.screenAdaptation = function () {
        if (WindowUtil_1.default.isIphoneX) {
            this.qdBox.bottom += 100;
            this.check.bottom += 100;
        }
    };
    CheckInDialog.prototype.onDisable = function () {
        _super.prototype.onDisable.call(this);
        if (PlatformMg_1.default.Instance.isWx) {
            WxBannerAd_1.default.hide();
        }
        else if (PlatformMg_1.default.Instance.isQq) {
            QqBannerAd_1.default.hide();
        }
    };
    CheckInDialog.prototype.onClick = function (e) {
        var _this = this;
        e.stopPropagation();
        if (e.target.name.substring(0, 3) === 'btn')
            SoundUtil_1.default.play('click');
        switch (e.target.name) {
            case 'btn_lq':
            case 'btn_zjlq':
                //console.log('签到!!!')
                if (this.dayNum < 7) {
                    if (this.check.selected) {
                        //视频双倍获得奖励
                        AdMg_1.default.Instance.showVideo({
                            success: function () {
                                //双倍奖励业务代码
                                //Laya.Dialog.open(ActivityUrls.Home_DIALOG)
                            }
                        });
                    }
                    else {
                        UmMg_1.default.trackEvent('e_38');
                        //普通领取奖励业务代码
                        //存储领取
                        LocalStorageUtil_1.default.setNumber(ConfigData_1.LocalStorageKey.CHECKIN, this.dayNum + 1);
                        LocalStorageUtil_1.default.setNumber(ConfigData_1.LocalStorageKey.CHECKINDATE, this.dateTime);
                        Laya.Dialog.open(ActivityUrls_1.default.Home_DIALOG);
                    }
                }
                else {
                    //第7天以后
                    if (this.check.selected) {
                        AdMg_1.default.Instance.showVideo({
                            success: function () {
                                //双倍奖励业务代码
                                TipsUtil_1.default.msg('恭喜获得' + GameData_1.default.CheckDate[_this.dayNum].val * _this.lqNum + '体力');
                                LocalStorageUtil_1.default.setNumber(ConfigData_1.LocalStorageKey.CHECKIN, _this.dayNum + 1);
                                LocalStorageUtil_1.default.setNumber(ConfigData_1.LocalStorageKey.CHECKINDATE, _this.dateTime);
                                Laya.Dialog.open(ActivityUrls_1.default.Home_DIALOG);
                            }
                        });
                    }
                    else {
                        //普通奖励业务代码
                        LocalStorageUtil_1.default.setNumber(ConfigData_1.LocalStorageKey.CHECKIN, this.dayNum + 1);
                        LocalStorageUtil_1.default.setNumber(ConfigData_1.LocalStorageKey.CHECKINDATE, this.dateTime);
                        Laya.Dialog.open(ActivityUrls_1.default.Home_DIALOG);
                    }
                }
                break;
            case 'btn_close':
                Laya.Dialog.open(ActivityUrls_1.default.Home_DIALOG, true);
                break;
            default:
                break;
        }
    };
    return CheckInDialog;
}(BaseDialogSc_1.default));
exports.default = CheckInDialog;
