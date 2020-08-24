export interface IReactive<T = any> {
    /** 赋值 */
    set(params: T | ((value: T) => T)): void;
    __v_isReactive: boolean;
}
export declare function isReactive(r: any): r is IReactive;
/**
 * 响应式对象
 * @param value
 */
export declare function useReactive<T>(value: T): any;
