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
var PlatformMg_1 = __importDefault(require("../Platform/PlatformMg"));
var ActivityUrls_1 = __importDefault(require("../Data/ActivityUrls"));
var ConfigData_1 = __importDefault(require("../Data/ConfigData"));
var GameData_1 = __importDefault(require("../Game/GameMg/GameData"));
var BaseDialogRt = /** @class */ (function (_super) {
    __extends(BaseDialogRt, _super);
    function BaseDialogRt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseDialogRt.prototype.openedCallBack = function (callBack) {
        this.opened_call_back = callBack;
    };
    BaseDialogRt.prototype.onOpened = function (param) {
        console.log("BaseDialogRt----------------onOpened param=", param);
        this.opened_call_back && this.opened_call_back(param);
    };
    BaseDialogRt.prototype.onAwake = function () {
        // this.pos(0, 0);
        // this.width = Laya.stage.width
        // this.height = Laya.stage.height
        if (PlatformMg_1.default.Instance.isWx && ConfigData_1.default.IsMisLead && GameData_1.default.isScene && this.name != 'ExprotListDialog') {
            this.retrunBtn();
        }
    };
    BaseDialogRt.prototype.retrunBtn = function () {
        var spBtn = new Laya.Image('public/btn_jlal.png');
        this.addChild(spBtn);
        spBtn.zOrder = 9999;
        spBtn.top = PlatformMg_1.default.Instance.JLBtnInfo.top + PlatformMg_1.default.Instance.JLBtnInfo.height + 1;
        spBtn.right = 20;
        spBtn.on(Laya.Event.CLICK, this, function () {
            Laya.Dialog.open(ActivityUrls_1.default.EXPROTLIST_DIALOG, false);
        });
    };
    return BaseDialogRt;
}(Laya.Dialog));
exports.default = BaseDialogRt;
