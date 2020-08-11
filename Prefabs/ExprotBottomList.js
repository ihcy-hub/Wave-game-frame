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
var ExprotBottomList = /** @class */ (function (_super) {
    __extends(ExprotBottomList, _super);
    function ExprotBottomList() {
        var _this = _super.call(this) || this;
        _this.isDc = false;
        _this._time = 0;
        _this.loadNum = 0;
        return _this;
    }
    ExprotBottomList.prototype.onEnable = function () {
        //this.Bar = this.owner.getChildByName('scrollBar') as Laya.ScrollBar;
        if (PlatformMg_1.default.Instance.isWx) {
            //this.is_status?this.owner.visible = true:this.owner.visible = false;
            this.dataList = LeadOutMg_1.default.GameList ? LeadOutMg_1.default.GameList : [];
            this.dataList = ArrUtil_1.default.Instance.shuffle(this.dataList);
            console.log('this.dataList', this.owner);
            this.init();
        }
        else {
            this.owner.removeSelf();
        }
    };
    ExprotBottomList.prototype.onUpdate = function () {
        this._time += Laya.timer.delta;
        if (PlatformMg_1.default.Instance.isWx && this._time > 1000 && this.loadNum < 3) {
            if (!this.isDc) {
                this.loadNum++;
                console.log('--------------首页底部导出信息重复------------------', this.dataList);
                this.dataList = LeadOutMg_1.default.GameList ? LeadOutMg_1.default.GameList : [];
                this.init();
            }
            this._time = 0;
        }
    };
    ExprotBottomList.prototype.init = function () {
        //this.owner.visible = true;
        if (this.dataList.length > 0) {
            console.log('--------------首页底部导出------------------', this.owner);
            this.owner.repeatX = this.dataList.length;
            this.onSetList();
            this.scrollText();
            this.owner.on(Laya.Event.MOUSE_UP, this, this.scrollText);
            this.isDc = true;
        }
    };
    ExprotBottomList.prototype.onSetList = function () {
        var owner = this.owner;
        owner.hScrollBarSkin = '';
        owner.selectEnable = true;
        owner.array = this.dataList;
        owner.selectedIndex = 0;
        owner.refresh();
        owner.renderHandler = new Laya.Handler(this, this.updateItem);
        owner.mouseHandler = new Laya.Handler(this, this.onSelect);
    };
    //设置列表里面images图片路径
    ExprotBottomList.prototype.updateItem = function (cell, index) {
        cell.getChildByName('m_pic').skin = cell.dataSource.img;
        cell.getChildByName('m_pic').mask = cell.getChildByName('m_mask');
        cell.getChildByName('m_name').text = cell.dataSource.title;
        //console.log(index,cell)
        //cell.getChildByName('m_pic').visible = true;
    };
    //选中当前
    ExprotBottomList.prototype.onSelect = function (e, index) {
        //e.stopPropagation();
        if (e.type == 'click') {
            LeadOutMg_1.default.leadOut(this.dataList[index], 'e_29');
        }
    };
    //list自动滚动
    ExprotBottomList.prototype.tween = function () {
        Laya.timer.loop(3000, this, this.scrollText);
    };
    //滚动list
    ExprotBottomList.prototype.scrollText = function () {
        var _this = this;
        this.owner.selectedIndex += 1;
        if (this.owner.selectedIndex == this.dataList.length - 4) {
            this.owner.selectedIndex = 0;
            //Laya.timer.clear(this,this.scrollText);
            this.scrollText();
        }
        else {
            this.owner.tweenTo(this.owner.selectedIndex, 5000, new Laya.Handler(this, function () {
                _this.scrollText();
            }));
        }
    };
    //滚动list
    ExprotBottomList.prototype.tweenAction = function () {
        var _this = this;
        var s = this.owner.length - 4;
        var scrollTime = 8000;
        this.owner.tweenTo(s, scrollTime);
        Laya.timer.loop(scrollTime, this, function () {
            if (s == 0) {
                s = _this.owner.length - 4;
            }
            else {
                s = 0;
            }
            _this.owner.tweenTo(s, scrollTime);
        });
    };
    ExprotBottomList.prototype.onDisable = function () {
        this.owner.off(Laya.Event.MOUSE_UP, this, this.scrollText);
    };
    return ExprotBottomList;
}(Laya.Script));
exports.default = ExprotBottomList;
