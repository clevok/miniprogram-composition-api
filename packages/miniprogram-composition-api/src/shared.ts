import { isRef, IRef, isObserve } from 'miniprogram-reactivity'
import { isPlainObject, isArray, isFunction } from './utils'
import { diff } from './diff'
import { overCloneDeep } from './over'
import {
    ComponentLifecycle,
    PageLifecycle,
    conductHook,
    CommonLifecycle,
} from './lifecycle'
import { ICurrentModuleInstance } from './instance'
import { IContext } from './context'
import { useEffect } from './watch'

/** 副作用, 如果是方法,返回null */
export const deepToRaw = overCloneDeep(function (x: unknown) {
    if (isFunction(x)) {
        return null
    }
    if (isRef(x)) {
        return x.value
    }
    if (isArray(x)) {
        return x.map((item) => deepToRaw(item))
    }
    if (isPlainObject(x)) {
        const obj: { [key: string]: unknown } = {}
        Object.keys(x).forEach((key) => {
            obj[key] = deepToRaw(x[key])
        })
        return obj
    }

    return x
})

/**
 * Page/Component 与 watch 中转
 * @return {function} 抛弃监听
 */
export function deepWatch(target: any, key: string, value: any) {
    const deepEffects: IRef[] = []
    ;(function observerEffects(x: any) {
        /**
         * isObserve必须是在最前面,因为会被isPlainObject解析
         */
        if (isObserve(x)) {
            return void deepEffects.push(x)
        }
        if (isArray(x)) {
            return void x.map((item) => observerEffects(item))
        }
        if (isPlainObject(x)) {
            return void Object.keys(x).forEach((key) => {
                observerEffects(x[key])
            })
        }
    })(value)

    if (!deepEffects.length) {
        return
    }

    return useEffect(() => {
        target.setData(
            diff(
                {
                    [key]: deepToRaw(value),
                },
                {
                    [key]: target.data[key],
                }
            )
        )
    }, deepEffects)
}

/**
 * 执行注册的生命周期
 */
export function createLifecycleMethods(
    lifecycle: ComponentLifecycle | PageLifecycle | CommonLifecycle,
    options: Object | Function | undefined
): (...args: any[]) => any[] {
    const lifeMethod: Function | undefined =
        typeof options === 'function'
            ? options
            : typeof options === 'undefined'
            ? undefined
            : options[lifecycle]

    return function (this: ICurrentModuleInstance, ...args: any[]) {
        const injectLifes: any[] = conductHook(this, lifecycle, args)

        if (lifeMethod) {
            injectLifes.push(lifeMethod.call(this, args))
        }

        return injectLifes
    }
}

/** 将数据注入到视图中 */
export function useSetup(setup: () => { [key: string]: any }) {
    return (target: ICurrentModuleInstance) => {
        const _binds = setup.apply(target)
    }
}

export type IBindings = { [key: string]: any }

type IAnyObject = Record<string, any>

type PropertyType =
    | StringConstructor
    | NumberConstructor
    | BooleanConstructor
    | ArrayConstructor
    | ObjectConstructor
    | null
type ValueType<T extends PropertyType> = T extends StringConstructor
    ? string
    : T extends NumberConstructor
    ? number
    : T extends BooleanConstructor
    ? boolean
    : T extends ArrayConstructor
    ? any[]
    : T extends ObjectConstructor
    ? IAnyObject
    : any

export type ISetup<Props extends Object> = (
    this: ICurrentModuleInstance,
    props: Props,
    context: IContext
) => IBindings
