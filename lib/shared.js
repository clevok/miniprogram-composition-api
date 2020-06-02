"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ref_1 = require("./ref");
var watch_1 = require("./watch");
var utils_1 = require("./utils");
var diff_1 = require("./diff");
function deepToRaw(x) {
    if (ref_1.isRef(x)) {
        return x.value;
    }
    if (utils_1.isArray(x)) {
        return x.map(function (item) { return deepToRaw(item); });
    }
    if (utils_1.isPlainObject(x)) {
        var obj_1 = {};
        Object.keys(x).forEach(function (key) {
            obj_1[key] = deepToRaw(x[key]);
        });
        return obj_1;
    }
    return x;
}
exports.deepToRaw = deepToRaw;
/**
 * Page/Component 与 watch 中转
 */
function deepWatch(target, key, value) {
    var _this = this;
    var deepEffects = [];
    (function observerEffects(x) {
        /**
         * isObserve必须是在最前面
         */
        if (watch_1.isObserve(x)) {
            return void deepEffects.push(x);
        }
        if (utils_1.isArray(x)) {
            return void x.map(function (item) { return observerEffects(item); });
        }
        if (utils_1.isPlainObject(x)) {
            return void Object.keys(x).forEach(function (key) {
                observerEffects(x[key]);
            });
        }
    })(value);
    if (!deepEffects.length) {
        return;
    }
    return watch_1.useEffect(function () {
        var _a, _b;
        target.setData(diff_1.diff((_a = {},
            _a[key] = deepToRaw(value),
            _a), (_b = {},
            _b[key] = _this.data[key],
            _b)));
    }, deepEffects);
}
exports.deepWatch = deepWatch;
