"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var routerParams = {
    store: {},
    take: function (key) {
        var value = this.store[key] || {};
        this.store[key] = null;
        return value;
    },
    set: function (key, value) {
        this.store[key] = value;
    }
};
exports.router = {
    go: function (url, params) {
        if (params === void 0) { params = {}; }
        wx.navigateTo({
            url: url
        });
    },
    /**
     * 后退页面
     * @param target - 接受number或者页面对象, 表示将退出直到显示该页面
     */
    back: function (target) {
        if (target === void 0) { target = 1; }
        var delta = typeof target === 'number' ? target : 1;
        wx.navigateBack({
            delta: delta
        });
    },
    /**
     * 离开页面
     * @param target - 往后退,直到离开这个页面
     */
    leave: function (target) { }
};
