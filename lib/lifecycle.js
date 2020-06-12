"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var instance_1 = require("./instance");
/**
 *
 * 装饰原有声明周期, 执行被注入的 this对象内声明周期方法
 * @param lifecycle - 页面属性
 * @param options - 页面构造对象
 * @return {function} - 新方法, 用于指向所有的注入的声明周期以及原有方法
 */
function createLifecycle(lifecycle, options) {
    /** 保持原有的生命周期方法链接 */
    var lifeMethod = options[lifecycle];
    /** this - 实例 */
    return function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var injectLifes = this[utils_1.createShortName(lifecycle)] || [];
        if (lifeMethod) {
            injectLifes.push(lifeMethod);
        }
        return injectLifes.map(function (life) { return life && life.apply.apply(life, __spreadArrays([_this], args)); });
    };
}
exports.createLifecycle = createLifecycle;
function injectLifecyle(target, lifecycle, callback) {
    var life = utils_1.createShortName(lifecycle);
    if (target[life] === void 0) {
        target[life] = [];
    }
    target[life].push(callback);
}
function createCurrentModuleLife(lifecycle) {
    return function (callback) {
        if (instance_1.getCurrentInstance()) {
            injectLifecyle(instance_1.getCurrentInstance(), lifecycle, callback);
        }
    };
}
/** 实例初始化 */
exports.attached = createCurrentModuleLife("attached" /* ATTACHED */);
/** 装载完成 */
exports.ready = createCurrentModuleLife("ready" /* READY */);
/** 卸载 */
exports.detached = createCurrentModuleLife("detached" /* DETACHED */);
/** 页面加载 */
exports.onLoad = createCurrentModuleLife("onLoad" /* ON_LOAD */);
/** 页面显示 */
exports.onShow = createCurrentModuleLife("onShow" /* ON_SHOW */);
/** 页面隐藏 */
exports.onHide = createCurrentModuleLife("onHide" /* ON_HIDE */);
/** 页面卸载 */
exports.onUnload = createCurrentModuleLife("onUnload" /* ON_UNLOAD */);
/** 下拉刷新 */
exports.onPullDownRefresh = createCurrentModuleLife("onPullDownRefresh" /* ON_PULL_DOWN_REFRESH */);
/** 滚动到底部 */
exports.onReachBottom = createCurrentModuleLife("onReachBottom" /* ON_REACH_BOTTOM */);
/** 转发 */
exports.onShareAppMessage = createCurrentModuleLife("onShareAppMessage" /* ON_SHARE_APP_MESSAGE */);
/** 页面滚动 */
exports.onPageScroll = createCurrentModuleLife("onPageScroll" /* ON_PAGE_SCROLL */);
