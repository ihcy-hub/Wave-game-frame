"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PlatformMg_1 = __importDefault(require("../Platform/PlatformMg"));
var WxMusicUtil_1 = __importDefault(require("../Platform/Wx/WxMusicUtil"));
/**声音管理类 */
var SoundUtil = /** @class */ (function () {
    //构造函数
    function SoundUtil() {
    }
    Object.defineProperty(SoundUtil, "Instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new SoundUtil();
            }
            return this._instance;
        },
        enumerable: false,
        configurable: true
    });
    //初始化
    SoundUtil.init = function (options) {
        SoundUtil.options = options;
        //不播放音效时储存到本地
        var s = Laya.LocalStorage.getItem(this._status_key); //platform.getStorageSync(this._status_key);
        this.status = (s ? false : true);
    };
    /**暂停所有声音 */
    SoundUtil.StopAll = function () {
        SoundUtil.status = false;
        SoundUtil.stop('bg');
    };
    /**恢复所有声音 */
    SoundUtil.RestAll = function () {
        SoundUtil.status = true;
        SoundUtil.play('bg');
    };
    Object.defineProperty(SoundUtil, "status", {
        /**获取播放状态 */
        get: function () {
            return SoundUtil._status;
        },
        /**
         * 设置播放状态
         * @param status --true 播放  false--不播放
         */
        set: function (status) {
            SoundUtil._status = status;
            //设置静音
            Laya.SoundManager.muted = Laya.SoundManager.musicMuted = Laya.SoundManager.soundMuted = !SoundUtil._status;
            console.log("是否静音", Laya.SoundManager.muted + '');
            if (SoundUtil._status) {
                Laya.LocalStorage.removeItem(this._status_key);
                //SoundUtil.play('bg');
            }
            else {
                Laya.SoundManager.stopAll();
                //储存状态
                Laya.LocalStorage.setItem(this._status_key, this._status_key);
            }
        },
        enumerable: false,
        configurable: true
    });
    //播放音效
    SoundUtil.play = function (name, num, onComplete) {
        if (num === void 0) { num = 1; }
        if (onComplete === void 0) { onComplete = null; }
        if (SoundUtil._status) {
            if (this.options[name].type === 'music') {
                console.log('播放背景音乐', this.options[name].url);
                if (PlatformMg_1.default.Instance.isWx) {
                    WxMusicUtil_1.default.Instance.playMusic(this.options[name].url, true);
                    return;
                }
                Laya.SoundManager.playMusic(this.options[name].url, 0);
                //音量
                Laya.SoundManager.setSoundVolume(1, this.options[name].url);
            }
            else {
                Laya.SoundManager.playSound(this.options[name].url, num, onComplete === null ? null : Laya.Handler.create(this, onComplete));
            }
        }
    };
    //暂停音效
    SoundUtil.stop = function (name) {
        if (this.options[name].type === 'music') {
            if (PlatformMg_1.default.Instance.isWx) {
                WxMusicUtil_1.default.Instance.stopAll();
                return;
            }
            Laya.SoundManager.stopMusic();
            console.log('停止播放背景音乐');
        }
        else {
            Laya.SoundManager.stopSound(this.options[name].url);
        }
    };
    //本地缓存音效状态的key值
    SoundUtil._status_key = 'sound_key';
    /** 状态true--播放  false --不播放*/
    SoundUtil._status = true;
    //音频路径
    SoundUtil.options = {};
    return SoundUtil;
}());
exports.default = SoundUtil;
