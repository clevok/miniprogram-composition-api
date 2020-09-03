import { ComponentLifecycle, PageLifecycle, CommonLifecycle } from './lifecycle';
import { ICurrentModuleInstance } from './instance';
import { IContext } from './context';
/** 副作用, 如果是方法,返回null */
export declare const deepToRaw: (x: unknown) => any;
/**
 * Page/Component 与 watch 中转
 * @return {function} 抛弃监听
 */
export declare function deepWatch(target: any, key: string, value: any): () => void;
/**
 * 执行注册的生命周期
 */
export declare function createLifecycleMethods(lifecycle: ComponentLifecycle | PageLifecycle | CommonLifecycle, options: Object | Function | undefined): (...args: any[]) => any[];
/** 将数据注入到视图中 */
export declare function useSetup(setup: () => {
    [key: string]: any;
}): (target: ICurrentModuleInstance) => void;
export declare type IBindings = {
    [key: string]: any;
};
export declare type ISetup<Props extends Object> = (this: ICurrentModuleInstance, props: Props, context: IContext) => IBindings;
