"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("./shared");
var utils_1 = require("./utils");
/**
 * 执行期间的页面
 */
var currentModule = null;
/**
 * 接受第一个参数是 current对象
 * @param callback
 */
function overCurrentModule(callback) {
    // @ts-ignore
    return function (target) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        currentModule = target;
        var reuslt = callback.call.apply(callback, __spreadArrays([target, target], arg));
        currentModule = null;
        return reuslt;
    };
}
exports.overCurrentModule = overCurrentModule;
/**
 *
 * 绑定函数, 基于target对象绑定实例
 * @param target - 页面/组件 实例
 * @param callback - 执行方法
 * @param props - props内容
 * @return {function} - 停止内部所有依赖的监听
 */
exports.setup = overCurrentModule(function (target, callback, props) {
    if (props === void 0) { props = {}; }
    var binding = callback.call(target, props);
    var stopHandels = Object.keys(binding).map(function (key) {
        var _a;
        var value = binding[key];
        if (utils_1.isFunction(value)) {
            target[key] = value;
            return;
        }
        target.setData((_a = {},
            _a[key] = shared_1.deepToRaw(value),
            _a));
        return shared_1.deepWatch(target, key, value);
    });
    return function () {
        stopHandels.forEach(function (stopHandle) {
            stopHandle && stopHandle();
        });
    };
});
function injectLifecyle(target, lifecycle, callback) {
    var life = utils_1.createShortName(lifecycle);
    if (target[life] === void 0) {
        target[life] = [];
    }
    target[life].push(callback);
}
function runLifecycle(target, lifecycle) {
    var life = utils_1.createShortName(lifecycle);
    target[life] &&
        target[life].forEach(function (fun) {
            utils_1.runFun.call(target, fun);
        });
}
exports.runLifecycle = runLifecycle;
function createCurrentModuleLife(lifecycle) {
    return function (callback) {
        if (currentModule) {
            injectLifecyle(currentModule, lifecycle, callback);
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
