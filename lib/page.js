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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var lifecycle_1 = require("./lifecycle");
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
    function createLifecycle(lifecycle) {
        var funs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            funs[_i - 1] = arguments[_i];
        }
        return utils_1.wrapFuns.apply(void 0, __spreadArrays(funs, [function () {
                lifecycle_1.runLifecycle(this, lifecycle);
            },
            options[lifecycle]]));
    }
    /** setup 回调句柄, 用于清除监听 */
    var __setup_handle;
    options["onLoad" /* ON_LOAD */] = createLifecycle("onLoad" /* ON_LOAD */, function () {
        __setup_handle = lifecycle_1.setup(this, setupFun, {});
    });
    options["onShow" /* ON_SHOW */] = createLifecycle("onShow" /* ON_SHOW */);
    options["onReady" /* ON_READY */] = createLifecycle("onReady" /* ON_READY */);
    options["onHide" /* ON_HIDE */] = createLifecycle("onHide" /* ON_HIDE */);
    options["onUnload" /* ON_UNLOAD */] = createLifecycle("onUnload" /* ON_UNLOAD */, function () {
        __setup_handle && __setup_handle();
    });
    options["onPullDownRefresh" /* ON_PULL_DOWN_REFRESH */] = createLifecycle("onPullDownRefresh" /* ON_PULL_DOWN_REFRESH */);
    options["onReachBottom" /* ON_REACH_BOTTOM */] = createLifecycle("onHide" /* ON_HIDE */);
    options["onPageScroll" /* ON_PAGE_SCROLL */] = createLifecycle("onPageScroll" /* ON_PAGE_SCROLL */);
    options["onShareAppMessage" /* ON_SHARE_APP_MESSAGE */] = function (params) {
        var life = utils_1.createShortName("onShareAppMessage" /* ON_SHARE_APP_MESSAGE */);
        if (this[life] && this[life].length) {
            if (utils_1.isFunction(this[life][0])) {
                return this[life][0].call(this, params);
            }
        }
        return utils_1.runFun.call(this, options["onShareAppMessage" /* ON_SHARE_APP_MESSAGE */], params);
    };
    return Page(options);
}
exports.definePage = definePage;
