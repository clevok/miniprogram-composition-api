import { isFunction, wrapFuns } from './utils'
import {
    ComponentLifecycle,
    PageLifecycle,
    conductHook,
    ExtendLefecycle,
    CommonLifecycle,
} from './lifecycle'
import { ICurrentModuleInstance, overCurrentModule } from './instance'
import { createContext, IContext } from './context'
import { createLifecycleMethods, ISetup, AllProperty } from './shared'
import { useRef, IRef } from 'miniprogram-reactivity'

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

    /**
     * 
     * 拦截props,做数据响应
     */
    const proxyProps: {
        [key: string]: IRef<any>
    } = {}
    options.properties && Object.keys(options.properties).forEach((KEY) => {
        let prop = options.properties[KEY];
        let proxy_prop;
        if (typeof prop === 'function' || prop === null) {
            proxy_prop = {
                type: prop,
                value: null
            }
        } else {
            proxy_prop = prop
        }
        let ref = useRef(proxy_prop.value || null)

        proxy_prop.observer = function (newValue, oldValue) {
            ref.set(newValue)
        }

        proxyProps[KEY] = ref
        options.properties[KEY] = proxy_prop
    })

    let __context: IContext

    /**
     *
     * TODO 下一个版本将props转化为ref对象,进行监听
     */
    options[ComponentLifecycle.ATTACHED] = wrapFuns(function (
        this: ICurrentModuleInstance
    ) {
        overCurrentModule(() => {
            __context = createContext(this)
            const binds = setupFun.call(this, proxyProps, __context)
            if (binds instanceof Promise) {
                return console.error(`
                setup返回值不支持promise
            `)
            }
            __context.setData(binds)
        })(this)
    },
    createLifecycleMethods(CommonLifecycle.ON_LOAD, options[ComponentLifecycle.ATTACHED]))

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