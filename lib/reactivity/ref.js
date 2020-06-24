"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isequal_1 = require("@jsmini/isequal");
var clone_1 = require("@jsmini/clone");
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
function createRef(_getValue) {
    _getValue = clone_1.clone(_getValue);
    var dep = new dep_1.Dep();
    var ref = Object.create(null);
    Object.defineProperties(ref, {
        value: {
            get: function () {
                return _getValue;
            },
            set: function () {
                console.error("\n                \u8BF7\u4E0D\u8981\u76F4\u63A5\u4FEE\u6539 ref.value \u503C\n            ");
            }
        },
        get: {
            value: function () {
                return _getValue;
            },
            configurable: false,
            writable: false,
            enumerable: false
        },
        set: {
            value: function (value) {
                var updateValue;
                if (utils_1.isFunction(value)) {
                    updateValue = value(clone_1.clone(_getValue));
                }
                else {
                    updateValue = value;
                }
                if (!isequal_1.isEqual(_getValue, updateValue)) {
                    dep.notify((_getValue = updateValue));
                }
            },
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
