"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isEqual = require('lodash/isEqual');
var cloneDeep = require('lodash/cloneDeep');
var dep_1 = require("./dep");
var utils_1 = require("./utils");
function isRef(r) {
    return r ? r.__v_isRef === true : false;
}
exports.isRef = isRef;
/**
 * @param {any} value - 初始值
 * ```js
const number = useRef(0)
number.set({
    name: 2
});
 *
 * ```
 */
function useRef(value) {
    return createRef(value);
}
exports.useRef = useRef;
function createRef(viewDate) {
    /** 视图层的数据,只有在set的时候才能被获取更改 */
    viewDate = cloneDeep(viewDate);
    /** 对外的数据,允许更改 */
    var outDate = cloneDeep(viewDate);
    var dep = new dep_1.Dep();
    var ref = Object.create(null);
    Object.defineProperties(ref, {
        value: {
            get: function () {
                return outDate;
            },
            set: function () {
                console.error("\n                \u8BF7\u4E0D\u8981\u76F4\u63A5\u4FEE\u6539 ref.value \u503C\n            ");
            }
        },
        get: {
            value: function () {
                return outDate;
            },
            configurable: false,
            writable: false,
            enumerable: false
        },
        set: {
            value: function (value, config) {
                if (config === void 0) { config = { notify: false }; }
                var updateValue;
                if (utils_1.isFunction(value)) {
                    updateValue = value(cloneDeep(outDate));
                }
                else {
                    updateValue = value;
                }
                if (config.notify || !isEqual(viewDate, updateValue)) {
                    var beforeViewDate = cloneDeep(viewDate);
                    viewDate = cloneDeep(updateValue);
                    outDate = cloneDeep(updateValue);
                    dep.notify(updateValue, beforeViewDate);
                }
            },
            configurable: false,
            writable: false,
            enumerable: false
        },
        toString: {
            value: function () { return String(viewDate); },
            configurable: false,
            writable: false,
            enumerable: false
        },
        __v_isRef: {
            value: true,
            configurable: false,
            writable: false,
            enumerable: false
        },
        __v_change: {
            value: function (callback) {
                return dep.depend(callback);
            },
            configurable: false,
            writable: false,
            enumerable: false
        },
        __v_clear: {
            value: function () {
                dep.clear();
            },
            configurable: false,
            writable: false,
            enumerable: false
        }
    });
    return ref;
}
