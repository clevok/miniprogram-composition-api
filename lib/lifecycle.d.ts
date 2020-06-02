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
export declare type PageInstance = WechatMiniprogram.Page.InstanceProperties & WechatMiniprogram.Page.InstanceMethods<Record<string, unknown>>;
export declare type ComponentInstance = WechatMiniprogram.Component.InstanceProperties & WechatMiniprogram.Component.InstanceMethods<Record<string, unknown>>;
/**
 * 执行期间的页面
 */
export declare let currentPage: PageInstance | null;
/**
 * 执行期间的组件
 */
export declare let currentComponent: ComponentInstance | null;
export declare function setCurrentPage(page: PageInstance | null): void;
export declare function overCurrentPage(callback: any): () => void;
export declare function setCurrentComponent(component: ComponentInstance | null): void;
export declare function overCurrentComponent(callback: any): () => void;
/**
 * 实例初始化
 */
export declare function attached(): void;
/**
 * 装载完成
 */
export declare function ready(): void;
/**
 * 卸载
 */
export declare function detached(): void;
/**
 * 页面加载
 */
export declare function onLoad(): void;
/**
 * 页面显示
 */
export declare function onShow(): void;
/**
 * 页面隐藏
 */
export declare function onHide(): void;
/**
 * 页面卸载
 */
export declare function onUnload(): void;
/**
 * 下拉刷新
 */
export declare function onPullDownRefresh(): void;
/**
 * 滚动到底部
 */
export declare function onReachBottom(): void;
/**
 * 转发
 */
export declare function onShareAppMessage(): void;
