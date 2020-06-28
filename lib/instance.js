"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var currentModule = null;
/**
 * 要求注入的函数第一个参数是 current对象
 * @param callback
 */
function overCurrentModule(callback) {
    return function (target) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        currentModule = target;
        var reuslt = callback.apply(target, arg);
        currentModule = null;
        return reuslt;
    };
}
exports.overCurrentModule = overCurrentModule;
function overInCurrentModule(callback) {
    return callback(currentModule);
}
exports.overInCurrentModule = overInCurrentModule;
