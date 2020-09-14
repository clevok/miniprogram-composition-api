import { injectHook, ExtendLefecycle } from './lifecycle'
import { overInCurrentModule } from './instance'

/**
 *
 * 创建单例共享空间, 用于实现单例依赖注入, 第一阶段api,可能要废弃
 * 所有自定义组件/页面共享数据, 当被依赖的页面/组件都被销毁时,重新加载第一遍会被执行一次
 * 请在setup期间调用!!
 */
export function createConstate<RESULT>(callback: (this: void) => RESULT) {
    let FINISH = Symbol()
    let callbackResult: Symbol | RESULT = FINISH
    let injectCurrentModules = []

    return (): RESULT => {
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
                    callbackResult = FINISH
                }
            })
        })

        if (callbackResult !== FINISH) {
            return callbackResult as RESULT
        }

        callbackResult = callback()

        return callbackResult
    }
}