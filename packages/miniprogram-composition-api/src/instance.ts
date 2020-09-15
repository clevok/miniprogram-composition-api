import { ExtendLefecycle } from './lifecycle'

let currentModule: ICurrentModuleInstance | null = null

export type ICurrentModuleInstance = WechatMiniprogram.Component.InstanceProperties &
    WechatMiniprogram.Component.InstanceMethods<Record<string, unknown>> & {
        /** 上级页面对象 */
        [ExtendLefecycle.PARENT]?: ICurrentModuleInstance
        /** 转发props更新,props变化,会主动调用改方法传值 */
        [ExtendLefecycle.WATCH_PROPERTY]?: {
            [propName: string]: (value: any) => void
        }
        /** loc注册的内容 */
        [ExtendLefecycle.LOC_INJECT]?: {
            function_target: Function
            caches: [args: any, result: any][]
        }[]
        [key: string]: any
    }

/**
 * 要求注入的函数第一个参数是 current对象
 * @param callback
 */
export function overCurrentModule<T>(callback: () => T) {
    return function (this: ICurrentModuleInstance, ...arg: any[]): T {
        currentModule = this

        const reuslt = callback.apply(this, arg)

        currentModule = null

        return reuslt
    }
}

export function overInCurrentModule<T>(
    callback: (current: ICurrentModuleInstance) => T
): T {
    return callback(currentModule)
}
