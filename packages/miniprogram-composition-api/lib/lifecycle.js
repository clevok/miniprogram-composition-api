"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var instance_1 = require("./instance");
/**注入hooks */
function injectHook(currentInstance, lifecycle, hook) {
    var hiddenField = utils_1.createShortName(lifecycle);
    if (currentInstance[hiddenField] === undefined) {
        currentInstance[hiddenField] = [];
    }
    currentInstance[hiddenField].push(hook);
}
exports.injectHook = injectHook;
/**执行hooks */
function conductHook(currentInstance, lifecycle, params) {
    var hiddenField = utils_1.createShortName(lifecycle);
    var injectLifes = currentInstance[hiddenField] || [];
    return injectLifes.map(function (life) { return typeof life === 'function' && life.apply(currentInstance, params); });
}
exports.conductHook = conductHook;
function createCurrentModuleHook(lifecycle) {
    return function (callback) {
        instance_1.overInCurrentModule(function (currentInstance) {
            currentInstance && injectHook(currentInstance, lifecycle, callback);
        });
    };
}
/** 实例被加载, Page.onLoad, Components.attached */
exports.onLoad = createCurrentModuleHook("onLoad" /* ON_LOAD */);
/** 实例被销毁, Page.onUnLoad, Components.destory */
exports.onUnLoad = createCurrentModuleHook("onUnload" /* ON_UN_LOAD */);
/** 实例装载完成, Page.onReady, Components.ready */
exports.onReady = createCurrentModuleHook("onReady" /* ON_READY */);
/** 页面显示 */
exports.onShow = createCurrentModuleHook("onShow" /* ON_SHOW */);
/** 页面隐藏 */
exports.onHide = createCurrentModuleHook("onHide" /* ON_HIDE */);
/** 下拉刷新 */
exports.onPullDownRefresh = createCurrentModuleHook("onPullDownRefresh" /* ON_PULL_DOWN_REFRESH */);
/** 滚动到底部 */
exports.onReachBottom = createCurrentModuleHook("onReachBottom" /* ON_REACH_BOTTOM */);
/** 转发 */
exports.onShareAppMessage = createCurrentModuleHook("onShareAppMessage" /* ON_SHARE_APP_MESSAGE */);
/** 页面滚动 */
exports.onPageScroll = createCurrentModuleHook("onPageScroll" /* ON_PAGE_SCROLL */);
