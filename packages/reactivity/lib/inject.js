"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dep_1 = require("./dep");
var provides = Object.create(null);
var dep = new dep_1.Dep();
/**
 * 注册
 * @param key
 * @param value
 */
function useProvide(key, value) {
    // TS doesn't allow symbol as index type
    provides[key] = value;
    dep.notify(key, value);
}
exports.useProvide = useProvide;
/**
 * 取消注册
 */
function useUnProvide(key) {
    delete provides[key];
}
exports.useUnProvide = useUnProvide;
function useInject(key, defaultValue) {
    if (key in provides) {
        // TS doesn't allow symbol as index type
        return provides[key];
    }
    if (arguments.length > 1) {
        return defaultValue;
    }
    /* istanbul ignore else */
    console.warn("injection \"" + String(key) + "\" not found.");
}
exports.useInject = useInject;
