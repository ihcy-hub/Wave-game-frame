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
var ExprotTcList2 = /** @class */ (function (_super) {
    __extends(ExprotTcList2, _super);
    function ExprotTcList2() {
        var _this = _super.call(this) || this;
        _this.dataList = []; //当前的导出数据
        _this.overDatalist = []; //剩余的导出数据
        /** @prop {name:eventId, tips:"友盟导出统计ID", type:string, default:'e_11'} */
        _this.eventId = 'e_11';
        return _this;
    }
    ExprotTcList2.prototype.onEnable = function () {
        if (PlatformMg_1.default.Instance.isWx) {
            if (LeadOutMg_1.default.GameList) {
                for (var i = 0; i < LeadOutMg_1.default.GameList.length; i++) {
                    this.dataList.push(LeadOutMg_1.default.GameList[i]);
                }
            }
            else {
                this.dataList = [];
            }
            var obj = ArrUtil_1.default.Instance.arrRandom(this.dataList, 6);
            this.dataList = obj.new; //随机读取6个
            this.overDatalist = obj.over;
            //console.log('this.dataList',this.dataList)
            this.onSetList();
        }
        else {
            this.owner.removeSelf();
        }
        //this.tween();
    };
    ExprotTcList2.prototype.onSetList = function () {
        var owner = this.owner;
        owner.vScrollBarSkin = '';
        owner.selectEnable = true;
        owner.array = this.dataList;
        owner.refresh();
        owner.renderHandler = new Laya.Handler(this, this.updateItem);
        owner.mouseHandler = new Laya.Handler(this, this.onSelect);
    };
    //设置列表里面images图片路径
    ExprotTcList2.prototype.updateItem = function (cell, index) {
        cell.getChildByName('m_pic').skin = cell.dataSource.img;
        cell.getChildByName('m_name').text = cell.dataSource.title;
    };
    //点击当前
    ExprotTcList2.prototype.onSelect = function (e, index, opid) {
        var dcName;
        if (e.type == 'click') {
            //点击
            LeadOutMg_1.default.leadOut(this.dataList[index], this.eventId);
            //从剩余的数组里面删除取消第一个元素
            var newVal = this.overDatalist.splice(0, 1);
            //当前操作数组中删除取出点击的元素并加入前面选取出来的元素
            var val = this.dataList.splice(index, 1, newVal[0]);
            //将选取出来的元素添加到剩余数组里面
            this.overDatalist.push(val[0]);
            this.owner.refresh();
        }
    };
    return ExprotTcList2;
}(Laya.Script));
exports.default = ExprotTcList2;
