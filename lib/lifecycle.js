"use strict";
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
function overCurrentPage(callback) {
    return function () {
        setCurrentPage(this);
        callback.call(this);
        setCurrentPage(null);
    };
}
exports.overCurrentPage = overCurrentPage;
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
/**
 * 实例初始化
 */
function attached() {
}
exports.attached = attached;
/**
 * 装载完成
 */
function ready() {
}
exports.ready = ready;
/**
 * 卸载
 */
function detached() {
}
exports.detached = detached;
/**
 * 页面加载
 */
function onLoad() {
}
exports.onLoad = onLoad;
/**
 * 页面显示
 */
function onShow() {
}
exports.onShow = onShow;
/**
 * 页面隐藏
 */
function onHide() {
}
exports.onHide = onHide;
/**
 * 页面卸载
 */
function onUnload() {
}
exports.onUnload = onUnload;
/**
 * 下拉刷新
 */
function onPullDownRefresh() {
}
exports.onPullDownRefresh = onPullDownRefresh;
/**
 * 滚动到底部
 */
function onReachBottom() {
}
exports.onReachBottom = onReachBottom;
/**
 * 转发
 */
function onShareAppMessage() {
}
exports.onShareAppMessage = onShareAppMessage;
