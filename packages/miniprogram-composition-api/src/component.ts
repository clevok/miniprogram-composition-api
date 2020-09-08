import { isFunction, wrapFuns, createShortName } from './utils'
import {
    ComponentLifecycle,
    PageLifecycle,
    conductHook,
    ExtendLefecycle,
    CommonLifecycle,
} from './lifecycle'
import { ICurrentModuleInstance, overCurrentModule } from './instance'
import { createContext, IContext } from './context'
import { createLifecycleMethods, ISetup, AllProperty, AllFullProperty } from './shared'
import { useRef, IRef } from 'miniprogram-reactivity'

const enum ComponentExtendProperty {
    WATCH_PROPERTY = 'watchProperty',
}

export function defineComponent<
    PROPS extends {
        [key: string]: AllProperty
    }
>(
    componentOptions:
        | {
              props?: PROPS
              setup?: ISetup<PROPS>
              [key: string]: any
          }
        | ISetup<PROPS>
): any {
    let setupFun: Function
    let options: {
        methods?: {
            [key: string]: (...args: any[]) => any
        }
        properties?: {
            [key: string]: AllProperty
        }
        [key: string]: any
    }

    if (isFunction(componentOptions)) {
        setupFun = componentOptions
        options = {}
    } else {
        componentOptions.properties =
            componentOptions.props || componentOptions.properties || {}

        if (componentOptions.setup === void 0) {
            return Component(componentOptions)
        }

        const { setup: setupOption, ...otherOptions } = componentOptions
        setupFun = setupOption
        options = otherOptions
    }

    options.methods = options.methods || {}

    options.properties &&
        Object.keys(options.properties).forEach((KEY) => {
            let prop = options.properties[KEY]
            let proxy_prop
            if (typeof prop === 'function' || prop === null) {
                proxy_prop = {
                    type: prop,
                    value: null,
                }
            } else {
                proxy_prop = prop
            }

            proxy_prop.observer = function (newValue) {
                const sortName = createShortName(ComponentExtendProperty.WATCH_PROPERTY)

                this[sortName] &&
                    this[sortName][KEY] &&
                    this[sortName][KEY](newValue)
            }

            options.properties[KEY] = proxy_prop
        })

    let __context: IContext

    function createProxyProperty(this: ICurrentModuleInstance) {
        const proxy: {
            [key: string]: IRef<any>
        } = {}

        options.properties && Object.keys(options.properties).forEach(KEY => {
            proxy[KEY] = useRef( this.properties[KEY] )

            const sortName = createShortName(ComponentExtendProperty.WATCH_PROPERTY)
            if (!this[sortName]) {
                this[sortName] = {}
            }
            this[sortName][KEY] = function (value) {
                proxy[KEY].set(value)
            }
        })

        return proxy
    }

    options[ComponentLifecycle.CREATED] = function () {}

    /**
     *
     * TODO 下一个版本将props转化为ref对象,进行监听
     */
    options[ComponentLifecycle.ATTACHED] = overCurrentModule(
        wrapFuns(function (this: ICurrentModuleInstance) {
            __context = createContext(this)
            const binds = setupFun.call(this, createProxyProperty.call(this), __context)
            if (binds instanceof Promise) {
                return console.error(`
                setup返回值不支持promise
            `)
            }
            __context.setData(binds)
        }, createLifecycleMethods(
            CommonLifecycle.ON_LOAD,
            options[ComponentLifecycle.ATTACHED]
        ))
    )

    options[ComponentLifecycle.READY] = createLifecycleMethods(
        CommonLifecycle.ON_READY,
        options[ComponentLifecycle.READY]
    )

    options[ComponentLifecycle.DETACHED] = wrapFuns(function () {
        conductHook(this, ExtendLefecycle.EFFECT, [])
    }, createLifecycleMethods(
        CommonLifecycle.ON_UN_LOAD,
        options[ComponentLifecycle.DETACHED]
    ))

    options.methods[PageLifecycle.ON_SHOW] = createLifecycleMethods(
        PageLifecycle.ON_SHOW,
        options[PageLifecycle.ON_SHOW]
    )

    options.methods[PageLifecycle.ON_HIDE] = createLifecycleMethods(
        PageLifecycle.ON_HIDE,
        options[PageLifecycle.ON_HIDE]
    )

    options.methods[
        PageLifecycle.ON_PULL_DOWN_REFRESH
    ] = createLifecycleMethods(
        PageLifecycle.ON_PULL_DOWN_REFRESH,
        options[PageLifecycle.ON_PULL_DOWN_REFRESH]
    )

    options.methods[PageLifecycle.ON_REACH_BOTTOM] = createLifecycleMethods(
        PageLifecycle.ON_REACH_BOTTOM,
        options[PageLifecycle.ON_REACH_BOTTOM]
    )

    options.methods[PageLifecycle.ON_PAGE_SCROLL] = createLifecycleMethods(
        PageLifecycle.ON_PAGE_SCROLL,
        options[PageLifecycle.ON_PAGE_SCROLL]
    )

    options.methods[PageLifecycle.ON_SHARE_APP_MESSAGE] = (() => {
        const lifecycleMethod = createLifecycleMethods(
            PageLifecycle.ON_SHARE_APP_MESSAGE,
            options[PageLifecycle.ON_SHARE_APP_MESSAGE]
        )
        return function (...params: any[]) {
            const runResults = lifecycleMethod.apply(this, params)
            return runResults[runResults.length - 1]
        }
    })()

    return Component(options)
}
