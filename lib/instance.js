"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
function getContext() { }
exports.getContext = getContext;
var currentModule = null;
/**
 * 要求注入的函数第一个参数是 current对象
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
function overInCurrentModule(callback) {
    if (currentModule) {
        callback(currentModule);
    }
    callback = null;
}
exports.overInCurrentModule = overInCurrentModule;
