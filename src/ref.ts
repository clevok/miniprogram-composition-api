import { isEqual } from '@jsmini/isequal'
import { clone } from '@jsmini/clone';

import { Dep } from './dep'
import { isFunction } from './utils'

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

/**
 * 赋值运算符
 * set(直接设置value值)
 * set(along => 返回设置的对象);
 */
export interface ISetRef<T> {
	(value: T): void
}
export interface ISetRef<T> {
	(value: (params: T) => unknown): void
}

export function isRef<T> (r: IRef<T> | unknown): r is IRef<T>
export function isRef (r: any): r is IRef{
	return r ? r.__v_isRef === true : false
}

export type IUseRef<T> = [IRef<T>, ISetRef<T>]
export function useRef<T> (value: T): IUseRef<T>{
	return createRef(value)
}

/**
 * @param _getValue 内部内容 
 */
function createRef<T> (_getValue: T): IUseRef<T>{
	const ref = {
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

	return [ ref as IRef, setRef ]
}
