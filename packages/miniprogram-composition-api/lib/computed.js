"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var miniprogram_reactivity_1 = require("miniprogram-reactivity");
var watch_1 = require("./watch");
function useComputed(callback, refs) {
    var ref = miniprogram_reactivity_1.useRef(callback());
    watch_1.useEffect(function () {
        ref.set(callback());
    }, refs);
    return ref;
}
exports.useComputed = useComputed;
