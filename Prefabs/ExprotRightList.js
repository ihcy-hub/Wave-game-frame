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
var exprotRightList = /** @class */ (function (_super) {
    __extends(exprotRightList, _super);
    function exprotRightList() {
        var _this = _super.call(this) || this;
        _this.isDc = false;
        _this._time = 0;
        _this.loadNum = 0;
        _this.refreshTime = 3000; //刷新时间
        return _this;
    }
    exprotRightList.prototype.onEnable = function () {
        this.owner.removeSelf();
        // if(PlatformMg.Instance.isWx){
        //     this.dataList =LeadOutMg.GameList?LeadOutMg.GameList:[]
        //     console.log('--------------导出信息------------------',this.dataList)
        //     //判断导出有无加载好
        //     this.init(); 
        //     //TipsUtil.msg(this.owner.visible+'、'+this.owner.alpha+'')
        // }else{
        //     this.owner.removeSelf();
        // }
    };
    exprotRightList.prototype.onUpdate = function () {
        this._time += Laya.timer.delta;
        if (PlatformMg_1.default.Instance.isWx && this._time > 1000 && this.loadNum < 3) {
            if (!this.isDc || typeof (this.owner) == "undefined") {
                this.loadNum++;
                this.dataList = LeadOutMg_1.default.GameList ? LeadOutMg_1.default.GameList : [];
                console.log('--------------导出信息重复------------------', this.dataList);
                this.init();
            }
            this._time = 0;
        }
    };
    exprotRightList.prototype.init = function () {
        if (this.dataList.length > 0) {
            //this.owner.visible = true
            this.dataList = ArrUtil_1.default.Instance.getRandomArrayElements(this.dataList, 3); //随机读取3个
            this.onSetList();
            console.log('--------------导出信息onwer------------------', this.owner);
            this.isDc = true;
            Laya.timer.clear(this, this.init);
            Laya.timer.once(this.refreshTime, this, this.init);
        }
    };
    exprotRightList.prototype.onSetList = function () {
        var owner = this.owner;
        //owner.hScrollBarSkin = '';
        owner.selectEnable = true;
        owner.array = this.dataList;
        owner.refresh();
        owner.renderHandler = new Laya.Handler(this, this.updateItem);
        owner.mouseHandler = new Laya.Handler(this, this.onSelect);
    };
    //设置列表里面images图片路径
    exprotRightList.prototype.updateItem = function (cell, index) {
        cell.getChildByName('m_pic').skin = cell.dataSource.img;
        cell.getChildByName('name').text = cell.dataSource.title;
        console.log(index, cell);
        //cell.getChildByName('m_name').text = cell.dataSource.title;
        //cell.getChildByName('m_pic').visible = true;
    };
    //选中当前
    exprotRightList.prototype.onSelect = function (e, index, opid) {
        if (e.type == 'click') {
            LeadOutMg_1.default.leadOut(this.dataList[index]);
        }
    };
    exprotRightList.prototype.onDisable = function () {
    };
    return exprotRightList;
}(Laya.Script));
exports.default = exprotRightList;
