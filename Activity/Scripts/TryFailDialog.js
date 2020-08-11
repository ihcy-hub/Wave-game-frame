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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDialogSc_1 = __importDefault(require("../BaseDialogSc"));
var GameData_1 = __importDefault(require("../../Game/GameMg/GameData"));
var ArrUtil_1 = __importDefault(require("../../Utils/ArrUtil"));
var AdMg_1 = __importDefault(require("../../Platform/AdMg"));
var PublicMg_1 = __importDefault(require("../../Game/GameMg/PublicMg"));
var SoundUtil_1 = __importDefault(require("../../Utils/SoundUtil"));
var ConfigData_1 = __importStar(require("../../Data/ConfigData"));
var LocalStorageUtil_1 = __importDefault(require("../../Utils/LocalStorageUtil"));
var TipsUtil_1 = __importDefault(require("../../Utils/TipsUtil"));
var WindowUtil_1 = __importDefault(require("../../Utils/WindowUtil"));
var TryFailDialog = /** @class */ (function (_super) {
    __extends(TryFailDialog, _super);
    function TryFailDialog() {
        var _this = _super.call(this) || this;
        _this.skinNum = 1;
        _this.dataList = [];
        _this.videoList = []; //视频列表
        return _this;
    }
    TryFailDialog.prototype.initData = function () {
        var _this = this;
        this.owner.openedCallBack(function (res) {
            _this.closeFun = res;
        });
        GameData_1.default.SkinData.forEach(function (item, index) {
            if (!item.have) {
                _this.dataList.push(item);
            }
            ;
        });
        //随机选择3个
        this.dataList = ArrUtil_1.default.Instance.getRandomArrayElements(this.dataList, 3);
        //随机分配是看视频还是金币够买
        for (var i = 0; i < this.dataList.length; i++) {
            if (Math.random() < 0.8) {
                this.videoList.push(1);
            }
            else {
                this.videoList.push(0);
            }
        }
        if (this.dataList.length < 1) {
            //已经全部拥有
            this.owner.close();
            this.closeFun();
        }
        else {
            //随机选一个
            //this.skinNum = this.dataList[Math.floor(Math.random()*this.dataList.length)].id;
        }
    };
    TryFailDialog.prototype.findView = function () {
        this.box = this.owner.getChildByName('box');
        this.btn_close = this.owner.getChildByName('btn_close');
        this.list = this.box.getChildByName('list');
    };
    TryFailDialog.prototype.initView = function () {
        this.onSetList();
        this.onCasualClick();
    };
    TryFailDialog.prototype.screenAdaptation = function () {
    };
    /**误点 */
    TryFailDialog.prototype.onCasualClick = function () {
        var _this = this;
        if (ConfigData_1.default.IsMisLead) {
            this.btn_close.bottom = WindowUtil_1.default.isIphoneX ? 155 : 105;
            this.btn_close.alpha = 1;
            Laya.timer.once(ConfigData_1.default.bannerTime, this, function () {
                _this.showBottomBanner();
            });
            Laya.timer.once(ConfigData_1.default.bannerTime + 500, this, function () {
                Laya.Tween.to(_this.btn_close, { bottom: WindowUtil_1.default.isIphoneX ? 339 : 288 }, 200);
            });
            //视频按钮
            // this.checkVideo.selected = true;
            // this.btn_close.text = '暂时使用';
        }
        else {
            this.btn_close.bottom = WindowUtil_1.default.isIphoneX ? 339 : 288;
            this.btn_close.alpha = 0.3;
            //this.btn_close.fontSize = 30;
            this.showBottomBanner();
            //视频按钮
        }
    };
    TryFailDialog.prototype.onSetList = function () {
        //this.list.hScrollBarSkin = '';
        this.list.selectEnable = true;
        this.list.array = this.dataList;
        this.list.refresh();
        this.list.renderHandler = new Laya.Handler(this, this.updateItem);
        this.list.mouseHandler = new Laya.Handler(this, this.onSelect);
    };
    //设置列表里面images图片路径
    TryFailDialog.prototype.updateItem = function (cell, index) {
        if (this.videoList[index]) {
            cell.getChildByName('VideoBox').visible = true;
            cell.getChildByName('coinBox').visible = false;
            //(cell.getChildByName('txt')as Laya.Label).text = '码力值 '+cell.dataSource.price;
        }
        else {
            cell.getChildByName('VideoBox').visible = false;
            cell.getChildByName('coinBox').visible = true;
            cell.getChildByName('coinBox').getChildByName('txt').text = PublicMg_1.default.Instance.setGoldCoin(cell.dataSource.price);
        }
        cell.getChildByName('m_pic').skin = cell.dataSource.img;
    };
    //选中当前
    TryFailDialog.prototype.onSelect = function (e, index) {
        var _this = this;
        if (e.type == 'click') {
            if (this.videoList[index]) {
                AdMg_1.default.Instance.showVideo({
                    success: function () {
                        _this.owner.close();
                        GameData_1.default.GetSkin = _this.dataList[index].id;
                        GameData_1.default.GetSkinSy = true;
                        _this.closeFun();
                    }
                });
            }
            else {
                var num = this.list.getItem(index).price;
                if (GameData_1.default.Coin >= num) {
                    GameData_1.default.GetSkin = this.dataList[index].id;
                    GameData_1.default.Coin -= num;
                    GameData_1.default.SkinData[this.dataList[index].id].have = true;
                    //本地储存
                    LocalStorageUtil_1.default.setList(ConfigData_1.LocalStorageKey.SKINDATA, GameData_1.default.SkinData);
                    LocalStorageUtil_1.default.setNumber(ConfigData_1.LocalStorageKey.GETSKIN, this.dataList[index].id);
                    this.owner.close();
                    this.closeFun();
                }
                else {
                    TipsUtil_1.default.msg('余额不足');
                }
            }
        }
    };
    TryFailDialog.prototype.onClick = function (e) {
        e.stopPropagation();
        if (e.target.name.substring(0, 3) === 'btn') {
            SoundUtil_1.default.play('click');
        }
        switch (e.target.name) {
            case 'btn_close':
                this.owner.close();
                this.closeFun();
                break;
            case 'check':
                //this.check.selected = !this.check.selected
                break;
            default:
                break;
        }
    };
    TryFailDialog.prototype.onDisable = function () {
        _super.prototype.onDisable.call(this);
        clearTimeout(this.setTime);
    };
    return TryFailDialog;
}(BaseDialogSc_1.default));
exports.default = TryFailDialog;
