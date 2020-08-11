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
var GameData_1 = __importDefault(require("../../Game/GameMg/GameData"));
var WindowUtil_1 = __importDefault(require("../../Utils/WindowUtil"));
var SoundUtil_1 = __importDefault(require("../../Utils/SoundUtil"));
var GameMg_1 = __importDefault(require("../../Game/GameMg/GameMg"));
var ActivityUrls_1 = __importDefault(require("../../Data/ActivityUrls"));
var TipsUtil_1 = __importDefault(require("../../Utils/TipsUtil"));
var qqBox_1 = __importDefault(require("../../Platform/Qq/qqBox"));
var UmMg_1 = __importDefault(require("../../Utils/UmMg"));
var WxBannerAd_1 = __importDefault(require("../../Platform/Wx/WxBannerAd"));
var AdMg_1 = __importDefault(require("../../Platform/AdMg"));
var ProwerMg_1 = __importDefault(require("../../Game/GameMg/ProwerMg"));
var LocalStorageUtil_1 = __importDefault(require("../../Utils/LocalStorageUtil"));
var ConfigData_1 = __importStar(require("../../Data/ConfigData"));
var ExprotDrawerMgr_1 = __importDefault(require("../../Prefabs/ExprotDrawerMgr"));
var EventCenter_1 = __importDefault(require("../../EventSystem/EventCenter"));
var HomeView = /** @class */ (function (_super) {
    __extends(HomeView, _super);
    function HomeView() {
        var _this = _super.call(this) || this;
        _this.isSq = false; //是否已经弹出过授权
        _this.isSwitch = true; //是否可以开始游戏
        _this.isVideo = false; //是否看视频开始
        HomeView.instance = _this;
        return _this;
    }
    HomeView.prototype.initData = function () {
        this.isSwitch = true;
        if (PlatformMg_1.default.Instance.isWx) {
            WxBannerAd_1.default.show();
        }
        else {
            this.showBottomBanner();
        }
        if (PlatformMg_1.default.Instance.isQq && GameData_1.default.IsShowBox) {
            //this.showBox(); 
            GameData_1.default.IsShowBox = false;
        }
        //签到弹窗逻辑
        Laya.timer.once(500, this, this.onCheck);
        var _date = new Date();
        GameData_1.default.DataTime = _date.getDate(); //获得当前日期
        if (GameData_1.default.DataTime == LocalStorageUtil_1.default.getNumber(ConfigData_1.LocalStorageKey.HOMEVIDEODATE)) {
            this.isVideo = true;
        }
    };
    /**弹签到 */
    HomeView.prototype.onCheck = function () {
        if (LocalStorageUtil_1.default.getBoolean(ConfigData_1.LocalStorageKey.ISNEWUSER, false)) {
            //不是新手
            this.onTl();
            var _date = new Date();
            var dateTime = _date.getDate(); //获得当前日期 
            if (!LocalStorageUtil_1.default.getBoolean(ConfigData_1.LocalStorageKey.ISCHECK, false) && dateTime != LocalStorageUtil_1.default.getNumber(ConfigData_1.LocalStorageKey.CHECKINDATE, 0)) {
                //今天未签到
                if (!PlatformMg_1.default.Instance.isWx) {
                    Laya.Dialog.open(ActivityUrls_1.default.CHECKIN_DIALOG, true);
                }
                LocalStorageUtil_1.default.setBoolean(ConfigData_1.LocalStorageKey.ISCHECK, true);
            }
        }
        else {
            //新手、
            LocalStorageUtil_1.default.setBoolean(ConfigData_1.LocalStorageKey.ISNEWUSER, true);
        }
    };
    HomeView.prototype.findView = function () {
        this.btn_ment = this.owner.getChildByName('btn_ment');
        this.levelBox = this.owner.getChildByName('levelBox');
        this.nowLevel = this.levelBox.getChildByName('level');
        this.leftBox = this.owner.getChildByName('leftBox');
        this.rightBox = this.owner.getChildByName('rightBox');
        this.btnRmr = this.rightBox.getChildByName('btn_rmr');
        this.btn_start_pt = this.owner.getChildByName('btn_start_pt');
        this.ltlico = this.rightBox.getChildByName('btnLtl').getChildByName('ico');
        this.btnMoreGame = this.leftBox.getChildByName('btnMoreGame');
        this.btnAdd = this.leftBox.getChildByName('btnAdd');
    };
    HomeView.prototype.initView = function () {
        //计算获得距离顶部的高度
        this.btn_ment.top = parseInt(PlatformMg_1.default.Instance.JLBtnInfo.top) + (parseInt(PlatformMg_1.default.Instance.JLBtnInfo.height) - 56) / 2;
        this.nowLevel.text = '关卡' + GameData_1.default.NowLevel;
        if (PlatformMg_1.default.Instance.isQq) {
            this.btnRmr.visible = false;
        }
        ;
        if (PlatformMg_1.default.Instance.isQq) {
            this.btn_ment.visible = false;
        }
    };
    /**套路 */
    HomeView.prototype.onTl = function () {
        var _this = this;
        if (PlatformMg_1.default.Instance.isWx && ConfigData_1.default.IsMisLead && GameData_1.default.HomeTL) {
            Laya.Dialog.open(ActivityUrls_1.default.EXPROTBOX_DIALOG, true, function () {
                ExprotDrawerMgr_1.default.Instance.show();
                EventCenter_1.default.Instance.on(ConfigData_1.EventKey.CLOSECT, function () {
                    EventCenter_1.default.Instance.removeListener(ConfigData_1.EventKey.CLOSECT, _this);
                    AdMg_1.default.Instance.showVideo({
                        complete: function () {
                            Laya.Dialog.open(ActivityUrls_1.default.BX_DIALOG, true, function () {
                                Laya.Dialog.open(ActivityUrls_1.default.EXPROTBOX3_DIALOG, true, function () {
                                    ExprotDrawerMgr_1.default.Instance.show();
                                    EventCenter_1.default.Instance.on(ConfigData_1.EventKey.CLOSECT, function () {
                                        EventCenter_1.default.Instance.removeListener(ConfigData_1.EventKey.CLOSECT, _this);
                                        GameData_1.default.HomeTL = false;
                                        Laya.Dialog.open(ActivityUrls_1.default.Home_DIALOG, true);
                                    }, _this);
                                });
                            });
                        }
                    });
                }, _this);
            });
        }
    };
    HomeView.prototype.screenAdaptation = function () {
        var _this = this;
        //this.btn_bang = this.leftBox.getChildByName('btn_bang') as Laya.Button;
        if (!PlatformMg_1.default.Instance.isWx) {
            //this.btn_bang.removeSelf();
        }
        if (WindowUtil_1.default.isIphoneX) {
            //全面屏
            this.btn_start_pt.bottom = 427;
            this.leftBox.bottom = 400;
            this.rightBox.bottom = 400;
        }
        if (PlatformMg_1.default.Instance.isTt) {
            this.btnMoreGame.visible = false;
            this.ltlico.visible = true;
        }
        if (PlatformMg_1.default.Instance.isBd) {
            this.btnMoreGame.visible = false;
        }
        if (PlatformMg_1.default.Instance.isVivo) {
            this.btnMoreGame.visible = false;
            this.btnAdd.visible = true;
            var qg = Laya.Browser.window.qg;
            qg.hasShortcutInstalled({
                success: function (status) {
                    if (status) {
                        console.log('已创建');
                        _this.btnAdd.visible = false;
                    }
                    else {
                        console.log('未创建');
                        _this.btnAdd.visible = true;
                    }
                }
            });
        }
    };
    //屏幕点击开始ui隐藏动画
    HomeView.prototype.onAni = function () {
        if (this.isSwitch) {
            this.start();
        }
        LocalStorageUtil_1.default.setNumber(ConfigData_1.LocalStorageKey.HOMEVIDEODATE, GameData_1.default.DataTime);
    };
    HomeView.prototype.start = function () {
        GameData_1.default.HomeTL = true;
        this.isSwitch = false; //预防多次点击
        Laya.Tween.to(this.leftBox, { left: -176 }, 200);
        Laya.Tween.to(this.rightBox, { right: -176 }, 200, null, Laya.Handler.create(this, function () {
            //Laya.Scene.open("view/gameView.scene");
            //游戏开始
            Laya.Dialog.closeAll();
            GameMg_1.default.Instance.gameStart();
            UmMg_1.default.trackEvent('e_3');
        }));
    };
    HomeView.prototype.onClick = function (e) {
        e.stopPropagation();
        if (e.target.name.substring(0, 3) === 'btn') {
            SoundUtil_1.default.play('click');
        }
        switch (e.target.name) {
            case 'btn_ment':
                //功能按钮
                UmMg_1.default.trackEvent('e_6');
                Laya.Dialog.open(ActivityUrls_1.default.MENT_DIALOG);
                break;
            case 'btnLevel':
                //关卡
                UmMg_1.default.trackEvent('e_4');
                Laya.Dialog.open(ActivityUrls_1.default.LEVEL_DIALOG, true);
                break;
            case 'btnQd':
                //签到
                UmMg_1.default.trackEvent('e_35');
                Laya.Dialog.open(ActivityUrls_1.default.CHECKIN_DIALOG, true);
                break;
            case 'btnLtl':
                //视频领取体力
                AdMg_1.default.Instance.showVideo({
                    success: function () {
                        UmMg_1.default.trackEvent('e_36');
                        ProwerMg_1.default.SetTl(false, 5);
                        TipsUtil_1.default.msg('恭喜获得5体力');
                    }
                });
                break;
            case 'btnAdd':
                //创建桌面图标
                var qg_1 = Laya.Browser.window.qg;
                qg_1.hasShortcutInstalled({
                    success: function (status) {
                        if (status) {
                            TipsUtil_1.default.msg('桌面图标已经创建');
                        }
                        else {
                            //未创建
                            qg_1.installShortcut({
                                success: function () {
                                    // 执行用户创建图标奖励
                                    TipsUtil_1.default.msg('创建成功,恭喜获得5体力');
                                    ProwerMg_1.default.SetTl(false, 5);
                                },
                                fail: function (err) {
                                    TipsUtil_1.default.msg('创建失败请从新创建');
                                },
                                complete: function () { }
                            });
                        }
                    }
                });
                break;
            case 'btnMoreGame':
                //打开更多游戏
                UmMg_1.default.trackEvent('e_5');
                if (PlatformMg_1.default.Instance.platformName == PlatformMg_1.default.Instance.Wx) {
                    Laya.Dialog.open(ActivityUrls_1.default.EXPROTBOX_DIALOG, true, function () {
                        Laya.Dialog.open(ActivityUrls_1.default.Home_DIALOG);
                    });
                }
                else if (PlatformMg_1.default.Instance.platformName == PlatformMg_1.default.Instance.Qq) {
                    qqBox_1.default.show({
                        succsee: function () {
                        },
                        fail: function () {
                        },
                        onClose: function () {
                        }
                    });
                }
                break;
            case 'bottomBox':
                break;
            default:
                //开始游戏
                if (Laya.stage.mouseY < (Laya.stage.height - 210) && Laya.stage.mouseX > 170 && Laya.stage.mouseX < (Laya.stage.width - 170)) {
                    this.onAni();
                }
                break;
        }
    };
    //开始按钮动画
    HomeView.prototype.onstartAin = function () {
        var oTimeLine = new Laya.TimeLine();
        //oTimeLine.to(this.btnStart,{rotation:20},200).to(this.btnStart,{rotation:-20},400).to(this.btnStart,{rotation:0},200);
        oTimeLine.play(0, false);
        oTimeLine.on(Laya.Event.COMPLETE, this, function () {
            oTimeLine.destroy();
        });
        //Laya.Tween.to()
    };
    HomeView.prototype.onDisable = function () {
        _super.prototype.onDisable.call(this);
        if (PlatformMg_1.default.Instance.isWx) {
            WxBannerAd_1.default.hide();
        }
    };
    HomeView.prototype.onUpdate = function () {
    };
    return HomeView;
}(BaseDialogSc_1.default));
exports.default = HomeView;
