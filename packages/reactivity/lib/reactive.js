"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
function isReactive(r) {
    return r ? r.__v_isReactive === true : false;
}
exports.isReactive = isReactive;
/**
 * 响应式对象
 * @param value
 */
function useReactive(value) {
    return createReactiveObject(value);
}
exports.useReactive = useReactive;
function createReactiveObject(value) {
    if (isReactive(value)) {
        return value;
    }
    if (!utils_1.isObject(value)) {
        console.warn("value cannot be made reactive: " + String(value) + ", please use the useRef");
        return value;
    }
}
