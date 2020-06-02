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
var shared_1 = require("./shared");
var lifecycle_1 = require("./lifecycle");
function definePage(optionsOrSetup) {
    /**
     * setup, 将在onLoad执行
     */
    var setup;
    /**
     * 构建componets基本参数
     */
    var options;
    if (utils_1.isFunction(optionsOrSetup)) {
        setup = optionsOrSetup;
        options = {};
    }
    else {
        if (optionsOrSetup.setup === void 0) {
            return Page(optionsOrSetup);
        }
        var setupOption = optionsOrSetup.setup, otherOptions = __rest(optionsOrSetup, ["setup"]);
        setup = setupOption;
        options = otherOptions;
    }
    options["onLoad" /* ON_LOAD */] = lifecycle_1.overCurrentPage(function (props) {
        var _this = this;
        var binding = setup.call(this, props);
        Object.keys(binding).forEach(function (key) {
            var _a;
            var value = binding[key];
            if (utils_1.isFunction(value)) {
                _this[key] = value;
                return;
            }
            _this.setData((_a = {},
                _a[key] = shared_1.deepToRaw(value),
                _a));
            shared_1.deepWatch(_this, key, value);
        });
    });
    return Page(options);
}
exports.definePage = definePage;
