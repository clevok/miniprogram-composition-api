"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lifecycle_1 = require("./lifecycle");
var instance_1 = require("./instance");
var isEqual = require('lodash/isEqual');
var cloneDeep = require('lodash/cloneDeep');
var RUN_HANDLES = [];
/**
 *
 * 创建单例共享空间, 用于实现单例依赖注入
 *
 * 和 export 定义区别在于, 这个示例是在执行期间被执行, 在页面都被销毁后才一起销毁, 只示例一次,
 * 支持传参数,如果传了参数,那么参数不同,将会渲染不同的实例!!!
 */
function useConstate(fun) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var findFunIndex = RUN_HANDLES.findIndex(function (handle) {
        return handle.fun === fun;
    });
    if (!~findFunIndex) {
        RUN_HANDLES.unshift({
            fun: fun,
            params: [],
        });
        findFunIndex = 0;
    }
    var findFunParamsIndex = RUN_HANDLES[findFunIndex].params.findIndex(function (_a) {
        var limit = _a.limit;
        return isEqual(limit, args);
    });
    if (!~findFunParamsIndex) {
        RUN_HANDLES[findFunIndex].params.unshift({
            limit: cloneDeep(args),
            done: initConstate(fun),
        });
        findFunParamsIndex = 0;
    }
    return RUN_HANDLES[findFunIndex].params[findFunParamsIndex].done(args);
}
exports.useConstate = useConstate;
function initConstate(callback) {
    var EMPTY_KEY = Symbol();
    var RUN_RESULT = EMPTY_KEY;
    var injectCurrentModules = [];
    return function (params) {
        instance_1.overInCurrentModule(function (currentInstance) {
            if (!currentInstance) {
                return;
            }
            injectCurrentModules.push(currentInstance);
            lifecycle_1.injectHook(currentInstance, "effect" /* EFFECT */, function () {
                var findIndex = injectCurrentModules.findIndex(function (mo) { return mo === currentInstance; });
                if (~findIndex) {
                    injectCurrentModules.splice(findIndex, 1);
                }
                if (injectCurrentModules.length === 0) {
                    RUN_RESULT = EMPTY_KEY;
                }
            });
        });
        if (RUN_RESULT !== EMPTY_KEY) {
            return RUN_RESULT;
        }
        RUN_RESULT = callback.apply(void 0, params);
        return RUN_RESULT;
    };
}
