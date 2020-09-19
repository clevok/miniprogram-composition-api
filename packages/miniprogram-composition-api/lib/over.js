"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clone_1 = require("@jsmini/clone");
function overCloneDeep(callback) {
    // @ts-ignore
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return clone_1.clone(callback.apply(this, args));
    };
}
exports.overCloneDeep = overCloneDeep;
