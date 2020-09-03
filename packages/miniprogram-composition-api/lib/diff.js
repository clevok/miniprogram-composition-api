"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
var FUNCTIONTYPE = '[object Function]';
function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result;
}
exports.diff = diff;
function syncKeys(current, pre) {
    if (current === pre)
        return;
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        //if(Object.keys(current).length >= Object.keys(pre).length){
        for (var key in pre) {
            var currentValue = current[key];
            if (currentValue === undefined) {
                current[key] = null;
            }
            else {
                syncKeys(currentValue, pre[key]);
            }
        }
        //}
    }
    else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}
function _diff(current, pre, path, result) {
    if (current === pre)
        return;
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE ||
            Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        }
        else {
            var _loop_1 = function (key) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + '.') + key, currentValue);
                    }
                }
                else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + '.') + key, currentValue);
                    }
                    else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + '.') + key, currentValue);
                        }
                        else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + '.') +
                                    key +
                                    '[' +
                                    index +
                                    ']', result);
                            });
                        }
                    }
                }
                else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE ||
                        Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + '.') + key, currentValue);
                    }
                    else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + '.') + key + '.' + subKey, result);
                        }
                    }
                }
            };
            for (var key in current) {
                _loop_1(key);
            }
        }
    }
    else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        }
        else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            }
            else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    }
    else {
        setResult(result, path, current);
    }
}
function setResult(result, k, v) {
    if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    }
}
function type(obj) {
    return Object.prototype.toString.call(obj);
}
