import { isEqual } from '@jsmini/isequal'
import { clone } from '@jsmini/clone'

import { Dep } from './dep'
import { isFunction } from '../utils'

export interface IRef<T = any> {
	__v_isRef: boolean
	/**
     * 更新通知
     */
	__v_change: (callback: Function) => /** 清除句柄 */ () => any
	/**
     * 清除所有的监听
     */
	__v_clear: () => void

	value: T
}

/**
 * 赋值运算符
 * set(直接设置value值)
 * set(along => 返回设置的对象);
 */
export interface ISetRef<T> {
	(value: T): void
}
export interface ISetRef<T> {
	(value: (params: T) => T): void
}

export function isRef<T> (r: IRef<T> | unknown): r is IRef<T>
export function isRef (r: any): r is IRef{
	return r ? r.__v_isRef === true : false
}

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
export function useRef<T> (value: T): [IRef<T>, ISetRef<T>]
export function useRef<T, D extends Function> (
	value: T,
	setValue: (setValue: ISetRef<T>, value: IRef<T>) => D
): [IRef<T>, D]
export function useRef<T, D extends Function> (value: T, setValue?: (setValue: ISetRef<T>, value: IRef<T>) => D): any{
	return createRef(value, setValue)
}


function createRef<T> (_getValue: T): [IRef<T>, ISetRef<T>]
function createRef<T, D extends Function> (
	_getValue: T,
	_setValue: (setValue: ISetRef<T>, value: IRef<T>) => D
): [IRef<T>, D]
function createRef<T, D extends Function> (_getValue: T, _setValue?: (setValue: ISetRef<T>, value: IRef<T>) => D): any{
    // @ts-ignore
    const ref: IRef<T> = {
		get value () {
			return _getValue
		},
		set value (newValue) {
			console.error(`
                请不要直接修改 ref.value 值
            `)
		}
	}

	const dep = new Dep()
	Object.defineProperties(ref, {
		__v_isRef: {
			value: true,
			configurable: false,
			writable: false,
			enumerable: false
		},
		__v_change: {
			value: (callback: Function) => {
				return dep.depend(callback)
			},
			configurable: false,
			writable: false,
			enumerable: false
		},
		__v_clear: {
			value: () => {
				dep.clear()
			},
			configurable: false,
			writable: false,
			enumerable: false
		}
	})

	function setRef (value: any){
		let updateValue: T
		if (isFunction(value)) {
			updateValue = value(clone(_getValue))
		} else {
			updateValue = value
		}

		if (!isEqual(_getValue, updateValue)) {
			dep.notify((_getValue = updateValue))
		}
    }
    
    const setValue = _setValue ? _setValue(setRef, ref) : setRef as ISetRef<T>;

	return [ ref, setValue ]
}