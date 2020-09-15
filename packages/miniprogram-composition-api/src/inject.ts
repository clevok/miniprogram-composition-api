import { overInCurrentModule, ICurrentModuleInstance } from './instance'
import { ExtendLefecycle } from './lifecycle'

const isEqual = require('lodash/isEqual')
const cloneDeep = require('lodash/cloneDeep')

const provides = Object.create(null)

/**
 *
 * 注册
 * @param key
 * @param value
 */
export function useProvide<T extends (...args: any[]) => any>(
    callback: T,
    ...args: Parameters<T>
): ReturnType<T> {
    return overInCurrentModule((current) => {
        if (!current) {
            current = provides
        }

        if (!current[ExtendLefecycle.LOC_INJECT]) {
            current[ExtendLefecycle.LOC_INJECT] = []
        }

        let targetInject = current[ExtendLefecycle.LOC_INJECT]
        let findFunctionIndex = targetInject.findIndex((target) => {
            return target.function_target === callback
        })
        if (!~findFunctionIndex) {
            targetInject.unshift({
                function_target: callback,
                caches: [],
            })
            findFunctionIndex = 0
        }

        let findFunctionResultIndex = targetInject[
            findFunctionIndex
        ].caches.findIndex((cache) => {
            return isEqual(cache[0], args)
        })

        if (!~findFunctionResultIndex) {
            targetInject[findFunctionIndex].caches.unshift([
                cloneDeep(args),
                callback(...args),
            ])
            findFunctionResultIndex = 0
        }

        return targetInject[findFunctionIndex].caches[
            findFunctionResultIndex
        ][1]
    })
}

/**
 *
 * 注入
 * @param key
 */
export function useInject<T extends (...args: any[]) => any>(
    callback: T,
    ...args: Parameters<T>
): ReturnType<T> {
    const CANT_FIND_KEY = Symbol()
    function getProvide(
        target: ICurrentModuleInstance
    ): typeof CANT_FIND_KEY | ReturnType<T> {
        if (!target) {
            return CANT_FIND_KEY
        }

        const targetInject = target[ExtendLefecycle.LOC_INJECT] || []
        if (!targetInject.length) {
            return getProvide(target[ExtendLefecycle.PARENT])
        }

        let findFunctionIndex = targetInject.findIndex((target) => {
            return target.function_target === callback
        })

        if (!~findFunctionIndex) {
            return getProvide(target[ExtendLefecycle.PARENT])
        }

        let findFunctionResultIndex = targetInject[
            findFunctionIndex
        ].caches.findIndex((cache) => {
            return isEqual(cache[0], args)
        })

        if (!~findFunctionResultIndex) {
            return getProvide(target[ExtendLefecycle.PARENT])
        }

        return targetInject[findFunctionIndex].caches[
            findFunctionResultIndex
        ][1]
    }

    return overInCurrentModule((current) => {
        if (!current) {
            current = provides
        }

        const runResult = getProvide(current)
        if (runResult === CANT_FIND_KEY) {
            return callback(...args)
        }

        return runResult
    })
}
