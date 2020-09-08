"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var currentModule = null;
/**
 * 要求注入的函数第一个参数是 current对象
 * @param callback
 */
function overCurrentModule(callback) {
    return function () {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        currentModule = this;
        var reuslt = callback.apply(this, arg);
        currentModule = null;
        return reuslt;
    };
}
exports.overCurrentModule = overCurrentModule;
function overInCurrentModule(callback) {
    return callback(currentModule);
}
exports.overInCurrentModule = overInCurrentModule;
