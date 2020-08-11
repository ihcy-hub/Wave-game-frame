"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var recorderMgr_1 = __importDefault(require("./recorderMgr"));
var PlatformMg_1 = __importDefault(require("../PlatformMg"));
var TipsUtil_1 = __importDefault(require("../../Utils/TipsUtil"));
var ttShar = /** @class */ (function () {
    function ttShar() {
    }
    ttShar.init = function () {
        //添加右上角分享
        PlatformMg_1.default.Instance.platform.showShareMenu({ withShareTicket: true });
        ttShar.onShareAppMessage(function (res) {
            return {
                title: ttShar.title,
                imageUrl: ttShar._url
            };
        });
    };
    ttShar.onShareAppMessage = function (callback) { PlatformMg_1.default.Instance.platform.onShareAppMessage(callback); };
    ;
    ttShar.shareAppMessage = function (obj) { PlatformMg_1.default.Instance.platform.shareAppMessage(obj); };
    ;
    /**
     * 分享
     * @param {any} options
     * @param {String} options.channel 类型 'vidoe'_视频分享
     * @param {String} options.title 标题
     * @param {String} options.desc 描述
     * @param {String} options.imageUrl 图片路径
     * @param {String} options.query 分享场景值
     * @param {String} options.videoPath 录屏得到的视频地址
     * @param {Array:string}options.videoTopics 视频话题(只在抖音可用)
     * @param {Function}options.success 成功
     * @param {Function}options.fail 失败
     */
    ttShar.share = function (options) {
        var videoId;
        if (recorderMgr_1.default.recorderTime < 4) {
            TipsUtil_1.default.msg('录屏时间小于3S，不能发布录屏!');
        }
        else if (!(options.videoPath)) {
            //录屏地址
            TipsUtil_1.default.msg('录屏异常,请下一局再尝试！');
            //options.success&&options.success()
        }
        else {
            if (options.channel === 'video') {
                ttShar.shareAppMessage({
                    channel: "video",
                    title: options.title ? options.title : ttShar.title,
                    desc: options.desc ? options.desc : "",
                    imageUrl: options.imageUrl ? options.imageUrl : ttShar._url,
                    templateId: ttShar._id,
                    query: options.query ? options.query : "",
                    extra: {
                        videoPath: options.videoPath,
                        videoTopics: options.videoTopics ? options.videoTopics : [""]
                    },
                    success: function (res) {
                        videoId = res.videoId;
                        options.success && options.success();
                    },
                    fail: function (e) {
                        options.fail && options.fail(e);
                    },
                    error: function (res) {
                        if (options.error) {
                            options.error(res);
                        }
                        else {
                            TipsUtil_1.default.msg('对局时间应大于3秒才能分享录屏哦');
                        }
                    }
                });
                PlatformMg_1.default.Instance.platform.navigateToVideoView({
                    videoId: videoId,
                    success: function (res) {
                        console.log("done");
                    },
                    fail: function (err) {
                        console.log('视频跳转失败', err);
                        if (err.errCode === 1006) {
                            PlatformMg_1.default.Instance.platform.showToast({
                                title: "something wrong with your network"
                            });
                        }
                    }
                });
            }
            else {
                ttShar.shareAppMessage({
                    templateId: ttShar._id,
                    title: options.title ? options.title : ttShar.title,
                    desc: options.desc ? options.desc : "",
                    imageUrl: options.imageUrl ? options.imageUrl : ttShar._url,
                    query: options.query ? options.query : "",
                    success: function () {
                        options.success && options.success();
                    },
                    fail: function (e) {
                        options.fail && options.fail();
                    }
                });
            }
        }
    };
    ttShar._url = 'https://sf1-ttcdn-tos.pstatp.com/img/developer/app/tt8224f4991d1eb3c3/si8a18f9c~noop.image';
    ttShar.title = '公路追击大逃亡！';
    ttShar._id = '49d5p7cdikd2hhi0if';
    return ttShar;
}());
exports.default = ttShar;
