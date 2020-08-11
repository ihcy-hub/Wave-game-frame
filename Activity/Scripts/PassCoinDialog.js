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
var AdMg_1 = __importDefault(require("../../Platform/AdMg"));
var ttShar_1 = __importDefault(require("../../Platform/Tt/ttShar"));
var recorderMgr_1 = __importDefault(require("../../Platform/Tt/recorderMgr"));
var ConfigData_1 = __importDefault(require("../../Data/ConfigData"));
var UmMg_1 = __importDefault(require("../../Utils/UmMg"));
var qqBox_1 = __importDefault(require("../../Platform/Qq/qqBox"));
var VivoAdUtil_1 = __importDefault(require("../../Platform/VivoAdUtil"));
/**通关获得金币 */
var PassCoinDialog = /** @class */ (function (_super) {
    __extends(PassCoinDialog, _super);
    function PassCoinDialog() {
        var _this = _super.call(this) || this;
        _this.speed = 1;
        _this.isShar = true;
        _this.isBox = true; //是否弹盒子广告
        return _this;
    }
    PassCoinDialog.prototype.initData = function () {
        GameData_1.default.Dctj = 0;
        UmMg_1.default.trackEvent('e_8');
        //this.showBoxOrInter();
        if (PlatformMg_1.default.Instance.isVivo) {
            VivoAdUtil_1.default.showNative();
        }
    };
    PassCoinDialog.prototype.findView = function () {
        this.boxBtn = this.owner.getChildByName('boxBtn');
        this.btnLq = this.boxBtn.getChildByName('btnLq');
        this.btnZJLQ = this.boxBtn.getChildByName('btnZJLQ');
        this.btnShar = this.boxBtn.getChildByName('btnShar');
        //this.btnNext = this.owner.getChildByName('btnNext') as Laya.Label;
        this.add = this.owner.getChildByName('add');
        this.add.top = parseInt(PlatformMg_1.default.Instance.JLBtnInfo.top) + (parseInt(PlatformMg_1.default.Instance.JLBtnInfo.height) - 42) / 2;
        this.titleBox = this.owner.getChildByName('titleBox');
        this.title = this.titleBox.getChildByName('title');
        this.dcBox = this.owner.getChildByName('DcBox3');
        this.checkLq = this.owner.getChildByName('checkLq');
        this.list = this.dcBox.getChildByName('list');
    };
    PassCoinDialog.prototype.initView = function () {
        var _this = this;
        if (PlatformMg_1.default.Instance.isWx || PlatformMg_1.default.Instance.isQq) {
            this.add.visible = true;
        }
        else {
            this.add.visible = false;
        }
        if (PlatformMg_1.default.Instance.isTt) {
            this.btnShar.visible = true;
        }
        else {
            this.btnShar.visible = false;
            this.btnLq.visible = false;
            this.btnZJLQ.visible = true;
            this.checkLq.skin = 'public/check_4blq2.png';
        }
        if (PlatformMg_1.default.Instance.isWx) {
            this.dcBox.visible = true;
        }
        else {
            this.dcBox.visible = false;
        }
        this.checkLq.on(Laya.Event.CLICK, this, function () {
            _this.checkLq.selected = !_this.checkLq.selected;
            if (_this.checkLq.selected) {
                _this.title.skin = 'public/title_jl200.png';
            }
            else {
                _this.title.skin = 'public/title_jl50.png';
            }
        });
    };
    PassCoinDialog.prototype.screenAdaptation = function () {
        if (WindowUtil_1.default.isIphoneX) {
            this.titleBox.bottom += 230;
            this.dcBox.bottom += 150;
            this.checkLq.bottom = 488;
        }
        this.onCasualClick();
    };
    /**banner误点 */
    PassCoinDialog.prototype.onCasualClick = function () {
        var _this = this;
        var that = this;
        if (ConfigData_1.default.IsMisLead && !PlatformMg_1.default.Instance.isQq) {
            this.checkLq.selected = true;
            this.title.skin = 'public/title_jl200.png';
            this.boxBtn.bottom = WindowUtil_1.default.isIphoneX ? 70 + 50 : 70;
            Laya.timer.once(ConfigData_1.default.bannerTime, this, function () {
                _this.showBottomBanner();
            });
            Laya.timer.once(ConfigData_1.default.bannerTime + 500, this, function () {
                Laya.Tween.to(that.boxBtn, { bottom: WindowUtil_1.default.isIphoneX ? 339 : 288 }, 200);
            });
        }
        else {
            this.checkLq.selected = false;
            this.title.skin = 'public/title_jl50.png';
            this.boxBtn.bottom = WindowUtil_1.default.isIphoneX ? 339 : 288;
            this.showBottomBanner();
        }
        if (ConfigData_1.default.IsMisLead) {
            this.checkLq.selected = true;
        }
        else {
            this.checkLq.selected = false;
        }
        if (this.checkLq.selected) {
            this.title.skin = 'public/title_jl200.png';
        }
        else {
            this.title.skin = 'public/title_jl50.png';
        }
        if (PlatformMg_1.default.Instance.isBd) {
            if (GameData_1.default.NowLevel > 4) {
                if (Math.random() < 0.5) {
                    this.checkLq.selected = false;
                }
                else {
                    this.checkLq.selected = true;
                }
            }
            else {
                this.checkLq.selected = false;
            }
        }
    };
    PassCoinDialog.prototype.onUpdate = function () {
        if (this.add.right > 190) {
            this.speed = -1;
        }
        else if (this.add.right < 170) {
            this.speed = 1;
        }
        this.add.right += this.speed;
    };
    PassCoinDialog.prototype.onClick = function (e) {
        var _this = this;
        e.stopPropagation();
        if (e.target.name.substring(0, 3) === 'btn') {
            SoundUtil_1.default.play('click');
        }
        switch (e.target.name) {
            case 'btnZJLQ':
            case 'btnLq':
                if (PlatformMg_1.default.Instance.isQq && ConfigData_1.default.IsMisLead && this.isBox) {
                    this.isBox = false;
                    qqBox_1.default.show({});
                    return;
                }
                if (PlatformMg_1.default.Instance.isWx) {
                    if (this.checkLq.selected) {
                        AdMg_1.default.Instance.showVideo({
                            success: function () {
                                UmMg_1.default.trackEvent('e_9');
                                clearTimeout(_this.setTime);
                                _this.owner.close();
                                GameData_1.default.getCoin(200);
                                TipsUtil_1.default.msg('恭喜获得' + 200 + '金币!');
                                if (_this.closeFun) {
                                    _this.owner.close();
                                    _this.closeFun();
                                }
                                else {
                                    Laya.Dialog.closeAll();
                                    GameData_1.default.IsTcHome = true;
                                    Laya.View.open(ActivityUrls_1.default.GAME_SCENE);
                                }
                            },
                            fail: function () {
                                clearTimeout(_this.setTime);
                                GameData_1.default.getCoin(50);
                                TipsUtil_1.default.msg('恭喜获得' + 50 + '金币!');
                                if (_this.closeFun) {
                                    _this.owner.close();
                                    _this.closeFun();
                                }
                                else {
                                    Laya.Dialog.closeAll();
                                    GameData_1.default.IsTcHome = true;
                                    Laya.View.open(ActivityUrls_1.default.GAME_SCENE);
                                }
                            }
                        });
                    }
                    else {
                        //获得的金币
                        clearTimeout(this.setTime);
                        GameData_1.default.getCoin(50);
                        TipsUtil_1.default.msg('恭喜获得' + 50 + '金币!');
                        if (this.closeFun) {
                            this.owner.close();
                            this.closeFun();
                        }
                        else {
                            Laya.Dialog.closeAll();
                            GameData_1.default.IsTcHome = true;
                            Laya.View.open(ActivityUrls_1.default.GAME_SCENE);
                        }
                    }
                }
                else {
                    if (this.checkLq.selected) {
                        AdMg_1.default.Instance.showVideo({
                            success: function () {
                                clearTimeout(_this.setTime);
                                _this.owner.close();
                                Laya.Dialog.open(ActivityUrls_1.default.PASS_DIALOG, true);
                                GameData_1.default.getCoin(200);
                                TipsUtil_1.default.msg('恭喜获得' + 200 + '金币!');
                            },
                            fail: function () {
                                clearTimeout(_this.setTime);
                                _this.owner.close();
                                Laya.Dialog.open(ActivityUrls_1.default.PASS_DIALOG, true);
                                GameData_1.default.getCoin(50);
                                TipsUtil_1.default.msg('恭喜获得' + 50 + '金币!');
                            }
                        });
                    }
                    else {
                        //获得的金币
                        clearTimeout(this.setTime);
                        this.owner.close();
                        Laya.Dialog.open(ActivityUrls_1.default.PASS_DIALOG, true);
                        GameData_1.default.getCoin(50);
                        TipsUtil_1.default.msg('恭喜获得' + 50 + '金币!');
                    }
                }
                break;
            case 'btnShar':
                UmMg_1.default.trackEvent('e_10');
                if (PlatformMg_1.default.Instance.isTt) {
                    if (this.isShar) {
                        ttShar_1.default.share({
                            channel: "video",
                            videoPath: recorderMgr_1.default.videoPath,
                            success: function () {
                                TipsUtil_1.default.msg("分享成功！");
                                _this.isShar = false;
                            },
                            fail: function () {
                                //TipsUtil.msg('录屏时间过短，对局时间应大于3S才能分享哦')
                            }
                        });
                    }
                    else {
                        TipsUtil_1.default.msg('已经分享过了，下一局再分享哦');
                    }
                }
                if (PlatformMg_1.default.Instance.isWx || PlatformMg_1.default.Instance.isQq) {
                    AdMg_1.default.Instance.share({
                        success: function () {
                            TipsUtil_1.default.msg("分享成功！");
                        },
                        fail: function () {
                            //console.log('分享失败！')
                        }
                    });
                }
                break;
            default:
                break;
        }
    };
    return PassCoinDialog;
}(BaseDialogSc_1.default));
exports.default = PassCoinDialog;
