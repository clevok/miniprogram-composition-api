"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lifecycle_1 = require("./lifecycle");
var instance_1 = require("./instance");
/**
 *
 * 创建单例共享空间, 用于实现单例依赖注入, 第一阶段api,可能要废弃
 * 所有自定义组件/页面共享数据, 当被依赖的页面/组件都被销毁时,重新加载第一遍会被执行一次
 * 请在setup期间调用!!
 */
function createConstate(callback) {
    var FINISH = Symbol();
    var callbackResult = FINISH;
    var injectCurrentModules = [];
    return function () {
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
                    callbackResult = FINISH;
                }
            });
        });
        if (callbackResult !== FINISH) {
            return callbackResult;
        }
        callbackResult = callback();
        return callbackResult;
    };
}
exports.createConstate = createConstate;
