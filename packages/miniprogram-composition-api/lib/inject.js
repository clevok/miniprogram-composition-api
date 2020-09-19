"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isEqual = require('lodash.isEqual');
var cloneDeep = require('lodash.cloneDeep');
var instance_1 = require("./instance");
var provides = getApp();
/**
 *
 * create and use point
 */
function useProvide(callback) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return instance_1.overInCurrentModule(function (_current) {
        var current = _current ? _current : provides;
        if (!current["__loc_inject__" /* LOC_INJECT */]) {
            current["__loc_inject__" /* LOC_INJECT */] = [];
        }
        var targetInject = current["__loc_inject__" /* LOC_INJECT */];
        var findFunctionIndex = targetInject.findIndex(function (target) {
            return target.function_target === callback;
        });
        if (!~findFunctionIndex) {
            targetInject.unshift({
                function_target: callback,
                caches: [],
            });
            findFunctionIndex = 0;
        }
        var findFunctionResultIndex = targetInject[findFunctionIndex].caches.findIndex(function (cache) {
            return isEqual(cache[0], args);
        });
        if (!~findFunctionResultIndex) {
            targetInject[findFunctionIndex].caches.unshift([
                cloneDeep(args),
                callback.apply(void 0, args),
            ]);
            findFunctionResultIndex = 0;
        }
        return targetInject[findFunctionIndex].caches[findFunctionResultIndex][1];
    });
}
exports.useProvide = useProvide;
/**
 *
 * use point
 */
function useInject(callback) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var CANT_FIND_KEY = Symbol();
    function getProvide(target) {
        if (!target) {
            return CANT_FIND_KEY;
        }
        var targetInject = target["__loc_inject__" /* LOC_INJECT */] || [];
        if (!targetInject.length) {
            return getProvide(target["__parent__" /* PARENT */]);
        }
        var findFunctionIndex = targetInject.findIndex(function (target) {
            return target.function_target === callback;
        });
        if (!~findFunctionIndex) {
            return getProvide(target["__parent__" /* PARENT */]);
        }
        var findFunctionResultIndex = targetInject[findFunctionIndex].caches.findIndex(function (cache) {
            return isEqual(cache[0], args);
        });
        if (!~findFunctionResultIndex) {
            return getProvide(target["__parent__" /* PARENT */]);
        }
        return targetInject[findFunctionIndex].caches[findFunctionResultIndex][1];
    }
    return instance_1.overInCurrentModule(function (_current) {
        var current = _current ? _current : provides;
        var runResult = getProvide(current);
        if (runResult === CANT_FIND_KEY) {
            return callback.apply(void 0, args);
        }
        return runResult;
    });
}
exports.useInject = useInject;
