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
var LeadOutMg_1 = __importDefault(require("../Manages/LeadOutMg"));
var GameData_1 = __importDefault(require("../Game/GameMg/GameData"));
var EventCenter_1 = __importDefault(require("../EventSystem/EventCenter"));
var ConfigData_1 = require("../Data/ConfigData");
var UmMg_1 = __importDefault(require("../Utils/UmMg"));
var WindowUtil_1 = __importDefault(require("../Utils/WindowUtil"));
var ExprotDraerMgr = /** @class */ (function (_super) {
    __extends(ExprotDraerMgr, _super);
    function ExprotDraerMgr() {
        var _this = _super.call(this) || this;
        _this.dataList = [];
        _this.isTrue = true; //点击按钮是否显示盒子
        ExprotDraerMgr.Instance = _this;
        return _this;
    }
    ExprotDraerMgr.prototype.onEnable = function () {
        var _this = this;
        this.getSpr();
        UmMg_1.default.trackEvent('e_14');
        this.btn.on(Laya.Event.CLICK, this, function () {
            if (_this.isTrue) {
                //显示盒子
                _this.show();
                UmMg_1.default.trackEvent('e_13');
            }
            else {
                //收起盒子
                _this.hide();
            }
        });
        this.initData();
        // if(PlatformMg.Instance.isWx || PlatformMg.Instance.isWeb){
        //     if(GameData.testdata){
        //         for(let i = 0; i<GameData.testdata.length; i++){
        //             this.dataList.push(GameData.testdata[i]);
        //         }
        //     }else{
        //         this.dataList = [];
        //     }
        //     this.onSetList();
        //     this.onTween();
        // }else{
        //     this.owner.removeSelf();
        // }
    };
    /**显示抽屉广告 */
    ExprotDraerMgr.prototype.show = function () {
        var _this = this;
        return new Promise(function (success) {
            _this.bgMask.visible = true;
            _this.ico.visible = false;
            Laya.Tween.to(_this.box, { x: 0 }, 500, null, Laya.Handler.create(_this, function () {
                _this.btn.selected = false;
                _this.isTrue = false;
                try {
                    success('success');
                }
                catch (_a) {
                }
            }));
        });
    };
    /**收起抽屉广告 */
    ExprotDraerMgr.prototype.hide = function () {
        var _this = this;
        EventCenter_1.default.Instance.emit(ConfigData_1.EventKey.CLOSECT);
        return new Promise(function (success) {
            Laya.Tween.to(_this.box, { x: -610 }, 500, null, Laya.Handler.create(_this, function () {
                _this.bgMask.visible = false;
                _this.ico.visible = true;
                _this.btn.selected = true;
                _this.isTrue = true;
                try {
                    success('success');
                }
                catch (_a) {
                }
            }));
        });
    };
    /**初始数据 */
    ExprotDraerMgr.prototype.initData = function () {
        if (GameData_1.default.DcLoad) {
            this.owner.visible = true;
            for (var i = 0; i < LeadOutMg_1.default.GameList.length; i++) {
                this.dataList.push(LeadOutMg_1.default.GameList[i]);
            }
            this.onSetList();
            this.onTween();
            EventCenter_1.default.Instance.removeListener(ConfigData_1.EventKey.DCLOADEND, this);
        }
        else {
            EventCenter_1.default.Instance.on(ConfigData_1.EventKey.DCLOADEND, this.initData, this);
        }
    };
    /**读取组件 */
    ExprotDraerMgr.prototype.getSpr = function () {
        this.box = this.owner.getChildByName('box');
        this.bgMask = this.owner.getChildByName('bgMask');
        this.btn = this.box.getChildByName('btn');
        this.list = this.box.getChildByName('list');
        this.ico = this.btn.getChildByName('ico');
        if (WindowUtil_1.default.isIphoneX) {
            this.box.bottom += 100;
        }
    };
    /**初始设置List */
    ExprotDraerMgr.prototype.onSetList = function () {
        this.list.vScrollBarSkin = '';
        this.list.selectEnable = true;
        this.list.array = this.dataList;
        this.list.refresh();
        this.list.renderHandler = new Laya.Handler(this, this.updateItem);
        this.list.mouseHandler = new Laya.Handler(this, this.onSelect);
    };
    //设置列表里面images图片路径
    ExprotDraerMgr.prototype.updateItem = function (cell, index) {
        var _name = cell.getChildByName('m_name');
        var colorArr = ['#F58B00', '#EC6969', '#07B448', '#F68B00', '#EA4CCE'];
        cell.getChildByName('m_pic').skin = cell.dataSource.img;
        _name.text = cell.dataSource.title;
        //_name.bgColor = colorArr[Math.floor(Math.random()*colorArr.length)]
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
    ExprotDraerMgr.prototype.onSelect = function (e, index, opid) {
        if (e.type == 'click') {
            //点击
            LeadOutMg_1.default.leadOut(this.dataList[index], 'e_15');
        }
    };
    //自动滑动
    ExprotDraerMgr.prototype.onTween = function () {
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
    return ExprotDraerMgr;
}(Laya.Script));
exports.default = ExprotDraerMgr;
