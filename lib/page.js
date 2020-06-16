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
var context_1 = require("./context");
var shared_1 = require("./shared");
var instance_1 = require("./instance");
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
    options["onLoad" /* ON_LOAD */] = utils_1.wrapFuns(function (params) {
        var _this = this;
        instance_1.overCurrentModule(function () {
            var context = context_1.createContext(_this);
            var binds = setupFun.call(_this, params, context);
            if (binds instanceof Promise) {
                return console.error("\n                setup\u4E0D\u652F\u6301\u8FD4\u56DEpromise\n            ");
            }
            context.setData(binds);
        })(this);
    }, shared_1.createLifecycleMethods("onLoad" /* ON_LOAD */, options));
    options["onShow" /* ON_SHOW */] = shared_1.createLifecycleMethods("onShow" /* ON_SHOW */, options);
    options["onReady" /* ON_READY */] = shared_1.createLifecycleMethods("onReady" /* ON_READY */, options);
    options["onHide" /* ON_HIDE */] = shared_1.createLifecycleMethods("onHide" /* ON_HIDE */, options);
    options["onUnload" /* ON_UNLOAD */] = utils_1.wrapFuns(function () {
        lifecycle_1.conductHook(this, "effect" /* EFFECT */, []);
    }, shared_1.createLifecycleMethods("onUnload" /* ON_UNLOAD */, options));
    options["onPullDownRefresh" /* ON_PULL_DOWN_REFRESH */] = shared_1.createLifecycleMethods("onPullDownRefresh" /* ON_PULL_DOWN_REFRESH */, options);
    options["onReachBottom" /* ON_REACH_BOTTOM */] = shared_1.createLifecycleMethods("onReachBottom" /* ON_REACH_BOTTOM */, options);
    options["onPageScroll" /* ON_PAGE_SCROLL */] = shared_1.createLifecycleMethods("onPageScroll" /* ON_PAGE_SCROLL */, options);
    options["onShareAppMessage" /* ON_SHARE_APP_MESSAGE */] = (function () {
        var lifecycleMethod = shared_1.createLifecycleMethods("onShareAppMessage" /* ON_SHARE_APP_MESSAGE */, options);
        return function () {
            var runResults = lifecycleMethod();
            return runResults[runResults.length - 1];
        };
    })();
    return Page(options);
}
exports.definePage = definePage;
