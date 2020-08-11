"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PlatformMg_1 = __importDefault(require("../Platform/PlatformMg"));
/**弹窗页面数据 */
var ActivityUrls = /** @class */ (function () {
    function ActivityUrls() {
    }
    /**加载页面 */
    ActivityUrls.LOAD_SCENE = "Scenes/LoadingScene.scene";
    /**游戏页面 */
    ActivityUrls.GAME_SCENE = "Scenes/GameScene.scene";
    /**首页弹窗*/
    ActivityUrls.Home_DIALOG = "Dialogs/HomeDialog.scene";
    /**商店弹窗*/
    ActivityUrls.SHOP_DIALOG = "Dialogs/ShopDialog.scene";
    /**签到弹窗*/
    ActivityUrls.CHECKIN_DIALOG = "Dialogs/CheckInDialog.scene";
    /**排行榜弹窗*/
    ActivityUrls.RAND_DIALOG = "Dialogs/RankDialog.scene";
    /**通关领取金币弹窗*/
    ActivityUrls.PASSCOIN_DIALOG = "Dialogs/PassCoinDialog.scene";
    /**通关弹窗*/
    ActivityUrls.PASS_DIALOG = "Dialogs/PassDialog.scene";
    /**复活弹窗*/
    ActivityUrls.RESU_DIALOG = PlatformMg_1.default.Instance.platformName === PlatformMg_1.default.Instance.Wx ? "Dialogs/ResuWxDialog.scene" : "Dialogs/ResuDialog.scene";
    /**失败弹窗*/
    ActivityUrls.FAIL_DIALOG = "Dialogs/FailDialog.scene";
    /**宝箱弹窗*/
    ActivityUrls.BX_DIALOG = "Dialogs/BxDialog.scene";
    /**导出弹窗*/
    ActivityUrls.EXPROT_DIALOG = "Dialogs/ExprotDialog.scene";
    /**导出盒子2弹窗*/
    ActivityUrls.EXPROTBOX_DIALOG = "Dialogs/ExprotBox2Dialog.scene";
    /**导出盒子弹窗*/
    ActivityUrls.EXPROTBOX3_DIALOG = "Dialogs/ExprotBox3Dialog.scene";
    /**导出列表弹窗*/
    ActivityUrls.EXPROTLIST_DIALOG = "Dialogs/ExprotListDialog.scene";
    /**导航工具弹窗*/
    ActivityUrls.MENT_DIALOG = "Dialogs/MentDialog.scene";
    /**导航工具弹窗*/
    ActivityUrls.PAUSE_DIALOG = "Dialogs/PauseDialog.scene";
    /**失败试用弹窗*/
    ActivityUrls.TRYFAIL_DIALOG = "Dialogs/TryFailDialog.scene";
    /**通关试用弹窗*/
    ActivityUrls.TRYEND_DIALOG = "Dialogs/TryEndDialog.scene";
    /**关卡弹窗*/
    ActivityUrls.LEVEL_DIALOG = "Dialogs/LevelDialog.scene";
    /**体力弹窗*/
    ActivityUrls.TL_DIALOG = "Dialogs/TlDialog.scene";
    /**原生广告*/
    ActivityUrls.NativeDIALOG = "Dialogs/NativeDialog.scene";
    return ActivityUrls;
}());
exports.default = ActivityUrls;
