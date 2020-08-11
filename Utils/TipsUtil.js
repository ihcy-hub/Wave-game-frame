"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
/**
 * 提示工具类
 */
var TipsUtil = /** @class */ (function () {
    //构造函数
    function TipsUtil() {
        //提示消息根容器
        this.root = null;
        this.LoadingBox = null;
        this.LoadingTimer = null;
        if (!this.root) {
            this.root = Laya.stage.addChild(new Laya.Sprite());
            this.root.zOrder = 1001;
        }
    }
    TipsUtil.Instance = function () {
        if (!TipsUtil.instance) {
            TipsUtil.instance = new TipsUtil();
        }
        return TipsUtil.instance;
    };
    //普通信息框 [静态方法]
    TipsUtil.alert = function (content, options, yes) {
        if (options === void 0) { options = {}; }
        if (yes === void 0) { yes = null; }
        TipsUtil.Instance().alert(content, options, yes);
    };
    //普通信息框
    TipsUtil.prototype.alert = function (content, options, yes) {
        if (options === void 0) { options = {}; }
        if (yes === void 0) { yes = null; }
    };
    //提示框 [静态方法]
    TipsUtil.msg = function (content, options, end) {
        if (options === void 0) { options = {}; }
        if (end === void 0) { end = null; }
        TipsUtil.Instance().msg(content, options, end);
    };
    //提示框
    TipsUtil.prototype.msg = function (content, options, end) {
        if (options === void 0) { options = { time: 1500 }; }
        if (end === void 0) { end = null; }
        var box = this.root.addChild(new Laya.Box());
        var bg = box.addChild(new Laya.Sprite());
        var txt = box.addChild(new Laya.Label());
        txt.text = content;
        txt.font = "SimHei";
        txt.color = "#ffffff";
        txt.padding = "15,15,15,15";
        txt.fontSize = 30;
        box.width = bg.width = txt.width;
        box.height = bg.height = txt.height;
        bg.graphics.drawPath(0, 0, common_1.roundRectPath(0, 0, txt.width, txt.height, 10), { fillStyle: "#000000" });
        bg.alpha = 0.5;
        box.x = (Laya.stage.width - box.width) / 2;
        box.y = (Laya.stage.height - box.height) / 2;
        setTimeout(function () {
            box.removeSelf();
            if (end)
                end();
        }, options.time || 1500);
    };
    //询问框 [静态方法]
    TipsUtil.confirm = function (content, options, yes, cancel) {
        if (options === void 0) { options = {}; }
        if (yes === void 0) { yes = null; }
        if (cancel === void 0) { cancel = null; }
        TipsUtil.Instance().confirm(content, options, yes, cancel);
    };
    //询问框
    TipsUtil.prototype.confirm = function (content, options, yes, cancel) {
        if (options === void 0) { options = {}; }
        if (yes === void 0) { yes = null; }
        if (cancel === void 0) { cancel = null; }
        var box = this.root.addChild(new Laya.Box());
        var imgBg = box.addChild(new Laya.Sprite());
        var txtContent = box.addChild(new Laya.Label());
        var txtTitle = box.addChild(new Laya.Label());
        var txtBtnCancel = box.addChild(new Laya.Label());
        var txtBtnYes = box.addChild(new Laya.Label());
        txtTitle.dataSource = txtBtnCancel.dataSource = txtBtnYes.dataSource = txtContent.dataSource = {
            padding: "20,20,20,20",
            font: "SimHei",
            fontSize: 30,
            width: Laya.stage.width * 0.6,
            color: "#000000",
            align: "center",
            x: 0,
            y: 0,
            text: "提示",
            overflow: "hidden",
        };
        txtContent.dataSource = {
            padding: "20,20,40,20",
            overflow: "",
            fontSize: 25,
            wordWrap: true,
            text: content,
            color: options.contentColor || "#5A5A5A",
            y: txtTitle.height,
        };
        txtBtnCancel.dataSource = {
            text: options.cancelText || '否',
            width: txtTitle.width / 2,
            y: txtTitle.height + txtContent.height,
        };
        txtBtnYes.dataSource = {
            text: options.yesText || '是',
            width: txtTitle.width / 2,
            color: "#169C24",
            y: txtTitle.height + txtContent.height,
            x: txtTitle.width / 2,
        };
        box.dataSource = {
            width: Laya.stage.width * 0.6,
            height: txtTitle.height + txtContent.height + txtBtnYes.height,
            x: Laya.stage.width * 0.2,
            y: (Laya.stage.height - txtTitle.height - txtContent.height - txtBtnYes.height) / 2,
        };
        imgBg.graphics.drawPath(0, 0, common_1.roundRectPath(0, 0, box.width, box.height, 10), { fillStyle: "#FFFFFF" });
        imgBg.graphics.drawLine(0, txtTitle.height + txtContent.height, box.width, txtTitle.height + txtContent.height, "#D2D2D2", 1);
        imgBg.graphics.drawLine(box.width / 2, txtTitle.height + txtContent.height, box.width / 2, box.height, "#D2D2D2", 1);
        txtBtnCancel.on(Laya.Event.CLICK, this, function (e) { box.removeSelf(); if (cancel)
            cancel(); });
        txtBtnYes.on(Laya.Event.CLICK, this, function (e) { box.removeSelf(); if (yes)
            yes(); });
    };
    //显示加载层 [静态方法]
    TipsUtil.showLoading = function () { TipsUtil.Instance().showLoading(); };
    //显示加载层 [静态方法]
    TipsUtil.hideLoading = function () { TipsUtil.Instance().hideLoading(); };
    //显示加载层
    TipsUtil.prototype.showLoading = function () {
        var _this = this;
        if (!this.LoadingBox) {
            var arr = [
                { x: Math.SQRT1_2, y: Math.SQRT1_2 }, { x: 0, y: 1 },
                { x: -Math.SQRT1_2, y: Math.SQRT1_2 }, { x: -1, y: 0 },
                { x: -Math.SQRT1_2, y: -Math.SQRT1_2 }, { x: 0, y: -1 },
                { x: Math.SQRT1_2, y: -Math.SQRT1_2 }, { x: 1, y: 0 },
            ];
            this.LoadingBox = this.root.addChild(new Laya.Box());
            this.LoadingBox.width = this.LoadingBox.height = 120;
            this.LoadingBox.anchorX = this.LoadingBox.anchorY = 0.5;
            this.LoadingBox.x = Laya.stage.width / 2;
            this.LoadingBox.y = Laya.stage.height / 2;
            for (var i = 0; i < 8; i++) {
                this.LoadingBox.graphics.drawCircle(arr[i].x * 60 + 60, arr[i].y * 60 + 60, 14 - i, "rgba(255,255,255," + (1 - 0.05 * i) + ")");
            }
        }
        this.LoadingBox.visible = true;
        this.LoadingTimer && clearInterval(this.LoadingTimer);
        this.LoadingTimer = setInterval(function () {
            _this.LoadingBox.rotation -= 2;
        }, 30);
    };
    //显示加载层
    TipsUtil.prototype.hideLoading = function () {
        this.LoadingTimer && clearInterval(this.LoadingTimer);
        this.LoadingBox.visible = false;
    };
    return TipsUtil;
}());
exports.default = TipsUtil;
