"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isequal_1 = require("@jsmini/isequal");
var clone_1 = require("@jsmini/clone");
var dep_1 = require("./dep");
var utils_1 = require("../utils");
function isRef(r) {
    return r ? r.__v_isRef === true : false;
}
exports.isRef = isRef;
function useRef(value, setValue) {
    return createRef(value, setValue);
}
exports.useRef = useRef;
function createRef(_getValue, _setValue) {
    // @ts-ignore
    var ref = {
        get value() {
            return _getValue;
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
    function setRef(value) {
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
    }
    var setValue = _setValue ? _setValue(setRef, ref) : setRef;
    return [ref, setValue];
}
