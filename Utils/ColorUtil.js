"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V4_2_V3 = exports.V3_2_V4 = exports.RGB_2_U3dColor = exports.colorStr_2_RGB = exports.colorStr_2_U3dColor = exports.setTrailColor = void 0;
var common_1 = require("./common");
exports.setTrailColor = function (trail) {
    trail.trailFilter.colorGradient["_rgbElements"] = [1, 1, 1, 1, 1, 1, 1, 1];
};
/**
 * 颜色字符串转颜色空间值
 * @param colorTx
 */
exports.colorStr_2_U3dColor = function (colorTx) {
    if (!colorTx) {
        throw Error("输入颜色值为空");
    }
    if (colorTx.length != 6) {
        throw Error("输入颜色值格式错误");
    }
    var color_v3 = new Laya.Vector3();
    var rgb = exports.colorStr_2_RGB(colorTx);
    color_v3 = exports.RGB_2_U3dColor(rgb);
    return color_v3;
};
/**
 * 颜色字符串转RGB
 * @param colorTx
 */
exports.colorStr_2_RGB = function (colorTx) {
    if (!colorTx) {
        throw Error("输入颜色值为空");
    }
    if (colorTx.length != 6) {
        throw Error("输入颜色值格式错误");
    }
    var rgb = {};
    var r = colorTx.substr(0, 2);
    var g = colorTx.substr(2, 2);
    var b = colorTx.substr(4, 2);
    rgb = { r: common_1.hex_to_ten(r), g: common_1.hex_to_ten(g), b: common_1.hex_to_ten(b) };
    return rgb;
};
/**
 * RGB转颜色空间值
 * @param rgb
 */
exports.RGB_2_U3dColor = function (rgb) {
    if (!rgb) {
        throw Error("输入RGB颜色值为空");
    }
    if (rgb.r == null || rgb.g == null || rgb.b == null) {
        throw Error("输入RGB颜色值格式不正确");
    }
    var num_r = Number((rgb.r / 255).toFixed(2));
    var num_g = Number((rgb.g / 255).toFixed(2));
    var num_b = Number((rgb.b / 255).toFixed(2));
    return new Laya.Vector3(num_r, num_g, num_b);
};
/**
 * 颜色空间值 Vector3 转 Vector4
 * @param v3
 */
exports.V3_2_V4 = function (v3) {
    if (!v3) {
        throw Error("输入Vector3颜色空间值为空");
    }
    return new Laya.Vector4(v3.x, v3.y, v3.z, 1);
};
/**
 * 颜色空间值 Vector4 转 Vector3
 * @param v4
 */
exports.V4_2_V3 = function (v4) {
    if (!v4) {
        throw Error("输入Vector4颜色空间值为空");
    }
    return new Laya.Vector3(v4.x, v4.y, v4.z);
};
