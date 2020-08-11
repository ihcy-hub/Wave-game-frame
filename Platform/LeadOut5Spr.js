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
var WindowUtil_1 = __importDefault(require("../Utils/WindowUtil"));
var LeadOut5Spr = /** @class */ (function (_super) {
    __extends(LeadOut5Spr, _super);
    function LeadOut5Spr() {
        var _this = _super.call(this) || this;
        _this.load_id = 0;
        _this.type = 1;
        return _this;
    }
    LeadOut5Spr.prototype.onEnable = function () {
        var _this = this;
        this.owner.zOrder = 9999;
        if (!LeadOutMg_1.default.BannerList || LeadOutMg_1.default.BannerList == null || LeadOutMg_1.default.BannerList.length <= 0) {
            this.owner.visible = false;
            console.log("bannerlist=" + LeadOutMg_1.default.BannerList + " 隐藏广告位导出");
            return;
        }
        this.initSize();
        this.load_id = Math.floor(Math.random() * LeadOutMg_1.default.BannerList.length);
        this.owner.loadImage(LeadOutMg_1.default.BannerList[this.load_id].img);
        Laya.timer.loop(5000, this, function () {
            _this.load_id++;
            _this.load_id = _this.load_id % LeadOutMg_1.default.BannerList.length;
            _this.owner.loadImage(LeadOutMg_1.default.BannerList[_this.load_id].img);
        });
        this.owner.on(Laya.Event.CLICK, this, function () {
            if (Laya.Browser.onWeiXin) {
                //ServiceRequest.getInstace().exprot()
                LeadOutMg_1.default.leadOut(LeadOutMg_1.default.BannerList[_this.load_id]);
            }
        });
    };
    LeadOut5Spr.prototype.initSize = function () {
        if (this.type == 1) {
            this.owner.height = 234;
            this.owner.width = 750;
        }
        else {
            this.owner.height = 200;
            this.owner.width = 600;
        }
        this.owner.x = (Laya.stage.width - this.owner.width) / 2;
        this.owner.y = Laya.stage.height - this.owner.height;
        if (WindowUtil_1.default.isIphoneX) {
            this.owner.y -= 30;
        }
    };
    return LeadOut5Spr;
}(Laya.Script));
exports.default = LeadOut5Spr;
