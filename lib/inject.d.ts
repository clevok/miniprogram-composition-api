export interface InjectionKey<T> extends Symbol {
}
/**
 * 注册
 * @param key
 * @param value
 */
export declare function useProvide<T>(key: InjectionKey<T> | string, value: T): void;
/**
 * 取消注册
 */
export declare function useUnProvide(): void;
/**
 * 注入
 * @param key
 */
export declare function useInject<T>(key: InjectionKey<T> | string): T | undefined;
export declare function useInject<T>(key: InjectionKey<T> | string, defaultValue: T): T;
/**
 * 异步注入, 等待注册
 * @param key
 */
export declare function useInjectAsync<T>(key: InjectionKey<T> | string): Promise<T>;
