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
var WindowUtil_1 = __importDefault(require("../Utils/WindowUtil"));
var PlatformMg_1 = __importDefault(require("../Platform/PlatformMg"));
var ConfigData_1 = __importDefault(require("../Data/ConfigData"));
var ActivityUrls_1 = __importDefault(require("../Data/ActivityUrls"));
var GameData_1 = __importDefault(require("../Game/GameMg/GameData"));
var BaseSceneRt = /** @class */ (function (_super) {
    __extends(BaseSceneRt, _super);
    function BaseSceneRt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseSceneRt.prototype.openedCallBack = function (callBack) {
        this.opened_call_back = callBack;
    };
    BaseSceneRt.prototype.onOpened = function (param) {
        console.log("BaseSceneRt----------------onOpened param=", param);
        this.opened_call_back && this.opened_call_back(param);
    };
    BaseSceneRt.prototype.onAwake = function () {
        this.height = WindowUtil_1.default.gameHeight;
        this.pos(0, 0);
        if (PlatformMg_1.default.Instance.isWx && ConfigData_1.default.IsMisLead && GameData_1.default.isScene && this.name != 'LoadingScene') {
            this.retrunBtn();
        }
    };
    BaseSceneRt.prototype.retrunBtn = function () {
        var spBtn = new Laya.Image('public/btn_jlal.png');
        this.addChild(spBtn);
        spBtn.zOrder = 9999;
        spBtn.top = PlatformMg_1.default.Instance.JLBtnInfo.top + PlatformMg_1.default.Instance.JLBtnInfo.height + 1;
        spBtn.right = 20;
        spBtn.on(Laya.Event.CLICK, this, function () {
            Laya.Dialog.open(ActivityUrls_1.default.EXPROTLIST_DIALOG, false);
        });
    };
    return BaseSceneRt;
}(Laya.Scene));
exports.default = BaseSceneRt;
