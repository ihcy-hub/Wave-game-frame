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
var WindowUtil_1 = __importDefault(require("../../Utils/WindowUtil"));
var SoundUtil_1 = __importDefault(require("../../Utils/SoundUtil"));
var AdMg_1 = __importDefault(require("../../Platform/AdMg"));
var GameMg_1 = __importDefault(require("../../Game/GameMg/GameMg"));
var GameData_1 = __importDefault(require("../../Game/GameMg/GameData"));
var ActivityUrls_1 = __importDefault(require("../../Data/ActivityUrls"));
var PlatformMg_1 = __importDefault(require("../../Platform/PlatformMg"));
var LGAniMgr_1 = require("../../Game/GameMg/LGAniMgr");
var TipsUtil_1 = __importDefault(require("../../Utils/TipsUtil"));
var UmMg_1 = __importDefault(require("../../Utils/UmMg"));
var ResuDialog = /** @class */ (function (_super) {
    __extends(ResuDialog, _super);
    function ResuDialog() {
        return _super.call(this) || this;
    }
    /**
     * 创建并且播放敌人龙骨动画
     * @param url 动画路径
     * @param loop 是否循环播放
     * @param point 动画位置偏移
     */
    ResuDialog.prototype.playAni = function (url, loop, point) {
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
    ResuDialog.prototype.parseComplete = function (parent) {
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
    ResuDialog.prototype.createLG = function (url, parent) {
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
    ResuDialog.prototype.initData = function () {
        UmMg_1.default.trackEvent('e_31');
        //this.showBox();
        //this.showBottomBanner()
    };
    ResuDialog.prototype.findView = function () {
        this.titleBox = this.owner.getChildByName('titleBox');
        this.LGBox = this.titleBox.getChildByName('LGBox');
        this.anBox = this.owner.getChildByName('anBox');
        this.btnCoin = this.anBox.getChildByName('btnCoin');
        this.btnVideo = this.anBox.getChildByName('btnVideo');
        this.btnClose = this.anBox.getChildByName('btnClose');
        this.djsBox = this.owner.getChildByName('djsBox');
        this.djs = this.djsBox.getChildByName('djs');
    };
    ResuDialog.prototype.initView = function () {
        var _this = this;
        this.playAni(LGAniMgr_1.LGAniUrl.ZUOXIA2, true, { x: 55, y: 200 });
        if (!PlatformMg_1.default.Instance.isBd) {
            Laya.timer.once(1500, this, function () {
                _this.btnClose.visible = true;
            });
        }
        if (PlatformMg_1.default.Instance.isQq) {
            this.btnCoin.skin = 'public/btn_coinResu_qq.png';
        }
        else {
            this.btnCoin.skin = 'public/btn_coinResu_qq.png';
            //this.btnCoin.skin = 'public/btn_coinResu.png'
        }
        if (PlatformMg_1.default.Instance.isBd) {
            this.djsBox.visible = true;
            this.onDjs();
        }
    };
    ResuDialog.prototype.screenAdaptation = function () {
        if (WindowUtil_1.default.isIphoneX) {
            this.anBox.bottom += 100;
        }
        this.onCasualClick();
        if (PlatformMg_1.default.Instance.isBd) {
            this.btnClose.visible = false;
        }
    };
    /**倒计时 */
    ResuDialog.prototype.onDjs = function () {
        var _this = this;
        var _time = 6;
        this.djs.text = _time + '';
        Laya.timer.loop(1000, this, function () {
            _time--;
            if (_time <= 0) {
                Laya.timer.clearAll(_this);
                clearTimeout(_this.setTime);
                _this.owner.close();
                Laya.Dialog.open(ActivityUrls_1.default.FAIL_DIALOG, true);
            }
            _this.djs.text = _time + '';
        });
    };
    /**banner误点 */
    ResuDialog.prototype.onCasualClick = function () {
        var _this = this;
        var that = this;
        if (ConfigData_1.default.IsMisLead) {
            this.btnClose.visible = true;
            this.btnClose.bottom = WindowUtil_1.default.isIphoneX ? -180 - 100 : -180;
            Laya.timer.once(ConfigData_1.default.bannerTime, this, function () {
                _this.showBottomBanner();
            });
            Laya.timer.once(ConfigData_1.default.bannerTime + 500, this, function () {
                Laya.Tween.to(that.btnClose, { bottom: WindowUtil_1.default.isIphoneX ? 0 : 0 }, 200);
            });
        }
        else {
            this.btnClose.bottom = WindowUtil_1.default.isIphoneX ? 0 : 0;
            this.showBottomBanner();
        }
    };
    ResuDialog.prototype.onUpdate = function () {
    };
    ResuDialog.prototype.onClick = function (e) {
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
                var num = 200;
                if (PlatformMg_1.default.Instance.isQq) {
                    num = 200;
                }
                if (GameData_1.default.Coin >= num) {
                    UmMg_1.default.trackEvent('e_20');
                    GameData_1.default.cutCoin(num);
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
    return ResuDialog;
}(BaseDialogSc_1.default));
exports.default = ResuDialog;
