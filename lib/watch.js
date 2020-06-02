"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
/**
 * 监听ref做出回应
 */
function watch(callback, refs) {
    if (!utils_1.isFunction(callback)) {
        return void console.warn("\n        callback must be functions\n        ");
    }
    if (!refs || !refs.length) {
        return void console.warn("\n        refs must be Ref[]\n        ");
    }
    var handles = refs.map(function (ref) {
        return ref && ref.__v_change && ref.__v_change(function (newValue) {
            callback(newValue);
        });
    });
    /**
     * 移除监听
     */
    return function () {
        handles.forEach(function (handle) {
            handle && handle();
        });
    };
}
exports.watch = watch;
