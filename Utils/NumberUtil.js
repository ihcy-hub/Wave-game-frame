"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NumberUtil = /** @class */ (function () {
    function NumberUtil() {
    }
    /**
     * 保留小数
     * @param value 初始值
     * @param decimalNum 保留的小数位
     * @param isRounding 是否四舍五入
     */
    NumberUtil.keepDecimal = function (value, decimalNum, isRounding) {
        if (isRounding === void 0) { isRounding = true; }
        var res;
        if (isRounding) {
            res = value.toFixed(decimalNum);
        }
        else {
            res = value.toFixed(decimalNum + 1).slice(0, -1);
        }
        return Number(res);
    };
    return NumberUtil;
}());
exports.default = NumberUtil;
