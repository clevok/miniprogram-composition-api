/**
 *
 * 注册
 * @param key
 * @param value
 */
export declare function useProvide<T extends (...args: any[]) => any>(callback: T, ...args: Parameters<T>): ReturnType<T>;
/**
 *
 * 注入
 * @param key
 */
export declare function useInject<T extends (...args: any[]) => any>(callback: T, ...args: Parameters<T>): ReturnType<T>;
