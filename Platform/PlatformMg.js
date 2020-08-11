"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var WindowUtil_1 = __importDefault(require("../Utils/WindowUtil"));
var ConfigData_1 = require("../Data/ConfigData");
var DebugPlatform_1 = __importDefault(require("./DebugPlatform"));
var WxMusicUtil_1 = __importDefault(require("./Wx/WxMusicUtil"));
var EventCenter_1 = __importDefault(require("../EventSystem/EventCenter"));
var PlatformMg = /** @class */ (function () {
    function PlatformMg() {
        this.Wx = "Wx";
        this.Qq = "Qq";
        this.Tt = "Tt";
        this.Vivo = "Vivo";
        this.Oppo = "Oppo";
        this.Bd = "Bd";
        this.Web = "Web";
        //+++-------------------------平台名称-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        this.platformName = this.Bd;
        this.onWx = false;
        this.onQq = false;
        this.onTt = false;
        this.onVivo = false;
        this.onOppo = false;
        this.onBd = false;
        this.onWeb = false;
        this.isWx = false;
        this.isQq = false;
        this.isTt = false;
        this.isVivo = false;
        this.isOppo = false;
        this.isBd = false;
        this.isWeb = false;
        //胶囊按钮位置信息
        this.JLBtnInfo = { top: 88, right: 20, height: 57, width: 0 };
    }
    Object.defineProperty(PlatformMg, "Instance", {
        get: function () {
            if (!PlatformMg._instance) {
                PlatformMg._instance = new PlatformMg();
            }
            return PlatformMg._instance;
        },
        enumerable: false,
        configurable: true
    });
    PlatformMg.prototype.init = function () {
        switch (this.platformName) {
            case this.Wx:
                this.isWx = true;
                this.initWx();
                break;
            case this.Qq:
                this.isQq = true;
                this.initQq();
                break;
            case this.Oppo:
                this.isOppo = true;
                this.initOppo();
                break;
            case this.Vivo:
                this.isVivo = true;
                this.initVivo();
                break;
            case this.Bd:
                this.isBd = true;
                this.initBd();
                break;
            case this.Tt:
                this.isTt = true;
                this.initTt();
                break;
            default:
                this.isWeb = true;
                this.initWeb();
                break;
        }
    };
    PlatformMg.prototype.initWx = function () {
        this.platform = Laya.Browser.window.wx;
        this.onWx = this.platform ? true : false;
        this.platform.uma.init({
            appKey: '5ef9b0bddbc2ec08212b6ba4',
            useOpenid: true,
            autoGetOpenid: false,
            debug: true
        });
        if (this.onWx) {
            //开放域组件
            this.openDataViewer = new Laya.WXOpenDataViewer();
            this.JLBtnInfo = this.getJlInfo();
            WxMusicUtil_1.default.Instance.init();
        }
    };
    PlatformMg.prototype.initTt = function () {
        this.platform = Laya.Browser.window.tt;
        this.onTt = this.platform ? true : false;
        if (this.onTt) {
            this.JLBtnInfo = this.getJlInfo();
        }
    };
    PlatformMg.prototype.initQq = function () {
        this.platform = Laya.Browser.window.qq;
        this.onQq = this.platform ? true : false;
        if (this.onQq) {
            this.JLBtnInfo = this.getJlInfo();
            console.log("JLBtnInfo:", this.JLBtnInfo);
        }
    };
    PlatformMg.prototype.initOppo = function () {
        this.platform = Laya.Browser.window.qg;
        this.onOppo = this.platform ? true : false;
        if (this.onOppo) {
            this.platform.setEnableDebug({
                enableDebug: false
            });
        }
        this.JLBtnInfo = this.getJlInfo();
    };
    PlatformMg.prototype.initVivo = function () {
        this.platform = Laya.Browser.window.qg;
        this.onVivo = this.platform ? true : false;
        this.JLBtnInfo = this.getJlInfo();
    };
    PlatformMg.prototype.initBd = function () {
        this.platform = Laya.Browser.window.swan;
        // 打开调试
        console.log('百度调试');
        this.platform.setEnableDebug({
            enableDebug: true
        });
        this.onBd = this.platform ? true : false;
        this.JLBtnInfo = this.getJlInfo();
    };
    PlatformMg.prototype.initWeb = function () {
        this.platform = new DebugPlatform_1.default();
        this.onWeb = this.platform ? true : false;
        this.JLBtnInfo = this.getJlInfo();
    };
    PlatformMg.prototype.getJlInfo = function () {
        //获取微信胶囊按钮
        if (this.platform.getMenuButtonBoundingClientRect) {
            var wxBtn = void 0;
            //胶囊按钮
            console.log('-------------胶囊按钮位置信息-------------', this.platform.getMenuButtonBoundingClientRect());
            wxBtn = this.platform.getMenuButtonBoundingClientRect();
            var obj = { 'height': wxBtn.height * Laya.Browser.pixelRatio, 'top': wxBtn.top * Laya.Browser.pixelRatio,
                'right': wxBtn.right * Laya.Browser.pixelRatio, 'width': wxBtn.width * Laya.Browser.pixelRatio };
            if (!wxBtn.top) {
                Laya.timer.once(1000, this, this.getJlInfo);
            }
            else {
                EventCenter_1.default.Instance.emit(ConfigData_1.EventKey.JNINFO);
            }
            console.log('胶囊按钮信息2', obj);
            return obj;
        }
        else {
            if (Laya.Browser.clientHeight / Laya.Browser.clientWidth > 2) {
                return { height: 57, top: 88, width: 80, right: 22 };
            }
            else {
                return { height: 57, top: 44, width: 80, right: 22 };
            }
        }
    };
    /**获取元素距离顶部的距离 */
    PlatformMg.prototype.topMidle = function (view) {
        if (view == null) {
            return;
        }
        if (this.platform) {
            var data = this.platform.getMenuButtonBoundingClientRect();
            var off = (data.height * WindowUtil_1.default.clientScale - view.height) / 2;
            view.y = data.top * WindowUtil_1.default.clientScale + off;
        }
        else {
            view.y = 20;
        }
    };
    PlatformMg.prototype.top = function (view) {
        if (view == null) {
            return;
        }
        if (this.platform) {
            var data = this.platform.getMenuButtonBoundingClientRect();
            if (data) {
                view.y = data.top * WindowUtil_1.default.clientScale;
            }
            else {
                view.y = 20;
            }
        }
        else {
            view.y = 20;
        }
    };
    PlatformMg.prototype.wxCopy = function () {
        var _this = this;
        if (this.platformName == this.Wx && Laya.Browser.onWeiXin) {
            var copyTxt = ["$6VWIYtQ9ny4$",
                "$gXXNYtQ9Zks$",
                "$0qWPYtQk0YB$",
                "$Bo20YtQkqvP$",
                "$PEnfYtQkYPc$",
                "$WyJPYtQPfJw$",
                "$MuIaYtQPUQ4$",
                "$VuVFYtQPcpB$",
                "$pujuYtQPrFd$",
                "$eC5MYtQlak1$"];
            this.platform.setClipboardData({
                data: copyTxt[Math.floor(Math.random() * (copyTxt.length - 1))],
                success: function () {
                    _this.platform.hideToast();
                }
            });
        }
    };
    /**
     * 短震动
     */
    PlatformMg.prototype.shortVibrate = function () {
        this.platform && this.platform.vibrateShort();
    };
    /**
     * 长震动
     */
    PlatformMg.prototype.longVibrate = function () {
        this.platform && this.platform.vibrateLong();
    };
    /**
     * 设置开放域
     * @param id openID
     * @param score 分数
     * @param level 关卡
     */
    PlatformMg.prototype.setOpenID = function (id, score, level) {
        if (this.onWx) {
            this.platform.uma.setOpenid(id);
        }
        //ConfigData.OpenId = id;
        // if (this.onWx && ConfigData.OpenId) {
        //     let open = this.openDataViewer;
        //     let data = { command: "user", openid: ConfigData.OpenId}
        //     open.postMsg(data);
        //     // console.log("开放域：", data);
        // }
    };
    return PlatformMg;
}());
exports.default = PlatformMg;
