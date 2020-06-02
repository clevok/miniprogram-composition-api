"use strict";
/**
 * 声明周期
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 执行期间的页面
 */
exports.currentPage = null;
/**
 * 执行期间的组件
 */
exports.currentComponent = null;
function setCurrentPage(page) {
    exports.currentPage = page;
}
exports.setCurrentPage = setCurrentPage;
function setCurrentComponent(component) {
    exports.currentComponent = component;
}
exports.setCurrentComponent = setCurrentComponent;
function overCurrentComponent(callback) {
    return function () {
        setCurrentComponent(this);
        callback.call(this);
        setCurrentComponent(null);
    };
}
exports.overCurrentComponent = overCurrentComponent;
