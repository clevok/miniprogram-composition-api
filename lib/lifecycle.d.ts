/// <reference types="types" />
export declare const enum ComponentLifecycle {
    CREATED = "created",
    ATTACHED = "attached",
    READY = "ready",
    DETACHED = "detached"
}
export declare const enum PageLifecycle {
    ON_LOAD = "onLoad",
    ON_SHOW = "onShow",
    ON_READY = "onReady",
    ON_HIDE = "onHide",
    ON_UNLOAD = "onUnload",
    ON_PULL_DOWN_REFRESH = "onPullDownRefresh",
    ON_REACH_BOTTOM = "onReachBottom",
    ON_PAGE_SCROLL = "onPageScroll",
    ON_SHARE_APP_MESSAGE = "onShareAppMessage",
    ON_RESIZE = "onResize",
    ON_TAB_ITEM_TAP = "onTabItemTap"
}
export declare type CurrentModuleInstance = (WechatMiniprogram.Component.InstanceProperties & WechatMiniprogram.Component.InstanceMethods<Record<string, unknown>> & {
    [key: string]: any;
}) | (WechatMiniprogram.Page.InstanceProperties & WechatMiniprogram.Page.InstanceMethods<Record<string, unknown>> & {
    [key: string]: any;
});
/**
 * 接受第一个参数是 current对象
 * @param callback
 */
export declare function overCurrentModule<T extends Function>(callback: T): T;
/**
 *
 * 绑定函数, 基于target对象绑定实例
 * @param target - 页面/组件 实例
 * @param callback - 执行方法
 * @param props - props内容
 * @return {function} - 停止内部所有依赖的监听
 */
export declare const setup: (target: CurrentModuleInstance, callback: Function, props?: unknown) => () => void;
/** 实例初始化 */
export declare const attached: (callback: Function) => void;
/** 装载完成 */
export declare const ready: (callback: Function) => void;
/** 卸载 */
export declare const detached: (callback: Function) => void;
/** 页面加载 */
export declare const onLoad: (callback: Function) => void;
/** 页面显示 */
export declare const onShow: (callback: Function) => void;
/** 页面隐藏 */
export declare const onHide: (callback: Function) => void;
/** 页面卸载 */
export declare const onUnload: (callback: Function) => void;
/** 下拉刷新 */
export declare const onPullDownRefresh: (callback: Function) => void;
/** 滚动到底部 */
export declare const onReachBottom: (callback: Function) => void;
/** 转发 */
export declare const onShareAppMessage: (callback: Function) => void;
/** 页面滚动 */
export declare const onPageScroll: (callback: Function) => void;
