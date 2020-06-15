import { ICurrentModuleInstance, IContext } from './instance';
export declare const deepToRaw: (x: unknown) => any;
/**
 * Page/Component 与 watch 中转
 * @return {function} 抛弃监听
 */
export declare function deepWatch(target: any, key: string, value: any): () => void;
/**
 *
 * 绑定函数, 基于target对象绑定实例
 * @param target - 页面/组件 实例
 * @param callback - 执行方法
 * @param props - props内容
 * @return {function} - 停止内部所有依赖的监听
 */
export declare const setup: (target: ICurrentModuleInstance, callback: Function, props: unknown, context: IContext) => any;
/**
 * 必须更改方法this指向为页面/组件
 * setData, 能够解析ref, 并监听
 * @param {object} binding - 必须是个对象,里面包含要绑定的数据
 * @return {function} 移除方法
 */
export declare function setData(this: ICurrentModuleInstance, binding: Object): () => any;
