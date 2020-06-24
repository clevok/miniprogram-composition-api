"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ref_1 = require("./reactivity/ref");
var watch_1 = require("./watch");
function useComputed(callback, refs) {
    var ref = ref_1.useRef(callback());
    watch_1.useEffect(function () {
        ref.set(callback());
    }, refs);
    return ref;
}
exports.useComputed = useComputed;
