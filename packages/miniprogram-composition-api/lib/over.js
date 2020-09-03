"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cloneDeep_1 = require("lodash/cloneDeep");
function overCloneDeep(callback) {
    // @ts-ignore
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return cloneDeep_1.default(callback.apply(this, args));
    };
}
exports.overCloneDeep = overCloneDeep;
