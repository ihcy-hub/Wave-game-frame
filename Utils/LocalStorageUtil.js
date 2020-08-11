"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ConfigData_1 = __importDefault(require("../Data/ConfigData"));
var LocalStorageUtil = /** @class */ (function () {
    function LocalStorageUtil() {
    }
    /**删除指定键名 */
    LocalStorageUtil.remove = function (key) {
        if (key == null || key == "") {
            console.error(this.name + "---> remove err : key undefind");
            return;
        }
        Laya.LocalStorage.removeItem(LocalStorageUtil.rootPath + key);
    };
    /**
     * 存储字符
     * @param key 键
     * @param value 值
     */
    LocalStorageUtil.setString = function (key, value) {
        if (value == null || key == null || key == "") {
            console.error(this.name + "---> setString err : key or value undefind");
            return;
        }
        Laya.LocalStorage.setItem(LocalStorageUtil.rootPath + key, value);
    };
    /**
     * 存储数值
     * @param key 键
     * @param value :值
     */
    LocalStorageUtil.setNumber = function (key, value) {
        if (value == null || key == null || key == "") {
            console.error(this.name + "---> setNumber err : key or value undefind");
            return;
        }
        Laya.LocalStorage.setItem(LocalStorageUtil.rootPath + key, String(value));
    };
    /**
     * 存储boolean值
     * @param key 键
     * @param value 值
     */
    LocalStorageUtil.setBoolean = function (key, value) {
        if (value == null || key == null || key == "") {
            console.error(this.name + "---> setBoolean err : key or value undefind");
            return;
        }
        Laya.LocalStorage.setItem(LocalStorageUtil.rootPath + key, value ? "1" : "0");
    };
    /**
     * 存储数组
     * @param key 键
     * @param value 值
     */
    LocalStorageUtil.setList = function (key, value) {
        if (value == null || key == null || key == "") {
            console.error(this.name + "---> setList err : key or value undefind");
            return;
        }
        Laya.LocalStorage.setJSON(LocalStorageUtil.rootPath + key, value);
    };
    // /**
    //  * 存储json
    //  * @param key 键
    //  */
    // public static setJson(key: string, value: any) {
    //     if (value == null || key == null || key == "") {
    //         console.error(this.name + "---> setJson err : key or value undefind");
    //         return null;
    //     }
    //     Laya.LocalStorage.setJSON(LocalStorageUtil.rootPath + key, value);
    // }
    /**
     *  取出存储的字符
     * @param key 键
     * @param def_value 默认值
     */
    LocalStorageUtil.getString = function (key, def_value) {
        if (key == null || key == "") {
            console.error(this.name + "---> getString err : key undefind");
            return null;
        }
        var string = Laya.LocalStorage.getItem(LocalStorageUtil.rootPath + key);
        if (string) {
            return string;
        }
        else {
            if (def_value) {
                return def_value;
            }
            else {
                return null;
            }
        }
    };
    /**
     * 取出数字
     * @param key 键
     * @param def_value 默认值
     */
    LocalStorageUtil.getNumber = function (key, def_value) {
        if (key == null || key == "") {
            console.error(this.name + "---> getNumber err : key undefind");
            return 0;
        }
        var val = Laya.LocalStorage.getItem(LocalStorageUtil.rootPath + key);
        if (!val || val == "") {
            if (def_value != null || def_value != undefined) {
                return def_value;
            }
            else {
                return 0;
            }
        }
        else {
            return Number(val);
        }
    };
    /**
   * 取出boolean值
   * @param key 键
   * @param def_value 默认值
   */
    LocalStorageUtil.getBoolean = function (key, def_value) {
        if (key == null || key == "") {
            console.error(this.name + "---> getBoolean err : key undefind");
            return false;
        }
        var val = Laya.LocalStorage.getItem(LocalStorageUtil.rootPath + key);
        if (!val || val == "") {
            if (def_value != null)
                return def_value;
            else
                return false;
        }
        else {
            return val == "1";
        }
    };
    /**
     * 取出数组
     * @param key 键
     * @param def_value 默认值
     */
    LocalStorageUtil.getList = function (key, def_value) {
        if (key == null || key == "") {
            console.error("getList err : key undefind");
            return null;
        }
        var list = Laya.LocalStorage.getJSON(LocalStorageUtil.rootPath + key);
        if (!list) {
            if (def_value) {
                return def_value;
            }
            else {
                return null;
            }
        }
        else {
            // console.log("取出数组：", list);
            return list;
        }
    };
    LocalStorageUtil.rootPath = ConfigData_1.default.GAME_NAME + "_";
    return LocalStorageUtil;
}());
exports.default = LocalStorageUtil;
