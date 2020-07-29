"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isFunction(x) {
    return typeof x === 'function';
}
exports.isFunction = isFunction;
function isObject(x) {
    return x !== null && typeof x === 'object';
}
exports.isObject = isObject;
