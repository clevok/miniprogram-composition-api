import { isFunction, wrapFun } from './utils'
import { PageLifecycle, setup } from './lifecycle'

export function definePage (
	optionsOrSetup:
		| {
				[key: string]: any
				setup?: Function
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

	options[PageLifecycle.ON_LOAD] = wrapFun(options[PageLifecycle.ON_LOAD], function (){
		__setup_handle = setup(this, setupFun, {})
	})

	options[PageLifecycle.ON_UNLOAD] = wrapFun(options[PageLifecycle.ON_UNLOAD], function (){
		__setup_handle && __setup_handle()
	})

	return Page(options)
}
