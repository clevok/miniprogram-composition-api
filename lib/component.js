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
var instance_1 = require("./instance");
var context_1 = require("./context");
var shared_1 = require("./shared");
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
    /**
     * TODO 下一个版本将props转化为ref对象,进行监听
     */
    options["attached" /* ATTACHED */] = utils_1.wrapFuns(function () {
        var _this = this;
        instance_1.overCurrentModule(function () {
            var context = context_1.createContext(_this);
            var binds = setupFun.call(_this, _this.properties, context);
            if (binds instanceof Promise) {
                return console.error("\n                setup\u8FD4\u56DE\u503C\u4E0D\u652F\u6301promise\n            ");
            }
            context.setData(binds);
        })(this);
    }, shared_1.createLifecycleMethods("attached" /* ATTACHED */, options));
    options["ready" /* READY */] = shared_1.createLifecycleMethods("ready" /* READY */, options);
    options["detached" /* DETACHED */] = utils_1.wrapFuns(function () {
        lifecycle_1.conductHook(this, "effect" /* EFFECT */, []);
    }, shared_1.createLifecycleMethods("detached" /* DETACHED */, options));
    options.methods["onLoad" /* ON_LOAD */] = shared_1.createLifecycleMethods("onLoad" /* ON_LOAD */, options["onLoad" /* ON_LOAD */]);
    options.methods["onShow" /* ON_SHOW */] = shared_1.createLifecycleMethods("onShow" /* ON_SHOW */, options["onShow" /* ON_SHOW */]);
    options.methods["onReady" /* ON_READY */] = shared_1.createLifecycleMethods("onReady" /* ON_READY */, options["onReady" /* ON_READY */]);
    options.methods["onHide" /* ON_HIDE */] = shared_1.createLifecycleMethods("onHide" /* ON_HIDE */, options["onHide" /* ON_HIDE */]);
    options.methods["onUnload" /* ON_UNLOAD */] = shared_1.createLifecycleMethods("onUnload" /* ON_UNLOAD */, options["onUnload" /* ON_UNLOAD */]);
    options.methods["onPullDownRefresh" /* ON_PULL_DOWN_REFRESH */] = shared_1.createLifecycleMethods("onPullDownRefresh" /* ON_PULL_DOWN_REFRESH */, options["onPullDownRefresh" /* ON_PULL_DOWN_REFRESH */]);
    options.methods["onReachBottom" /* ON_REACH_BOTTOM */] = shared_1.createLifecycleMethods("onReachBottom" /* ON_REACH_BOTTOM */, options["onReachBottom" /* ON_REACH_BOTTOM */]);
    options.methods["onPageScroll" /* ON_PAGE_SCROLL */] = shared_1.createLifecycleMethods("onPageScroll" /* ON_PAGE_SCROLL */, options["onPageScroll" /* ON_PAGE_SCROLL */]);
    options.methods["onShareAppMessage" /* ON_SHARE_APP_MESSAGE */] = (function () {
        var lifecycleMethod = shared_1.createLifecycleMethods("onShareAppMessage" /* ON_SHARE_APP_MESSAGE */, options["onShareAppMessage" /* ON_SHARE_APP_MESSAGE */]);
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
