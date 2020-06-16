import { isFunction, wrapFuns } from './utils'
import { ComponentLifecycle, PageLifecycle, conductHook, ExtendLefecycle } from './lifecycle'
import { ICurrentModuleInstance, overCurrentModule } from './instance'
import { createContext, IContext } from './context'
import { createLifecycleMethods, ISetup } from './shared'

export function defineComponent (
	componentOptions:
		| (WechatMiniprogram.Component.Options<
				Record<string, any>,
				Record<string, WechatMiniprogram.Component.AllProperty>,
				Record<string, (...args: any[]) => any>
			> & {
				setup?: ISetup<WechatMiniprogram.Component.AllProperty>
			})
		| ISetup<WechatMiniprogram.Component.AllProperty>
): any{
	let setupFun: Function

	let options: {
		methods?: {
			[key: string]: (...args: any[]) => any
		}
		[key: string]: any
	}

	if (isFunction(componentOptions)) {
		setupFun = componentOptions
		options = {}
	} else {
		if (componentOptions.setup === void 0) {
			return Component(componentOptions)
		}

		const { setup: setupOption, ...otherOptions } = componentOptions
		setupFun = setupOption
		options = otherOptions
	}

	options.methods = options.methods || {}

    let __context: IContext;

	/**
     * TODO 下一个版本将props转化为ref对象,进行监听
     */
	options[ComponentLifecycle.ATTACHED] = wrapFuns(function (this: ICurrentModuleInstance){
		overCurrentModule(() => {
			__context = createContext(this)
			const binds = setupFun.call(this, this.properties, __context)
			if (binds instanceof Promise) {
				return console.error(`
                setup返回值不支持promise
            `)
			}
			__context.setData(binds)
		})(this)
	}, createLifecycleMethods(ComponentLifecycle.ATTACHED, options))

	options[ComponentLifecycle.READY] = createLifecycleMethods(ComponentLifecycle.READY, options)

    options[ComponentLifecycle.DETACHED] = wrapFuns(function () {
        conductHook(this, ExtendLefecycle.EFFECT, []);
        __context && __context.event.clear()
	}, createLifecycleMethods(ComponentLifecycle.DETACHED, options))

	options.methods[PageLifecycle.ON_LOAD] = createLifecycleMethods(
		PageLifecycle.ON_LOAD,
		options[PageLifecycle.ON_LOAD]
	)

	options.methods[PageLifecycle.ON_SHOW] = createLifecycleMethods(
		PageLifecycle.ON_SHOW,
		options[PageLifecycle.ON_SHOW]
	)

	options.methods[PageLifecycle.ON_READY] = createLifecycleMethods(
		PageLifecycle.ON_READY,
		options[PageLifecycle.ON_READY]
	)

	options.methods[PageLifecycle.ON_HIDE] = createLifecycleMethods(
		PageLifecycle.ON_HIDE,
		options[PageLifecycle.ON_HIDE]
	)

	options.methods[PageLifecycle.ON_UNLOAD] = createLifecycleMethods(
		PageLifecycle.ON_UNLOAD,
		options[PageLifecycle.ON_UNLOAD]
	)

	options.methods[PageLifecycle.ON_PULL_DOWN_REFRESH] = createLifecycleMethods(
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
		return function (...params: any[]){
			const runResults = lifecycleMethod.apply(this, params)
			return runResults[runResults.length - 1]
		}
	})()

	return Component(options)
}
