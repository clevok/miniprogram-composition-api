"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var provides = Object.create(null);
/**
 * 注入
 * @param key
 * @param value
 */
function provide(key, value) {
    // TS doesn't allow symbol as index type
    provides[key] = value;
}
exports.provide = provide;
function inject(key, defaultValue) {
    if (key in provides) {
        // TS doesn't allow symbol as index type
        return provides[key];
    }
    if (arguments.length > 1) {
        return defaultValue;
    }
    /* istanbul ignore else */
    console.warn("injection \"" + String(key) + "\" not found.");
}
exports.inject = inject;
