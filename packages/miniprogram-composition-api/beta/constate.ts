import { injectHook, ExtendLefecycle } from '../src/lifecycle'
import { overInCurrentModule } from '../src/instance'

const isEqual = require('lodash/isEqual')
const cloneDeep = require('lodash/cloneDeep')
const RUN_HANDLES: { fun: any; params: { limit: any; done: Function }[] }[] = []

/**
 *
 * 创建单例共享空间, 用于实现单例依赖注入
 *
 * 和 export 定义区别在于, 这个示例是在执行期间被执行, 在页面都被销毁后才一起销毁, 只示例一次,
 * 支持传参数,如果传了参数,那么参数不同,将会渲染不同的实例!!!
 */
export function useConstate<F extends (...args: any[]) => any>(
    fun: F,
    ...args: Parameters<F>
): ReturnType<F> {
    let findFunIndex = RUN_HANDLES.findIndex((handle) => {
        return handle.fun === fun
    })

    if (!~findFunIndex) {
        RUN_HANDLES.unshift({
            fun,
            params: [],
        })
        findFunIndex = 0
    }

    let findFunParamsIndex = RUN_HANDLES[findFunIndex].params.findIndex(
        ({ limit }) => {
            return isEqual(limit, args)
        }
    )
    if (!~findFunParamsIndex) {
        RUN_HANDLES[findFunIndex].params.unshift({
            limit: cloneDeep(args),
            done: initConstate(fun),
        })
        findFunParamsIndex = 0
    }

    return RUN_HANDLES[findFunIndex].params[findFunParamsIndex].done(args)
}

function initConstate(callback: (...params: any[]) => any) {
    let EMPTY_KEY = Symbol()
    let RUN_RESULT: Symbol | any = EMPTY_KEY
    let injectCurrentModules = []
    return (params: any[]) => {
        overInCurrentModule((currentInstance) => {
            if (!currentInstance) {
                return
            }
            injectCurrentModules.push(currentInstance)
            injectHook(currentInstance, ExtendLefecycle.EFFECT, () => {
                const findIndex = injectCurrentModules.findIndex(
                    (mo) => mo === currentInstance
                )
                if (~findIndex) {
                    injectCurrentModules.splice(findIndex, 1)
                }

                if (injectCurrentModules.length === 0) {
                    RUN_RESULT = EMPTY_KEY
                }
            })
        })

        if (RUN_RESULT !== EMPTY_KEY) {
            return RUN_RESULT
        }

        RUN_RESULT = callback(...params)

        return RUN_RESULT
    }
}
