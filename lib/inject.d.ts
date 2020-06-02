export interface InjectionKey<T> extends Symbol {
}
/**
 * 注入
 * @param key
 * @param value
 */
export declare function provide<T>(key: InjectionKey<T> | string, value: T): void;
/**
 * 取出
 * @param key
 */
export declare function inject<T>(key: InjectionKey<T> | string): T | undefined;
export declare function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T;
