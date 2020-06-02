/**
 * 声明周期
 */
/// <reference types="types" />
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
export declare function setCurrentComponent(component: ComponentInstance | null): void;
export declare function overCurrentComponent(callback: any): () => void;
