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
var AldMg_1 = __importDefault(require("../Manages/AldMg"));
var AdMg_1 = __importDefault(require("../Platform/AdMg"));
var qqBox_1 = __importDefault(require("../Platform/Qq/qqBox"));
var ConfigData_1 = __importDefault(require("../Data/ConfigData"));
var QqAdUtil_1 = __importDefault(require("../Platform/QqAdUtil"));
var PlatformMg_1 = __importDefault(require("../Platform/PlatformMg"));
var BaseDialogSc = /** @class */ (function (_super) {
    __extends(BaseDialogSc, _super);
    function BaseDialogSc() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //阿拉丁页面统计字段,自动获取页面路径
        _this.aldPage = "BaseDialog";
        return _this;
    }
    BaseDialogSc.prototype.onEnable = function () {
        var _this = this;
        //console.log(this.owner.url, "------------------onEnable");
        this.aldPage = this.owner.url.substring(this.owner.url.lastIndexOf("/"), this.owner.url.lastIndexOf(".scene"));
        this.owner.width = Laya.stage.width;
        this.owner.height = Laya.stage.height;
        this.owner.left = 0;
        this.owner.top = 0;
        this.owner.openedCallBack(function (res) {
            _this.closeFun = res;
        });
        this.initData();
        /**获取组件 */
        this.findView();
        /**初始化组件 */
        this.initView();
        /**屏幕适配 */
        this.screenAdaptation();
    };
    BaseDialogSc.prototype.onStart = function () {
        //console.log(this.owner.url, "------------------onStart");
        AldMg_1.default.upload(this.aldPage);
    };
    /**显示盒子遮罩 */
    BaseDialogSc.prototype.showBoxMask = function () {
        this.boxMask = this.owner.getChildByName('_mask');
        this.boxMask.visible = true;
    };
    /**隐藏盒子遮罩 */
    BaseDialogSc.prototype.hideBoxMask = function () {
        this.boxMask = this.owner.getChildByName('_mask');
        this.boxMask.visible = false;
    };
    /**显示QQ盒子广告 */
    BaseDialogSc.prototype.showBox = function () {
        if (ConfigData_1.default.IsMisLead && PlatformMg_1.default.Instance.isQq) {
            //this.showBoxMask()
            Laya.timer.once(ConfigData_1.default.BoxTime, this, function () {
                qqBox_1.default.show({
                    succsee: function () {
                    },
                    fail: function () {
                        //this.hideBoxMask() 
                    },
                    onClose: function () {
                        //this.hideBoxMask()
                    }
                });
            });
        }
    };
    /**显示盒子广告或者插屏广告 */
    BaseDialogSc.prototype.showBoxOrInter = function () {
        if (ConfigData_1.default.IsMisLead && PlatformMg_1.default.Instance.isQq) {
            Laya.timer.once(ConfigData_1.default.BoxTime, this, function () {
                if (Math.random() < -1) {
                    return;
                    QqAdUtil_1.default.Instance.showInterstitialAd({
                        fail: function () {
                            qqBox_1.default.show({
                                succsee: function () {
                                },
                                fail: function () {
                                },
                                onClose: function () {
                                }
                            });
                        }
                    });
                }
                else {
                    qqBox_1.default.show({
                        succsee: function () {
                        },
                        fail: function () {
                        },
                        onClose: function () {
                        }
                    });
                }
            });
        }
    };
    BaseDialogSc.prototype.onDisable = function () {
        //console.log(this.owner.url, "------------------onDisable");
        // 组件被禁用时，隐藏banner,清除定时器
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this);
        Laya.timer.clearAll(this.owner);
        Laya.Tween.clearAll(this.owner);
        AdMg_1.default.Instance.hideBanner();
    };
    BaseDialogSc.prototype.onDestroy = function () {
        //console.log(this.owner.url, "------------------onDestroy");
    };
    /**
     * 播放dialog 内的帧动画
     * @param name 动画名称
     * @param isLoop 是否循环
     */
    BaseDialogSc.prototype.startAni = function (name, isLoop) {
        var ani = this.owner[name];
        if (ani) {
            ani.play(null, isLoop);
        }
    };
    /**
     * 显示banner
     * @param lb 误点组件
     */
    BaseDialogSc.prototype.showBottomBanner = function (lb) {
        if (lb === void 0) { lb = null; }
        AdMg_1.default.Instance.showBanner({ type: 1, dialog: this.owner });
        // if (ConfigData.IsMisLead) {
        //     this.setMisLeadStyle(lb);
        // } else {
        //     this.setNotMisLeadStyle(lb);
        // }
    };
    return BaseDialogSc;
}(Laya.Script));
exports.default = BaseDialogSc;
