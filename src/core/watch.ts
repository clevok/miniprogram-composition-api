import { IRef, isRef } from './ref'
import { isFunction } from '../utils'

/**
 * 可观测对象
 * @param value
 */
export function isObserve(value): value is IRef {
    return isRef(value)
}

/**
 * 监听ref做出回应
 * @return {function} 丢弃监听
 */
export function useEffect<T>(callback: (newValue: T) => any, refs: IRef<T>[]) {
    if (!isFunction(callback)) {
        return void console.warn(`
        callback must be functions
        `)
    }
    if (!refs || !refs.length) {
        return void console.warn(`
        refs must be Ref[]
        `)
    }

    const handles = refs.map((ref) => {
        return (
            isObserve(ref) &&
            ref.__v_change((newValue) => {
                callback(newValue)
            })
        )
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
