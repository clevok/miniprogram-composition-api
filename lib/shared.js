"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ref_1 = require("./ref");
var watch_1 = require("./watch");
var utils_1 = require("./utils");
var diff_1 = require("./diff");
var over_1 = require("./over");
var instance_1 = require("./instance");
exports.deepToRaw = over_1.overCloneDeep(function (x) {
    if (ref_1.isRef(x)) {
        return x.value;
    }
    if (utils_1.isArray(x)) {
        return x.map(function (item) { return exports.deepToRaw(item); });
    }
    if (utils_1.isPlainObject(x)) {
        var obj_1 = {};
        Object.keys(x).forEach(function (key) {
            obj_1[key] = exports.deepToRaw(x[key]);
        });
        return obj_1;
    }
    return x;
});
/**
 * Page/Component 与 watch 中转
 * @return {function} 抛弃监听
 */
function deepWatch(target, key, value) {
    /**
     * 提取可被响应的数据
     */
    var deepEffects = [];
    (function observerEffects(x) {
        /**
         * isObserve必须是在最前面,因为会被isPlainObject解析
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
            _a[key] = exports.deepToRaw(value),
            _a), (_b = {},
            _b[key] = target.data[key],
            _b)));
    }, deepEffects);
}
exports.deepWatch = deepWatch;
/**
 *
 * 绑定函数, 基于target对象绑定实例
 * @param target - 页面/组件 实例
 * @param callback - 执行方法
 * @param props - props内容
 * @return {function} - 停止内部所有依赖的监听
 */
exports.setup = instance_1.overCurrentModule(function (target, callback, props) {
    if (props === void 0) { props = {}; }
    var binding = callback.call(target, props);
    var stopHandels = Object.keys(binding).map(function (key) {
        var _a;
        var value = binding[key];
        if (utils_1.isFunction(value)) {
            target[key] = value;
            return;
        }
        target.setData((_a = {},
            _a[key] = exports.deepToRaw(value),
            _a));
        return deepWatch(target, key, value);
    });
    return function () {
        stopHandels.forEach(function (stopHandle) {
            stopHandle && stopHandle();
        });
    };
});
