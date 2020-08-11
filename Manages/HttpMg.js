"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
var PlatformMg_1 = __importDefault(require("../Platform/PlatformMg"));
var ConfigData_1 = __importStar(require("../Data/ConfigData"));
var HttpUtil_1 = __importDefault(require("../Utils/HttpUtil"));
var LeadOutMg_1 = __importDefault(require("./LeadOutMg"));
var UmMg_1 = __importDefault(require("../Utils/UmMg"));
var GameData_1 = __importDefault(require("../Game/GameMg/GameData"));
var EventCenter_1 = __importDefault(require("../EventSystem/EventCenter"));
/**
 * 网络请求管理类
 */
var HttpMg = /** @class */ (function () {
    function HttpMg() {
        //是否加载了ald代码
        this.isRequiered = true;
    }
    /**
     * 登录请求
     */
    HttpMg.login = function () {
        var _this = this;
        if (PlatformMg_1.default.Instance.platform) {
            this.getTimes += 1;
            PlatformMg_1.default.Instance.platform.login({
                force: false,
                success: function (res) {
                    console.log("login success: res=", res);
                    if (res.code) {
                        ConfigData_1.default.Code = res.code;
                        var obj = PlatformMg_1.default.Instance.platform.getLaunchOptionsSync();
                        var appId = "0";
                        var scene = obj.scene;
                        if (obj.scene == '1037' || obj.scene == '1038') {
                            GameData_1.default.isScene = true;
                        }
                        if (obj.query == undefined || obj.query == null) {
                            scene = "0";
                        }
                        else {
                            if (obj.query.scene == undefined || obj.query.scene == null) {
                                scene = "0";
                            }
                            else {
                                scene = obj.query.scene;
                            }
                        }
                        ConfigData_1.default.Scene = decodeURIComponent(scene);
                        _this.getTimes = 0;
                        var loginPath = Api.loginUrl
                            + "&version=" + ConfigData_1.default.VERSION
                            + "&code=" + res.code
                            + "&scene=" + ConfigData_1.default.Scene
                            + "&uid=" + appId;
                        _this.loginToService(loginPath);
                    }
                    else if (res.data) {
                        var token = res.token;
                        var obj = PlatformMg_1.default.Instance.platform.getLaunchOptionsSync();
                        if (obj.scene == '1037' || obj.scene == '1038') {
                            GameData_1.default.isScene = true;
                        }
                        var sence = "0";
                        if (obj.query == undefined || obj.query == null) {
                            sence = "0";
                        }
                        else {
                            sence = JSON.stringify(obj.query);
                        }
                        _this.loginOppoToService(token, sence);
                    }
                },
                fail: function (err) {
                    if (_this.getTimes < _this.MAX_GET_TIMES) {
                        _this.login();
                    }
                    else {
                        console.log("login fail");
                    }
                }
            });
        }
        else {
            console.log("请在微信开发工具上调试");
        }
    };
    /**
     * 登录自己后台
     */
    HttpMg.loginToService = function (loginPath) {
        var _this = this;
        console.log("loginPath=", loginPath);
        HttpUtil_1.default.request({
            url: loginPath,
            method: "get",
            complete: function (res) {
                console.log("loginToService success:", res);
                PlatformMg_1.default.Instance.setOpenID(res.data.openid, 0, 0);
                ConfigData_1.default.OpenId = res.data.openid;
                _this.getGameList();
                _this.getMisleadInfo();
            },
            error: function (err) {
                console.error("loginToService fail:", err);
            }
        });
    };
    /**
     * oppo 平台登录
     * @param token
     * @param scene
     */
    HttpMg.loginOppoToService = function (token, scene) {
        var path = "http://oppo.xyxapi.com/home/lxdd/index.php?act=userinfo&token=" + token + "&scene=" + scene;
        console.log("path:", path);
        HttpUtil_1.default.request({
            url: path,
            method: "get",
            complete: function (res) {
                console.log("loginOppoToService success:", res);
            },
            error: function (err) {
                UmMg_1.default.trackEvent('e_44');
                console.log("loginOppoToService fail:", err);
            }
        });
    };
    /**
     * 加载导出列表
     */
    HttpMg.getGameList = function () {
        if (ConfigData_1.default.OpenId) {
            var path = Api.gameListUrl + "&openid=" + ConfigData_1.default.OpenId + "&version=" + ConfigData_1.default.VERSION;
            HttpUtil_1.default.request({
                url: path,
                method: "get",
                complete: function (res) {
                    console.log("getLeadOut success:", res);
                    if (res.result_code == 1) {
                        LeadOutMg_1.default.GameList = res.data.gamelist;
                        LeadOutMg_1.default.BannerList = res.data.banner;
                        console.log("导出列表加载成功:");
                        console.log("GameList", LeadOutMg_1.default.GameList);
                        console.log("GameBannerList", LeadOutMg_1.default.BannerList);
                        GameData_1.default.DcLoad = true;
                        EventCenter_1.default.Instance.emit(ConfigData_1.EventKey.DCLOADEND);
                    }
                },
                error: function (err) {
                    UmMg_1.default.trackEvent('e_44');
                    console.log("导出列表加载失败:", err);
                }
            });
        }
    };
    /**
     * 游戏开始上传
     */
    HttpMg.startGame = function () {
        if (ConfigData_1.default.OpenId) {
            var path = Api.startGameUrl + "&openid=" + ConfigData_1.default.OpenId + "&version=" + ConfigData_1.default.VERSION;
            HttpUtil_1.default.request({
                url: path,
                method: "get",
                complete: function (res) {
                    console.info("startGame success:", res);
                    ConfigData_1.default.GameId = res.data.id;
                },
                error: function (err) {
                    UmMg_1.default.trackEvent('e_44');
                    console.info("startGame fail:", err);
                }
            });
        }
    };
    HttpMg.endGame = function (level) {
        if (ConfigData_1.default.OpenId) {
            // if (!this.isRequiered) {
            //     // require("../ald/ald-game.js")
            //     this.isRequiered = true;
            // }
            var path = Api.endGameUrl + "&openid=" + ConfigData_1.default.OpenId + "&version=" + ConfigData_1.default.VERSION + "&id=" + ConfigData_1.default.GameId + "&level=" + level;
            HttpUtil_1.default.request({
                url: path,
                method: "get",
                complete: function (res) {
                    console.info("endGame success:", res);
                },
                error: function (err) {
                    UmMg_1.default.trackEvent('e_44');
                    console.info("endGame fail:", err);
                }
            });
        }
    };
    /**
     * 上传被点击的导出id
     * @param id 导出id
     */
    HttpMg.leadOut = function (id) {
        if (ConfigData_1.default.OpenId) {
            var path = Api.leadOutUrl + "&openid=" + ConfigData_1.default.OpenId + "&version=" + ConfigData_1.default.VERSION + "&id=" + id;
            HttpUtil_1.default.request({
                url: path,
                method: "get",
                complete: function (res) {
                    console.info("leadOut success:", res);
                },
                error: function (err) {
                    UmMg_1.default.trackEvent('e_44');
                    console.info("leadOut fail:", err);
                }
            });
        }
    };
    /**
     * 上传导出成功的id
     * @param id 导出id
     */
    HttpMg.leadOutSuccess = function (id) {
        if (ConfigData_1.default.OpenId) {
            var path = Api.leadOutSuccessUrl + "&openid=" + ConfigData_1.default.OpenId + "&version=" + ConfigData_1.default.VERSION + "&id=" + id;
            HttpUtil_1.default.request({
                url: path,
                method: "get",
                complete: function (res) {
                    console.info("leadOutSuccess success:", res);
                },
                error: function (err) {
                    UmMg_1.default.trackEvent('e_44');
                    console.info("leadOutSuccess fail:", err);
                }
            });
        }
    };
    /**
     * 是否误点
     */
    HttpMg.getMisleadInfo = function () {
        if (ConfigData_1.default.OpenId) {
            var path = Api.misleadUrl + "&openid=" + ConfigData_1.default.OpenId + "&version=" + ConfigData_1.default.VERSION + "&scene=" + ConfigData_1.default.Scene;
            HttpUtil_1.default.request({
                url: path,
                method: "get",
                complete: function (res) {
                    ConfigData_1.default.IsStatus = (res.data.is_status == "1");
                    if (ConfigData_1.default.IsStatus) {
                        ConfigData_1.default.IsMisLead = res.data.casualClick == "1";
                    }
                    else {
                        ConfigData_1.default.IsMisLead = false;
                    }
                    console.log("IsMisLead:", ConfigData_1.default.IsMisLead);
                    console.log("IsStatus:", ConfigData_1.default.IsStatus);
                },
                error: function (err) {
                    UmMg_1.default.trackEvent('e_44');
                    console.info("isMislead fail:", err);
                }
            });
        }
    };
    /**
   * 公告栏列表
   */
    HttpMg.getBulletinList = function () {
        if (ConfigData_1.default.OpenId) {
            var path = Api.bulletinList + ConfigData_1.default.OpenId;
            HttpUtil_1.default.request({
                url: path,
                method: "get",
                complete: function (res) {
                    console.log("getBulletinList=", res.data.list);
                    ConfigData_1.default.BulletinList = res.data.list;
                },
                error: function (err) {
                }
            });
        }
    };
    HttpMg.uploadLevel = function (level) {
        if (ConfigData_1.default.OpenId) {
            var path = Api.uploadLevelUrl + "&openid=" + ConfigData_1.default.OpenId + "&level=" + level;
            HttpUtil_1.default.request({
                url: path,
                method: "get",
                complete: function (res) {
                    console.log("uploadLevel success");
                },
                error: function (err) {
                    console.log("uploadLevel fail");
                }
            });
        }
    };
    HttpMg.MAX_GET_TIMES = 3;
    //请求次数
    HttpMg.getTimes = 0;
    return HttpMg;
}());
exports.default = HttpMg;
var Api = /** @class */ (function () {
    function Api() {
    }
    Api.getRootUrl = function () {
        var url = 'https://qdxyx.xyxapi.com/home/?webid=61';
        switch (PlatformMg_1.default.Instance.platformName) {
            case PlatformMg_1.default.Instance.Wx:
                url = 'https://qdxyx.xyxapi.com/home/?webid=61';
                break;
            case PlatformMg_1.default.Instance.Qq:
                url = 'https://qq.xyxapi.com/sapi/mnqsj/';
                break;
            case PlatformMg_1.default.Instance.Tt:
                url = 'https://qdxyx.xyxapi.com/home/?webid=61';
                break;
            default:
                break;
        }
        return url;
    };
    Api.user = Api.getRootUrl() + "&act=user"; //openid
    Api.loginUrl = Api.getRootUrl() + "&act=userinfo";
    Api.misleadUrl = Api.getRootUrl() + "&act=user";
    Api.gameListUrl = Api.getRootUrl() + "&act=gamelist";
    Api.startGameUrl = Api.getRootUrl() + "&act=index";
    Api.endGameUrl = Api.getRootUrl() + "&act=end";
    Api.leadOutUrl = Api.getRootUrl() + "&act=game";
    Api.leadOutSuccessUrl = Api.getRootUrl() + "&act=cgame";
    Api.leadBox = Api.getRootUrl() + "&act=hzlist";
    Api.uploadLevelUrl = Api.getRootUrl() + "&act=level";
    Api.bulletinList = Api.getRootUrl() + "&act=nickname&openid=";
    Api.fenghong = Api.getRootUrl() + "&act=fenhong&openid=";
    Api.domain = Api.getRootUrl() + "&act=";
    return Api;
}());
exports.Api = Api;
