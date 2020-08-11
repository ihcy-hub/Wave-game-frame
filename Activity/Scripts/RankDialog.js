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
var AdMg_1 = __importDefault(require("../../Platform/AdMg"));
var TipsUtil_1 = __importDefault(require("../../Utils/TipsUtil"));
var GameData_1 = __importDefault(require("../../Game/GameMg/GameData"));
var ActivityUrls_1 = __importDefault(require("../../Data/ActivityUrls"));
var RankDialog = /** @class */ (function (_super) {
    __extends(RankDialog, _super);
    function RankDialog() {
        return _super.call(this) || this;
    }
    RankDialog.prototype.initData = function () {
    };
    RankDialog.prototype.findView = function () {
        this.contentSpr = this.owner.getChildByName("contentSpr");
        this.btnClose = this.contentSpr.getChildByName("btnClose");
        this.btnDc = this.contentSpr.getChildByName("btnDc");
        this.btnShar = this.contentSpr.getChildByName("btnShar");
        this.rankPanel = this.contentSpr.getChildByName("rankPanel");
    };
    RankDialog.prototype.initView = function () {
        this.rankPanel.vScrollBar.hide = true; //隐藏列表的滚动条
        this.rankPanel.vScrollBar.elasticBackTime = 200; //设置橡皮筋回弹时间单位为毫秒
        this.rankPanel.vScrollBar.elasticDistance = 120; //设置橡皮筋极限距离
        this.showRankList();
    };
    RankDialog.prototype.screenAdaptation = function () {
    };
    RankDialog.prototype.onClick = function (e) {
        e.stopPropagation();
        switch (e.target.name) {
            case 'btnDc':
                this.owner.close();
                Laya.Dialog.open(ActivityUrls_1.default.EXPROT_DIALOG);
                break;
            case 'btnClose':
                this.owner.close();
                Laya.Dialog.open(ActivityUrls_1.default.Home_DIALOG);
                break;
            case 'btnShar':
                AdMg_1.default.Instance.share({
                    success: function () {
                        TipsUtil_1.default.msg("获得200刀！");
                        //console.log('分享成功！');
                        GameData_1.default.getCoin(200);
                    },
                    fail: function () {
                        //console.log('分享失败！')
                    }
                });
                break;
            default:
                break;
        }
    };
    RankDialog.prototype.closeAction = function () {
        //this.owner.close();
        //Laya.Dialog.open(ConfigData.StartGameDialog);
    };
    RankDialog.prototype.showRankList = function () {
        if (Laya.Browser.onWeiXin) {
            //let wxOpen:Laya.WXOpenDataViewer = this.rankPanel.getChildByName('wxOpen') as Laya.WXOpenDataViewer;
            var open_1 = this.rankPanel.addChild(new Laya.WXOpenDataViewer()); //platform.openDataContext.createDisplayObject());
            open_1.width = 110 * 12;
            open_1.height = 110 * 12;
            //console.log('open1',open);
            open_1.postMsg({
                command: "rank_list",
                data: { width: this.rankPanel.width, height: 110 * 12 }
            });
        }
    };
    RankDialog.prototype.showOwner = function () {
        if (Laya.Browser.onWeiXin) {
            var open_2 = this.ownerItem.addChild(new Laya.WXOpenDataViewer());
            console.log(open_2);
            open_2.width = this.ownerItem.width;
            open_2.height = this.ownerItem.height * 2;
            open_2.postMsg({
                command: "rank_owner",
                data: { width: this.rankPanel.width, height: this.ownerItem.height * 2 }
            });
        }
    };
    return RankDialog;
}(BaseDialogSc_1.default));
exports.default = RankDialog;
