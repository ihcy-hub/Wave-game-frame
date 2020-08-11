"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreFabsKey = exports.EventKey = exports.LocalStorageKey = void 0;
var ConfigData = /** @class */ (function () {
    function ConfigData() {
    }
    ConfigData.GAME_NAME = "游戏名字";
    ConfigData.VERSION = 112;//版本号
    //音效配置
    ConfigData.SOUND = {
        //bg: { url: 'bg.mp3', type: 'music' },//背景音乐
        //coin: { url: 'sound/get_coin.mp3', type: 'sound' }//获得金币
    };
    //banner误点延迟时间
    ConfigData.bannerTime = 1000;
    //盒子广告延迟时间
    ConfigData.BoxTime = 2250;
    //后台获取的id
    ConfigData.GameId = "";
    //场景值
    ConfigData.Scene = "0";
    //登录返回code
    ConfigData.Code = "";
    //OpenId  C497A80EB7BEAA6B70E9E67D8DE58974
    ConfigData.OpenId = "";
    //是否能领取红包
    ConfigData.IsShowRedPackge = false;
    /**是否开启误点*/
    ConfigData.IsMisLead = false;
    //是否开启版本控制
    ConfigData.IsStatus = false;
    ConfigData.YDShowing = false;
    ConfigData.BulletinList = [];
    ConfigData.StartDialogShowAdTime = 1000;
    ConfigData.fenhongData = null;
    return ConfigData;
}());
exports.default = ConfigData;
var LocalStorageKey = /** @class */ (function () {
    function LocalStorageKey() {
    }
    //day of month
    LocalStorageKey.DATE = "date";
    //month of year
    LocalStorageKey.MONTH = "month";
    /**是否登录过（不是新用户） */
    LocalStorageKey.ISNEWUSER = "IsNewUser";
    /**是否已经弹过签到 */
    LocalStorageKey.ISCHECK = 'IsCheck';
    /**签到日期 */
    LocalStorageKey.CHECKINDATE = "checkDate";
    /**签到天数 */
    LocalStorageKey.CHECKIN = "checkIn";
    /**新手用户 */
    LocalStorageKey.NEWUSER = 'NewUser';
    /**用户完成的最高关卡 */
    LocalStorageKey.USERLEVEL = 'UserLevel';
    /**关卡皮肤信息 */
    LocalStorageKey.SKINDATA = 'SkinData';
    /**选择的皮肤 */
    LocalStorageKey.GETSKIN = 'GetSkin';
    /**金币 */
    LocalStorageKey.COIN = 'Coin';
    /**体力 */
    LocalStorageKey.TL = 'LocalTL';
    /**体力获取记时 */
    LocalStorageKey.TLTIME = 'TLTIME';
    /**储存首页看视频的日期 */
    LocalStorageKey.HOMEVIDEODATE = 'HomeVideoDate';
    /**储存开始弹窗日期 */
    LocalStorageKey.GAMESTARTDATE = 'GameStartDate';
    /**导出2 */
    LocalStorageKey.DcSj2 = 'DcSj2';
    /**导出3 */
    LocalStorageKey.DcSj3 = 'DcSj3';
    return LocalStorageKey;
}());
exports.LocalStorageKey = LocalStorageKey;
var EventKey = /** @class */ (function () {
    function EventKey() {
    }
    /**胶囊按钮设置完成 */
    EventKey.JNINFO = 'JnInfo';
    /**游戏加载完成*/
    EventKey.GAMELOADEND = 'GameLoadEnd';
    /**游戏开始*/
    EventKey.GAMESTART = 'GameStart';
    /**继续游戏*/
    //public static readonly GAMERESUME = 'GameResume';
    /**游戏结束*/
    EventKey.GAMEEND = 'GameEnd';
    /**监听选择过关方法 */
    EventKey.SELECT = 'Select';
    /**监听选择过关方法 */
    EventKey.SELECTCALLBACK = 'SelectCallback';
    /**关卡创建完成*/
    EventKey.LEVELEND = 'LevelEnd';
    /**体力 */
    EventKey.TL = 'Tl';
    /**导出加载完成 */
    EventKey.DCLOADEND = 'DCLoadEnd';
    /**导出抽屉关闭 */
    EventKey.CLOSECT = 'CloseCT';
    return EventKey;
}());
exports.EventKey = EventKey;
var PreFabsKey = /** @class */ (function () {
    function PreFabsKey() {
    }
    /**主角 */
    PreFabsKey.ROLE = 'Role';
    return PreFabsKey;
}());
exports.PreFabsKey = PreFabsKey;
