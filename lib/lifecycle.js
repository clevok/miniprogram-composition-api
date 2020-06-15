"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var instance_1 = require("./instance");
/**
 * 返回的函数 this指向必须是 页面或组件
 * @param lifecycle
 * @param options
 * @return {function}
 */
function createLifecycleMethods(lifecycle, options) {
    var lifeMethod = typeof options === 'function'
        ? options
        : typeof options === 'undefined' ? undefined : options[lifecycle];
    return function () {
        var _this = this;
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        var injectLifes = this[utils_1.createShortName(lifecycle)] || [];
        if (lifeMethod) {
            injectLifes.push(lifeMethod);
        }
        // @ts-ignore
        return injectLifes.map(function (life) { return life && life.apply(_this, arg); });
    };
}
exports.createLifecycleMethods = createLifecycleMethods;
function createCurrentModuleHook(lifecycle) {
    return function (callback) {
        instance_1.overInCurrentModule(function (currentInstance) {
            injectHook(currentInstance, lifecycle, callback);
        });
    };
}
function injectHook(currentInstance, lifecycle, hook) {
    var hiddenField = utils_1.createShortName(lifecycle);
    if (currentInstance[hiddenField] === undefined) {
        currentInstance[hiddenField] = [];
    }
    currentInstance[hiddenField].push(hook);
}
/** 实例初始化 */
exports.onAttached = createCurrentModuleHook("attached" /* ATTACHED */);
/** 装载完成 */
exports.onReady = createCurrentModuleHook("ready" /* READY */);
/** 卸载 */
exports.onDetached = createCurrentModuleHook("detached" /* DETACHED */);
/** 页面加载 */
exports.onLoad = createCurrentModuleHook("onLoad" /* ON_LOAD */);
/** 页面显示 */
exports.onShow = createCurrentModuleHook("onShow" /* ON_SHOW */);
/** 页面隐藏 */
exports.onHide = createCurrentModuleHook("onHide" /* ON_HIDE */);
/** 页面卸载 */
exports.onUnload = createCurrentModuleHook("onUnload" /* ON_UNLOAD */);
/** 下拉刷新 */
exports.onPullDownRefresh = createCurrentModuleHook("onPullDownRefresh" /* ON_PULL_DOWN_REFRESH */);
/** 滚动到底部 */
exports.onReachBottom = createCurrentModuleHook("onReachBottom" /* ON_REACH_BOTTOM */);
/** 转发 */
exports.onShareAppMessage = createCurrentModuleHook("onShareAppMessage" /* ON_SHARE_APP_MESSAGE */);
/** 页面滚动 */
exports.onPageScroll = createCurrentModuleHook("onPageScroll" /* ON_PAGE_SCROLL */);
