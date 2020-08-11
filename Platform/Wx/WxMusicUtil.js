"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PlatformMg_1 = __importDefault(require("../PlatformMg"));
var WxMusicUtil = /** @class */ (function () {
    function WxMusicUtil() {
        this.music_url = "";
        this.music_loop = false;
        this.sound_inner_isPlaying = false;
        this.sound_inner_isPause = false;
        this.sound_inner_isStop = false;
    }
    Object.defineProperty(WxMusicUtil, "Instance", {
        get: function () {
            if (!WxMusicUtil.instance) {
                WxMusicUtil.instance = new WxMusicUtil();
            }
            return WxMusicUtil.instance;
        },
        enumerable: false,
        configurable: true
    });
    WxMusicUtil.prototype.init = function () {
        if (!PlatformMg_1.default.Instance.onWx) {
            console.error("未找到微信接口");
            return;
        }
        this.mp3_inner = PlatformMg_1.default.Instance.platform.createInnerAudioContext();
        this.onMusicListener();
        this.wav_inner = PlatformMg_1.default.Instance.platform.createInnerAudioContext();
        this.onSoundListener();
    };
    /**播放背景音乐 */
    WxMusicUtil.prototype.playMusic = function (url, isLoop) {
        var _this = this;
        if (isLoop === void 0) { isLoop = false; }
        if (this.mp3_inner) {
            this.music_url = url;
            this.music_loop = isLoop;
            this.mp3_inner.stop();
            this.mp3_inner.src = url;
            this.mp3_inner.loop = isLoop;
            Laya.timer.once(200, this, function () {
                _this.mp3_inner.play();
            });
        }
    };
    /**播放音效 */
    WxMusicUtil.prototype.playSound = function (url, isLoop) {
        if (isLoop === void 0) { isLoop = false; }
        if (this.wav_inner) {
            if (this.sound_inner_isPlaying || this.sound_inner_isPause) {
                this.wav_inner.stop();
            }
            this.wav_inner.src = url;
            this.wav_inner.loop = isLoop;
            this.wav_inner.play();
        }
    };
    /**停止所有音效 */
    WxMusicUtil.prototype.stopAll = function () {
        if (this.mp3_inner) {
            this.mp3_inner.volume = 0;
        }
        if (this.wav_inner) {
            this.wav_inner.volume = 0;
        }
    };
    /**播放所用音效 */
    WxMusicUtil.prototype.playAll = function () {
        if (this.mp3_inner) {
            this.mp3_inner.volume = 1;
        }
        if (this.wav_inner) {
            this.wav_inner.volume = 1;
        }
    };
    WxMusicUtil.prototype.onMusicListener = function () {
        var _this = this;
        //监听音频进入可以播放状态的事件。但不保证后面可以流畅播放
        this.mp3_inner.onCanplay(function () {
            //console.log("1111进入可以播放状态的事件");
        });
        //监听音频播放事件
        this.mp3_inner.onPlay(function () {
            //console.log("1111音频播放事件");
        });
        //监听音频暂停事件
        this.mp3_inner.onPause(function () {
            //console.log("1111音频暂停事件");
        });
        //监听音频停止事件
        this.mp3_inner.onStop(function () {
            //console.log("1111音频停止事件");
            _this.mp3_inner.destroy();
            _this.mp3_inner = PlatformMg_1.default.Instance.platform.createInnerAudioContext();
            _this.onMusicListener();
            _this.playMusic(_this.music_url, _this.music_loop);
        });
        //监听音频自然播放至结束的事件
        this.mp3_inner.onEnded(function () {
            //console.log("1111音频自然播放至结束的事件");
        });
        //监听音频播放进度更新事件
        this.mp3_inner.onTimeUpdate(function () {
            //console.log("1111音频播放进度更新事件");
            //console.log('音量大小',this.mp3_inner.volume)
        });
        //监听音频播放错误事件
        this.mp3_inner.onError(function () {
            //console.log("1111音频播放错误事件");
            _this.mp3_inner.destroy();
            _this.mp3_inner = PlatformMg_1.default.Instance.platform.createInnerAudioContext();
            _this.onMusicListener();
            _this.playMusic(_this.music_url, _this.music_loop);
        });
        //监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发
        this.mp3_inner.onWaiting(function () {
            //console.log("1111音频加载中事件");
        });
        //监听音频进行跳转操作的事件
        this.mp3_inner.onSeeking(function () {
            //console.log("1111音频进行跳转操作的事件");
        });
        //监听音频完成跳转操作的事件
        this.mp3_inner.onSeeked(function () {
            //console.log("1111音频完成跳转操作的事件");
        });
    };
    WxMusicUtil.prototype.offMusicListener = function () {
        //取消监听音频进入可以播放状态的事件
        this.mp3_inner.offCanplay(function () { });
        //取消监听音频播放事件
        this.mp3_inner.offPlay(function () { });
        //取消监听音频暂停事件
        this.mp3_inner.offPause(function () { });
        //取消监听音频停止事件
        this.mp3_inner.offStop(function () { });
        //取消监听音频自然播放至结束的事件
        this.mp3_inner.offEnded(function () { });
        //取消监听音频播放进度更新事件
        this.mp3_inner.offTimeUpdate(function () { });
        //取消监听音频播放错误事件
        this.mp3_inner.offError(function () { });
        //取消监听音频加载中事件
        this.mp3_inner.offWaiting(function () { });
        //取消监听音频进行跳转操作的事件
        this.mp3_inner.offSeeking(function () { });
        //取消音频完成跳转操作的事件
        this.mp3_inner.offSeeked(function () { });
    };
    WxMusicUtil.prototype.onSoundListener = function () {
        var _this = this;
        //监听音频进入可以播放状态的事件。但不保证后面可以流畅播放
        this.wav_inner.onCanplay(function () {
            //console.log("进入可以播放状态的事件");
        });
        //监听音频播放事件
        this.wav_inner.onPlay(function () {
            //console.log("音频播放事件");
            _this.sound_inner_isPlaying = true;
            _this.sound_inner_isPause = false;
            _this.sound_inner_isStop = false;
        });
        //监听音频暂停事件
        this.wav_inner.onPause(function () {
            //console.log("音频暂停事件");
            _this.sound_inner_isPlaying = false;
            _this.sound_inner_isPause = true;
            _this.sound_inner_isStop = false;
        });
        //监听音频停止事件
        this.wav_inner.onStop(function () {
            //console.log("音频暂停事件");
            _this.sound_inner_isPlaying = false;
            _this.sound_inner_isPause = false;
            _this.sound_inner_isStop = true;
        });
        //监听音频自然播放至结束的事件
        this.wav_inner.onEnded(function () {
            //console.log("音频自然播放至结束的事件");
            _this.sound_inner_isPlaying = false;
            _this.sound_inner_isPause = false;
            _this.sound_inner_isStop = true;
        });
        //监听音频播放进度更新事件
        this.wav_inner.onTimeUpdate(function () {
            //console.log("音频播放进度更新事件");
        });
        //监听音频播放错误事件
        this.wav_inner.onError(function () {
            //console.log("音频播放错误事件");
            _this.sound_inner_isPlaying = false;
            _this.sound_inner_isPause = false;
            _this.sound_inner_isStop = false;
        });
        //监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发
        this.wav_inner.onWaiting(function () {
            //console.log("音频加载中事件");
        });
        //监听音频进行跳转操作的事件
        this.wav_inner.onSeeking(function () {
            //console.log("音频进行跳转操作的事件");
        });
        //监听音频完成跳转操作的事件
        this.wav_inner.onSeeked(function () {
            //console.log("音频完成跳转操作的事件");
        });
    };
    WxMusicUtil.prototype.offSoundListener = function () {
        //取消监听音频进入可以播放状态的事件
        this.wav_inner.offCanplay(function () { });
        //取消监听音频播放事件
        this.wav_inner.offPlay(function () { });
        //取消监听音频暂停事件
        this.wav_inner.offPause(function () { });
        //取消监听音频停止事件
        this.wav_inner.offStop(function () { });
        //取消监听音频自然播放至结束的事件
        this.wav_inner.offEnded(function () { });
        //取消监听音频播放进度更新事件
        this.wav_inner.offTimeUpdate(function () { });
        //取消监听音频播放错误事件
        this.wav_inner.offError(function () { });
        //取消监听音频加载中事件
        this.wav_inner.offWaiting(function () { });
        //取消监听音频进行跳转操作的事件
        this.wav_inner.offSeeking(function () { });
        //取消音频完成跳转操作的事件
        this.wav_inner.offSeeked(function () { });
    };
    return WxMusicUtil;
}());
exports.default = WxMusicUtil;
