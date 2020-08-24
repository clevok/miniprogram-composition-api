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
export declare function useUnProvide<T>(key: InjectionKey<T> | string): void;
/**
 * 注入
 * @param key
 */
export declare function useInject<T>(key: InjectionKey<T> | string): T | undefined;
export declare function useInject<T>(key: InjectionKey<T> | string, defaultValue: T): T;
