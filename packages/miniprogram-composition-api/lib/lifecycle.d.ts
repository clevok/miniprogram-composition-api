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
export declare const enum CommonLifecycle {
    ON_LOAD = "onLoad",
    ON_UN_LOAD = "onUnload",
    ON_READY = "onReady"
}
export declare const enum ExtendLefecycle {
    EFFECT = "effect",
    WATCH_PROPERTY = "watchProperty"
}
/**注入hooks */
export declare function injectHook(currentInstance: ICurrentModuleInstance, lifecycle: PageLifecycle | ComponentLifecycle | ExtendLefecycle | CommonLifecycle, hook: Function): void;
/**执行hooks */
export declare function conductHook(currentInstance: ICurrentModuleInstance, lifecycle: PageLifecycle | ComponentLifecycle | ExtendLefecycle | CommonLifecycle, params: any[]): any[];
/** 实例被加载, Page.onLoad, Components.attached */
export declare const onLoad: (callback: Function) => void;
/** 实例被销毁, Page.onUnLoad, Components.destory */
export declare const onUnLoad: (callback: Function) => void;
/** 实例装载完成, Page.onReady, Components.ready */
export declare const onReady: (callback: Function) => void;
/** 页面显示 */
export declare const onShow: (callback: Function) => void;
/** 页面隐藏 */
export declare const onHide: (callback: Function) => void;
/** 下拉刷新 */
export declare const onPullDownRefresh: (callback: Function) => void;
/** 滚动到底部 */
export declare const onReachBottom: (callback: Function) => void;
/** 转发 */
export declare const onShareAppMessage: (callback: Function) => void;
/** 页面滚动 */
export declare const onPageScroll: (callback: Function) => void;
