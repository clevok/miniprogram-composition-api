"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var watch_1 = require("./reactivity/watch");
var instance_1 = require("./instance");
var lifecycle_1 = require("./lifecycle");
function useEffect(callback, refs) {
    var stopHandle = watch_1.useEffect(callback, refs);
    return instance_1.overInCurrentModule(function (currentInstance) {
        lifecycle_1.injectHook(currentInstance, "effect" /* EFFECT */, stopHandle);
        return stopHandle;
    }, function () {
        return stopHandle;
    });
}
exports.useEffect = useEffect;
