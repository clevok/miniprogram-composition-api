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
    /**
     * 通过合并方法的方式, 调用setup
     * 在attached里调用setup是因为props原因
     * 下一个版本将props转化为ref对象,进行监听
     */
    options["attached" /* ATTACHED */] = createLifecycle("attached" /* ATTACHED */, function () {
        __setup_handle = lifecycle_1.setup(this, setupFun, this.properties);
    });
    options["ready" /* READY */] = createLifecycle("ready" /* READY */);
    options["detached" /* DETACHED */] = createLifecycle("detached" /* DETACHED */, function () {
        __setup_handle && __setup_handle();
    });
    return Component(options);
}
exports.defineComponent = defineComponent;
