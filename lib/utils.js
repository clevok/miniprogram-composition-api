"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArray = Array.isArray;
function getType(x) {
    return Object.prototype.toString.call(x).slice(8, -1);
}
exports.getType = getType;
function isObject(x) {
    return x !== null && typeof x === 'object';
}
exports.isObject = isObject;
function isFunction(x) {
    return typeof x === 'function';
}
exports.isFunction = isFunction;
function isPlainObject(x) {
    return x !== null && getType(x) === 'Object';
}
exports.isPlainObject = isPlainObject;
function wrapFun(afterFun, beforeFun) {
    return function () {
        try {
            beforeFun && beforeFun.apply(this, arguments);
        }
        finally {
            afterFun && afterFun.apply(this, arguments);
        }
    };
}
exports.wrapFun = wrapFun;
function createShortName(name) {
    return "__" + name + "__";
}
exports.createShortName = createShortName;
