"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WindowUtil = /** @class */ (function () {
    function WindowUtil() {
    }
    WindowUtil.init = function () {
        //设计稿实际高度
        this.gameHeight = 750 * Laya.Browser.clientHeight / Laya.Browser.clientWidth;
        //设计高度与实际高度的比
        this.clientScale = this.gameHeight / Laya.Browser.clientHeight;
        this.heightOffsetScale = (this.gameHeight - 1334) / (1624 - 1334);
        if (this.gameHeight - 1334 > 0) {
            this.offY = (this.gameHeight - 1334) / 2;
        }
        this.isIphoneX = Laya.Browser.clientHeight / Laya.Browser.clientWidth > 2;
        console.log("WindowUtil ---------------------------------------------------------");
        console.log("WindowUtil Laya.Browser.client:", Laya.Browser.clientWidth, Laya.Browser.clientHeight);
        console.log("WindowUtil Laya.stageSize:", Laya.stage.width, Laya.stage.height);
        console.log("WindowUtil IsIphoneX=", this.isIphoneX);
        console.log("WindowUtil gameWidth=" + this.gameWidth, "  gameHeight=" + this.gameHeight);
        console.log("WindowUtil clientScale=", this.clientScale);
        console.log("WindowUtil heightOffsetScale=", this.heightOffsetScale);
        console.log("WindowUtil offY=", this.offY);
        console.log("WindowUtil ---------------------------------------------------------");
    };
    /**
     * 物体跟随
     * @param followed_spr_1 :被跟随组件
     * @param follow_spr_2 ：跟随组件
     * @param off_position ：差值
     * @param rate ：插值 0~1
     */
    WindowUtil.follow2 = function (followed_spr_1, follow_spr_2, off_position, rate) {
        if (rate === void 0) { rate = 1; }
        var add_v3 = new Laya.Vector3();
        Laya.Vector3.add(followed_spr_1.transform.position, off_position, add_v3);
        var camare_off_rate_v3 = new Laya.Vector3();
        Laya.Vector3.lerp(follow_spr_2.transform.position, add_v3, rate, camare_off_rate_v3);
        follow_spr_2.transform.position = camare_off_rate_v3;
    };
    WindowUtil.follow2Z = function (followed_spr_1, follow_spr_2, off_position, rate) {
        if (rate === void 0) { rate = 1; }
        var add_v3 = new Laya.Vector3();
        Laya.Vector3.add(followed_spr_1.transform.position, off_position, add_v3);
        var camare_off_rate_v3 = new Laya.Vector3();
        Laya.Vector3.lerp(follow_spr_2.transform.position, add_v3, rate, camare_off_rate_v3);
        follow_spr_2.transform.localPositionZ = camare_off_rate_v3.z;
    };
    /**
     * 屏幕适配
     */
    //场景size
    WindowUtil.gameWidth = 750;
    WindowUtil.gameHeight = 1334;
    //屏幕适配Y轴偏移量
    WindowUtil.offY = 0;
    WindowUtil.isIphoneX = false;
    WindowUtil.clientScale = 1;
    WindowUtil.heightOffsetScale = 0;
    return WindowUtil;
}());
exports.default = WindowUtil;
