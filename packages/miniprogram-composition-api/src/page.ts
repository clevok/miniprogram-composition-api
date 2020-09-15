import { createShortName, isFunction, wrapFuns } from './utils'
import {
    PageLifecycle,
    conductHook,
    ExtendLefecycle,
    CommonLifecycle,
} from './lifecycle'
import { createContext, IContext } from './context'
import { createLifecycleMethods, ISetup } from './shared'
import { ICurrentModuleInstance, overCurrentModule } from './instance'

export function definePage(
    pageOptions:
        | {
              /** 静态属性,可以被覆盖,初始化显示更快 */
              data?: {
                  [key: string]: any
              }
              setup?: ISetup<any>
          }
        | ISetup<any>
): any {
    let setupFun: Function

    let options: {
        methods?: {
            [key: string]: (...args: any[]) => any
        }
        [key: string]: any
    }

    if (isFunction(pageOptions)) {
        setupFun = pageOptions
        options = {}
    } else {
        if (pageOptions.setup === void 0) {
            return Page(pageOptions)
        }

        const { setup: setupOption, ...otherOptions } = pageOptions
        setupFun = setupOption
        options = otherOptions
    }

    let __context: IContext

    /** 绑定上下文 */
    options['$'] = function (
        this: ICurrentModuleInstance,
        { detail }: { detail: ICurrentModuleInstance }
    ) {
        detail[ExtendLefecycle.PARENT] = this
    }

    options[PageLifecycle.ON_LOAD] = overCurrentModule(
        wrapFuns(
            function (this: ICurrentModuleInstance) {
                typeof this.triggerEvent === 'function' &&
                    this.triggerEvent('component', this)
            },
            function (params) {
                __context = createContext(this)
                const binds = setupFun.call(this, params, __context)
                if (binds instanceof Promise) {
                    return console.error(`
                setup不支持返回promise
            `)
                }
                __context.setData(binds)
            },
            createLifecycleMethods(
                CommonLifecycle.ON_LOAD,
                options[PageLifecycle.ON_LOAD]
            )
        )
    )

    options[PageLifecycle.ON_READY] = createLifecycleMethods(
        CommonLifecycle.ON_READY,
        options[PageLifecycle.ON_READY]
    )

    options[PageLifecycle.ON_UNLOAD] = wrapFuns(function () {
        conductHook(this, ExtendLefecycle.EFFECT, [])
    }, createLifecycleMethods(
        CommonLifecycle.ON_UN_LOAD,
        options[PageLifecycle.ON_UNLOAD]
    ))

    options[PageLifecycle.ON_SHOW] = createLifecycleMethods(
        PageLifecycle.ON_SHOW,
        options
    )

    options[PageLifecycle.ON_HIDE] = createLifecycleMethods(
        PageLifecycle.ON_HIDE,
        options
    )

    options[PageLifecycle.ON_RESIZE] = createLifecycleMethods(
        PageLifecycle.ON_RESIZE,
        options
    )

    options[PageLifecycle.ON_TAB_ITEM_TAP] = createLifecycleMethods(
        PageLifecycle.ON_TAB_ITEM_TAP,
        options
    )

    options[PageLifecycle.ON_PULL_DOWN_REFRESH] = createLifecycleMethods(
        PageLifecycle.ON_PULL_DOWN_REFRESH,
        options
    )

    options[PageLifecycle.ON_REACH_BOTTOM] = createLifecycleMethods(
        PageLifecycle.ON_REACH_BOTTOM,
        options
    )

    options[PageLifecycle.ON_PAGE_SCROLL] = createLifecycleMethods(
        PageLifecycle.ON_PAGE_SCROLL,
        options
    )

    options[PageLifecycle.ON_SHARE_APP_MESSAGE] = (() => {
        const lifecycleMethod = createLifecycleMethods(
            PageLifecycle.ON_SHARE_APP_MESSAGE,
            options
        )
        return function (...args: any) {
            const runResults = lifecycleMethod.apply(this, ...args)
            return runResults[runResults.length - 1]
        }
    })()

    return Page(options)
}
