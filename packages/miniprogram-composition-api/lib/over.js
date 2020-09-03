"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cloneDeep = require('lodash/cloneDeep');
function overCloneDeep(callback) {
    // @ts-ignore
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return cloneDeep(callback.apply(this, args));
    };
}
exports.overCloneDeep = overCloneDeep;
