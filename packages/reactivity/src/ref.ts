import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'

import { Dep } from './dep'
import { isFunction } from './utils'

export interface IRef<T = any> {
	value: T
	/** 提取值 */
	get(): T
	/** 
     * @param {any} params 值
     * @param {object} config
     * @param {boolean} config.notify - 是否强制更新
     */
	set(params: T | ((value: T) => T), config?: { notify: boolean }): void

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

function createRef<T> (viewDate: T){
	/** 视图层的数据,只有在set的时候才能被获取更改 */
	viewDate = cloneDeep(viewDate)
	/** 对外的数据,允许更改 */
	let outDate = cloneDeep(viewDate)

	const dep = new Dep()
	const ref = Object.create(null)

	Object.defineProperties(ref, {
		value: {
			get () {
				return outDate
			},
			set () {
				console.error(`
                请不要直接修改 ref.value 值
            `)
			}
		},
		get: {
			value: () => {
				return outDate
			},
			configurable: false,
			writable: false,
			enumerable: false
		},
		set: {
			value: (value: ((params: T) => T) | T, config = { notify: false }) => {
				let updateValue: T
				if (isFunction(value)) {
					updateValue = value(cloneDeep(viewDate))
				} else {
					updateValue = value
				}

				if (config.notify || !isEqual(viewDate, updateValue)) {
					let beforeViewDate = cloneDeep(viewDate)

					viewDate = cloneDeep(updateValue)
					outDate = cloneDeep(updateValue)

					dep.notify(updateValue, beforeViewDate)
				}
			},
			configurable: false,
			writable: false,
			enumerable: false
		},
		toString: {
			value: () => String(viewDate),
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