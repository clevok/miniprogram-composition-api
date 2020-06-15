import { isFunction, wrapFuns } from './utils'
import { PageLifecycle, createLifecycleMethods } from './lifecycle'
import { setup } from './shared'

export function definePage (
	pageOptions:
		| WechatMiniprogram.Page.Options<Record<string, any>, Record<string, any>> & {
				setup?: (params: Object) => { [key: string]: any }
			}
		| Function
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

	let __setup_handle: Function

	options[PageLifecycle.ON_LOAD] = wrapFuns(function (params){
		__setup_handle = setup(this, setupFun, params)
	}, createLifecycleMethods(PageLifecycle.ON_LOAD, options))

	options[PageLifecycle.ON_SHOW] = createLifecycleMethods(PageLifecycle.ON_SHOW, options)

	options[PageLifecycle.ON_READY] = createLifecycleMethods(PageLifecycle.ON_READY, options)

	options[PageLifecycle.ON_HIDE] = createLifecycleMethods(PageLifecycle.ON_HIDE, options)

	options[PageLifecycle.ON_UNLOAD] = wrapFuns(function (){
		__setup_handle && __setup_handle()
	}, createLifecycleMethods(PageLifecycle.ON_UNLOAD, options))

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
		return function (){
			const runResults = lifecycleMethod()
			return runResults[runResults.length - 1]
		}
	})()

	return Page(options)
}
