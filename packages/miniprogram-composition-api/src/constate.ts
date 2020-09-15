import { injectHook, ExtendLefecycle } from './lifecycle'
import { overInCurrentModule } from './instance'

const isEqual = require('lodash/isEqual')
const cloneDeep = require('lodash/cloneDeep')

type Parameters<T extends (...args: any) => any> = T extends (
    ...args: infer P
) => any
    ? P
    : never
type ReturnType<T extends (...args: any) => any> = T extends (
    ...args: any
) => infer R
    ? R
    : any

/**
 *
 * 存在期间的 单一实例
 * 所有自定义组件/页面共享数据, 当被依赖的页面/组件都被销毁时,重新加载第一遍会被执行一次
 * 请在setup期间调用!!
 */
export function createConstate<T extends (...args: any[]) => any>(callback: T) {
    function useConstate() {
        let EMPYT_KEY = Symbol()
        let CACHE: any = EMPYT_KEY
        let injectCurrentModules = []

        return (args: any) => {
            overInCurrentModule((currentInstance) => {
                if (!currentInstance) {
                    return
                }
                injectCurrentModules.unshift(currentInstance)
                injectHook(currentInstance, ExtendLefecycle.EFFECT, () => {
                    const findIndex = injectCurrentModules.findIndex(
                        (mo) => mo === currentInstance
                    )
                    if (~findIndex) {
                        injectCurrentModules.splice(findIndex, 1)
                    }

                    if (injectCurrentModules.length === 0) {
                        CACHE = EMPYT_KEY
                    }
                })
            })

            if (CACHE !== EMPYT_KEY) {
                return CACHE
            }

            CACHE = callback(...args)

            return CACHE
        }
    }

    let CACHE_PARAMS: { params: any; constate: any }[] = []

    return (...args: Parameters<T>): ReturnType<T> => {
        let findIndex = CACHE_PARAMS.findIndex(({params}) => {
            return isEqual(params, args)
        })

        if (!~findIndex) {
            CACHE_PARAMS.unshift({
                params: cloneDeep(args),
                constate: useConstate(),
            })
            findIndex = 0
        }

        return CACHE_PARAMS[findIndex].constate(args)
    }
}