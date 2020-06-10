"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var lifecycle_1 = require("./lifecycle");
var shared_1 = require("./shared");
function definePage(optionsOrSetup) {
    /**
     * setup, 将在onLoad执行
     */
    var setupFun;
    /**
     * 构建componets基本参数
     */
    var options;
    if (utils_1.isFunction(optionsOrSetup)) {
        setupFun = optionsOrSetup;
        options = {};
    }
    else {
        if (optionsOrSetup.setup === void 0) {
            return Page(optionsOrSetup);
        }
        var setupOption = optionsOrSetup.setup, otherOptions = __rest(optionsOrSetup, ["setup"]);
        setupFun = setupOption;
        options = otherOptions;
    }
    /** setup 回调句柄, 用于清除监听 */
    var __setup_handle;
    options["onLoad" /* ON_LOAD */] = utils_1.wrapFuns(function (params) {
        __setup_handle = shared_1.setup(this, setupFun, params);
    }, lifecycle_1.createLifecycle("onLoad" /* ON_LOAD */, options));
    options["onShow" /* ON_SHOW */] = lifecycle_1.createLifecycle("onShow" /* ON_SHOW */, options);
    options["onReady" /* ON_READY */] = lifecycle_1.createLifecycle("onReady" /* ON_READY */, options);
    options["onHide" /* ON_HIDE */] = lifecycle_1.createLifecycle("onHide" /* ON_HIDE */, options);
    options["onUnload" /* ON_UNLOAD */] = utils_1.wrapFuns(function () {
        __setup_handle && __setup_handle();
    }, lifecycle_1.createLifecycle("onUnload" /* ON_UNLOAD */, options));
    options["onPullDownRefresh" /* ON_PULL_DOWN_REFRESH */] = lifecycle_1.createLifecycle("onPullDownRefresh" /* ON_PULL_DOWN_REFRESH */, options);
    options["onReachBottom" /* ON_REACH_BOTTOM */] = lifecycle_1.createLifecycle("onReachBottom" /* ON_REACH_BOTTOM */, options);
    options["onPageScroll" /* ON_PAGE_SCROLL */] = lifecycle_1.createLifecycle("onPageScroll" /* ON_PAGE_SCROLL */, options);
    options["onShareAppMessage" /* ON_SHARE_APP_MESSAGE */] = (function () {
        var lifecycleMethod = lifecycle_1.createLifecycle("onShareAppMessage" /* ON_SHARE_APP_MESSAGE */, options);
        return function () {
            var runResults = lifecycleMethod();
            return runResults[runResults.length - 1];
        };
    })();
    return Page(options);
}
exports.definePage = definePage;
