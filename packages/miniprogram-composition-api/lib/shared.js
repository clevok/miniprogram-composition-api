"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var miniprogram_reactivity_1 = require("miniprogram-reactivity");
var utils_1 = require("./utils");
var diff_1 = require("./diff");
var over_1 = require("./over");
var lifecycle_1 = require("./lifecycle");
var watch_1 = require("./watch");
/** 副作用, 如果是方法,返回null */
exports.deepToRaw = over_1.overCloneDeep(function (x) {
    if (utils_1.isFunction(x)) {
        return null;
    }
    if (miniprogram_reactivity_1.isRef(x)) {
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
    var deepEffects = [];
    (function observerEffects(x) {
        /**
         * isObserve必须是在最前面,因为会被isPlainObject解析
         */
        if (miniprogram_reactivity_1.isObserve(x)) {
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
 * 执行注册的生命周期
 */
function createLifecycleMethods(lifecycle, options) {
    var lifeMethod = typeof options === 'function'
        ? options
        : typeof options === 'undefined'
            ? undefined
            : options[lifecycle];
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var injectLifes = lifecycle_1.conductHook(this, lifecycle, args);
        if (lifeMethod) {
            injectLifes.push(lifeMethod.call(this, args));
        }
        return injectLifes;
    };
}
exports.createLifecycleMethods = createLifecycleMethods;
