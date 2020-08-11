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
var LeadOutMg_1 = __importDefault(require("../Manages/LeadOutMg"));
var ExprotBoxList = /** @class */ (function (_super) {
    __extends(ExprotBoxList, _super);
    function ExprotBoxList() {
        return _super.call(this) || this;
    }
    ExprotBoxList.prototype.onEnable = function () {
        if (PlatformMg_1.default.Instance.isWx) {
            this.dataList = LeadOutMg_1.default.GameList ? LeadOutMg_1.default.GameList : [];
            console.log('导出盒子', this.dataList);
            this.onSetList();
            this.ontween();
        }
        else {
            this.owner.removeSelf();
        }
        //this.tween();
    };
    ExprotBoxList.prototype.onSetList = function () {
        var owner = this.owner;
        owner.vScrollBarSkin = '';
        owner.selectEnable = true;
        owner.array = this.dataList;
        owner.refresh();
        owner.renderHandler = new Laya.Handler(this, this.updateItem);
        owner.mouseHandler = new Laya.Handler(this, this.onSelect);
    };
    //设置列表里面images图片路径
    ExprotBoxList.prototype.updateItem = function (cell, index) {
        cell.getChildByName('m_pic').skin = cell.dataSource.img;
        cell.getChildByName('m_pic').mask = cell.getChildByName('m_mask');
        //cell.getChildByName('ani').mask = cell.getChildByName('m_mask2');
        cell.getChildByName('m_name').text = cell.dataSource.title;
        var _random = 10 + Number(Math.floor(Math.random() * 10).toFixed(2));
        cell.getChildByName('m_num').text = _random + '万人玩过';
        //console.log(index,cell)
        //cell.getChildByName('m_pic').visible = true;
    };
    //选中当前
    ExprotBoxList.prototype.onSelect = function (e, index, opid) {
        if (e.type == 'click') {
            //点击
            LeadOutMg_1.default.leadOut(this.dataList[index], 'e_32');
        }
    };
    //自动滑动
    ExprotBoxList.prototype.ontween = function () {
        var _this = this;
        this.owner.array = this.dataList;
        var sig = this.owner.scrollBar.max / 4;
        //自动滑动
        Laya.timer.loop(20, null, function () {
            _this.owner.scrollBar.value += 1;
            if (_this.owner.scrollBar.value >= _this.owner.scrollBar.max - sig) {
                _this.dataList = _this.dataList.concat(_this.dataList);
                _this.owner.updateArray(_this.dataList);
            }
        });
    };
    //滚动list
    ExprotBoxList.prototype.tweenAction = function () {
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
    ExprotBoxList.prototype.onDisable = function () {
    };
    return ExprotBoxList;
}(Laya.Script));
exports.default = ExprotBoxList;
