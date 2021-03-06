export interface IRef<T = any> {
    value: T;
    /** 提取值 */
    get(): T;
    /**
     * @param {any} params 值
     * @param {object} config
     * @param {boolean} config.notify - 是否强制更新
     */
    set(params: T | ((value: T) => T), config?: {
        notify: boolean;
    }): void;
    __v_isRef: boolean;
    /**
     * 更新通知
     */
    __v_change: (callback: (newValue: T, oldValue: T) => any) => () => any;
    /**
     * 清除所有的监听
     */
    __v_clear: () => void;
}
export declare function isRef<T>(r: IRef<T> | unknown): r is IRef<T>;
/**
 * @param {any} value - 初始值
 * ```js
const number = useRef(0)
number.set({
    name: 2
});
 *
 * ```
 */
export declare function useRef<T>(value: T): IRef<T>;
