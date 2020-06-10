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
function defineComponent(optionsOrSetup) {
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
            return Component(optionsOrSetup);
        }
        var setupOption = optionsOrSetup.setup, otherOptions = __rest(optionsOrSetup, ["setup"]);
        setupFun = setupOption;
        options = otherOptions;
    }
    /** setup 回调句柄, 用于清除监听 */
    var __setup_handle;
    /**
     * 通过合并方法的方式, 调用setup
     * 在attached里调用setup是因为props原因
     * 下一个版本将props转化为ref对象,进行监听
     */
    options["attached" /* ATTACHED */] = utils_1.wrapFuns(function () {
        __setup_handle = lifecycle_1.setup(this, setupFun, this.properties);
    }, createLifecycle("attached" /* ATTACHED */, options));
    options["ready" /* READY */] = createLifecycle("ready" /* READY */, options);
    options["detached" /* DETACHED */] = utils_1.wrapFuns(function () {
        __setup_handle && __setup_handle();
    }, createLifecycle("detached" /* DETACHED */, options));
    return Component(options);
}
exports.defineComponent = defineComponent;
/**
 *
 * 装饰原有声明周期, 执行被注入的 this对象内声明周期方法
 * @param lifecycle - 页面属性
 * @param options - 页面构造对象
 * @return {function} - 新方法, 用于指向所有的注入的声明周期以及原有方法
 */
function createLifecycle(lifecycle, options) {
    /** 保持原有的生命周期方法链接 */
    var lifeMethod = options[lifecycle];
    /**
     * this - 实例
     */
    return function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var injectLifes = this[utils_1.createShortName(lifecycle)] || [];
        if (lifeMethod) {
            injectLifes.push(lifeMethod);
        }
        return injectLifes.map(function (life) { return life && life.apply.apply(life, __spreadArrays([_this], args)); });
    };
}
exports.createLifecycle = createLifecycle;
