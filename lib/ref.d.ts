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
 * 设置
 */
export declare type ISetRef<T> = (value: T) => void;
export declare function isRef<T>(r: IRef<T> | unknown): r is IRef<T>;
export declare type IUseRef<T> = [IRef<T>, ISetRef<T>];
export declare function useRef<T>(value: T): IUseRef<T>;
export declare function setRef<T>(value: T): void;
export declare function setRef<T>(value: () => T): void;
