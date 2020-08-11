"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ColorUtil_1 = require("./ColorUtil");
/**材质工具 */
var MaterialUtil = /** @class */ (function () {
    function MaterialUtil() {
    }
    Object.defineProperty(MaterialUtil, "Instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new MaterialUtil();
            }
            return this._instance;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 更新模型材质贴图(不能更改特效材质)
     * @param sp 要更新的模型
     * @param src 填图地址
     */
    MaterialUtil.prototype.upDateTexture = function (sp, src) {
        //获取模型自带的材质
        var material = sp.meshRenderer.material;
        //漫反射贴图
        Laya.Texture2D.load(src, Laya.Handler.create(this, function (texture) {
            //设置材质纹理
            material.albedoTexture = texture;
        }));
    };
    /**
     * 更新材质MeshSprite3D
     * @param sp 要添加材质的精灵
     * @param src 贴图地址
     */
    MaterialUtil.prototype.upDateMaterial = function (sp, src) {
        //获取模型自带的材质
        var materialOld = sp.meshRenderer.material;
        //创建新的材质
        var material = new Laya.PBRStandardMaterial();
        material.smoothness = 0;
        //漫反射贴图
        Laya.Texture2D.load(src, Laya.Handler.create(this, function (texture) {
            //设置材质纹理
            material.albedoTexture = texture;
        }));
        sp.meshRenderer.material = material;
    };
    /**
     * 更新材质SkinnedMeshSprite3D
     * @param sp 要添加材质的精灵
     * @param src 贴图地址
     */
    MaterialUtil.prototype.upDateMaterial2 = function (sp, src) {
        //获取模型自带的材质
        var materialOld = sp.skinnedMeshRenderer.material;
        //创建新的材质
        var material = new Laya.PBRStandardMaterial();
        material.metallic = 0.2;
        material.smoothness = 0;
        //漫反射贴图
        Laya.Texture2D.load(src, Laya.Handler.create(this, function (texture) {
            //设置材质纹理
            material.albedoTexture = texture;
        }));
        sp.skinnedMeshRenderer.material = material;
    };
    /**
     * 更新受伤的材质
     * @param sp 要添加材质的精灵
     * @param src 贴图地址
     */
    MaterialUtil.prototype.upDateMaterialFeel = function (sp, src) {
        //获取模型自带的材质
        var materialOld = sp.meshRenderer.material;
        //创建新的材质
        var material = new Laya.UnlitMaterial();
        material.albedoColor = ColorUtil_1.V3_2_V4(ColorUtil_1.colorStr_2_U3dColor('FF0900'));
        material.albedoIntensity = 2.3;
        //漫反射贴图
        Laya.Texture2D.load(src, Laya.Handler.create(this, function (texture) {
            //设置材质纹理
            material.albedoTexture = texture;
        }));
        sp.meshRenderer.material = material;
    };
    return MaterialUtil;
}());
exports.default = MaterialUtil;
