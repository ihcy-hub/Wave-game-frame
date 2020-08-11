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
var ExprotTcList = /** @class */ (function (_super) {
    __extends(ExprotTcList, _super);
    function ExprotTcList() {
        return _super.call(this) || this;
    }
    ExprotTcList.prototype.onEnable = function () {
        var _this = this;
        if (PlatformMg_1.default.Instance.isWx) {
            //this.is_status?this.owner.visible = true:this.owner.visible = false;
            this.dataList = LeadOutMg_1.default.GameList ? LeadOutMg_1.default.GameList : [];
            var num = 9;
            num = this.owner.repeatX * this.owner.repeatY;
            this.dataList = ArrUtil_1.default.Instance.getRandomArrayElements(this.dataList, num); //随机读取4个
            console.log('this.dataList', this.dataList);
            this.onSetList();
            if (num > 9) {
                Laya.timer.once(700, this, function () {
                    _this.tweenAction();
                });
            }
        }
        else {
            this.owner.removeSelf();
        }
        //this.tween();
    };
    ExprotTcList.prototype.onSetList = function () {
        var owner = this.owner;
        owner.vScrollBarSkin = '';
        owner.selectEnable = true;
        owner.array = this.dataList;
        owner.refresh();
        owner.renderHandler = new Laya.Handler(this, this.updateItem);
        owner.mouseHandler = new Laya.Handler(this, this.onSelect);
    };
    //设置列表里面images图片路径
    ExprotTcList.prototype.updateItem = function (cell, index) {
        cell.getChildByName('m_pic').skin = cell.dataSource.img;
        cell.getChildByName('m_pic').mask = cell.getChildByName('m_mask');
        //cell.getChildByName('ani').mask = cell.getChildByName('m_mask2');
        cell.getChildByName('m_name').text = cell.dataSource.title;
        //console.log(index,cell)
        //cell.getChildByName('m_pic').visible = true;
    };
    //选中当前
    ExprotTcList.prototype.onSelect = function (e, index, opid) {
        var dcName;
        if (e.type == 'click') {
            //点击
            var str = void 0;
            switch (GameData_1.default.Dctj) {
                case 0:
                    str = 'e_11';
                    break;
                case 1:
                    str = 'e_15';
                    break;
                case 2:
                    str = 'e_19';
                    break;
                default:
                    break;
            }
            LeadOutMg_1.default.leadOut(this.dataList[index], str);
        }
    };
    //list自动滚动
    ExprotTcList.prototype.tween = function () {
        Laya.timer.loop(5000, this, function scrollText() {
            this.owner.selectedIndex += 1;
            if (this.owner.selectedIndex > 9) {
                this.owner.selectedIndex = -1;
                Laya.timer.clear(this, scrollText);
                this.tween();
            }
            else {
                this.owner.tweenTo(this.owner.selectedIndex, 5000, null);
            }
        });
    };
    //滚动list
    ExprotTcList.prototype.tweenAction = function () {
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
    ExprotTcList.prototype.onDisable = function () {
    };
    return ExprotTcList;
}(Laya.Script));
exports.default = ExprotTcList;
