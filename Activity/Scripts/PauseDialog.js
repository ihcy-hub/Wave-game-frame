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
var BaseDialogSc_1 = __importDefault(require("../BaseDialogSc"));
var GameData_1 = __importDefault(require("../../Game/GameMg/GameData"));
var PlatformMg_1 = __importDefault(require("../../Platform/PlatformMg"));
var WindowUtil_1 = __importDefault(require("../../Utils/WindowUtil"));
var SoundUtil_1 = __importDefault(require("../../Utils/SoundUtil"));
var ActivityUrls_1 = __importDefault(require("../../Data/ActivityUrls"));
var GameMg_1 = __importDefault(require("../../Game/GameMg/GameMg"));
var PauseDialog = /** @class */ (function (_super) {
    __extends(PauseDialog, _super);
    function PauseDialog() {
        return _super.call(this) || this;
    }
    PauseDialog.prototype.initData = function () {
        this.showBottomBanner();
    };
    PauseDialog.prototype.findView = function () {
        this.dcBox = this.owner.getChildByName('DcBox');
        this.btnHome = this.owner.getChildByName('btn_home');
        this.btnJx = this.owner.getChildByName('btn_jx');
    };
    PauseDialog.prototype.initView = function () {
        if (PlatformMg_1.default.Instance.isWx) {
            this.dcBox.visible = true;
        }
        else {
            this.dcBox.visible = false;
        }
    };
    PauseDialog.prototype.screenAdaptation = function () {
        if (WindowUtil_1.default.isIphoneX) {
            this.dcBox.bottom = 610;
            this.btnHome.bottom = 339;
            this.btnJx.bottom = 408;
        }
    };
    PauseDialog.prototype.onUpdate = function () {
    };
    PauseDialog.prototype.onClick = function (e) {
        e.stopPropagation();
        if (e.target.name.substring(0, 3) === 'btn') {
            SoundUtil_1.default.play('click');
        }
        switch (e.target.name) {
            case 'btn_jx':
                GameMg_1.default.Instance.gameRestart();
                break;
            case 'btn_home':
                GameData_1.default.IsTcHome = true;
                this.owner.close();
                Laya.View.open(ActivityUrls_1.default.GAME_SCENE);
                break;
            default:
                break;
        }
    };
    return PauseDialog;
}(BaseDialogSc_1.default));
exports.default = PauseDialog;
