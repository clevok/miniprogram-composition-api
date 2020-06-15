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
var context_1 = require("./context");
function defineComponent(componentOptions) {
    var setupFun;
    var options;
    if (utils_1.isFunction(componentOptions)) {
        setupFun = componentOptions;
        options = {};
    }
    else {
        if (componentOptions.setup === void 0) {
            return Component(componentOptions);
        }
        var setupOption = componentOptions.setup, otherOptions = __rest(componentOptions, ["setup"]);
        setupFun = setupOption;
        options = otherOptions;
    }
    options.methods = options.methods || {};
    var __setup_handle;
    /**
     * TODO 下一个版本将props转化为ref对象,进行监听
     */
    options["attached" /* ATTACHED */] = utils_1.wrapFuns(function () {
        __setup_handle = shared_1.setup(this, setupFun, this.properties, context_1.createContext(this));
    }, lifecycle_1.createLifecycleMethods("attached" /* ATTACHED */, options));
    options["ready" /* READY */] = lifecycle_1.createLifecycleMethods("ready" /* READY */, options);
    options["detached" /* DETACHED */] = utils_1.wrapFuns(function () {
        __setup_handle && __setup_handle();
    }, lifecycle_1.createLifecycleMethods("detached" /* DETACHED */, options));
    options.methods["onLoad" /* ON_LOAD */] = lifecycle_1.createLifecycleMethods("onLoad" /* ON_LOAD */, options["onLoad" /* ON_LOAD */]);
    options.methods["onShow" /* ON_SHOW */] = lifecycle_1.createLifecycleMethods("onShow" /* ON_SHOW */, options["onShow" /* ON_SHOW */]);
    options.methods["onReady" /* ON_READY */] = lifecycle_1.createLifecycleMethods("onReady" /* ON_READY */, options["onReady" /* ON_READY */]);
    options.methods["onHide" /* ON_HIDE */] = lifecycle_1.createLifecycleMethods("onHide" /* ON_HIDE */, options["onHide" /* ON_HIDE */]);
    options.methods["onUnload" /* ON_UNLOAD */] = lifecycle_1.createLifecycleMethods("onUnload" /* ON_UNLOAD */, options["onUnload" /* ON_UNLOAD */]);
    options.methods["onPullDownRefresh" /* ON_PULL_DOWN_REFRESH */] = lifecycle_1.createLifecycleMethods("onPullDownRefresh" /* ON_PULL_DOWN_REFRESH */, options["onPullDownRefresh" /* ON_PULL_DOWN_REFRESH */]);
    options.methods["onReachBottom" /* ON_REACH_BOTTOM */] = lifecycle_1.createLifecycleMethods("onReachBottom" /* ON_REACH_BOTTOM */, options["onReachBottom" /* ON_REACH_BOTTOM */]);
    options.methods["onPageScroll" /* ON_PAGE_SCROLL */] = lifecycle_1.createLifecycleMethods("onPageScroll" /* ON_PAGE_SCROLL */, options["onPageScroll" /* ON_PAGE_SCROLL */]);
    options.methods["onShareAppMessage" /* ON_SHARE_APP_MESSAGE */] = (function () {
        var lifecycleMethod = lifecycle_1.createLifecycleMethods("onShareAppMessage" /* ON_SHARE_APP_MESSAGE */, options["onShareAppMessage" /* ON_SHARE_APP_MESSAGE */]);
        return function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var runResults = lifecycleMethod.apply(this, params);
            return runResults[runResults.length - 1];
        };
    })();
    return Component(options);
}
exports.defineComponent = defineComponent;
