"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var dep_1 = require("./dep");
var utils_1 = require("./utils");
function isRef(r) {
    return r ? r.__v_isRef === true : false;
}
exports.isRef = isRef;
function useRef(value) {
    return createRef(value);
}
exports.useRef = useRef;
/**
 * TODO
 * 如果是个对象,包含了ref对象,应该再实现监听
 * @param rawValue
 */
function createRef(rawValue) {
    var ref = {
        get value() {
            return rawValue;
        },
        set value(newValue) {
            console.error("\n                \u8BF7\u4E0D\u8981\u76F4\u63A5\u4FEE\u6539 ref.value \u503C\n            ");
        }
    };
    var dep = new dep_1.Dep();
    Object.defineProperties(ref, {
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
        }
    });
    function setRef(value) {
        var result;
        if (utils_1.isFunction(value)) {
            result = value();
        }
        else {
            result = value;
        }
        if (!lodash_1.isEqual(rawValue, result)) {
            rawValue = result;
            dep.notify(result);
        }
    }
    return [ref, setRef];
}
function setRef(value) {
}
exports.setRef = setRef;
