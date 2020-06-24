"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inject_1 = require("./reactivity/inject");
exports.pageQueryKey = Symbol();
exports.pageQuery = inject_1.useProvide(exports.pageQueryKey, {});
exports.router = {
    go: function (url) {
        wx.navigateTo({
            url: url
        });
    },
    back: function (delta) {
        if (delta === void 0) { delta = 1; }
        wx.navigateBack({
            delta: delta
        });
    }
};
