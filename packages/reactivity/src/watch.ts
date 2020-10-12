import { IRef, isRef } from './ref'
import { isFunction } from './utils'

/**
 * 可观测对象
 * @param value
 */
export function isObserve (value): value is IRef{
	return isRef(value)
}

/**
 * 监听ref做出回应
 * @return {function} 丢弃监听
 */
export function useEffect<T> (callback: (newValue: T, oldValue: T) => any, refs: IRef<T>[]){
	if (!isFunction(callback)) {
		return void console.error(`
        useEffect callback must be functions
        `)
	}
	if (!refs || !refs.length) {
		return void console.error(`
        refs must be Ref[]
        `)
	}

	const handles = refs.map((ref) => {
		if (!isObserve(ref)) {
			return void console.error(`useEffect refs incloud cant Observe object`)
		}
		return ref.observe((newValue, oldValue) => {
			callback(newValue, oldValue)
		})
	})

	/**
     * 移除监听
     */
	return () => {
		handles.forEach((handle) => {
			handle && handle()
		})
	}
}
