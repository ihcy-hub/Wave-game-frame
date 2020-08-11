"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexCharToDecimal = exports.hex_to_ten = exports.add3dTo2d = exports.formatDate = exports.roundRectPath = exports.isJsonStr = exports.array_uniq = void 0;
/*
* 推荐的方法
*
* 方法的实现代码相当酷炫，
* 实现思路：获取没重复的最右一值放入新数组。
* （检测到有重复值时终止当前循环同时进入顶层循环的下一轮判断）
*/
function array_uniq(array) {
    var temp = [];
    var index = [];
    var l = array.length;
    for (var i = 0; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
            if (array[i] === array[j]) {
                i++;
                j = i;
            }
        }
        temp.push(array[i]);
        index.push(i);
    }
    return temp;
}
exports.array_uniq = array_uniq;
/**
* 判断是否为json字符串
* @param {any} str
*/
exports.isJsonStr = function (str) {
    if (typeof str === "string") {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
            return false;
        }
    }
    else {
        return false;
    }
};
/**
 * 画圆角矩形路径
 * @param {number} x 起始点x坐标
 * @param {number} y 起始点y坐标
 * @param {number} w 宽度
 * @param {number} h 高度
 * @param {number} r 圆角
 */
exports.roundRectPath = function (x, y, w, h, r) {
    return [
        ["moveTo", x + r, 0],
        ["lineTo", x + w - r, 0],
        ["arcTo", x + w, y, x + w, y + r, r],
        ["lineTo", x + w, y + h - r],
        ["arcTo", x + w, y + h, x + w - r, y + h, r],
        ["lineTo", x + r, y + h],
        ["arcTo", x, y + h, x, y + h - r, r],
        ["lineTo", x, y + r],
        ["arcTo", x, y, x + r, y, r],
        ["closePath"]
    ];
};
/**
 * 格式化日期：yyyy-MM-dd
 * @param {Date} date
 */
exports.formatDate = function (date) {
    if (date === void 0) { date = null; }
    if (date === null)
        date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
};
/**
 * 添加3D物体到 2D场景
 * @param father 2D父容器
 * @param meshSpr 3D物体
 * @param x 2D场景中位置 x轴
 * @param y 2D场景中位置 y轴
 */
exports.add3dTo2d = function (father, meshSpr, x, y) {
    var scene = new Laya.Scene3D();
    scene.name = 'skinS3d';
    father.addChild(scene);
    var camera = new Laya.Camera(1, 1, 1000);
    scene.addChild(camera);
    camera.transform.rotate(new Laya.Vector3(-15, 0, 0), false, false);
    camera.orthographic = true;
    //正交投影垂直矩阵尺寸,镜头缩放
    camera.orthographicVerticalSize = 1;
    camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
    var directionLight = new Laya.DirectionLight();
    scene.addChild(directionLight);
    directionLight.intensity = 1;
    directionLight.color = new Laya.Vector3(1, 0.96, 0.84);
    directionLight.transform.rotate(new Laya.Vector3(-45, 0, 0));
    var pos = new Laya.Vector3(x, y, 0);
    var _translate = new Laya.Vector3(0, 0, 0);
    scene.addChild(meshSpr);
    //转换2D屏幕坐标系统到3D正交投影下的坐标系统
    camera.convertScreenCoordToOrthographicCoord(pos, _translate);
    meshSpr.transform.position = _translate;
    meshSpr.transform.rotationEuler = new Laya.Vector3(0, 45, 0);
};
/**
 * 16进制转10进制
 * @param hex
 */
exports.hex_to_ten = function (hex) {
    var decimalValue = 0;
    for (var i = 0; i < hex.length; i++) {
        var hexChar = hex.charAt(i);
        decimalValue = decimalValue * 16 + exports.hexCharToDecimal(hexChar);
    }
    // console.log(hex, "--->", decimalValue);
    return decimalValue;
};
/**
 * 字符转16进制
 * @param char
 */
exports.hexCharToDecimal = function (char) {
    var asc_a = "a".charCodeAt(0);
    var asc_f = "f".charCodeAt(0);
    var asc_A = "A".charCodeAt(0);
    var asc_F = "F".charCodeAt(0);
    var asc_0 = "0".charCodeAt(0);
    var asc_9 = "9".charCodeAt(0);
    var asc_char = char.charCodeAt(0);
    if (asc_char >= asc_a && asc_char <= asc_f) {
        return 10 + asc_char - asc_a;
    }
    else if (asc_char >= asc_A && asc_char <= asc_F) {
        return 10 + asc_char - asc_A;
    }
    else if (asc_char >= asc_0 && asc_char <= asc_9) {
        return asc_char - asc_0;
    }
    else {
        throw Error("转换时字符错误：" + char);
    }
};
