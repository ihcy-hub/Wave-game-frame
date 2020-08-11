"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PlatformMg_1 = __importDefault(require("../PlatformMg"));
/**录屏管理器 */
var recorderMgr = /** @class */ (function () {
    function recorderMgr() {
    }
    recorderMgr.init = function () {
        recorderMgr.recorder = PlatformMg_1.default.Instance.platform.getGameRecorderManager();
    };
    /**开始录屏
     * @param time 时间
     */
    recorderMgr.start = function (time) {
        if (time === void 0) { time = 120; }
        recorderMgr.recorder.onStart(function (res) { recorderMgr.isLp = true; console.log("录屏开始"); });
        recorderMgr.recorder.start({ duration: time });
        recorderMgr.recorderTime = 0;
        recorderMgr._time = setInterval(function () {
            recorderMgr.recorderTime++;
        }, 1000);
    };
    /**
     * 结束录屏
     */
    recorderMgr.stop = function () {
        clearInterval(recorderMgr._time);
        recorderMgr.recorder.onStop(function (res) {
            recorderMgr.isLp = false;
            console.log("录屏结束");
            recorderMgr.videoPath = res.videoPath; // 录屏文件路径，分享时用这个
        });
        recorderMgr.recorder.stop();
    };
    recorderMgr.recorderTime = 0; //录屏时间
    recorderMgr.isLp = false; //是否正在录屏
    return recorderMgr;
}());
exports.default = recorderMgr;
