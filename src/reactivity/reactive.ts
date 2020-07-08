import { isObject } from './utils'

export interface IReactive<T = any> {
	/** 赋值 */
	set(params: T | ((value: T) => T)): void

	__v_isReactive: boolean
}

export function isReactive(r: any): r is IReactive {
	return r ? r.__v_isReactive === true : false
}

/**
 * 响应式对象
 * @param value 
 */
export function useReactive<T> (value: T){
    return createReactiveObject(value)
}

function createReactiveObject(value) {
    if (isReactive(value)) {
        return value;
    }
    if (!isObject(value)) {
		console.warn(
			`value cannot be made reactive: ${String(value)}, please use the useRef`
        )
        return value
    }
    
}
