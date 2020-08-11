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
var LeadOutMg_1 = __importDefault(require("../../Manages/LeadOutMg"));
var PlatformMg_1 = __importDefault(require("../../Platform/PlatformMg"));
var SoundUtil_1 = __importDefault(require("../../Utils/SoundUtil"));
var GameData_1 = __importDefault(require("../../Game/GameMg/GameData"));
var UmMg_1 = __importDefault(require("../../Utils/UmMg"));
var WindowUtil_1 = __importDefault(require("../../Utils/WindowUtil"));
/**导出列表**/
var ExprotListDialog = /** @class */ (function (_super) {
    __extends(ExprotListDialog, _super);
    function ExprotListDialog() {
        var _this = _super.call(this) || this;
        _this.dataList = [];
        //设置点亮星星的id
        _this.bzdata = [];
        return _this;
    }
    ;
    ExprotListDialog.prototype.initData = function () {
        UmMg_1.default.trackEvent('e_50');
        GameData_1.default.IsDcBox = false;
        if (LeadOutMg_1.default.GameList) {
            for (var i = 0; i < LeadOutMg_1.default.GameList.length; i++) {
                this.dataList.push(LeadOutMg_1.default.GameList[i]);
            }
        }
        else {
            this.dataList = [];
        }
        for (var i = 0; i < this.dataList.length; i++) {
            if (Math.random() < 0.2) {
                this.bzdata.push(i);
            }
        }
    };
    ExprotListDialog.prototype.findView = function () {
        this.top = this.owner.getChildByName('top');
        this.title = this.top.getChildByName('txt');
        this.list = this.owner.getChildByName('list');
        this.btn_retrun = this.top.getChildByName('retrunHome');
        this.btn_retrun.top = parseInt(PlatformMg_1.default.Instance.JLBtnInfo.top) + (parseInt(PlatformMg_1.default.Instance.JLBtnInfo.height) - this.btn_retrun.height) / 2;
        this.title.top = parseInt(PlatformMg_1.default.Instance.JLBtnInfo.top) + (parseInt(PlatformMg_1.default.Instance.JLBtnInfo.height) - this.title.height) / 2;
    };
    ExprotListDialog.prototype.initView = function () {
        var _height = PlatformMg_1.default.Instance.JLBtnInfo.height + PlatformMg_1.default.Instance.JLBtnInfo.top + 20;
        this.top.height = _height;
        if (WindowUtil_1.default.isIphoneX && !Laya.Browser.onIOS) {
            this.btn_retrun.top += 58;
            this.top.height += 58;
        }
        this.list.top = this.top.height + 30;
        this.onSetList();
        this.onTween();
    };
    ExprotListDialog.prototype.screenAdaptation = function () {
    };
    /**初始list表单 */
    ExprotListDialog.prototype.onSetList = function () {
        this.list.vScrollBarSkin = '';
        this.list.selectEnable = true;
        this.list.array = this.dataList;
        this.list.refresh();
        this.list.renderHandler = new Laya.Handler(this, this.updateItem);
        this.list.mouseHandler = new Laya.Handler(this, this.onSelect);
    };
    //设置列表里面images图片路径
    ExprotListDialog.prototype.updateItem = function (cell, index) {
        cell.getChildByName('pic').skin = cell.dataSource.img;
        cell.getChildByName('name').text = cell.dataSource.title;
        cell.getChildByName('hit').text = 5 + Math.floor(Math.random() * 100) + '万人在玩';
        if (this.bzdata.indexOf(index) > -1) {
            cell.getChildByName('name').getChildByName('ico').visible = true;
        }
    };
    //选中当前
    ExprotListDialog.prototype.onSelect = function (e, index) {
        if (PlatformMg_1.default.Instance.isWx) {
            if (e.type == 'click') {
                //点击
                LeadOutMg_1.default.leadOut(this.dataList[index], 'e_52');
            }
        }
    };
    //自动滑动
    ExprotListDialog.prototype.onTween = function () {
        var _this = this;
        this.list.array = this.dataList;
        var sig = this.list.scrollBar.max / 4;
        //自动滑动
        Laya.timer.loop(16, null, function () {
            _this.list.scrollBar.value += 1;
            if (_this.list.scrollBar.value >= _this.list.scrollBar.max - sig) {
                _this.dataList = _this.dataList.concat(_this.dataList);
                _this.list.updateArray(_this.dataList);
            }
        });
    };
    /**点击 */
    ExprotListDialog.prototype.onClick = function (e) {
        e.stopPropagation();
        if (e.target.name.substring(0, 3) === 'btn') {
            SoundUtil_1.default.play('click');
        }
        switch (e.target.name) {
            case 'retrunHome':
                UmMg_1.default.trackEvent('e_51');
                if (this.closeFun) {
                    this.owner.close();
                    this.closeFun();
                }
                else {
                    this.owner.close();
                    // Laya.Dialog.closeAll();
                    // GameData.IsTcHome = true;
                    // Laya.View.open(ActivityUrls.GAME_SCENE);
                }
                break;
            default:
                break;
        }
    };
    return ExprotListDialog;
}(BaseDialogSc_1.default));
exports.default = ExprotListDialog;
