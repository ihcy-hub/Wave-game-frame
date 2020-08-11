"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSceneSc_1 = __importDefault(require("../../../Activity/BaseSceneSc"));
var GameData_1 = __importDefault(require("../../GameMg/GameData"));
var LocalStorageUtil_1 = __importDefault(require("../../../Utils/LocalStorageUtil"));
var ConfigData_1 = require("../../../Data/ConfigData");
var SoundUtil_1 = __importDefault(require("../../../Utils/SoundUtil"));
var PublicMg_1 = __importDefault(require("../../GameMg/PublicMg"));
var PlatformMg_1 = __importDefault(require("../../../Platform/PlatformMg"));
var ActivityUrls_1 = __importDefault(require("../../../Data/ActivityUrls"));
var AniFramesMgr_1 = __importDefault(require("../../GameMg/AniFramesMgr"));
var ProwerMg_1 = __importDefault(require("../../GameMg/ProwerMg"));
var UmMg_1 = __importDefault(require("../../../Utils/UmMg"));
var LoadingScene = /** @class */ (function (_super) {
    __extends(LoadingScene, _super);
    //++++++++++++++++++++++++++++++++++++++++++++++++预制体++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    function LoadingScene() {
        var _this = _super.call(this) || this;
        _this.assets = [
        //图集资源
        // "res/atlas/comp.atlas",
        // "res/atlas/comp.png",
        //散图资源
        //关卡资源
        //3D场景
        //"res/LayaScene_main/Conventional/main.ls",
        //音频资源
        //"sound/click.mp3",
        ];
        _this.loadTaskNum = 0;
        return _this;
    }
    /**提示 */
    LoadingScene.prototype.onPrompt = function () {
        var _this = this;
        var txtArr = [
            '愉快的一天即将开始',
            '一个好玩的游戏正在加载中',
        ];
        this.prompt = this.owner.getChildByName('prompt');
        this.prompt.text = txtArr[Math.floor(Math.random() * txtArr.length)];
        Laya.timer.loop(1500, this, function () {
            _this.prompt.text = txtArr[Math.floor(Math.random() * txtArr.length)];
        });
    };
    /**初始数据 */
    LoadingScene.prototype.initData = function () {
        UmMg_1.default.trackEvent('e_1');
        this.loadTaskNum = 0;
        GameData_1.default.MaxLevel = GameData_1.default.LevelData.length;
        ProwerMg_1.default.initTL();
        GameData_1.default.DcSj2 = LocalStorageUtil_1.default.getBoolean(ConfigData_1.LocalStorageKey.DcSj2, false);
        GameData_1.default.DcSj3 = LocalStorageUtil_1.default.getBoolean(ConfigData_1.LocalStorageKey.DcSj3, false);
        GameData_1.default.Coin = LocalStorageUtil_1.default.getNumber(ConfigData_1.LocalStorageKey.COIN, 0);
        GameData_1.default.NowLevel = GameData_1.default.UserLevel = LocalStorageUtil_1.default.getNumber(ConfigData_1.LocalStorageKey.USERLEVEL, 1);
        GameData_1.default.GetSkin = LocalStorageUtil_1.default.getNumber(ConfigData_1.LocalStorageKey.GETSKIN, 0);
        if (LocalStorageUtil_1.default.getList(ConfigData_1.LocalStorageKey.SKINDATA))
            GameData_1.default.SkinData = LocalStorageUtil_1.default.getList(ConfigData_1.LocalStorageKey.SKINDATA);
        Laya.loader.load("bg.mp3", new Laya.Handler(this, function () {
            SoundUtil_1.default.play('bg');
            //[监听]回到游戏
            PublicMg_1.default.Instance.onShow();
        }));
    };
    LoadingScene.prototype.findView = function () {
        this.bar = this.owner.getChildByName('progress');
        this.onPrompt();
    };
    LoadingScene.prototype.initView = function () {
        this.onLoadSubpackage();
    };
    LoadingScene.prototype.screenAdaptation = function () {
    };
    //加载必要的动画
    LoadingScene.prototype.onloadAni = function () {
        AniFramesMgr_1.default.init().then(function () {
            UmMg_1.default.trackEvent('e_2');
            Laya.Scene.open(ActivityUrls_1.default.GAME_SCENE);
        });
    };
    /**判断分包加载数量 */
    LoadingScene.prototype.getLoadTaskNum = function () {
        this.loadTaskNum++;
        if (this.loadTaskNum == 3) {
            this.onZyLoad();
            console.log('分包资源加载完成' + this.loadTaskNum);
        }
    };
    /**分包龙骨一 */
    LoadingScene.prototype.loadSubpackage1 = function () {
        var _this = this;
        var loadTask = PlatformMg_1.default.Instance.platform.loadSubpackage({
            name: 'DragonBones',
            success: function (res) {
                //龙骨动画
                _this.getLoadTaskNum();
            },
            fail: function (res) {
                // 分包加载失败通过 fail 回调
            }
        });
        loadTask.onProgressUpdate(function (res) {
            _this.bar.value = res.progress;
        });
    };
    /**分包2music */
    LoadingScene.prototype.loadSubpackage2 = function () {
        var _this = this;
        var loadTask2 = PlatformMg_1.default.Instance.platform.loadSubpackage({
            name: 'sound',
            success: function (res) {
                //音乐
                _this.getLoadTaskNum();
            },
            fail: function (res) {
                // 分包加载失败通过 fail 回调
            }
        });
        loadTask2.onProgressUpdate(function (res) {
            _this.bar.value = res.progress;
        });
    };
    /**分包3 res */
    LoadingScene.prototype.loadSubpackage3 = function () {
        var _this = this;
        var loadTask3 = PlatformMg_1.default.Instance.platform.loadSubpackage({
            name: 'Resources',
            success: function (res) {
                //音乐
                _this.getLoadTaskNum();
            },
            fail: function (res) {
                // 分包加载失败通过 fail 回调
            }
        });
        loadTask3.onProgressUpdate(function (res) {
            _this.bar.value = res.progress;
        });
    };
    /**加载分包 */
    LoadingScene.prototype.onLoadSubpackage = function () {
        if (PlatformMg_1.default.Instance.isWx || PlatformMg_1.default.Instance.isQq || PlatformMg_1.default.Instance.isBd || PlatformMg_1.default.Instance.isVivo) {
            this.loadSubpackage1();
            this.loadSubpackage2();
            this.loadSubpackage3();
        }
        else {
            this.onZyLoad();
        }
    };
    //资源加载
    LoadingScene.prototype.onZyLoad = function () {
        var _this = this;
        Laya.loader.load(this.assets, new Laya.Handler(this, function () {
            if (PlatformMg_1.default.Instance.isWx) {
                _this.createDrawer();
            }
            _this.onloadAni();
        }), new Laya.Handler(this, function (progress) {
            //设置进度
            console.log("[进度设置]", progress);
            _this.bar.value = progress;
        }));
    };
    /**创建抽屉页导出 */
    LoadingScene.prototype.createDrawer = function () {
        var exprotBox;
        Laya.loader.create("Prefabs/exprotDrawerBox.json", Laya.Handler.create(this, onLoadPrefab));
        function onLoadPrefab(obj) {
            var prefab = new Laya.Prefab();
            //console.log('预制体',prefab,obj)
            prefab.json = obj;
            exprotBox = prefab.create();
            exprotBox.bottom = 0;
            exprotBox.left = 0;
            Laya.stage.addChild(exprotBox);
            exprotBox.zOrder = 9999;
        }
    };
    return LoadingScene;
}(BaseSceneSc_1.default));
exports.default = LoadingScene;
