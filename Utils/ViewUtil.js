"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ViewUtil = /** @class */ (function () {
    function ViewUtil() {
    }
    /**
     * 动画 放大缩小  放大
     * @param view
     */
    ViewUtil.setScaleAni = function (view) {
        var _this = this;
        Laya.Tween.clearAll(view);
        Laya.Tween.to(view, { scaleX: 1.1, scaleY: 1.1 }, 500, null, Laya.Handler.create(this, function () {
            _this.setScaleAni2(view);
        }));
    };
    /**
     * 动画 放大缩小  缩小
     * @param view
     */
    ViewUtil.setScaleAni2 = function (view) {
        var _this = this;
        Laya.Tween.clearAll(view);
        Laya.Tween.to(view, { scaleX: 1, scaleY: 1 }, 500, null, Laya.Handler.create(this, function () {
            _this.setScaleAni(view);
        }));
    };
    /**
   * 动画 放大缩小  放大
   * @param view
   */
    ViewUtil.scaleAni = function (view, default_scale) {
        if (default_scale === void 0) { default_scale = 1; }
        Laya.Tween.clearAll(view);
        Laya.Tween.to(view, { scaleX: default_scale * 1.2, scaleY: default_scale * 1.2 }, 100, null, Laya.Handler.create(this, function () {
            Laya.Tween.to(view, { scaleX: default_scale, scaleY: default_scale }, 100);
        }));
    };
    ViewUtil.showDelay = function (spr, delayTime) {
        if (delayTime === void 0) { delayTime = 1000; }
        spr.visible = false;
        Laya.timer.once(delayTime, spr, function () {
            if (!spr.destroyed) {
                spr.visible = true;
            }
        });
    };
    ViewUtil.hideSprites = function () {
        var spr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            spr[_i] = arguments[_i];
        }
        for (var _a = 0, spr_1 = spr; _a < spr_1.length; _a++) {
            var s = spr_1[_a];
            s.visible = false;
        }
    };
    ViewUtil.showSprites = function () {
        var spr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            spr[_i] = arguments[_i];
        }
        for (var _a = 0, spr_2 = spr; _a < spr_2.length; _a++) {
            var s = spr_2[_a];
            s.visible = true;
        }
    };
    return ViewUtil;
}());
exports.default = ViewUtil;
