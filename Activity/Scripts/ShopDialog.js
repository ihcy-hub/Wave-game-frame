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
var PlatformMg_1 = __importDefault(require("../../Platform/PlatformMg"));
var WindowUtil_1 = __importDefault(require("../../Utils/WindowUtil"));
var BaseDialogSc_1 = __importDefault(require("../BaseDialogSc"));
var GameData_1 = __importDefault(require("../../Game/GameMg/GameData"));
var SoundUtil_1 = __importDefault(require("../../Utils/SoundUtil"));
var GameMg_1 = __importDefault(require("../../Game/GameMg/GameMg"));
var PublicMg_1 = __importDefault(require("../../Game/GameMg/PublicMg"));
var AdMg_1 = __importDefault(require("../../Platform/AdMg"));
var LocalStorageUtil_1 = __importDefault(require("../../Utils/LocalStorageUtil"));
var ConfigData_1 = require("../../Data/ConfigData");
var TipsUtil_1 = __importDefault(require("../../Utils/TipsUtil"));
var ShopDialog = /** @class */ (function (_super) {
    __extends(ShopDialog, _super);
    function ShopDialog() {
        var _this = _super.call(this) || this;
        _this.noSelIndex = -1;
        _this.selectIndex = 0; //选中的武器
        _this._getSkin = 0; //进来时选择的皮肤初始选择的皮肤
        return _this;
    }
    ShopDialog.prototype.initData = function () {
        PlatformMg_1.default.Instance.platform.hideLoading();
    };
    ShopDialog.prototype.findView = function () {
        this.boxList = this.owner.getChildByName('listBox');
        this.boxBtn = this.boxList.getChildByName('boxBtn');
        this.boxStart = this.boxList.getChildByName('boxStart');
        this.list = this.boxList.getChildByName('list');
        this.btnHome = this.owner.getChildByName('btnHome');
        this.boxTop = this.owner.getChildByName('boxTop');
        this.box3D = this.boxTop.getChildByName('box3D');
        //this.selSkin = this.boxTop.getChildByName('showBox').getChildByName('selSkin') as Laya.Image;
    };
    ShopDialog.prototype.initView = function () {
        this.btnHome.top = parseInt(PlatformMg_1.default.Instance.JLBtnInfo.top) + (parseInt(PlatformMg_1.default.Instance.JLBtnInfo.height) - this.btnHome.height) / 2;
        this.gunNameTxt.top = this.btnHome.top + this.btnHome.height;
        this.init();
    };
    ShopDialog.prototype.screenAdaptation = function () {
        if (WindowUtil_1.default.isIphoneX) {
            //this.boxTop.bottom = 1080;
            this.boxTop.top = 50;
            this.boxList.bottom = 155;
        }
        else {
            //this.boxTop.bottom = 1000;
            this.boxList.bottom = 50;
        }
    };
    /**播放动画 */
    ShopDialog.prototype.playAin = function (sp) {
        Laya.timer.frameLoop(1, this, function () {
            sp.transform.localRotationEulerY += 0.5;
            if (sp.transform.localRotationEulerY >= 360) {
                sp.transform.localRotationY = 0;
            }
        });
    };
    /**设置参数 */
    ShopDialog.prototype.setCs = function (num) {
        this.gunImg.skin = GameData_1.default.SkinData[num].imgBig;
        this.gunNameTxt.text = GameData_1.default.SkinData[num].showName;
        this.powerTxt.text = '' + GameData_1.default.SkinData[num].power * 10; //伤害
        this.clipTxt.text = '' + GameData_1.default.SkinData[num].clip; //弹夹
        this.clipTimeTxt.text = GameData_1.default.SkinData[num].clipTime / 1000 + 'S'; //换弹时间
    };
    ShopDialog.prototype.init = function () {
        this.dataList = GameData_1.default.SkinData;
        this.selectIndex = GameData_1.default.GetSkin;
        console.log('商城页面', this.boxList);
        this.setCs(GameData_1.default.GetSkin);
        this.onSetList();
    };
    //初始list表单
    ShopDialog.prototype.onSetList = function () {
        var list = this.list;
        list.vScrollBarSkin = '';
        list.selectEnable = true;
        list.array = this.dataList;
        list.refresh();
        list.renderHandler = new Laya.Handler(this, this.updateItem);
        list.mouseHandler = new Laya.Handler(this, this.onSelect);
    };
    ShopDialog.prototype.onClick = function (e) {
        var _this = this;
        e.stopPropagation();
        if (e.target.name.substring(0, 3) === 'btn') {
            SoundUtil_1.default.play('click');
        }
        switch (e.target.name) {
            case 'btn_home':
                // this.owner.close();
                // GameData.IsTcHome = true;
                // Laya.Dialog.open(ActivityUrls.Home_DIALOG);
                break;
            case 'btnStart':
                this.owner.close();
                GameMg_1.default.Instance.gameStart();
                break;
            case 'btnCoin':
                if (GameData_1.default.Coin >= PublicMg_1.default.Instance.getGoldCoin(this.bulbPrice.text)) {
                    GameData_1.default.Coin -= PublicMg_1.default.Instance.getGoldCoin(this.bulbPrice.text);
                    GameData_1.default.SkinData[this.noSelIndex].have = true;
                    //本地储存
                    LocalStorageUtil_1.default.setList(ConfigData_1.LocalStorageKey.SKINDATA, GameData_1.default.SkinData);
                    //初始化
                    GameData_1.default.GetSkin = this.noSelIndex;
                    LocalStorageUtil_1.default.setNumber(ConfigData_1.LocalStorageKey.GETSKIN, this.noSelIndex);
                    //this.noSelIndex = -1;
                    this.init();
                    this.boxStart.visible = true;
                    this.boxBtn.visible = false;
                }
                else {
                    TipsUtil_1.default.msg('余额不足！！！');
                }
                break;
            case 'btnVideo':
                AdMg_1.default.Instance.showVideo({
                    success: function () {
                        GameData_1.default.SkinData[_this.noSelIndex].num += 1;
                        //判断是否看视频次数足够
                        //本地储存
                        _this.dataList = GameData_1.default.SkinData;
                        _this.videoNum.text = _this.dataList[_this.noSelIndex].num + '/' + _this.dataList[_this.noSelIndex].video;
                        if (GameData_1.default.SkinData[_this.noSelIndex].num === GameData_1.default.SkinData[_this.noSelIndex].video || GameData_1.default.SkinData[_this.noSelIndex].num > GameData_1.default.SkinData[_this.noSelIndex].video) {
                            GameData_1.default.SkinData[_this.noSelIndex].have = true;
                            //Laya.LocalStorage.setJSON('skinData',GameData.SkinData);
                            //初始化
                            GameData_1.default.GetSkin = _this.noSelIndex;
                            LocalStorageUtil_1.default.setNumber(ConfigData_1.LocalStorageKey.GETSKIN, _this.noSelIndex);
                            //this.noSelIndex = -1;
                            _this.init();
                            _this.boxStart.visible = true;
                            _this.boxBtn.visible = false;
                        }
                        //本地储存
                        console.log('皮肤储存', GameData_1.default.SkinData);
                        LocalStorageUtil_1.default.setList(ConfigData_1.LocalStorageKey.SKINDATA, GameData_1.default.SkinData);
                    },
                    fail: function () {
                        TipsUtil_1.default.msg('观看完整视频才有奖励哦');
                    }
                });
                break;
            default:
                break;
        }
    };
    //设置列表里面images图片路径
    ShopDialog.prototype.updateItem = function (cell, index) {
        var pic = cell.getChildByName('m_pic');
        pic.skin = cell.dataSource.img;
        if (cell.dataSource.have) {
            cell.getChildByName('have').visible = true;
        }
        if (index === this.selectIndex) {
            cell.getChildByName('sel').visible = true;
        }
        else {
            cell.getChildByName('sel').visible = false;
        }
    };
    //选中当前
    ShopDialog.prototype.onSelect = function (e, index) {
        if (e.type == 'click') {
            //点击
            this.setCs(index);
            //this.setData(index);
            this.selectIndex = index;
            if (this.dataList[index].have) {
                //已经拥有
                GameData_1.default.GetSkin = index;
                LocalStorageUtil_1.default.setNumber(ConfigData_1.LocalStorageKey.GETSKIN, index);
                this.noSelIndex = -1;
                this.boxStart.visible = true;
                this.boxBtn.visible = false;
            }
            else {
                //未拥有
                this.noSelIndex = index;
                this.boxStart.visible = false;
                this.boxBtn.visible = true;
                this.bulbPrice.text = PublicMg_1.default.Instance.setGoldCoin(this.dataList[index].price);
                this.videoNum.text = this.dataList[index].num + '/' + this.dataList[index].video;
            }
        }
    };
    ShopDialog.prototype.onDisable = function () {
        _super.prototype.onDisable.call(this);
        // this.skinS3d.removeChildren();
        // this.skinS3d.destroy();//销毁场景
        // this.skinS3d = null;
    };
    return ShopDialog;
}(BaseDialogSc_1.default));
exports.default = ShopDialog;
