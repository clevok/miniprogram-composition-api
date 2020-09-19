import { Parameters, ReturnType } from './interface';
/**
 *
 * 存在期间的 单一实例
 * 所有自定义组件/页面共享数据, 当被依赖的页面/组件都被销毁时,重新加载第一遍会被执行一次
 * 请在setup期间调用!!
 */
export declare function createConstate<T extends (...args: any[]) => any>(callback: T): (...args: Parameters<T>) => ReturnType<T>;
