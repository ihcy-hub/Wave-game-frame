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
var ttShar_1 = __importDefault(require("../../Platform/Tt/ttShar"));
var recorderMgr_1 = __importDefault(require("../../Platform/Tt/recorderMgr"));
var ConfigData_1 = __importDefault(require("../../Data/ConfigData"));
var LGAniMgr_1 = require("../../Game/GameMg/LGAniMgr");
var UmMg_1 = __importDefault(require("../../Utils/UmMg"));
/**通关获得金币 */
var PassDialog = /** @class */ (function (_super) {
    __extends(PassDialog, _super);
    function PassDialog() {
        var _this = _super.call(this) || this;
        _this.speed = 1;
        _this.isShar = true;
        return _this;
    }
    /**
         * 创建并且播放敌人龙骨动画
         * @param url 动画路径
         * @param loop 是否循环播放
         * @param point 动画位置偏移
         */
    PassDialog.prototype.playAni = function (url, loop, point) {
        var _this = this;
        if (point === void 0) { point = { x: 55, y: 270 }; }
        this.createLG(url, this.LGBox).then(function (res) {
            _this.lGAni && _this.lGAni.destroy();
            _this.lGAni = res;
            _this.lGAni.pos(point.x, point.y);
            _this.lGAni.play(0, loop);
        });
    };
    /**创建成功 */
    PassDialog.prototype.parseComplete = function (parent) {
        //创建第一个动画
        var skeleton0;
        //从动画模板创建动画播放对象
        skeleton0 = this.templet.buildArmature(0);
        //播放
        skeleton0.play(0, true);
        parent.addChild(skeleton0);
        return skeleton0;
    };
    /**
     * 创建龙骨动画返回创建的动画
     * @param url 路径 "DragonBones/xingzou.sk"
     * @param parent 要加入到的父级精灵
     */
    PassDialog.prototype.createLG = function (url, parent) {
        var _this = this;
        return new Promise(function (fulfill, reject) {
            //创建动画模板
            //this.templet&&this.templet.destroy();
            _this.templet = new Laya.Templet();
            _this.templet.loadAni(url);
            _this.templet.on(Laya.Event.COMPLETE, _this, function () {
                var Skeleton = _this.parseComplete(parent);
                try {
                    fulfill(Skeleton);
                }
                catch (error) {
                    reject("fail");
                }
            });
        });
    };
    PassDialog.prototype.initData = function () {
        UmMg_1.default.trackEvent('e_30');
        GameData_1.default.Dctj = 1;
        GameData_1.default.RetrunHomeNum = 1;
        //this.showBoxOrInter();
    };
    PassDialog.prototype.findView = function () {
        this.boxBtn = this.owner.getChildByName('boxBtn');
        this.btnNext = this.boxBtn.getChildByName('btnNext');
        this.btnHome = this.owner.getChildByName('btn_home');
        this.CoinBox = this.owner.getChildByName('CoinBox');
        this.btnShar = this.boxBtn.getChildByName('btnShar');
        //this.btnNext = this.owner.getChildByName('btnNext') as Laya.Label;
        this.add = this.owner.getChildByName('add');
        this.add.top = parseInt(PlatformMg_1.default.Instance.JLBtnInfo.top) + (parseInt(PlatformMg_1.default.Instance.JLBtnInfo.height) - 42) / 2;
        this.titleBox = this.owner.getChildByName('titleBox');
        this.LGBox = this.titleBox.getChildByName('LGBox');
        this.dcBox = this.owner.getChildByName('DcBox3');
        this.list = this.dcBox.getChildByName('list');
    };
    PassDialog.prototype.initView = function () {
        if (PlatformMg_1.default.Instance.isWx || PlatformMg_1.default.Instance.isQq) {
            this.add.visible = true;
        }
        else {
            this.add.visible = false;
        }
        if (PlatformMg_1.default.Instance.isWx || PlatformMg_1.default.Instance.isTt) {
            this.btnShar.visible = true;
        }
        else {
            this.btnNext.centerX = 0;
            this.btnShar.visible = false;
        }
        if (PlatformMg_1.default.Instance.isWx) {
            this.dcBox.visible = true;
        }
        else {
            this.dcBox.visible = false;
        }
        //this.btnHome.top =  parseInt(PlatformMg.Instance.JLBtnInfo.top) +(parseInt(PlatformMg.Instance.JLBtnInfo.height)-60)/2
        this.CoinBox.left = this.btnHome.left + this.btnHome.width + 10;
        this.playAni(LGAniMgr_1.LGAniUrl.TIAOQILAI, true);
    };
    PassDialog.prototype.screenAdaptation = function () {
        if (WindowUtil_1.default.isIphoneX) {
            this.titleBox.bottom += 230;
            this.dcBox.bottom += 150;
        }
        this.onCasualClick();
    };
    /**banner误点 */
    PassDialog.prototype.onCasualClick = function () {
        var _this = this;
        var that = this;
        if (ConfigData_1.default.IsMisLead) {
            this.boxBtn.bottom = WindowUtil_1.default.isIphoneX ? 70 + 50 : 70;
            Laya.timer.once(ConfigData_1.default.bannerTime, this, function () {
                if (!PlatformMg_1.default.Instance.isVivo)
                    _this.showBottomBanner();
            });
            Laya.timer.once(ConfigData_1.default.bannerTime + 500, this, function () {
                Laya.Tween.to(that.boxBtn, { bottom: WindowUtil_1.default.isIphoneX ? 339 : 288 }, 200);
            });
        }
        else {
            this.boxBtn.bottom = WindowUtil_1.default.isIphoneX ? 339 : 288;
            if (!PlatformMg_1.default.Instance.isVivo)
                this.showBottomBanner();
        }
    };
    PassDialog.prototype.onUpdate = function () {
        if (this.add.right > 190) {
            this.speed = -1;
        }
        else if (this.add.right < 170) {
            this.speed = 1;
        }
        this.add.right += this.speed;
    };
    PassDialog.prototype.onClick = function (e) {
        var _this = this;
        e.stopPropagation();
        if (e.target.name.substring(0, 3) === 'btn') {
            SoundUtil_1.default.play('click');
        }
        switch (e.target.name) {
            case 'btnNext':
                this.owner.close();
                clearTimeout(this.setTime);
                GameData_1.default.IsTcHome = false;
                UmMg_1.default.trackEvent('e_12');
                if (PlatformMg_1.default.Instance.isWx) {
                    if (GameData_1.default.NowLevel == 2) {
                        Laya.Dialog.open(ActivityUrls_1.default.EXPROTBOX3_DIALOG, true, function () {
                            Laya.View.open(ActivityUrls_1.default.GAME_SCENE, true, GameMg_1.default.Instance.gameStart);
                        });
                    }
                    else if (GameData_1.default.NowLevel == 3) {
                        Laya.Dialog.open(ActivityUrls_1.default.EXPROTBOX3_DIALOG, true, function () {
                            Laya.Dialog.open(ActivityUrls_1.default.PASSCOIN_DIALOG, true, function () {
                                Laya.View.open(ActivityUrls_1.default.GAME_SCENE, true, GameMg_1.default.Instance.gameStart);
                            });
                        });
                    }
                    else if (GameData_1.default.NowLevel == 4) {
                        Laya.Dialog.open(ActivityUrls_1.default.EXPROTBOX3_DIALOG, true, function () {
                            Laya.Dialog.open(ActivityUrls_1.default.EXPROTBOX_DIALOG, true, function () {
                                Laya.Dialog.open(ActivityUrls_1.default.PASSCOIN_DIALOG, true, function () {
                                    Laya.View.open(ActivityUrls_1.default.GAME_SCENE, true, GameMg_1.default.Instance.gameStart);
                                });
                            });
                        });
                    }
                    else {
                        if (ConfigData_1.default.IsMisLead) {
                            Laya.Dialog.open(ActivityUrls_1.default.EXPROTBOX3_DIALOG, true, function () {
                                Laya.Dialog.open(ActivityUrls_1.default.EXPROTBOX_DIALOG, true, function () {
                                    Laya.Dialog.open(ActivityUrls_1.default.BX_DIALOG, true, function () {
                                        Laya.Dialog.open(ActivityUrls_1.default.PASSCOIN_DIALOG, true, function () {
                                            Laya.View.open(ActivityUrls_1.default.GAME_SCENE, true, GameMg_1.default.Instance.gameStart);
                                        });
                                    });
                                });
                            });
                        }
                        else {
                            Laya.Dialog.open(ActivityUrls_1.default.EXPROTBOX3_DIALOG, true, function () {
                                Laya.Dialog.open(ActivityUrls_1.default.EXPROTBOX_DIALOG, true, function () {
                                    Laya.Dialog.open(ActivityUrls_1.default.PASSCOIN_DIALOG, true, function () {
                                        Laya.View.open(ActivityUrls_1.default.GAME_SCENE, true, GameMg_1.default.Instance.gameStart);
                                    });
                                });
                            });
                        }
                    }
                }
                else if (PlatformMg_1.default.Instance.isQq) {
                    if (ConfigData_1.default.IsMisLead && GameData_1.default.NowLevel >= 4 && Math.random() < 0.8) {
                        AdMg_1.default.Instance.showVideo({
                            success: function () {
                                Laya.View.open(ActivityUrls_1.default.GAME_SCENE, true, GameMg_1.default.Instance.gameStart);
                            },
                            fail: function () {
                                Laya.View.open(ActivityUrls_1.default.GAME_SCENE, true, GameMg_1.default.Instance.gameStart);
                            }
                        });
                    }
                    else {
                        Laya.View.open(ActivityUrls_1.default.GAME_SCENE, true, GameMg_1.default.Instance.gameStart);
                    }
                }
                else {
                    Laya.View.open(ActivityUrls_1.default.GAME_SCENE, true, GameMg_1.default.Instance.gameStart);
                }
                break;
            case 'btnShar':
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
                            UmMg_1.default.trackEvent('e_13');
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
    return PassDialog;
}(BaseDialogSc_1.default));
exports.default = PassDialog;
