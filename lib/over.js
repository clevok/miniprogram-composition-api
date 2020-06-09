"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
function overCloneDeep(callback) {
    // @ts-ignore
    return function () {
        return lodash_1.cloneDeep(callback.apply(this, arguments));
    };
}
exports.overCloneDeep = overCloneDeep;
