/**
 * Obtain the parameters of a function type in a tuple
 */
declare type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
/**
 * Obtain the return type of a function type
 */
declare type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
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
export {};
