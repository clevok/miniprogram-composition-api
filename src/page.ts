import { isFunction, wrapFuns } from './utils'
import { PageLifecycle, createLifecycle } from './lifecycle'
import { setup } from './shared'

export function definePage (
	optionsOrSetup:
		| WechatMiniprogram.Page.Options<Record<string, any>, Record<string, any>> & {
				setup?: (params: Object) => {[key: string]: any}
			}
		| Function
): any{
	/**
     * setup, 将在onLoad执行
     */
	let setupFun: Function

	/**
     * 构建componets基本参数
     */
	let options: Object

	if (isFunction(optionsOrSetup)) {
		setupFun = optionsOrSetup
		options = {}
	} else {
		if (optionsOrSetup.setup === void 0) {
			return Page(optionsOrSetup)
		}

		const { setup: setupOption, ...otherOptions } = optionsOrSetup
		setupFun = setupOption
		options = otherOptions
	}

	/** setup 回调句柄, 用于清除监听 */
	let __setup_handle: Function

	options[PageLifecycle.ON_LOAD] = wrapFuns(function (params){
		__setup_handle = setup(this, setupFun, params)
	}, createLifecycle(PageLifecycle.ON_LOAD, options))

	options[PageLifecycle.ON_SHOW] = createLifecycle(PageLifecycle.ON_SHOW, options)

	options[PageLifecycle.ON_READY] = createLifecycle(PageLifecycle.ON_READY, options)

	options[PageLifecycle.ON_HIDE] = createLifecycle(PageLifecycle.ON_HIDE, options)

	options[PageLifecycle.ON_UNLOAD] = wrapFuns(function (){
		__setup_handle && __setup_handle()
	}, createLifecycle(PageLifecycle.ON_UNLOAD, options))

	options[PageLifecycle.ON_PULL_DOWN_REFRESH] = createLifecycle(
		PageLifecycle.ON_PULL_DOWN_REFRESH,
		options
	)

	options[PageLifecycle.ON_REACH_BOTTOM] = createLifecycle(
		PageLifecycle.ON_REACH_BOTTOM,
		options
	)

	options[PageLifecycle.ON_PAGE_SCROLL] = createLifecycle(PageLifecycle.ON_PAGE_SCROLL, options)

	options[PageLifecycle.ON_SHARE_APP_MESSAGE] = (() => {
		const lifecycleMethod = createLifecycle(PageLifecycle.ON_SHARE_APP_MESSAGE, options)
		return function (){
			const runResults = lifecycleMethod()
			return runResults[runResults.length - 1]
		}
	})()

	return Page(options)
}
