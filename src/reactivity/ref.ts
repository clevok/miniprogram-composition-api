import { isEqual } from '@jsmini/isequal'
import { clone } from '@jsmini/clone'

import { Dep } from './dep'
import { isFunction } from './utils'

export interface IRef<T = any> {
	value: T
	/** 提取值 */
	get(): T
	/** 赋值 */
	set(params: T | ((value: T) => T)): void

	__v_isRef: boolean
	/**
     * 更新通知
     */
	__v_change: (callback: (newValue: T, oldValue: T) => any) => /** 清除句柄 */ () => any
	/**
     * 清除所有的监听
     */
	__v_clear: () => void
}

export function isRef<T> (r: IRef<T> | unknown): r is IRef<T>
export function isRef (r: any): r is IRef{
	return r ? r.__v_isRef === true : false
}

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
export function useRef<T> (value: T): IRef<T>{
	return createRef(value)
}

function createRef<T> (_getValue: T){
	_getValue = clone(_getValue)

	const dep = new Dep()
	const ref = Object.create(null)

	Object.defineProperties(ref, {
		value: {
			get () {
				return _getValue
			},
			set () {
				console.error(`
                请不要直接修改 ref.value 值
            `)
			}
		},
		get: {
			value: () => {
				return _getValue
			},
			configurable: false,
			writable: false,
			enumerable: false
		},
		set: {
			value: (value: any) => {
				let cloneValue = clone(_getValue)
				let updateValue: T
				if (isFunction(value)) {
					updateValue = value(cloneValue)
				} else {
					updateValue = value
				}

				if (!isEqual(cloneValue, updateValue)) {
					dep.notify((_getValue = updateValue), cloneValue)
				}
			},
			configurable: false,
			writable: false,
			enumerable: false
		},
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

	return ref
}
