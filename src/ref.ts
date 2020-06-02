import { isEqual, cloneDeep } from 'lodash';
import { Dep } from "./dep";
import { isFunction } from './utils';

export interface IRef<T = any> {
	/**
     * 用于确认他是ref对象
     */
	__v_isRef: boolean
    /**
     * 更新通知
     */
    __v_change: (callback: Function) => /** 清除句柄 */ () => any
	value: T
}
export interface ISetRef<T> {
    (value: T): void
}
export interface ISetRef<T> {
    (value: () => T): void;
}

export function isRef<T> (r: IRef<T> | unknown): r is IRef<T>
export function isRef (r: any): r is IRef{
	return r ? r.__v_isRef === true : false
}

export type IUseRef<T> = [IRef<T>, ISetRef<T>];
export function useRef<T>(value: T): IUseRef<T> {
    return createRef(value);
}

/**
 * TODO
 * 如果是个对象,包含了ref对象,应该再实现监听
 * @param rawValue 
 */
function createRef<T>(rawValue: T): IUseRef<T> {
    const ref = {
        get value() {
            return rawValue
        },
        set value(newValue) {
            console.error(`
                请不要直接修改 ref.value 值
            `)
        }
    }

    const dep = new Dep();
    Object.defineProperties(ref, {
        __v_isRef: {
            value: true,
            configurable: false,
            writable: false,
            enumerable: false
        },
        __v_change: {
            value: (callback: Function) => {
                return dep.depend(callback);
            },
            configurable: false,
            writable: false,
            enumerable: false
        }
    });

    function setRef(value: T): void
    function setRef(value: () => T): void
    function setRef(value: any) {
        let result: T;
        if (isFunction(value)) {
            result = value(cloneDeep(rawValue));
        } else {
            result = value;
        }

        if (!isEqual(rawValue, result)) {
            rawValue = result;
            dep.notify(result);
        }
    }

    return [ ref as IRef, setRef ];
}