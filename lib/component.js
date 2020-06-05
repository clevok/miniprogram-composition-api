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
var shared_1 = require("./shared");
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
    var __setup_handle;
    /**
     * 通过合并方法的方式, 调用setup
     * 在attached里调用setup是因为props原因
     * 下一个版本将props转化为ref对象,进行监听
     */
    options["attached" /* ATTACHED */] = utils_1.wrapFun(options["attached" /* ATTACHED */], lifecycle_1.overCurrentComponent(function () {
        __setup_handle = setup(this, setupFun, this.properties);
    }));
    options["detached" /* DETACHED */] = utils_1.wrapFun(options["detached" /* DETACHED */], function () {
        __setup_handle && __setup_handle();
    });
    return Component(options);
}
exports.defineComponent = defineComponent;
/**
 *
 * 绑定函数, 基于target对象绑定实例
 * @param target - 页面/组件 实例
 * @param callback - 执行方法
 * @param props - props内容
 * @return {function} - 停止内部所有依赖的监听
 */
function setup(target, callback, props) {
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
}
exports.setup = setup;
