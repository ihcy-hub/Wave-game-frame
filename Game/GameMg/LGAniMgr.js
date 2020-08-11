"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LGAniUrl = void 0;
/** 龙骨动画管理 */
var LGAniMgr = /** @class */ (function () {
    function LGAniMgr() {
    }
    /**
     * 创建龙骨动画返回创建的动画
     * @param url 路径 "DragonBones/xingzou.sk"
     * @param parent 要加入到的父级精灵
     */
    LGAniMgr.createLG = function (url, parent, point) {
        var _this = this;
        return new Promise(function (fulfill, reject) {
            //创建动画模板
            //this.templet&&this.templet.destroy();
            _this.templet = new Laya.Templet();
            _this.templet.loadAni(url);
            _this.templet.on(Laya.Event.ERROR, _this, function (res) {
                try {
                    fulfill(_this.onError(res));
                }
                catch (error) {
                    reject("fail");
                }
            });
            _this.templet.on(Laya.Event.COMPLETE, _this, function () {
                var Skeleton = _this.parseComplete(parent, point);
                try {
                    fulfill(Skeleton);
                }
                catch (error) {
                    reject("fail");
                }
            });
        });
    };
    /**错误 */
    LGAniMgr.onError = function (res) {
        console.log("parse error", res);
        return false;
    };
    /**创建成功 */
    LGAniMgr.parseComplete = function (parent, point) {
        //创建第一个动画
        var skeleton0;
        //从动画模板创建动画播放对象
        skeleton0 = this.templet.buildArmature(0);
        //播放
        skeleton0.play(0, true);
        parent.addChild(skeleton0);
        if (point) {
            skeleton0.pos(point.x, point.y);
        }
        else {
            skeleton0.pos(55, 270);
        }
        return skeleton0;
    };
    return LGAniMgr;
}());
exports.default = LGAniMgr;
//龙骨动画链接地址
var LGAniUrl = /** @class */ (function () {
    function LGAniUrl() {
    }
    return LGAniUrl;
}());
exports.LGAniUrl = LGAniUrl;
