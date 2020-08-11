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
var PlatformMg_1 = __importDefault(require("../Platform/PlatformMg"));
var GameData_1 = __importDefault(require("../Game/GameMg/GameData"));
var EventCenter_1 = __importDefault(require("../EventSystem/EventCenter"));
var ConfigData_1 = __importStar(require("../Data/ConfigData"));
var SoundUtil_1 = __importDefault(require("../Utils/SoundUtil"));
var ActivityUrls_1 = __importDefault(require("../Data/ActivityUrls"));
var UmMg_1 = __importDefault(require("../Utils/UmMg"));
var WxBannerAd_1 = __importDefault(require("../Platform/Wx/WxBannerAd"));
var WindowUtil_1 = __importDefault(require("../Utils/WindowUtil"));
var qqBox_1 = __importDefault(require("../Platform/Qq/qqBox"));
var AdMg_1 = __importDefault(require("../Platform/AdMg"));
/**体力图标 */
var retrunHomeMg = /** @class */ (function (_super) {
    __extends(retrunHomeMg, _super);
    function retrunHomeMg() {
        return _super.call(this) || this;
    }
    retrunHomeMg.prototype.onEnable = function () {
        this.setInfo();
        EventCenter_1.default.Instance.on(ConfigData_1.EventKey.JNINFO, this.setInfo, this);
    };
    retrunHomeMg.prototype.setInfo = function () {
        this.owner.top = parseInt(PlatformMg_1.default.Instance.JLBtnInfo.top) + (parseInt(PlatformMg_1.default.Instance.JLBtnInfo.height) - 57) / 2;
        if (WindowUtil_1.default.isIphoneX && !Laya.Browser.onIOS) {
            this.owner.top += 57;
        }
        EventCenter_1.default.Instance.removeListener(ConfigData_1.EventKey.JNINFO, this);
    };
    retrunHomeMg.prototype.onClick = function () {
        GameData_1.default.IsShowBox = true;
        WxBannerAd_1.default.hide();
        GameData_1.default.LevelJD = 0;
        SoundUtil_1.default.play('click');
        if (PlatformMg_1.default.Instance.isWx) {
            if (GameData_1.default.RetrunHomeNum === 3 && ConfigData_1.default.IsMisLead) {
                UmMg_1.default.trackEvent('e_28');
                if (PlatformMg_1.default.Instance.isWx) {
                    Laya.Dialog.open(ActivityUrls_1.default.BX_DIALOG, true, function () {
                        Laya.Dialog.open(ActivityUrls_1.default.EXPROTBOX_DIALOG, true, function () {
                            Laya.Dialog.closeAll();
                            GameData_1.default.IsTcHome = true;
                            Laya.View.open(ActivityUrls_1.default.GAME_SCENE);
                        });
                    });
                }
                else {
                    Laya.Dialog.open(ActivityUrls_1.default.BX_DIALOG, true, function () {
                        Laya.Dialog.closeAll();
                        GameData_1.default.IsTcHome = true;
                        Laya.View.open(ActivityUrls_1.default.GAME_SCENE);
                    });
                }
            }
            else {
                Laya.Dialog.open(ActivityUrls_1.default.EXPROTBOX3_DIALOG, true, function () {
                    Laya.Dialog.closeAll();
                    GameData_1.default.IsTcHome = true;
                    Laya.View.open(ActivityUrls_1.default.GAME_SCENE);
                    switch (GameData_1.default.RetrunHomeNum) {
                        case 0:
                            UmMg_1.default.trackEvent('e_7');
                            break;
                        case 1:
                            UmMg_1.default.trackEvent('e_14');
                            break;
                        case 2:
                            UmMg_1.default.trackEvent('e_18');
                            break;
                        case 3:
                            UmMg_1.default.trackEvent('e_28');
                            break;
                        default:
                            break;
                    }
                });
            }
        }
        else {
            if (PlatformMg_1.default.Instance.isQq && ConfigData_1.default.IsMisLead) {
                qqBox_1.default.show({
                    onClose: function () {
                        AdMg_1.default.Instance.showVideo({
                            success: function () {
                                Laya.Dialog.closeAll();
                                GameData_1.default.IsTcHome = true;
                                Laya.View.open(ActivityUrls_1.default.GAME_SCENE);
                            },
                            fail: function () {
                                Laya.Dialog.closeAll();
                                GameData_1.default.IsTcHome = true;
                                Laya.View.open(ActivityUrls_1.default.GAME_SCENE);
                            }
                        });
                    }
                });
            }
            else {
                Laya.Dialog.closeAll();
                GameData_1.default.IsTcHome = true;
                Laya.View.open(ActivityUrls_1.default.GAME_SCENE);
            }
        }
    };
    return retrunHomeMg;
}(Laya.Script));
exports.default = retrunHomeMg;
