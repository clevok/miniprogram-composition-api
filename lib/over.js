"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clone_1 = require("@jsmini/clone");
function overCloneDeep(callback) {
    // @ts-ignore
    return function () {
        return clone_1.clone(callback.apply(this, arguments));
    };
}
exports.overCloneDeep = overCloneDeep;
