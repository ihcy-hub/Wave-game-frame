"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var LocalStorageUtil_1 = __importDefault(require("../../Utils/LocalStorageUtil"));
var ConfigData_1 = require("../../Data/ConfigData");
var GameData = /** @class */ (function () {
    function GameData() {
    }
    //人物数据
    // public static RoleSpeed:number = 6;//人物速度
    // public static speedRun:number = 2;//加速速度
    /**++++++++++++++++++++++++++++++++敌人++++++++++++++++++++++++++++++++++++++ */
    /**初始化数据 */
    GameData.init = function () {
    };
    /**获得金币 */
    GameData.getCoin = function (val) {
        this.Coin += val;
        LocalStorageUtil_1.default.setNumber(ConfigData_1.LocalStorageKey.COIN, this.Coin);
        //Sound.play('coin');
    };
    /**消费金币 */
    GameData.cutCoin = function (val) {
        this.Coin -= val;
        LocalStorageUtil_1.default.setNumber(ConfigData_1.LocalStorageKey.COIN, this.Coin);
    };
    /**********************公共信息**************************** */
    GameData.NowLevel = 1; //当前关卡
    GameData.UserLevel = 1; //用户最高关卡
    GameData.MaxLevel = 10; //最高关卡
    GameData.Coin = 0;
    GameData.IsIP6 = false;
    GameData.IsTtIOS = false; //头条ios
    GameData.GetSkin = 0; //选择的皮肤
    GameData.GetSkinSy = false; //是否试用
    GameData.IsTcHome = true; //是否弹首页
    GameData.StartGame = false; //是否开始游戏
    GameData.RetrunHomeNum = 0; //返回首页 0_游戏页面 1_下一关 2——失败  3-体力不足
    GameData.Dctj = 0; //导出统计 0_通关，1_下一关,2_失败 
    GameData.PassNum = 0; //通关次数
    GameData.IsShowBox = false; //是否弹首页盒子广告
    GameData.DCHandNumMax = 1;
    GameData.DCHandNum = 0;
    GameData.IsDcBox = true; //是否是盒子导出页面
    GameData.DcLoad = false; //导出是否加载完成
    GameData.DataTime = 0; //当前日期
    GameData.HomeTL = true; //是否开启首页套路
    GameData.DcSj2 = false; //有随机
    GameData.DcSj3 = false; //有随机
    GameData.isScene = false; //是否1037 或者 1038 场景值进入
    //签到数据
    GameData.CheckDate = [
        { type: 'power', val: 2 },
        { type: 'coin', val: 400 },
        { type: 'power', val: 4 },
        { type: 'coin', val: 800 },
        { type: 'power', val: 6 },
        { type: 'coin', val: 1000 },
        { type: 'power', val: 8 },
    ];
    GameData.DcBoxzt = 0; //0--随机导出一个,1--通关，2---死亡
    GameData.IsResu = 0; //复活次数
    //当前关卡完成进度
    GameData.LevelJD = 0;
    //皮肤数据 img--皮肤页预览图,model--枪的模型， power-子弹威力  fireSpeed——射速 clip--弹夹容量  clipTime--换弹夹时间  price 金币购买  video 视频购买
    GameData.SkinData = [
    //{id:0,name:'pistol',showName:'小手枪',img:'shop/gun1.png',imgBig:'shop/big/gun1.png',power:1,fireSpeed:2,clip:6,clipTime:500,have:true,version:1},
    ];
    //关卡数据 
    GameData.LevelData = [
        {},
    ];
    return GameData;
}());
exports.default = GameData;
