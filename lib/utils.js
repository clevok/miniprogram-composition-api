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
function wrapFuns() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function () {
        var _this = this;
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        args.forEach(function (fun) {
            try {
                fun && fun.apply(_this, params);
            }
            catch (e) {
                /** ignore */
            }
        });
    };
}
exports.wrapFuns = wrapFuns;
function createShortName(name) {
    return "__lifecycle_" + name + "__";
}
exports.createShortName = createShortName;
function runFun(callback, params) {
    if (typeof callback === 'function') {
        callback.call(this, params);
    }
}
exports.runFun = runFun;
