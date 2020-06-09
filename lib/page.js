"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var lifecycle_1 = require("./lifecycle");
function definePage(optionsOrSetup) {
    /**
     * setup, 将在onLoad执行
     */
    var setupFun;
    /**
     * 构建componets基本参数
     */
    var options;
    if (utils_1.isFunction(optionsOrSetup)) {
        setupFun = optionsOrSetup;
        options = {};
    }
    else {
        if (optionsOrSetup.setup === void 0) {
            return Page(optionsOrSetup);
        }
        var setupOption = optionsOrSetup.setup, otherOptions = __rest(optionsOrSetup, ["setup"]);
        setupFun = setupOption;
        options = otherOptions;
    }
    /** setup 回调句柄, 用于清除监听 */
    var __setup_handle;
    options["onLoad" /* ON_LOAD */] = utils_1.wrapFun(options["onLoad" /* ON_LOAD */], function () {
        __setup_handle = lifecycle_1.setup(this, setupFun, {});
    });
    options["onUnload" /* ON_UNLOAD */] = utils_1.wrapFun(options["onUnload" /* ON_UNLOAD */], function () {
        __setup_handle && __setup_handle();
    });
    return Page(options);
}
exports.definePage = definePage;
