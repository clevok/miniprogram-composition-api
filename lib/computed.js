"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ref_1 = require("./ref");
var watch_1 = require("./watch");
/**
 * 计算属性
 */
function useComputed(callback, refs) {
    var _a = ref_1.useRef(callback()), ref = _a[0], setRef = _a[1];
    watch_1.useEffect(function () {
        setRef(callback());
    }, refs);
    return ref;
}
exports.useComputed = useComputed;
