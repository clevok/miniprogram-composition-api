"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var miniprogram_reactivity_1 = require("miniprogram-reactivity");
var instance_1 = require("./instance");
var lifecycle_1 = require("./lifecycle");
function useEffect(callback, refs) {
    var stopHandle = miniprogram_reactivity_1.useEffect(callback, refs);
    return instance_1.overInCurrentModule(function (currentInstance) {
        currentInstance &&
            lifecycle_1.injectHook(currentInstance, "effect" /* EFFECT */, stopHandle);
        return stopHandle;
    });
}
exports.useEffect = useEffect;
