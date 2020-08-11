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
var ExprotBox2 = /** @class */ (function (_super) {
    __extends(ExprotBox2, _super);
    function ExprotBox2() {
        var _this = _super.call(this) || this;
        _this.dataList = [];
        return _this;
    }
    ExprotBox2.prototype.onAwake = function () {
    };
    ExprotBox2.prototype.onEnable = function () {
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
    ExprotBox2.prototype.onSetList = function () {
        var owner = this.owner;
        owner.vScrollBarSkin = '';
        owner.selectEnable = true;
        owner.array = this.dataList;
        owner.refresh();
        owner.renderHandler = new Laya.Handler(this, this.updateItem);
        owner.mouseHandler = new Laya.Handler(this, this.onSelect);
    };
    //设置列表里面images图片路径
    ExprotBox2.prototype.updateItem = function (cell, index) {
        cell.getChildByName('m_pic').skin = cell.dataSource.img;
        cell.getChildByName('m_name').text = cell.dataSource.title;
    };
    //点击当前
    ExprotBox2.prototype.onSelect = function (e, index, opid) {
        if (e.type == 'click') {
            //点击
            LeadOutMg_1.default.leadOut(this.dataList[index], 'e_55');
        }
    };
    //自动滑动
    ExprotBox2.prototype.onTween = function () {
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
    ExprotBox2.prototype.onDisable = function () {
    };
    return ExprotBox2;
}(Laya.Script));
exports.default = ExprotBox2;
