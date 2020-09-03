import { isFunction, wrapFuns } from './utils'
import { PageLifecycle, conductHook, ExtendLefecycle, CommonLifecycle } from './lifecycle'
import { createContext, IContext } from './context'
import { createLifecycleMethods, ISetup } from './shared'
import { overCurrentModule } from './instance'

export function definePage (
	pageOptions:
		| ({} & {
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

	options[PageLifecycle.ON_LOAD] = wrapFuns(function (params){
		overCurrentModule(() => {
			__context = createContext(this)
			const binds = setupFun.call(this, params, __context)
			if (binds instanceof Promise) {
				return console.error(`
                setup不支持返回promise
            `)
			}
			__context.setData(binds)
		})(this)
	}, createLifecycleMethods(CommonLifecycle.ON_LOAD, options[PageLifecycle.ON_LOAD]))

	options[PageLifecycle.ON_READY] = createLifecycleMethods(
		CommonLifecycle.ON_READY,
		options[PageLifecycle.ON_READY]
	)

	options[PageLifecycle.ON_UNLOAD] = wrapFuns(function (){
		conductHook(this, ExtendLefecycle.EFFECT, [])
	}, createLifecycleMethods(CommonLifecycle.ON_UN_LOAD, options[PageLifecycle.ON_UNLOAD]))

	options[PageLifecycle.ON_SHOW] = createLifecycleMethods(PageLifecycle.ON_SHOW, options)

	options[PageLifecycle.ON_HIDE] = createLifecycleMethods(PageLifecycle.ON_HIDE, options)

	options[PageLifecycle.ON_RESIZE] = createLifecycleMethods(PageLifecycle.ON_RESIZE, options)

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
		return function (...args: any){
			const runResults = lifecycleMethod.apply(this, ...args)
			return runResults[runResults.length - 1]
		}
	})()

	return Page(options)
}
