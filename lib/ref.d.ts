export interface IRef<T = any> {
    /**
     * 用于确认他是ref对象
     */
    __v_isRef: boolean;
    /**
     * 更新通知
     */
    __v_change: (callback: Function) => () => any;
    value: T;
}
/**
 * 赋值运算符
 * set(直接设置value值)
 * set(along => 返回设置的对象);
 */
export interface ISetRef<T> {
    (value: T): void;
}
export interface ISetRef<T> {
    (value: (params: T) => unknown): void;
}
export declare function isRef<T>(r: IRef<T> | unknown): r is IRef<T>;
export declare type IUseRef<T> = [IRef<T>, ISetRef<T>];
export declare function useRef<T>(value: T): IUseRef<T>;
