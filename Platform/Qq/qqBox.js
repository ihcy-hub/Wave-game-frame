"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PlatformMg_1 = __importDefault(require("../PlatformMg"));
var qqBox = /** @class */ (function () {
    function qqBox() {
    }
    /**
     *
     * @param obj
     * @param obj.realTime 是否时时更新
     */
    qqBox.init = function (obj) {
        if (obj === void 0) { obj = {}; }
        if (obj.realTime)
            this.realTime = obj.realTime;
        if (qqBox.AppBox) {
            qqBox.AppBox.destroy();
        }
        qqBox.AppBox = PlatformMg_1.default.Instance.platform.createAppBox({
            adUnitId: qqBox.adUnitId
        });
        qqBox.AppBox && qqBox.AppBox.load();
        //监听用户关闭广告
        qqBox.AppBox.onClose(function (res) {
            console.log('用户关闭了广告', qqBox.callback);
            qqBox.callback && qqBox.callback();
        });
    };
    /**
     * 显示盒子广告
     * @param opations.success 盒子加载成功
     * @param opations.fail 盒子加载失败
     * @param opations.onClose 监听关闭执行
     */
    qqBox.show = function (opations) {
        if (qqBox.realTime) {
            qqBox.AppBox.load().then(function () {
                qqBox.AppBox.show().then(function () {
                    opations.success && opations.success();
                    qqBox.callback = opations.onClose;
                }).catch(function () {
                    opations.fail && opations.fail();
                });
            });
        }
        else {
            qqBox.AppBox.show().then(function () {
                opations.success && opations.success();
                qqBox.callback = opations.onClose;
            }).catch(function () {
                opations.fail && opations.fail();
            });
        }
    };
    /**
     * 销毁广告盒子
     */
    qqBox.destroy = function () {
        qqBox.AppBox && qqBox.AppBox.destroy();
    };
    qqBox.adUnitId = 'bb6e43796a48ac3ad52deabf5b1ac19d';
    qqBox.realTime = false; //时时更新
    return qqBox;
}());
exports.default = qqBox;
