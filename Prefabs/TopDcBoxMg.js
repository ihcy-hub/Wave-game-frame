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
var ArrUtil_1 = __importDefault(require("../Utils/ArrUtil"));
var LeadOutMg_1 = __importDefault(require("../Manages/LeadOutMg"));
var GameData_1 = __importDefault(require("../Game/GameMg/GameData"));
var EventCenter_1 = __importDefault(require("../EventSystem/EventCenter"));
var ConfigData_1 = require("../Data/ConfigData");
var TopDcBoxMg = /** @class */ (function (_super) {
    __extends(TopDcBoxMg, _super);
    function TopDcBoxMg() {
        var _this = _super.call(this) || this;
        _this.dataList = [];
        _this._time = 0;
        _this.loadNum = 0;
        /** @prop {name:eventId, tips:"友盟导出统计ID", type:string, default:'e_7'} */
        _this.eventId = 'e_7';
        return _this;
    }
    TopDcBoxMg.prototype.onAwake = function () {
    };
    TopDcBoxMg.prototype.onEnable = function () {
        console.log("友盟导出统计ID", this.eventId);
        this.owner.top = parseInt(PlatformMg_1.default.Instance.JLBtnInfo.top) + parseInt(PlatformMg_1.default.Instance.JLBtnInfo.height) + 10;
        this.owner.visible = false;
        this.list = this.owner.getChildByName('list');
        this.initData();
    };
    /**初始数据 */
    TopDcBoxMg.prototype.initData = function () {
        if (GameData_1.default.DcLoad) {
            //this.owner.visible = true
            for (var i = 0; i < LeadOutMg_1.default.GameList.length; i++) {
                this.dataList.push(LeadOutMg_1.default.GameList[i]);
            }
            this.dataList = ArrUtil_1.default.Instance.shuffle(this.dataList);
            this.init();
            EventCenter_1.default.Instance.removeListener(ConfigData_1.EventKey.DCLOADEND, this);
        }
        else {
            EventCenter_1.default.Instance.on(ConfigData_1.EventKey.DCLOADEND, this.initData, this);
        }
    };
    TopDcBoxMg.prototype.init = function () {
        //this.owner.visible = true;
        if (this.dataList && this.dataList.length > 0) {
            this.list.repeatX = this.dataList.length;
            this.onSetList();
            this.onTween();
        }
    };
    TopDcBoxMg.prototype.onSetList = function () {
        this.list.hScrollBarSkin = '';
        this.list.selectEnable = true;
        this.list.array = this.dataList;
        this.list.selectedIndex = 0;
        this.list.refresh();
        this.list.renderHandler = new Laya.Handler(this, this.updateItem);
        this.list.mouseHandler = new Laya.Handler(this, this.onSelect);
    };
    //设置列表里面images图片路径
    TopDcBoxMg.prototype.updateItem = function (cell, index) {
        cell.getChildByName('m_pic').skin = cell.dataSource.img;
        //console.log(index,cell)
        //cell.getChildByName('m_pic').visible = true;
    };
    //选中当前
    TopDcBoxMg.prototype.onSelect = function (e, index) {
        if (e.type == 'click') {
            LeadOutMg_1.default.leadOut(this.dataList[index], this.eventId);
        }
    };
    /**联系滚动 */
    TopDcBoxMg.prototype.scrollText = function () {
        var _this = this;
        this.list.selectedIndex += 1;
        if (this.list.selectedIndex == this.dataList.length - 4) {
            this.list.selectedIndex = 0;
            //Laya.timer.clear(this,this.scrollText);
            this.scrollText();
        }
        else {
            this.list.tweenTo(this.list.selectedIndex, 5000, new Laya.Handler(this, function () {
                _this.scrollText();
            }));
        }
    };
    //自动滑动
    TopDcBoxMg.prototype.onTween = function () {
        var _this = this;
        var sig = this.list.scrollBar.max / 4;
        //自动滑动
        Laya.timer.loop(2000, null, function () {
            Laya.Tween.to(_this.list.scrollBar, { value: _this.list.scrollBar.value + 190 }, 100);
            if (_this.list.scrollBar.value >= _this.list.scrollBar.max - sig) {
                _this.dataList = _this.dataList.concat(_this.dataList);
                _this.list.updateArray(_this.dataList);
            }
        });
    };
    /**间隔滚动 */
    TopDcBoxMg.prototype.onTween2 = function () {
        var _this = this;
        Laya.timer.clearAll(this);
        Laya.timer.loop(2000, this, function () {
            _this.list.selectedIndex += 1;
            _this.list.tweenTo(_this.list.selectedIndex, 100);
            if (_this.list.selectedIndex >= _this.dataList.length - 4) {
                _this.dataList = _this.dataList.concat(_this.dataList);
                _this.list.updateArray(_this.dataList);
            }
        });
    };
    TopDcBoxMg.prototype.onDisable = function () {
    };
    return TopDcBoxMg;
}(Laya.Script));
exports.default = TopDcBoxMg;
