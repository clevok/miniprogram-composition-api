import { Parameters, ReturnType } from './interface';
/**
 *
 * create and use point
 */
export declare function useProvide<T extends (...args: any[]) => any>(callback: T, ...args: Parameters<T>): ReturnType<T>;
/**
 *
 * use point
 */
export declare function useInject<T extends (...args: any[]) => any>(callback: T, ...args: Parameters<T>): ReturnType<T>;
