"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PlatformMg_1 = __importDefault(require("../../Platform/PlatformMg"));
var SoundUtil_1 = __importDefault(require("../../Utils/SoundUtil"));
var GameData_1 = __importDefault(require("./GameData"));
var ProwerMg_1 = __importDefault(require("./ProwerMg"));
/**游戏公告管理类 */
var PublicMg = /** @class */ (function () {
    function PublicMg() {
    }
    Object.defineProperty(PublicMg, "Instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new PublicMg();
            }
            return this._instance;
        },
        enumerable: false,
        configurable: true
    });
    /**监听回到游戏 */
    PublicMg.prototype.onShow = function () {
        var _this_1 = this;
        PlatformMg_1.default.Instance.platform.onShow(function (res) {
            if (res.scene == '1037' || res.scene == '1038') {
                GameData_1.default.isScene = true;
            }
            ProwerMg_1.default.initTL();
            //SoundUtil.stop('bg');
            Laya.timer.once(500, _this_1, function () {
                SoundUtil_1.default.play('bg');
            });
        });
    };
    /**
     * 场景中加入预制体
     * @param src 预制体json路径
     * @param onload 加载回调
     * @param _this 执行域
     */
    PublicMg.AddPrefab = function (src, onload, _this) {
        Laya.loader.create(src, Laya.Handler.create(_this, onload));
        return new Promise(function (fulfill, reject) {
            try {
                fulfill("success");
            }
            catch (error) {
                reject("fail");
            }
        });
    };
    /**金币换算返回number，用于计算 */
    PublicMg.prototype.getGoldCoin = function (val) {
        var num = parseFloat(val);
        var _num;
        var str = val.charAt(val.length - 1);
        //console.log(str,num)
        switch (str) {
            case 'T':
                _num = num * 1000000;
                break;
            case 'K':
                _num = num * 1000;
                break;
            default:
                _num = num;
        }
        return _num;
    };
    /**金币换算返回String,用于显示 */
    PublicMg.prototype.setGoldCoin = function (val) {
        var str;
        if (val > 1000000) {
            str = (val / 1000000).toFixed(1) + 'T';
        }
        else if (val > 1000) {
            str = (val / 1000).toFixed(1) + 'K';
        }
        else {
            str = val + '';
        }
        return str;
    };
    /**返回相对于父级坐标：point */
    PublicMg.prototype.toParentPoin = function (obj) {
        var oPoint;
        oPoint = Laya.Point.create();
        oPoint.setTo(obj.x, obj.y);
        oPoint = obj.toParentPoint(oPoint);
        return oPoint;
    };
    /**返回相对于stage坐标：point */
    PublicMg.prototype.stagePoin = function (obj, node) {
        if (node === void 0) { node = Laya.stage; }
        var oPoint;
        oPoint = Laya.Point.create();
        oPoint.setTo(obj.x, obj.y);
        oPoint = obj.fromParentPoint(oPoint);
        oPoint = obj.localToGlobal(oPoint, false, node);
        return oPoint;
    };
    /**stage坐标转父级坐标：point */
    PublicMg.prototype.parentPoin = function (obj, _x, _y) {
        var oPoint;
        oPoint = new Laya.Point(_x, _y);
        obj.globalToLocal(oPoint);
        //oPoint = obj.toParentPoint(oPoint)
        return oPoint;
    };
    return PublicMg;
}());
exports.default = PublicMg;
