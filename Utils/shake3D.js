"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**3D晃动屏幕管理类 */
var shake3D = /** @class */ (function () {
    function shake3D() {
        this._isShaking = false;
        this._startTime = 0;
        this._offsetPos = [0, 0];
        this.shank_I = 0;
        this._orgX = 0;
        this._orgY = 0;
    }
    /**返回一个单列 */
    shake3D.getInstace = function () {
        if (!this.instace) {
            this.instace = new shake3D();
        }
        return this.instace;
    };
    /**
     * 振动
     * @param intensity 振动频率(单位：毫秒)
     * @param duration 振动时间（单位：毫秒）
     * @param radius 振动半径
     *
     * @example
     * 振屏：Mgr.sceneMgr.sceneExt.jscene.camare.shake();
     */
    shake3D.prototype.exe = function (target, intensity, duration, radius) {
        if (this._isShaking) {
            return;
        }
        this._isShaking = true;
        this._startTime = Laya.timer.currTimer;
        this._offsetPos = [0, 0];
        this.shank_I = 0;
        this._target = target;
        this._orgX = target.transform.position.x;
        this._orgY = target.transform.position.y;
        Laya.timer.loop(intensity, this, this._pos, [duration, radius]);
    };
    /**清除振动 */
    shake3D.prototype.clear = function () {
        Laya.timer.clearAll(this);
    };
    shake3D.prototype._pos = function (duration, radius) {
        this._offsetPos[this.shank_I % 2] = (this._offsetPos[this.shank_I % 2] > 0) ? -radius : radius;
        this.shank_I++;
        console.log('晃动', this._offsetPos);
        this._target.transform.localPositionX += this._offsetPos[0];
        this._target.transform.localPositionY += this._offsetPos[1];
        if (Laya.timer.currTimer - this._startTime >= duration) {
            Laya.timer.clear(this, this._pos);
            this.shank_I = 0;
            this._isShaking = false;
            this._target.transform.position.x = this._orgX;
            this._target.transform.position.y = this._orgY;
            this._target = null;
        }
    };
    return shake3D;
}());
exports.default = shake3D;
