import { isRef, IRef, isObserve, useRef } from 'miniprogram-reactivity'
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
 * 
 * 执行注册的声明周期
 * @param {string} lifecycle 需要执行的某个生命周期
 * @param {string} extendFunction 额外需要追加执行的方法
 * @return {function} 返回一个方法, 调用时, 执行该this下所有指定的生命周期
 */
export function createLifecycleMethods(
    lifecycle: ComponentLifecycle | PageLifecycle | CommonLifecycle,
    extendFunction?: Function | undefined
): (...args: any[]) => any[] {

    return function (this: ICurrentModuleInstance, ...args: any[]) {
        const injectLifes: any[] = conductHook(this, lifecycle, args)

        if (extendFunction) {
            injectLifes.push(extendFunction.call(this, args))
        }

        return injectLifes
    }
}


/**
 * 
 * 适配于需要一个返回值
 * @param lifecycle 
 * @param extendFunction 
 */
export function createSingleCallbackResultLifecycle (
    lifecycle: PageLifecycle,
    extendFunction: Function | undefined
){
    const lifecycleMethod = createLifecycleMethods(lifecycle, extendFunction)
    return function (...args: any){
        const runResults = lifecycleMethod.apply(this, ...args)
        return runResults[runResults.length - 1]
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
type FullProperty<T extends PropertyType> = {
    /** 属性类型 */
    type: T
    /** 默认值 */
    value?: ValueType<T>
}
export type AllFullProperty =
    | FullProperty<StringConstructor>
    | FullProperty<NumberConstructor>
    | FullProperty<BooleanConstructor>
    | FullProperty<ArrayConstructor>
    | FullProperty<ObjectConstructor>
    | FullProperty<null>
type ShortProperty =
    | StringConstructor
    | NumberConstructor
    | BooleanConstructor
    | ArrayConstructor
    | ObjectConstructor
    | null

export type AllProperty = AllFullProperty | ShortProperty

interface IProps {
    [keyName: string]: AllProperty
}

type PropertyToData<T extends AllProperty> = T extends ShortProperty
    ? ValueType<T>
    : T extends AllFullProperty
    ? ValueType<T['type']>
    : any

type PropertyOptionToData<P extends IProps> = {
    [name in keyof P]: IRef<PropertyToData<P[name]>>
}

export type ISetup<
    P extends IProps,
    PROVIDE extends {
        [key: string]: () => any
    },
    INJECT extends {
        [key: string]: () => any
    }
> = (
    this: ICurrentModuleInstance,
    props: PropertyOptionToData<P>,
    context: IContext & {
        provide: ParamsCallback<PROVIDE>
        inject: ParamsCallback<INJECT>
    }
) => IBindings

type ParamsFunDI = () => any

type ParamsCallback<
    P extends {
        [key: string]: ParamsFunDI
    }
> = {
    [name in keyof P]: ReturnType<P[name]>
}

export function createDI<
    P extends {
        [key: string]: ParamsFunDI
    }
>(params: P, next: (callback: any) => any): ParamsCallback<P> {
    if (!params) {
        // @ts-ignore
        return {}
    }
    const result: any = {}
    Object.keys(params).forEach((KEY) => {
        result[KEY] = next(params[KEY])
    })

    return result
}
