"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lifecycle_1 = require("./lifecycle");
var instance_1 = require("./instance");
var clone_1 = require("@jsmini/clone");
var isequal_1 = require("@jsmini/isequal");
/**
 *
 * 存在期间的 单一实例
 * 所有自定义组件/页面共享数据, 当被依赖的页面/组件都被销毁时,重新加载第一遍会被执行一次
 * 请在setup期间调用!!
 */
function createConstate(callback) {
    function useConstate() {
        var EMPYT_KEY = Symbol();
        var CACHE = EMPYT_KEY;
        var injectCurrentModules = [];
        return function (args) {
            instance_1.overInCurrentModule(function (currentInstance) {
                if (!currentInstance) {
                    return;
                }
                injectCurrentModules.unshift(currentInstance);
                lifecycle_1.injectHook(currentInstance, "effect" /* EFFECT */, function () {
                    var findIndex = injectCurrentModules.findIndex(function (mo) { return mo === currentInstance; });
                    if (~findIndex) {
                        injectCurrentModules.splice(findIndex, 1);
                    }
                    if (injectCurrentModules.length === 0) {
                        CACHE = EMPYT_KEY;
                    }
                });
            });
            if (CACHE !== EMPYT_KEY) {
                return CACHE;
            }
            CACHE = callback.apply(void 0, args);
            return CACHE;
        };
    }
    var CACHE_PARAMS = [];
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var findIndex = CACHE_PARAMS.findIndex(function (_a) {
            var params = _a.params;
            return isequal_1.isEqual(params, args);
        });
        if (!~findIndex) {
            CACHE_PARAMS.unshift({
                params: clone_1.clone(args),
                constate: useConstate(),
            });
            findIndex = 0;
        }
        return CACHE_PARAMS[findIndex].constate(args);
    };
}
exports.createConstate = createConstate;
