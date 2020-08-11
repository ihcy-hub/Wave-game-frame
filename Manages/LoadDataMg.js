"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PlatformMg_1 = __importDefault(require("../Platform/PlatformMg"));
var HttpMg_1 = __importDefault(require("./HttpMg"));
var AdMg_1 = __importDefault(require("../Platform/AdMg"));
var WindowUtil_1 = __importDefault(require("../Utils/WindowUtil"));
var SoundUtil_1 = __importDefault(require("../Utils/SoundUtil"));
var ConfigData_1 = __importDefault(require("../Data/ConfigData"));
var AldMg_1 = __importDefault(require("./AldMg"));
var LoadDataMg = /** @class */ (function () {
    function LoadDataMg() {
    }
    //初始化数据
    LoadDataMg.init = function () {
        return new Promise(function (resolve) {
            // 清除本地数据缓存
            // Laya.LocalStorage.clear();
            //弹出框背景透明度
            UIConfig.popupBgAlpha = 0.8;
            //模式窗口点击边缘，是否关闭窗口
            UIConfig.closeDialogOnSide = false;
            //平台初始化
            PlatformMg_1.default.Instance.init();
            console.log("平台初始化-完成");
            //初始化音效
            SoundUtil_1.default.init(ConfigData_1.default.SOUND);
            console.log("音效初始化-完成");
            WindowUtil_1.default.init();
            Laya.MouseManager.multiTouchEnabled = false;
            //广告初始化
            AdMg_1.default.Instance.init();
            console.log("广告初始化-完成");
            //登录操作
            HttpMg_1.default.login();
            console.log("登录操作");
            //阿拉丁
            if (PlatformMg_1.default.Instance.platformName === PlatformMg_1.default.Instance.Wx || PlatformMg_1.default.Instance.platformName === PlatformMg_1.default.Instance.Qq) {
                AldMg_1.default.postAld = true;
            }
        });
    };
    LoadDataMg.initData = function () {
        //任务初始化
        //抽奖模块
        //CjMg.Instance.init();
    };
    LoadDataMg.loadSubpackages = function () {
        var packagePath = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            packagePath[_i] = arguments[_i];
        }
        return new Promise(function (resolve, fail) {
            console.log("分包加载开始");
            if (packagePath && packagePath.length > 0 && (PlatformMg_1.default.Instance.onWx || PlatformMg_1.default.Instance.onQq)) {
                var loadPro_1 = 0;
                for (var i = 0; i < packagePath.length; i++) {
                    PlatformMg_1.default.Instance.platform.loadSubpackage({
                        name: packagePath[i],
                        success: function () {
                            loadPro_1++;
                            if (loadPro_1 == packagePath.length) {
                                console.log("分包加载成功");
                                resolve();
                            }
                        },
                        fail: function () {
                            console.log("分包加载失败");
                            fail();
                        }
                    });
                }
            }
            else {
                console.log("不需要加载分包");
                resolve();
            }
        });
    };
    return LoadDataMg;
}());
exports.default = LoadDataMg;
