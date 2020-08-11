"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PlatformMg_1 = __importDefault(require("../PlatformMg"));
var TipsUtil_1 = __importDefault(require("../../Utils/TipsUtil"));
/**
 * 字节跳动更多游戏管理类
 * 2020/2/22
 */
var ttMoreGames = /** @class */ (function () {
    function ttMoreGames() {
    }
    ttMoreGames.init = function (data) {
        //后台读取hr.data.data.gamelist
        var gamelist = [];
        for (var i = 0; i < data.length; i++) {
            var _str = data[i].url;
            //_str = _str.substring(7)
            gamelist.push({
                "appId": data[i].appid,
                "query": _str,
            });
        }
        ttMoreGames.appidArr = gamelist;
        console.log('导出设置', ttMoreGames.appidArr);
    };
    /**弹出一个固定样式的弹窗，弹窗中包含预先配置的小游戏列表，支持点击列表中的游戏进行跳转。 */
    ttMoreGames.show = function () {
        var systemInfo = PlatformMg_1.default.Instance.platform.getSystemInfoSync();
        // iOS 不支持，建议先检测再使用
        if (systemInfo.platform !== "ios") {
            // 打开互跳弹窗
            if (PlatformMg_1.default.Instance.platform.showMoreGamesModal) {
                PlatformMg_1.default.Instance.platform.showMoreGamesModal({
                    appLaunchOptions: ttMoreGames.appidArr,
                    success: function (res) {
                        console.log("打开更多游戏弹窗成功", res.errMsg);
                        ttMoreGames.onShow();
                    },
                    fail: function (res) {
                        console.log("打开更多游戏弹窗失败", res.errMsg);
                    }
                });
            }
            else {
                PlatformMg_1.default.Instance.platform.showModal({
                    title: "提示",
                    content: "当前客户端版本过低，无法使用该功能，请升级客户端或关闭后重启更新。"
                });
            }
        }
        else {
            TipsUtil_1.default.msg('暂时不支持ios游戏盒子！');
        }
    };
    /**监听跳转游戏 */
    ttMoreGames.onShow = function () {
        PlatformMg_1.default.Instance.platform.onNavigateToMiniProgram(function (res) {
            console.log("监听跳转游戏", res);
            switch (res.errCode) {
                case 0:
                    //跳转成功
                    break;
                case 1:
                    //跳转失败
                    break;
                case 2:
                    //用户取消
                    break;
                default:
                    break;
            }
            ttMoreGames.offShow();
        });
    };
    /**取消监听跳转游戏
     * @param callback 取消指定回调函数 callback 不填取消全部回调函数
    */
    ttMoreGames.offShow = function (callback) {
        PlatformMg_1.default.Instance.platform.offNavigateToMiniProgram(callback);
    };
    /**监听关闭更多游戏弹窗 */
    ttMoreGames.onMoreBtnClose = function (callback) {
        PlatformMg_1.default.Instance.platform.onMoreGamesModalClose(callback);
    };
    /**取消监听关闭更多游戏弹窗
     * @param callback 取消指定回调函数 callback 不填取消全部回调函数
     */
    ttMoreGames.offMoreBtnClose = function (callback) {
        PlatformMg_1.default.Instance.platform.offMoreGamesModalClose(callback);
    };
    return ttMoreGames;
}());
exports.default = ttMoreGames;
