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
        return args.map(function (fun) {
            try {
                fun && fun.apply(_this, params);
            }
            catch (e) {
                console.error(e);
                /** ignore */
            }
        });
    };
}
exports.wrapFuns = wrapFuns;
function createShortName(name) {
    return "__" + name + "__";
}
exports.createShortName = createShortName;
