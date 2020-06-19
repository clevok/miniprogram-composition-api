export interface IRef<T = any> {
    __v_isRef: boolean;
    /**
     * 更新通知
     */
    __v_change: (callback: Function) => () => any;
    /**
     * 清除所有的监听
     */
    __v_clear: () => void;
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
    (value: (params: T) => T): void;
}
export declare function isRef<T>(r: IRef<T> | unknown): r is IRef<T>;
/**
 * @param {any} value - 初始值
 * @param {function} setValue - 接受一个立即执行的方法,并接受setRef,ref参数(setRef,ref) => 返回自定义的方法
 * ```js
const [number, updateNumber] = useRef(0, (setRef, ref) => {
    return function (params) {
        setRef(params.name)
    }
})
updateNumber({
    name: 2
});
 *
 * ```
 */
export declare function useRef<T>(value: T): [IRef<T>, ISetRef<T>];
export declare function useRef<T, D extends Function>(value: T, setValue: (setValue: ISetRef<T>, value: IRef<T>) => D): [IRef<T>, D];
