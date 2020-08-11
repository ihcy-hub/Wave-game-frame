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
var ExprotBox3 = /** @class */ (function (_super) {
    __extends(ExprotBox3, _super);
    function ExprotBox3() {
        var _this = _super.call(this) || this;
        _this.dataList = [];
        return _this;
    }
    ExprotBox3.prototype.onAwake = function () {
    };
    ExprotBox3.prototype.onEnable = function () {
        if (PlatformMg_1.default.Instance.isWx || PlatformMg_1.default.Instance.isWeb) {
            if (LeadOutMg_1.default.GameList) {
                for (var i = 0; i < LeadOutMg_1.default.GameList.length; i++) {
                    this.dataList.push(LeadOutMg_1.default.GameList[i]);
                }
            }
            else {
                this.dataList = [];
            }
            console.log('导出盒子', this.dataList);
            this.onSetList();
            this.onTween();
        }
        else {
            this.owner.removeSelf();
        }
    };
    /**初始设置List */
    ExprotBox3.prototype.onSetList = function () {
        var owner = this.owner;
        owner.vScrollBarSkin = '';
        owner.selectEnable = true;
        owner.array = this.dataList;
        owner.refresh();
        owner.renderHandler = new Laya.Handler(this, this.updateItem);
        owner.mouseHandler = new Laya.Handler(this, this.onSelect);
    };
    //设置列表里面images图片路径
    ExprotBox3.prototype.updateItem = function (cell, index) {
        var _name = cell.getChildByName('m_name');
        var colorArr = ['#F58B00', '#EC6969', '#07B448', '#F68B00', '#EA4CCE'];
        cell.getChildByName('m_pic').skin = cell.dataSource.img;
        _name.text = cell.dataSource.title;
        _name.bgColor = colorArr[Math.floor(Math.random() * colorArr.length)];
        // switch (index%3) {
        //     case 0:
        //         _name.bgColor = '#F58B00'
        //         break;
        //     case 1:
        //         _name.bgColor = '#EC6969'
        //         break;
        //     case 2:
        //         _name.bgColor = '#07B448'
        //         break;
        //     default:
        //         break;
        // }
    };
    //点击当前
    ExprotBox3.prototype.onSelect = function (e, index, opid) {
        if (e.type == 'click') {
            //点击
            LeadOutMg_1.default.leadOut(this.dataList[index], 'e_49');
        }
    };
    //自动滑动
    ExprotBox3.prototype.onTween = function () {
        var _this = this;
        this.owner.array = this.dataList;
        var sig = this.owner.scrollBar.max / 4;
        //自动滑动
        Laya.timer.loop(16, null, function () {
            _this.owner.scrollBar.value += 1;
            if (_this.owner.scrollBar.value >= _this.owner.scrollBar.max - sig) {
                _this.dataList = _this.dataList.concat(_this.dataList);
                _this.owner.updateArray(_this.dataList);
            }
        });
    };
    ExprotBox3.prototype.onDisable = function () {
    };
    return ExprotBox3;
}(Laya.Script));
exports.default = ExprotBox3;
