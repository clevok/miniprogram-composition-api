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
var miniprogram_reactivity_1 = require("miniprogram-reactivity");
function defineComponent(componentOptions) {
    var setupFun;
    var options;
    if (utils_1.isFunction(componentOptions)) {
        setupFun = componentOptions;
        options = {};
    }
    else {
        componentOptions.properties =
            componentOptions.props || componentOptions.properties || {};
        if (componentOptions.setup === void 0) {
            return Component(componentOptions);
        }
        var setupOption = componentOptions.setup, otherOptions = __rest(componentOptions, ["setup"]);
        setupFun = setupOption;
        options = otherOptions;
    }
    options.properties &&
        Object.keys(options.properties).forEach(function (KEY) {
            var prop = options.properties[KEY];
            var proxy_prop;
            if (typeof prop === 'function' || prop === null) {
                proxy_prop = {
                    type: prop,
                    value: null,
                };
            }
            else {
                proxy_prop = prop;
            }
            proxy_prop.observer = function (newValue) {
                var sortName = "__watchProperty__" /* WATCH_PROPERTY */;
                this[sortName] &&
                    this[sortName][KEY] &&
                    this[sortName][KEY](newValue);
            };
            options.properties[KEY] = proxy_prop;
        });
    function createProxyProperty() {
        var _this = this;
        var proxy = {};
        options.properties &&
            Object.keys(options.properties).forEach(function (KEY) {
                proxy[KEY] = miniprogram_reactivity_1.useRef(_this.properties[KEY]);
                if (!_this["__watchProperty__" /* WATCH_PROPERTY */]) {
                    _this["__watchProperty__" /* WATCH_PROPERTY */] = {};
                }
                _this["__watchProperty__" /* WATCH_PROPERTY */][KEY] = function (value) {
                    proxy[KEY].set(value);
                };
            });
        return proxy;
    }
    options.methods = options.methods || {};
    /** 绑定上下文 */
    options.methods['$'] = function (_a) {
        var detail = _a.detail;
        detail["__parent__" /* PARENT */] = this;
    };
    /**
     *
     * TODO 下一个版本将props转化为ref对象,进行监听
     */
    options["attached" /* ATTACHED */] = instance_1.overCurrentModule(utils_1.wrapFuns(function () {
        this.triggerEvent('component', this);
    }, function () {
        var context = context_1.createContext(this);
        var props = createProxyProperty.call(this);
        var binds = setupFun.call(this, props, context);
        if (binds instanceof Promise) {
            return console.error("\n                setup\u8FD4\u56DE\u503C\u4E0D\u652F\u6301promise\n            ");
        }
        var calcKeys = Object.keys(binds).filter(function (val) {
            return Object.keys(props).indexOf(val) > -1;
        });
        if (calcKeys.length) {
            console.error("\u6CE8\u610F!" + calcKeys + "\u5DF2\u5B58\u5728props\u4E2D,setup\u671F\u95F4\u8FD4\u56DE\u540C\u540D\u5C5E\u6027,\u5C06\u4F1A\u89E6\u53D1props\u503C\u6539\u53D8");
        }
        context.setData(binds);
    }, shared_1.createLifecycleMethods("onLoad" /* ON_LOAD */, options["attached" /* ATTACHED */])));
    options["ready" /* READY */] = shared_1.createLifecycleMethods("onReady" /* ON_READY */, options["ready" /* READY */]);
    options["detached" /* DETACHED */] = utils_1.wrapFuns(function () {
        lifecycle_1.conductHook(this, "effect" /* EFFECT */, []);
    }, shared_1.createLifecycleMethods("onUnload" /* ON_UN_LOAD */, options["detached" /* DETACHED */]));
    options.methods["onShow" /* ON_SHOW */] = shared_1.createLifecycleMethods("onShow" /* ON_SHOW */, options["onShow" /* ON_SHOW */]);
    options.methods["onHide" /* ON_HIDE */] = shared_1.createLifecycleMethods("onHide" /* ON_HIDE */, options["onHide" /* ON_HIDE */]);
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
