"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PlatformMg_1 = __importDefault(require("../Platform/PlatformMg"));
var ConfigData_1 = __importDefault(require("../Data/ConfigData"));
var GameData_1 = __importDefault(require("../Game/GameMg/GameData"));
var AldMg = /** @class */ (function () {
    function AldMg() {
    }
    /**
     * 关卡开始
     */
    AldMg.onStart = function (id, name, user_id) {
        if (!this.postAld) {
            return;
        }
        console.log('关卡', GameData_1.default.NowLevel, GameData_1.default.UserLevel);
        if (GameData_1.default.UserLevel != GameData_1.default.NowLevel) {
            return;
        }
        var obj = {
            "stageId": id ? id : GameData_1.default.NowLevel,
            "stageName": name ? '第' + name + '关' : '第' + GameData_1.default.NowLevel + '关',
            "userId": user_id ? user_id : ConfigData_1.default.OpenId
        };
        if (PlatformMg_1.default.Instance.platform) {
            var wx = Laya.Browser.window.wx;
            try {
                wx.aldStage.onStart(obj);
            }
            catch (error) {
                console.error("stageStart upload fail");
            }
        }
    };
    /**
     * 复活
     */
    AldMg.onRunning = function (id, name, user_id) {
        if (!this.postAld) {
            return;
        }
        var obj = {
            "stageId": id ? id : GameData_1.default.NowLevel,
            "stageName": name ? '第' + name + '关' : '第' + GameData_1.default.NowLevel + '关',
            "userId": user_id ? user_id : ConfigData_1.default.OpenId,
            "event": "relive"
        };
        if (PlatformMg_1.default.Instance.platform) {
            var wx = Laya.Browser.window.wx;
            try {
                wx.aldStage.onRunning(obj);
            }
            catch (error) {
                console.error("onRunning upload fail");
            }
        }
    };
    /**
     * 关卡结束
     * @param _event  是否完成
     */
    AldMg.onEnd = function (event, id, name, user_id) {
        if (!this.postAld) {
            return;
        }
        if (GameData_1.default.UserLevel != GameData_1.default.NowLevel) {
            return;
        }
        var obj = {
            "stageId": id ? id : GameData_1.default.NowLevel,
            "stageName": name ? '第' + name + '关' : '第' + GameData_1.default.NowLevel + '关',
            "userId": user_id ? user_id : ConfigData_1.default.OpenId,
            "event": event ? "complete" : "fail"
        };
        if (PlatformMg_1.default.Instance.platform) {
            var wx = Laya.Browser.window.wx;
            try {
                wx.aldStage.onEnd(obj);
            }
            catch (error) {
                console.error("onRunning upload fail");
            }
        }
    };
    /**
     * 上传自定义事件
     * @param obj
     */
    AldMg.upload = function (obj) {
        if (!this.postAld) {
            return;
        }
        if (PlatformMg_1.default.Instance.platform) {
            try {
                PlatformMg_1.default.Instance.platform.aldSendEvent(obj);
            }
            catch (error) {
            }
        }
    };
    AldMg.postAld = false;
    return AldMg;
}());
exports.default = AldMg;
