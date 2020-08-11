"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var GameData_1 = __importDefault(require("./GameData"));
var ConfigData_1 = require("../../Data/ConfigData");
var LocalStorageUtil_1 = __importDefault(require("../../Utils/LocalStorageUtil"));
var PlatformMg_1 = __importDefault(require("../../Platform/PlatformMg"));
var HttpMg_1 = __importDefault(require("../../Manages/HttpMg"));
var recorderMgr_1 = __importDefault(require("../../Platform/Tt/recorderMgr"));
var EventCenter_1 = __importDefault(require("../../EventSystem/EventCenter"));
var ActivityUrls_1 = __importDefault(require("../../Data/ActivityUrls"));
var LevelPressMgr_1 = __importDefault(require("../Script/LevelPressMgr"));
var SoundUtil_1 = __importDefault(require("../../Utils/SoundUtil"));
var ProwerMg_1 = __importDefault(require("./ProwerMg"));
var AldMg_1 = __importDefault(require("../../Manages/AldMg"));
var WxBannerAd_1 = __importDefault(require("../../Platform/Wx/WxBannerAd"));
var QqBannerAd_1 = __importDefault(require("../../Platform/Qq/QqBannerAd"));
var ExprotDrawerMgr_1 = __importDefault(require("../../Prefabs/ExprotDrawerMgr"));
var BdBannerAd_1 = __importDefault(require("../../Platform/Bd/BdBannerAd"));
/**游戏管理 */
var GameMg = /** @class */ (function () {
    function GameMg() {
    }
    Object.defineProperty(GameMg, "Instance", {
        /**获得单列 */
        get: function () {
            if (!this._instance) {
                this._instance = new GameMg();
            }
            return this._instance;
        },
        enumerable: false,
        configurable: true
    });
    //暂停
    GameMg.prototype.gamePause = function () {
    };
    //重新开始
    GameMg.prototype.gameRestart = function () {
    };
    //复活
    GameMg.prototype.gameRelive = function () {
        var _this = this;
        GameData_1.default.IsTcHome = false;
        Laya.View.open(ActivityUrls_1.default.GAME_SCENE, true, function () {
            _this.gameStart();
            for (var i = 0; i < GameData_1.default.LevelJD; i++) {
                LevelPressMgr_1.default.instace.icoUpdate(i + 1);
            }
        });
    };
    /**
     * 开始游戏
     */
    GameMg.prototype.gameStart = function () {
        //判断体力
        if (GameData_1.default.IsResu < 1) {
            if (ProwerMg_1.default.TlVal <= 0) {
                Laya.Dialog.open(ActivityUrls_1.default.TL_DIALOG, true);
                GameData_1.default.IsTcHome = false;
                Laya.View.open(ActivityUrls_1.default.GAME_SCENE);
                return;
            }
            ProwerMg_1.default.SetTl(true, 1);
            EventCenter_1.default.Instance.emit(ConfigData_1.EventKey.TL);
        }
    };
    /**开始 */
    GameMg.prototype.start = function () {
        var _this = this;
        Laya.timer.once(1000, this, function () {
            if (PlatformMg_1.default.Instance.isWx) {
                WxBannerAd_1.default.show();
            }
            if (PlatformMg_1.default.Instance.isQq) {
                QqBannerAd_1.default.show();
            }
            if (PlatformMg_1.default.Instance.isBd) {
                BdBannerAd_1.default.show();
            }
        });
        HttpMg_1.default.startGame();
        GameData_1.default.RetrunHomeNum = 0;
        if (PlatformMg_1.default.Instance.isWx) { // && LocalStorageUtil.getNumber(LocalStorageKey.GAMESTARTDATE,0)==GameData.DataTime
            ExprotDrawerMgr_1.default.Instance.show();
            EventCenter_1.default.Instance.on(ConfigData_1.EventKey.CLOSECT, function () {
                GameData_1.default.StartGame = true;
                EventCenter_1.default.Instance.removeListener(ConfigData_1.EventKey.CLOSECT, _this);
            }, this);
        }
        else {
            GameData_1.default.StartGame = true;
        }
        GameData_1.default.IsTcHome = false;
        EventCenter_1.default.Instance.emit(ConfigData_1.EventKey.GAMESTART);
        AldMg_1.default.onStart();
        if (PlatformMg_1.default.Instance.isTt) {
            recorderMgr_1.default.start();
        }
        LocalStorageUtil_1.default.setNumber(ConfigData_1.LocalStorageKey.GAMESTARTDATE, GameData_1.default.DataTime);
    };
    /**
     * 游戏结束
     * @param status true--过关，false--失败
     */
    GameMg.prototype.gameEnd = function (status) {
        if (PlatformMg_1.default.Instance.isTt) {
            recorderMgr_1.default.stop();
        }
        GameData_1.default.IsResu = 0;
        GameData_1.default.StartGame = false;
        HttpMg_1.default.endGame(GameData_1.default.NowLevel + '');
        //如果试用皮肤
        if (GameData_1.default.GetSkinSy) {
            GameData_1.default.GetSkin = 0;
            GameData_1.default.GetSkinSy = false;
        }
        if (status) {
            //过关
            AldMg_1.default.onEnd(true);
            SoundUtil_1.default.play('pass');
            this.storeUserInfo();
            GameData_1.default.PassNum++;
        }
        else {
            //失败
            AldMg_1.default.onEnd(false);
            SoundUtil_1.default.play('fail');
        }
    };
    /**通关储存数据 */
    GameMg.prototype.storeUserInfo = function () {
        //储存最高关卡
        var level = LocalStorageUtil_1.default.getNumber(ConfigData_1.LocalStorageKey.USERLEVEL);
        GameData_1.default.NowLevel += 1;
        if (level < GameData_1.default.NowLevel) {
            GameData_1.default.UserLevel = GameData_1.default.NowLevel;
            LocalStorageUtil_1.default.setNumber(ConfigData_1.LocalStorageKey.USERLEVEL, GameData_1.default.NowLevel);
            //储存开放域数据
            if (PlatformMg_1.default.Instance.isWx) {
                // let open = new Laya.WXOpenDataViewer();//platform.openDataContext.createDisplayObject();
                // open.postMsg({ command: "set_score", score:GameData.UserLevel});
            }
        }
    };
    return GameMg;
}());
exports.default = GameMg;
