"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ref_1 = require("./ref");
var watch_1 = require("./watch");
function deepToValue(x) {
    if (ref_1.isRef(x)) {
        return x.value;
    }
    return x;
}
exports.deepToValue = deepToValue;
/**
 * components 与 watch 中转
 */
function deepWatch(target, key, value) {
    if (!ref_1.isRef(value))
        return;
    watch_1.watch(function (newValue) {
        var _a;
        target.setData((_a = {},
            _a[key] = newValue,
            _a));
    }, [value]);
}
exports.deepWatch = deepWatch;
