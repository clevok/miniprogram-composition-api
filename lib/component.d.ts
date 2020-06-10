/// <reference types="types" />
import { ComponentLifecycle, PageLifecycle } from './lifecycle';
export declare function defineComponent(optionsOrSetup: (WechatMiniprogram.Component.Options<Record<string, any>, Record<string, WechatMiniprogram.Component.AllProperty>, Record<string, (...args: any[]) => any>> & {
    setup?: Function;
}) | Function): any;
/**
 *
 * 装饰原有声明周期, 执行被注入的 this对象内声明周期方法
 * @param lifecycle - 页面属性
 * @param options - 页面构造对象
 * @return {function} - 新方法, 用于指向所有的注入的声明周期以及原有方法
 */
export declare function createLifecycle(lifecycle: ComponentLifecycle | PageLifecycle, options: Object): (...args: any[]) => any[];
