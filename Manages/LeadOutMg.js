"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var TipsUtil_1 = __importDefault(require("../Utils/TipsUtil"));
var HttpMg_1 = __importDefault(require("./HttpMg"));
var PlatformMg_1 = __importDefault(require("../Platform/PlatformMg"));
var UmMg_1 = __importDefault(require("../Utils/UmMg"));
var ActivityUrls_1 = __importDefault(require("../Data/ActivityUrls"));
/**
 * 导出管理类
 */
var LeadOutMg = /** @class */ (function () {
    function LeadOutMg() {
    }
    /**
    * 获取导出列表长度
    */
    LeadOutMg.getGameListSize = function () {
        if (this.GameList == null) {
            return 0;
        }
        else {
            return this.GameList.length;
        }
    };
    LeadOutMg.checkBannerGameList = function () {
        if (this.BannerList == null || this.BannerList.length <= 0) {
            return false;
        }
        else {
            return true;
        }
    };
    /**
    * 随机获取导出数组
    */
    LeadOutMg.getGameListRadom = function (num, list) {
        if (num == 0) {
            return null;
        }
        var ids = [];
        var newGameList = [];
        if (list != null && list.length > 0) {
            num = Math.min(num, list.length);
            var goon = true;
            while (goon) {
                var i = Number((Math.random() * (list.length - 1)).toFixed());
                if (ids.indexOf(i) < 0) {
                    ids.push(i);
                    newGameList.push(list[i]);
                }
                if (ids.length == num) {
                    goon = false;
                }
            }
            return newGameList;
        }
        else {
            return null;
        }
    };
    /**
     * 点击导出上传数据
     * @param gameInfo 导出当前数据
     */
    LeadOutMg.leadOut = function (gameInfo, str) {
        if (str === void 0) { str = 'e_11'; }
        //AldMg.upload(dc_pois);
        if (PlatformMg_1.default.Instance.onWx) {
            HttpMg_1.default.leadOut(gameInfo.id);
            PlatformMg_1.default.Instance.platform.navigateToMiniProgram({
                appId: gameInfo.appid,
                path: gameInfo.url,
                extraData: {
                    foo: 'bar'
                },
                envVersion: 'release',
                success: function (res) {
                    // 确认导出
                    HttpMg_1.default.leadOutSuccess(gameInfo.id);
                    UmMg_1.default.trackEvent(str);
                },
                fail: function () {
                    Laya.Dialog.open(ActivityUrls_1.default.EXPROTBOX3_DIALOG, true);
                }
            });
        }
        else if (PlatformMg_1.default.Instance.onTt) {
            //ttMoreGames.show();
        }
        else {
            TipsUtil_1.default.msg("仅在微信中使用");
        }
    };
    return LeadOutMg;
}());
exports.default = LeadOutMg;
