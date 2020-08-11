"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**动画工具类 */
var AnimUtil = /** @class */ (function () {
    function AnimUtil() {
    }
    Object.defineProperty(AnimUtil, "Instance", {
        /**单列 */
        get: function () {
            if (!this.instance) {
                this.instance = new AnimUtil();
            }
            return this.instance;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 动画状态
     * @param ani 动画
     * @param name 名字
     * @param stime 开始时间
     * @param etime 结束时间
     * @param isloop 是否循环播放
     */
    AnimUtil.prototype.animState = function (anim, name, stime, etime, isloop) {
        //创建一个动画动作状态
        var state = new Laya.AnimatorState();
        //设置动作状态的名称
        state.name = name;
        //设置动作状态播放的起始时间（起始时间与结束时间的设置为0-1的百分比数值）  要截取的时间点 / 动画的总时长
        state.clipStart = stime;
        //设置动作状态播放的结束时间
        state.clipEnd = etime;
        //得到默认动画赋值给Clip（getDefaultState默认动画为Unity中animation的数组顺序0下标的动画）
        state.clip = anim.getDefaultState().clip;
        //动画播放是否循环
        state.clip.islooping = isloop;
        return state;
    };
    return AnimUtil;
}());
exports.default = AnimUtil;
