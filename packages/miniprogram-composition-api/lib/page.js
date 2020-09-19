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
var context_1 = require("./context");
var shared_1 = require("./shared");
var instance_1 = require("./instance");
var inject_1 = require("./inject");
function definePage(pageOptions) {
    var setupFun;
    var options;
    if (utils_1.isFunction(pageOptions)) {
        setupFun = pageOptions;
        options = {};
    }
    else {
        if (pageOptions.setup === void 0) {
            return Page(pageOptions);
        }
        var setupOption = pageOptions.setup, otherOptions = __rest(pageOptions, ["setup"]);
        setupFun = setupOption;
        options = otherOptions;
    }
    /** 绑定上下文 */
    options['$'] = function (_a) {
        var detail = _a.detail;
        detail["__parent__" /* PARENT */] = this;
    };
    options["onLoad" /* ON_LOAD */] = instance_1.overCurrentModule(utils_1.wrapFuns(function () {
        typeof this.triggerEvent === 'function' &&
            this.triggerEvent('component', this);
    }, function (params) {
        var context = context_1.createContext(this);
        var inject = shared_1.createDI(options.inject, inject_1.useInject);
        var provide = shared_1.createDI(options.provide, inject_1.useProvide);
        var binds = setupFun.call(this, params, Object.assign(context, { inject: inject, provide: provide }));
        if (binds instanceof Promise) {
            return console.error("\n                setup\u4E0D\u652F\u6301\u8FD4\u56DEpromise\n            ");
        }
        context.setData(binds);
    }, shared_1.createLifecycleMethods("onLoad" /* ON_LOAD */, options["onLoad" /* ON_LOAD */])));
    options["onReady" /* ON_READY */] = shared_1.createLifecycleMethods("onReady" /* ON_READY */, options["onReady" /* ON_READY */]);
    options["onUnload" /* ON_UNLOAD */] = utils_1.wrapFuns(function () {
        lifecycle_1.conductHook(this, "effect" /* EFFECT */, []);
    }, shared_1.createLifecycleMethods("onUnload" /* ON_UN_LOAD */, options["onUnload" /* ON_UNLOAD */]));
    options["onShow" /* ON_SHOW */] = shared_1.createLifecycleMethods("onShow" /* ON_SHOW */, options);
    options["onHide" /* ON_HIDE */] = shared_1.createLifecycleMethods("onHide" /* ON_HIDE */, options);
    options["onResize" /* ON_RESIZE */] = shared_1.createLifecycleMethods("onResize" /* ON_RESIZE */, options);
    options["onTabItemTap" /* ON_TAB_ITEM_TAP */] = shared_1.createLifecycleMethods("onTabItemTap" /* ON_TAB_ITEM_TAP */, options);
    options["onPullDownRefresh" /* ON_PULL_DOWN_REFRESH */] = shared_1.createLifecycleMethods("onPullDownRefresh" /* ON_PULL_DOWN_REFRESH */, options);
    options["onReachBottom" /* ON_REACH_BOTTOM */] = shared_1.createLifecycleMethods("onReachBottom" /* ON_REACH_BOTTOM */, options);
    options["onPageScroll" /* ON_PAGE_SCROLL */] = shared_1.createLifecycleMethods("onPageScroll" /* ON_PAGE_SCROLL */, options);
    options["onShareAppMessage" /* ON_SHARE_APP_MESSAGE */] = (function () {
        var lifecycleMethod = shared_1.createLifecycleMethods("onShareAppMessage" /* ON_SHARE_APP_MESSAGE */, options);
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var runResults = lifecycleMethod.apply.apply(lifecycleMethod, __spreadArrays([this], args));
            return runResults[runResults.length - 1];
        };
    })();
    return Page(options);
}
exports.definePage = definePage;
