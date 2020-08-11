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
var TipsUtil_1 = __importDefault(require("../../Utils/TipsUtil"));
var ProwerMg_1 = __importDefault(require("../../Game/GameMg/ProwerMg"));
var UmMg_1 = __importDefault(require("../../Utils/UmMg"));
var WindowUtil_1 = __importDefault(require("../../Utils/WindowUtil"));
var QqBannerAd_1 = __importDefault(require("../../Platform/Qq/QqBannerAd"));
/**砸金蛋管理类 */
var BxDialog = /** @class */ (function (_super) {
    __extends(BxDialog, _super);
    function BxDialog() {
        var _this = _super.call(this) || this;
        _this._numAll = 0; //点击次数
        _this._numOnce = 0; //1s内点击次数
        _this._timeOnce = 1000; //单位时间记时器
        _this._numDjs = 10; //倒计时
        _this.isClick = true;
        _this.isShowBanner = false; //banner是否已经显示
        return _this;
    }
    BxDialog.prototype.initData = function () {
        var _this = this;
        QqBannerAd_1.default.hide();
        UmMg_1.default.trackEvent('e_33');
        this.isClick = true;
        this.owner.openedCallBack(function (res) {
            _this.closeFun = res;
        });
    };
    BxDialog.prototype.findView = function () {
        this.box = this.owner.getChildByName('Box');
        this.img = this.box.getChildByName('bxBox').getChildByName('img');
        // console.log('this.img', this.box,this.img)
        this.time = this.box.getChildByName('time');
        this.djs = this.box.getChildByName('djs');
        this.btn = this.owner.getChildByName('btn');
        this.bar = this.box.getChildByName('bar');
    };
    BxDialog.prototype.initView = function () {
        if (PlatformMg_1.default.Instance.isQq) {
            this.btn.bottom -= 50;
        }
        this.bar.value = 0;
        if (Laya.Browser.onWeiXin && !Laya.Browser.onQQMiniGame) {
            this.time.visible = false;
            this.djs.visible = false;
        }
        this.btn.on(Laya.Event.CLICK, this, this.bxClick);
        //倒计时
        // Laya.timer.loop(1000,this,()=>{
        //     this._numOnce = 0;
        //     if(PlatformMg.Instance.isWx){
        //         this.countdown();
        //     }
        // })
    };
    BxDialog.prototype.screenAdaptation = function () {
    };
    /**宝箱点击 */
    BxDialog.prototype.bxClick = function () {
        var _this = this;
        if (this.isClick) {
            SoundUtil_1.default.play('click');
            this.btn.scale(1.2, 1.2);
            Laya.timer.once(100, this, function () {
                _this.btn.scale(1, 1);
            });
            this._numAll++;
            this._numOnce++;
            //
            this.bar.value += 1 / 8;
            var num = 0.5 + Math.random() * 0.3;
            if (PlatformMg_1.default.Instance.isQq) {
                if (this.bar.value >= num && !this.isShowBanner) {
                    this.showBottomBanner();
                    this.isShowBanner = true;
                    Laya.timer.once(500, this, function () {
                        Laya.Tween.to(_this.btn, { bottom: WindowUtil_1.default.isIphoneX ? 339 : 288 }, 200);
                    });
                }
                if (this.bar.value >= 1) {
                    this.onPass();
                }
            }
            else {
                if (this.bar.value >= num) {
                    this.showBottomBanner();
                    this.onPass();
                }
            }
            //this.bar.value>=0.9&&this.onPass();
        }
    };
    /**倒计时 */
    BxDialog.prototype.countdown = function () {
        this._numDjs--;
        this.time.text = this._numDjs + '秒';
        if (this._numDjs < 1) {
            this.owner.close();
            //Laya.Dialog.open(ActivityUrls.PASS_DIALOG)
            Laya.Dialog.open(ActivityUrls_1.default.TRYEND_DIALOG, true, function () {
                Laya.Dialog.open(ActivityUrls_1.default.PASS_DIALOG, true);
            });
        }
    };
    /**宝箱状态*/
    BxDialog.prototype.onBxStatus = function (num) {
        var arr = ['public/img_bx1.png', 'public/img_bx2.png', 'public/img_bx3.png'];
        this.img.skin = arr[num];
    };
    /**频率 */
    BxDialog.prototype.onFrequency = function () {
        this._numOnce++;
    };
    //通过业务逻辑
    BxDialog.prototype.onPass = function () {
        var _this = this;
        this.isClick = false;
        ProwerMg_1.default.SetTl(false, 1);
        TipsUtil_1.default.msg('恭喜获得' + 1 + '体力');
        this.showBottomBanner();
        UmMg_1.default.trackEvent('e_34');
        if (PlatformMg_1.default.Instance.isQq) {
            this.owner.close();
            this.closeFun();
        }
        else {
            Laya.timer.once(2000, this, function () {
                //this.closeFun()
                _this.owner.close();
                _this.closeFun();
                // Laya.Dialog.open(ActivityUrls.TRYEND_DIALOG,true,()=>{
                //     Laya.Dialog.open(ActivityUrls.PASS_DIALOG,true)
                // })
            });
        }
    };
    BxDialog.prototype.onUpdate = function () {
        this.bar.value -= 0.003;
    };
    BxDialog.prototype.onDisable = function () {
        Laya.timer.clearAll(this);
        _super.prototype.onDisable.call(this);
        this.btn.off(Laya.Event.CLICK, this, this.bxClick);
    };
    return BxDialog;
}(BaseDialogSc_1.default));
exports.default = BxDialog;
