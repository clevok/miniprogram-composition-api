"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ref_1 = require("./ref");
var utils_1 = require("./utils");
/**
 * 可观测对象
 * @param value
 */
function isObserve(value) {
    return ref_1.isRef(value);
}
exports.isObserve = isObserve;
/**
 * 监听ref做出回应
 * @return {function} 丢弃监听
 */
function useEffect(callback, refs) {
    if (!utils_1.isFunction(callback)) {
        return void console.warn("\n        useEffect callback must be functions\n        ");
    }
    if (!refs || !refs.length) {
        return void console.warn("\n        refs must be Ref[]\n        ");
    }
    var handles = refs.map(function (ref) {
        if (!isObserve(ref)) {
            return void console.warn("useEffect refs incloud cant Observe object");
        }
        return ref.__v_change(function (newValue) {
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
exports.useEffect = useEffect;
