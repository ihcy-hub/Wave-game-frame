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
var BaseSceneSc = /** @class */ (function (_super) {
    __extends(BaseSceneSc, _super);
    function BaseSceneSc() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //阿拉丁页面统计字段,自动获取页面路径
        _this.aldPage = "BaseDialog";
        return _this;
        // /**
        //  * 刷新金币
        //  * coinBox为预制体，布局的时候放在根目录
        //  */
        // refreshCoin() {
        //     let coinBox = this.owner.getChildByName("coinBox") as Laya.Box;
        //     if (coinBox) {
        //         //金币布局与微信胶囊按钮对齐
        //         PlatformMg.Instance.topMidle(coinBox);
        //         let coinLb: Laya.Label = coinBox.getChildByName("coinLb") as Laya.Label;
        //         let coinNum = PublicMg.Coin
        //         if (coinLb != null) {
        //             if (coinNum >= 10000) {
        //                 coinLb.text = (coinNum / 1000).toFixed(1) + "k";
        //             } else {
        //                 coinLb.text = String(coinNum);
        //             }
        //         }
        //     }
        // }
    }
    BaseSceneSc.prototype.onAwake = function () {
        var _this = this;
        this.owner.openedCallBack(function (res) {
            _this.closeFun = res;
        });
        //console.log(this.owner.url, "------------------onAwake");
        this.aldPage = this.owner.url.substring(this.owner.url.lastIndexOf("/"), this.owner.url.lastIndexOf(".scene"));
        //数据初始化
        this.initData();
        //获取组件
        this.findView();
        //初始化组件
        this.initView();
        //屏幕适配
        this.screenAdaptation();
    };
    BaseSceneSc.prototype.onEnable = function () {
        //console.log(this.owner.url, "------------------onEnable");
    };
    BaseSceneSc.prototype.onStart = function () {
        //console.log(this.owner.url, "------------------onStart");
        AldMg_1.default.upload(this.aldPage);
    };
    BaseSceneSc.prototype.onDisable = function () {
        //console.log(this.owner.url, "------------------onDisable");
        // 组件被禁用时，隐藏banner,清除定时器
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this);
    };
    BaseSceneSc.prototype.onDestroy = function () {
        //console.log(this.owner.url, "------------------onDestroy");
    };
    BaseSceneSc.prototype.showBanner = function () {
    };
    BaseSceneSc.prototype.hideBanner = function () {
    };
    //设置是否开启误点
    BaseSceneSc.prototype.setIsShowMisLead = function (isShow, view) {
        var oldY;
        if (isShow) {
            view.visible = true;
            oldY = view.y;
            try {
                Laya.timer.clearAll(this);
                Laya.timer.once(1500, this, function () {
                    // ADUtil.Instance.showBannerAd(1, this.owner);
                    Laya.Tween.to(view, { "y": oldY }, 300, null, null, 200);
                });
            }
            catch (error) { }
        }
        else {
            // ADUtil.Instance.showBannerAd(1, this.owner);
            view.visible = false;
            view.alpha = 0.3;
            Laya.timer.once(1000, this, function () {
                view.visible = true;
            });
        }
    };
    /**
     * 播放dialog 内的帧动画
     * @param name 动画名称
     * @param isLoop 是否循环
     */
    BaseSceneSc.prototype.startAni = function (name, isLoop) {
        var ani = this.owner[name];
        if (ani) {
            ani.play(null, isLoop);
        }
    };
    return BaseSceneSc;
}(Laya.Script));
exports.default = BaseSceneSc;
