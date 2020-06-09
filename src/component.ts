import { isFunction, wrapFun } from './utils'
import { ComponentLifecycle, setup } from './lifecycle'

export function defineComponent (
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
			return Component(optionsOrSetup)
		}

		const { setup: setupOption, ...otherOptions } = optionsOrSetup
		setupFun = setupOption
		options = otherOptions
	}

	/** setup 回调句柄, 用于清除监听 */
	let __setup_handle: Function

    
	/**
     * 通过合并方法的方式, 调用setup
     * 在attached里调用setup是因为props原因
     * 下一个版本将props转化为ref对象,进行监听
     */
	options[ComponentLifecycle.ATTACHED] = wrapFun(
        options[ComponentLifecycle.ATTACHED],
		function (){
			__setup_handle = setup(this, setupFun, this.properties)
		}
	)

	options[ComponentLifecycle.DETACHED] = wrapFun(
		options[ComponentLifecycle.DETACHED],
		function (){
			__setup_handle && __setup_handle()
		}
	)

	return Component(options)
}
