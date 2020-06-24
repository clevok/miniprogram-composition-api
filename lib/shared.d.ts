import { ComponentLifecycle, PageLifecycle } from './lifecycle';
import { ICurrentModuleInstance } from './instance';
import { IContext } from './context';
export declare const deepToRaw: (x: unknown) => any;
/**
 * Page/Component 与 watch 中转
 * @return {function} 抛弃监听
 */
export declare function deepWatch(target: any, key: string, value: any): () => void;
/**
 * 返回的函数 this指向必须是 页面或组件
 */
export declare function createLifecycleMethods(lifecycle: ComponentLifecycle | PageLifecycle, options: Object | Function | undefined): (...args: any[]) => any[];
export declare type IBindings = {
    [key: string]: any;
};
export declare type ISetup<Props extends Object> = (this: ICurrentModuleInstance, props: Props, context: IContext) => IBindings;
