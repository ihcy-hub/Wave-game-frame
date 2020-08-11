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
var ConfigData_1 = __importDefault(require("../../Data/ConfigData"));
var WindowUtil_1 = __importDefault(require("../../Utils/WindowUtil"));
var GameData_1 = __importDefault(require("../../Game/GameMg/GameData"));
var BaseDialogSc_1 = __importDefault(require("../BaseDialogSc"));
var AdMg_1 = __importDefault(require("../../Platform/AdMg"));
var SoundUtil_1 = __importDefault(require("../../Utils/SoundUtil"));
var tryEndDialog = /** @class */ (function (_super) {
    __extends(tryEndDialog, _super);
    function tryEndDialog() {
        var _this = _super.call(this) || this;
        _this.skinNum = 1;
        _this.dataList = [];
        _this.setTime = null;
        return _this;
    }
    tryEndDialog.prototype.initData = function () {
    };
    tryEndDialog.prototype.findView = function () {
        this.checkVideo = this.owner.getChildByName('checkVideo');
        this._mask = this.owner.getChildByName('_mask');
        this.btn_close = this.owner.getChildByName('btn_close');
        this.box = this.owner.getChildByName('box');
        this.box3D = this.box.getChildByName('box3D');
        this.titleBox = this.owner.getChildByName('titleBox');
        this.btn_video = this.owner.getChildByName('btn_video');
    };
    tryEndDialog.prototype.initView = function () {
        //获取没有拥有的皮肤数据
        this.getData();
        // this.checkVideo.on(Laya.Event.CLICK,this,()=>{
        //     this.checkVideo.selected = !this.checkVideo.selected;
        //     if(this.checkVideo.selected){
        //         this.btn_close.text = '暂时使用'
        //     }else{
        //         this.btn_close.text = '暂不使用'
        //     }
        // }) 
        this.checkVideo.visible = false;
        this.btn_close.text = '暂不使用';
        //this.setData(this.skinNum);
    };
    tryEndDialog.prototype.screenAdaptation = function () {
        if (WindowUtil_1.default.isIphoneX) {
            this.btn_close.bottom = 339;
            this.box.bottom = 638;
            this.titleBox.bottom = 1242;
            this.btn_video.bottom = 408;
            this.checkVideo.bottom += 48;
        }
        else {
            this.box.bottom = 493;
            this.titleBox.bottom = 946;
        }
        this.onCasualClick();
    };
    /**播放动画 */
    tryEndDialog.prototype.playAin = function (sp) {
        Laya.timer.frameLoop(1, this, function () {
            sp.transform.localRotationEulerY += 0.5;
            if (sp.transform.localRotationEulerY >= 360) {
                sp.transform.localRotationY = 0;
            }
        });
    };
    /**误点 */
    tryEndDialog.prototype.onCasualClick = function () {
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
            this.checkVideo.selected = false;
            this.btn_close.text = '暂不使用';
        }
    };
    /**通关操作 */
    tryEndDialog.prototype.pass = function () {
    };
    /**失败操作 */
    tryEndDialog.prototype.fail = function () {
    };
    /**获取还没有获得的皮肤数据 */
    tryEndDialog.prototype.getData = function () {
        var _this = this;
        GameData_1.default.SkinData.forEach(function (item, index) {
            if (!item.have) {
                _this.dataList.push(item);
            }
            ;
        });
        var num = Math.floor(Math.random() * this.dataList.length);
        this.skinNum = this.dataList[num].id;
        this.setCs(this.skinNum);
    };
    /**设置参数 */
    tryEndDialog.prototype.setCs = function (num) {
        this.nameTxt.text = '- ' + GameData_1.default.SkinData[num].name + ' -';
        this.gunImg.skin = GameData_1.default.SkinData[num].imgBig;
        // this.shTxt.text = ''+GameData.SkinData[num].power; //伤害
        // this.djTxt.text = ''+GameData.SkinData[num].clip; //弹夹
        // this.lfTxt.text = ''+GameData.SkinData[num].lf; //稀有度
    };
    tryEndDialog.prototype.onClick = function (e) {
        var _this = this;
        e.stopPropagation();
        if (e.target.name.substring(0, 3) === 'btn') {
            SoundUtil_1.default.play('click');
        }
        switch (e.target.name) {
            case 'btn_video':
                AdMg_1.default.Instance.showVideo({
                    success: function () {
                        _this.owner.close();
                        GameData_1.default.GetSkin = _this.skinNum;
                        GameData_1.default.GetSkinSy = true;
                        _this.closeFun();
                    }
                });
                break;
            case 'btn_close':
                if (this.checkVideo.selected) {
                    this.closeFun();
                }
                else {
                    this.closeFun();
                }
                break;
            default:
                break;
        }
    };
    return tryEndDialog;
}(BaseDialogSc_1.default));
exports.default = tryEndDialog;
