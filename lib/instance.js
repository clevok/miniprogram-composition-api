"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.context = {};
/**
 * 执行期间的页面
 */
var currentModule = null;
function getCurrentInstance() {
    return currentModule;
}
exports.getCurrentInstance = getCurrentInstance;
/**
 * 接受第一个参数是 current对象
 * @param callback
 */
function overCurrentModule(callback) {
    // @ts-ignore
    return function (target) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        currentModule = target;
        var reuslt = callback.call.apply(callback, __spreadArrays([target, target], arg));
        currentModule = null;
        return reuslt;
    };
}
exports.overCurrentModule = overCurrentModule;
