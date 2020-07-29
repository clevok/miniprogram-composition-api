import { ICurrentModuleInstance } from './instance';
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
export declare const enum ExtendLefecycle {
    EFFECT = "effect"
}
/**注入hooks */
export declare function injectHook(currentInstance: ICurrentModuleInstance, lifecycle: PageLifecycle | ComponentLifecycle | ExtendLefecycle, hook: Function): void;
/**执行hooks */
export declare function conductHook(currentInstance: ICurrentModuleInstance, lifecycle: PageLifecycle | ComponentLifecycle | ExtendLefecycle, params: any[]): any[];
/** 实例初始化 */
export declare const onAttached: (callback: Function) => void;
/** 装载完成 */
export declare const onReady: (callback: Function) => void;
/** 卸载 */
export declare const onDetached: (callback: Function) => void;
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
